import { Strapi } from "@strapi/strapi";
import pluginId from "../../admin/src/pluginId";

export default ({ strapi }: { strapi: Strapi }) => ({

  async createTenantForBetrieb(id: number) {
    const firm: any = await strapi.entityService.findOne('api::firm.firm', id, { populate: { Address: { populate: '*'}}});
    if(firm.TenentUID && firm.TenentUID.length > 0) {
      return;
    }
    const tenant = await strapi.plugin('thingsboard-plugin').service('thingsboardService').createTenant({
      "title": firm.name,
      "region": "",
      "country": firm.Address.Country || "",
      "state": firm.Address.State || "",
      "city": firm.Address.City || "",
      "address": firm.Address.Address || "",
      "address2": firm.Address.Address_2 || "",
      "zip": firm.Address.Postal_code || "",
      "phone": "",
      "email": "",
      "additionalInfo": {}
    });
    return await strapi.entityService.update('api::firm.firm', id, {
      data: {
        // @ts-ignore
        TenentUID: tenant.id.id
      }
    });
  },
  async deploySetup(deploymentId: number) {

     const deployment: any = await strapi.entityService.update('api::deployment.deployment', deploymentId,{
        data: {
          id: deploymentId,
          status: 'deploying'
        },
        populate: { use_case: true, firm: true }
      });

      const useCase: any = await strapi.entityService.findOne('api::use-case.use-case', deployment.use_case.id,{
        populate: '*'
      });

      const firm: any = deployment.firm;

      let deployDict: any = {};

     const allDummies = await Promise.allSettled(useCase.components.flatMap((c) =>
      c.Reference.map((r) => {
        return strapi.plugin(pluginId)
          .service('thingsboardService').createDummytThingsboardComponentForTenant(firm.TenentUID, r.entityType.replace(/[^a-zA-Z\d]/gm, "").toLowerCase()).then((response) => {
            deployDict[r.id] = response.id.id;

            return response
          });
      })
    ));

      console.warn("ID ARRAY", deployDict);

      const allCopies = await Promise.allSettled(useCase.components.flatMap((c) =>
        c.Reference.map((r) => {
          return strapi.plugin(pluginId)
            .service('thingsboardService').syncThingsboardComponentForTenant(r.id,r.tenantId.id, deployDict[r.id], firm.TenentUID,r.entityType.replace(/[^a-zA-Z\d]/gm, "").toLowerCase(), deployDict, deployment.name).then((response) => {
              console.warn(response)
              return response;
            });
        })
      ));

      const constructJson = allCopies.map((result: any) => {
        if(result.status === 'fulfilled') {
          return Object.assign(result.value.id, { tenantId: result.value.tenantId } );
        }
        return null;
      }).filter((result) => {
        return result !== null;
      });
    console.log(JSON.stringify(constructJson));


    strapi.entityService.update('api::deployment.deployment', deploymentId,{
      data: {
        id: deploymentId,
        deployed: constructJson,
        status: 'deployed'
      }
    });

  },
  async createNewDeployment(useCaseId: number, firmID: number, title: string, description: string) {

    const deployment: any = await strapi.entityService.create('api::deployment.deployment',{
      data: {
        name: title || "unnamed setup",
        description: description || "Fehlende Beschreibung",
        use_case:  { connect: [ { id: useCaseId }]},
        firm:  { connect: [ { id: firmID }]},
        status: 'created',
        sync: false
      }
    });
    return deployment;
  },
  async getDashboardsFromDeployment(deploymentId: number) {

    const deployment: any = await strapi.entityService.findOne('api::deployment.deployment', deploymentId,{
      fields: ["deployed"]
    });

    return deployment.deployed.filter((comp) => {
      return comp.entityType === "DASHBOARD";
    }).map((comp) => {
      delete comp.tenantId;
      return comp;
    });
  },
});
