import { Strapi } from "@strapi/strapi";
import { responses } from "@strapi/strapi/dist/middlewares/responses";
import pluginId from "../../admin/src/pluginId";
import { faker } from '@faker-js/faker';

export default ({ strapi }: { strapi: Strapi }) => ({

  async createTenantForBetrieb(id: number) {
    const firm: any = await strapi.entityService.findOne('api::firm.firm', id, { populate: { Address: { populate: '*'}}});
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
    if(firm.TenentUID && firm.TenentUID.length > 0) {
      return;
    }

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

      const allCopies = await Promise.allSettled(useCase.components.flatMap((c) =>
        c.Reference.map((r) => {
          return strapi.plugin(pluginId)
            .service('thingsboardService').copyThingsboardComponentForTenant(r.id, r.entityType.toLowerCase(), r.tenantId.id, firm.TenentUID).then((response) => {
              return response;
            });
        })
      ));
      const constructJson = allCopies.map((result: any) => Object.assign(result.value.id, { tenantId: result.value.tenantId } ));
    console.log(JSON.stringify(constructJson));


    return strapi.entityService.update('api::deployment.deployment', deploymentId,{
      data: {
        id: deploymentId,
        deployed: constructJson,
        status: 'deployed'
      }
    });

  },
  async createNewDeployment(useCaseId: number, firmID: number) {

    const deployment: any = await strapi.entityService.create('api::deployment.deployment',{
      data: {
        name: faker.word.words(3),
        use_case:  { connect: [ { id: useCaseId }]},
        firm:  { connect: [ { id: firmID }]},
        status: 'created',
        sync: false
      }
    });
    return "done";
  }
});
