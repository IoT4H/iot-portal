import { Strapi } from "@strapi/strapi";
import { responses } from "@strapi/strapi/dist/middlewares/responses";
import { randomUUID } from "crypto";
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
  async createCustomerForBetrieb(id: number) {
    const firm: any = await strapi.entityService.findOne('api::firm.firm', id, { populate: { Address: { populate: '*'}}});
    if(firm.CustomerUID && firm.CustomerUID.length > 0) {
      return;
    }
    const customer = await strapi.plugin('thingsboard-plugin').service('thingsboardService').createCustomer(firm.TenentUID, {
      "title": "Portal",
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
    let updatedFirmState = await strapi.entityService.update('api::firm.firm', id, {
      data: {
        // @ts-ignore
        CustomerUID: customer.id.id
      }
    });
    try {
      const customerUser = await strapi.plugin('thingsboard-plugin').service('thingsboardService').createCustomerUser(firm.TenentUID, {
        "firstName": "Portal",
        "lastName": "Default",
        "phone": "",
        "email": customer.id.id + "_" + randomUUID() + "-system@system.local",
        "authority": "CUSTOMER_USER",
        "customerId": {
          "id": customer.id.id,
          "entityType": "CUSTOMER"
        },
        "additionalInfo": {}
      });
      updatedFirmState = await strapi.entityService.update('api::firm.firm', id, {
        data: {
          // @ts-ignore
          CustomerUserUID: customerUser.id.id
        }
      });
    } catch (e) {
      console.error(e);
    }
    return updatedFirmState;
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
      let fullReference: Array<{ reference: any, template: any}> = [];

     const allDummies = await Promise.allSettled(useCase.components.flatMap((c) =>
      c.Reference.map((r) => {
        return strapi.plugin(pluginId)
          .service('thingsboardService').createDummytThingsboardComponentForTenant(firm.TenentUID, r.entityType.replace(/[^a-zA-Z\d]/gm, "").toLowerCase()).then((response) => {
            deployDict[r.id] = response.id.id;
            fullReference.push({reference: response.id, template: r});
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
              if(response.id.entityType.replace(/[^a-zA-Z\d]/gm, "").toLowerCase() === "dashboard") {
                strapi.plugin(pluginId)
                  .service('thingsboardService').assignCustomerToDashboard(firm.TenentUID, firm.CustomerUID, response.id.id).then(() => {
                  console.log("Dashboard Assigned")
                })
              }
              return response;
            });
        })
      ));

      const findTemplate = (id: any) => {
        const f = fullReference.find((v) => {
          return v.reference.id === id.id;
        })
        if(f) {
          return f.template;
        }
        return {}
      }

      const constructJson = allCopies.map((result: any) => {
        if(result.status === 'fulfilled') {
          return Object.assign(result.value.id, { tenantId: result.value.tenantId, template: findTemplate(result.value.id) } );
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
  async getDashboardsFromDeployment(deploymentId: number)  {
    return this.getComponentsFromDeployment(deploymentId, ["DASHBOARD"]);
  },
  async getDevicesFromDeployment(deploymentId: number) {
    return this.getComponentsFromDeployment(deploymentId, ["ASSET_PROFILE", "DEVICE_PROFILE"]);
  },
  async getComponentsFromDeployment(deploymentId: number, types: string[] = ["DASHBOARD","RULE_CHAIN","ASSET_PROFILE", "DEVICE_PROFILE"]): Promise<any[]> {
    const deployment: any = await strapi.entityService.findOne('api::deployment.deployment', deploymentId,{
      fields: ["deployed"]
    });
    const comps = (deployment.deployed || []).filter((comp) => {
      return types.includes(comp.entityType);
    }).map((comp) => {
      delete comp.tenantId;
      return comp;
    });
    console.log(comps)
    return comps
  },
  async getInstructionStepsFromDeployment(deploymentId: number) {
    const deployment: any = await strapi.entityService.findOne('api::deployment.deployment', deploymentId,{
      populate: { use_case : { populate: { setupSteps: { populate: '*'}}}}
    });
    let replacementDictionary: Array<string> = new Array<string>();
    Array.of(...deployment.deployed).forEach((deployed) => {
      if(deployed.id && deployed.template) {
        replacementDictionary[deployed.template.id] = deployed.id;
        replacementDictionary[deployed.template.tenantId.id] = deployed.tenantId.id;
      }
    })
    const constructedModSteps = JSON.stringify(deployment.use_case.setupSteps).replace(new RegExp(Object.keys(replacementDictionary).join("|"), "gi"), (matched) => {
      return replacementDictionary[matched]
    })
    return JSON.parse(constructedModSteps);

    //TODO: CHECK CODE FOR BUGS
  },
  async getInstructionStepsProgressFromDeployment(deploymentId: number) {
    const deployment: any = await strapi.entityService.findOne('api::deployment.deployment', deploymentId,{
      fields: ['stepStatus']
    });
    console.warn(deployment.stepStatus);
    return deployment.stepStatus;
  },
  async updateInstructionStepsProgressFromDeployment(deploymentId: number, step: { "__component": string,
    "id": number, tasks?: any[]}, progress: number, subprogress?: any) {

    const deployment: any = await strapi.entityService.findOne('api::deployment.deployment', deploymentId,{
      fields: ['stepStatus']
    });

    let currenStatus = (deployment.stepStatus || []);
    let posIndex = currenStatus.findIndex((e, i ,a) => {
      return e.__component === step.__component && e.id === step.id
    });


    switch (step.__component) {
      case "instructions.setup-instruction":
        break;
      case "instructions.text-instruction":
        break;
      case "instructions.list-instruction":
        if(Object.keys(subprogress).length === 0) {
          progress = 100;
        } else {
          if(posIndex !== -1) {
            subprogress.tasks = subprogress.tasks.concat(currenStatus[posIndex].tasks.filter((f: any) => !(subprogress.tasks.some((t) => t.id === f.id))));
          }
          progress = (subprogress.tasks.filter((t: any) => t.progress === 100).length / step.tasks.length) * 100
        }
        break;
      default:
        break;
    }

    if(posIndex !== -1) {
      currenStatus[posIndex] = Object.assign(currenStatus[posIndex], { ...(progress ? { progress: progress } : {}), ...subprogress });
    } else {
      currenStatus.push(Object.assign(step, { ...(progress ? { progress: progress } : {}), ...subprogress }));
    }

    return await strapi.entityService.update('api::deployment.deployment', deploymentId,{
      fields: ['stepStatus'],
      data: {
        // @ts-ignore
        stepStatus: currenStatus
      }
    });

  },
  async stepAction(deploymentId: number, data: any) {

    return new Promise<void>(async (resolve, reject) => {

    const deployment: any = await strapi.entityService.findOne('api::deployment.deployment', deploymentId,{
      populate: { firm: {fields: ['id', 'TenentUID', 'CustomerUID', 'CustomerUserUID']}, use_case: { populate: '*' }}
    });

    let returnPromise;

    switch (data.step.data.__component) {
      case "instructions.setup-instruction":
        returnPromise = strapi.plugin(pluginId)
          .service('thingsboardService').setupThingsboardDeviceAsset(
            deployment.firm.TenentUID,
            deployment.firm.CustomerUID,
            data.step.data.thingsboard_profile,
            {
              name: data.parameter.name,
              label: data.parameter.label
            }
          );
        returnPromise = returnPromise.then((response) => {
            strapi.plugin('thingsboard-plugin').service('strapiService').updateInstructionStepsProgressFromDeployment(deploymentId, {
              id: data.step.data.id,
              __component: data.step.data.__component
            }, 100, {});
            resolve(response);
        }, (reason) => {
          strapi.plugin('thingsboard-plugin').service('strapiService').updateInstructionStepsProgressFromDeployment(deploymentId, {
            id: data.step.data.id,
            __component: data.step.data.__component
          }, 1, {});
          strapi.log.warn(`${data.step.data.__component} action failed`);
          reject(reason);
        });
        break;
      case "instructions.text-instruction":
        returnPromise = strapi.plugin('thingsboard-plugin').service('strapiService').updateInstructionStepsProgressFromDeployment(deploymentId, {
          id: data.step.data.id,
          __component: data.step.data.__component
        }, 100, {})
        returnPromise.then((response) => resolve(response), (reason) => reject(reason));
        break;
      case "instructions.list-instruction":
        console.warn("data: " + JSON.stringify(data));
        returnPromise = strapi.plugin('thingsboard-plugin').service('strapiService').updateInstructionStepsProgressFromDeployment(deploymentId, data.step.data, null, data.parameter)
        returnPromise.then((response) => resolve(response), (reason) => reject(reason));
      default:
        break;
    }


    });

  }
});
