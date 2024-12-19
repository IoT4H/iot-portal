import { Strapi } from "@strapi/strapi";
import { randomUUID } from "crypto";
import { createHash } from 'node:crypto'
import { ComponentStructure } from "../../admin/src/components/ComponentStructure";
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
        "email":  createHash('md5').update(customer.id.id + "_" + randomUUID()).digest('hex') + "-system@system.local",
        "authority": "CUSTOMER_USER",
        "customerId": {
          "id": customer.id.id,
          "entityType": "CUSTOMER"
        },
        "additionalInfo": {
          "defaultDashboardFullscreen": true,
        }
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
      let refMap = new Map<any, any>();

      let constructJson = []

      try {
       const allDummies = await Promise.allSettled(useCase.components.flatMap((c) =>
        c.Reference.map((r) => {
          return strapi.plugin(pluginId)
            .service('thingsboardService').createDummytThingsboardComponentForTenant(firm.TenentUID, r.entityType.replace(/[^a-zA-Z\d]/gm, "").toLowerCase()).then((response) => {
              deployDict[r.id] = response.id.id;
              fullReference.push({reference: response.id, template: r});
              refMap.set(r, response.id);
              return response
            });
        })
      ));

      console.warn("ID ARRAY", refMap);

      const allCopies = await Promise.allSettled(useCase.components.flatMap((c) =>
        c.Reference.map((r) => {
          return strapi.plugin(pluginId)
            .service('thingsboardService').syncThingsboardComponentForTenant(r.id,r.tenantId.id, refMap.get(r).id, firm.TenentUID,r.entityType.replace(/[^a-zA-Z\d]/gm, "").toLowerCase(), deployDict, deployment.name).then((response) => {
              //console.warn(response)
              if(response.id.entityType.replace(/[^a-zA-Z\d]/gm, "").toLowerCase() === "dashboard") {
                strapi.plugin(pluginId)
                  .service('thingsboardService').assignCustomerToDashboard(firm.TenentUID, firm.CustomerUID, response.id.id).then(() => {
                  //console.log("Dashboard Assigned")
                })
              }
              return response;
            });
        })
      ));

      const findTemplate = (id: any) => {
        try {
          if(id === undefined) {
            throw new Error("searching for undefined id isn't possible");
          }
          const f = fullReference.find((v) => {
            return v.reference.id === id.id && v.reference.entityType === id.entityType;
          })
          if(f) {
            return f.template;
          }
        } catch (e) {
          strapi.log.error(e);
        }
        return {}
      }

      constructJson = allCopies.map((result: any) => {
        if(result.status === 'fulfilled') {
          return Object.assign(result.value.id, { tenantId: result.value.tenantId, template: findTemplate(result.value.id) } );
        }

        if (result.error) {
          console.error(result.error);
        }

        return null;
      }).filter((result) => {
        return result !== null;
      });

        if (constructJson.length !== useCase.components.reduce((accumulator, component) => {
          return accumulator + Array.of(...component.Reference).length
        }, 0)) {
          console.warn(constructJson, useCase.components)
          throw new Error("Not all elements had been properly deployed. Canceling deployment.");
        }
        strapi.entityService.update('api::deployment.deployment', deploymentId, {
          data: {
            id: deploymentId,
            deployed: constructJson,
            status: 'deployed'
          }
        });
      } catch (e) {
        strapi.log.error(e);
        strapi.entityService.update('api::deployment.deployment', deploymentId, {
          data: {
            id: deploymentId,
            deployed: constructJson,
            status: "failed"
          }
        });

        //clean up unneeded thingsboard entities and profiles


      }

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
    return comps
  },
  async getComponentProfilesFromSetupProcessOfDeployment(deploymentId: number): Promise<any[]> {

    const steps = await this.getInstructionStepsFromDeployment(deploymentId);
    let profiles = await Promise.all(
      steps.filter(steps => steps.__component === "instructions.setup-instruction")
        .map(async (step) => {
            let t = { id: { id: step.thingsboard_profile.id, entityType: step.thingsboard_profile.entityType}, tenantId: step.thingsboard_profile.tenantId };
            return await strapi.plugin(pluginId).service('thingsboardService').getThingsboardComponent(t.id.id, t.id.entityType, t.tenantId.id);
        })
    );

    return profiles
  },
  async getInstructionStepsFromDeployment(deploymentId: number) {
    const deployment: any = await strapi.entityService.findOne('api::deployment.deployment', deploymentId,{
      populate: { use_case : { populate: { setupSteps: {
              populate: {
                meta: {
                  populate: "*"
                },
                tasks: {
                  populate: "*"
                },
                relations: {
                  populate: "*"
                },
                flashConfig: {
                  populate: "*"
                },
                flashInstruction: {
                  populate: {
                    binary: {
                      populate: "*"
                    }
                  },
                },
              },
            }}}}
    });

    const cMs = deployment.use_case.setupSteps.map((step) => step.__component === "instructions.setup-instruction" ? this.replaceUUIDsForDeployment(deployment.deployed, step) : step);

    try {
      return cMs;
    } catch (e) {
      strapi.log.error(e);
      return null;
    }

    //TODO: CHECK CODE FOR BUGS
  },
  async getInstructionStepsProgressFromDeployment(deploymentId: number) {
    const deployment: any = await strapi.entityService.findOne('api::deployment.deployment', deploymentId,{
      fields: ['stepStatus']
    });
    return deployment.stepStatus || [];
  },
  async getInstructionStepsProgressCompleteFromDeployment(deploymentId: number) {
    const deployment: any = await strapi.entityService.findOne('api::deployment.deployment', deploymentId,{
      populate: { use_case : { populate: { setupSteps: { populate: '*'}}}},
      fields: ['stepStatus'],
    });

    if(Array.isArray(deployment.stepStatus)) {
      return { complete: (deployment.stepStatus.filter((t) => t.progress >= 100) || []).length === deployment.use_case.setupSteps.length};
    } else {
      return { complete: 0 === deployment.use_case.setupSteps.length};
    }
  },
  async updateInstructionStepsProgressFromDeployment(deploymentId: number, step: { "__component": string,
    "id": number, flashProcess: boolean, tasks?: any[], device: any, index: number, meta: any}, progress: number, subprogress?: any) {
    //console.warn(deploymentId, step, progress, subprogress);
    for (let attribute in step) {
      if(!["__component","id", "flashProcess", "tasks", "device"].includes(attribute)){
        delete step[attribute];
      }
    }

    const deployment: any = await strapi.entityService.findOne('api::deployment.deployment', deploymentId,{
      fields: ['stepStatus']
    });

    let currenStatus = (deployment.stepStatus || []);
    let posIndex = currenStatus.findIndex((e, i ,a) => {
      return e.__component === step.__component && e.id === step.id
    });


    switch (step.__component) {
      case "instructions.setup-instruction":
        if(Object.keys(subprogress).length === 0) {
          progress = 100;
        } else {
          if(posIndex !== -1) {
            if(step.flashProcess){
              subprogress.flash = { progress: (subprogress.flash && subprogress.flash.progress) || (currenStatus[posIndex].flash && currenStatus[posIndex].flash.progress) || 0};
            }
            subprogress.setup = { progress: (subprogress.setup && subprogress.setup.progress) || (currenStatus[posIndex].setup && currenStatus[posIndex].setup.progress) || 0};
          }
          progress = (((subprogress.flash && Number(subprogress.flash.progress) || 0) + (subprogress.setup && Number(subprogress.setup.progress) || 0)) / (step.flashProcess ? 2 : 1));
        }
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
  async stepAction(deploymentId: number, data: any, ignoreStepsProgressUpdate = false) {

    let _ignoreStepsProgressUpdate = ignoreStepsProgressUpdate;

    return new Promise<void>(async (resolve, reject) => {

    const deployment: any = await strapi.entityService.findOne('api::deployment.deployment', deploymentId,{
      populate: { firm: {fields: ['id', 'TenentUID', 'CustomerUID', 'CustomerUserUID']}, use_case: { populate: '*' }}
    });

    let returnPromise;

    if((await this.getInstructionStepsProgressCompleteFromDeployment(deploymentId)).complete) {
      _ignoreStepsProgressUpdate = true;
    }

    switch (data.step.data.__component) {
      case "instructions.setup-instruction":
        if(data.parameter.flash) {
          if(!_ignoreStepsProgressUpdate) {
            returnPromise = strapi.plugin('thingsboard-plugin').service('strapiService').updateInstructionStepsProgressFromDeployment(deploymentId, {
              ...data.step.data,
              __component: data.step.data.__component,
              id: data.step.data.id,
              thingsboard_profile: data.step.data.thingsboard_profile
            }, null, {
              flash: {progress: 100}
            });
            returnPromise.then((response) => resolve(response), (reason) => reject(reason));
          }
        } else {
          returnPromise = strapi.plugin(pluginId)
            .service('thingsboardService').setupThingsboardDeviceAsset(
              deployment.firm.TenentUID,
              deployment.firm.CustomerUID,
              data.step.data.thingsboard_profile,
              {
                name: data.parameter.name || deployment.name + " | " + data.parameter.label,
                label: data.parameter.label
              }
            );
          if(!_ignoreStepsProgressUpdate) {
            returnPromise = returnPromise.then((response) => {
                strapi.plugin('thingsboard-plugin').service('strapiService').updateInstructionStepsProgressFromDeployment(deploymentId, {
                  ...data.step.data,
                  __component: data.step.data.__component,
                  id: data.step.data.id,
                  thingsboard_profile: data.step.data.thingsboard_profile,
                  device: response.id
                }, null, {
                  setup: {progress: 100}
                });
                resolve(response);
            }, (reason) => {
              strapi.plugin('thingsboard-plugin').service('strapiService').updateInstructionStepsProgressFromDeployment(deploymentId, {
                ...data.step.data,
                __component: data.step.data.__component,
                id: data.step.data.id,
                thingsboard_profile: data.step.data.thingsboard_profile
              }, null, { setup: { progress: 0 }});
              strapi.log.warn(`${data.step.data.__component} action failed`);
              reject(reason);
            });
          } else {
            returnPromise.then((response) => resolve(response), (reason) => reject(reason));
          }


        }
        break;
      case "instructions.text-instruction":
        returnPromise = strapi.plugin('thingsboard-plugin').service('strapiService').updateInstructionStepsProgressFromDeployment(deploymentId, {
          ...data.step.data,
          __component: data.step.data.__component,
          id: data.step.data.id,
        }, 100, {})
        returnPromise.then((response) => resolve(response), (reason) => reject(reason));
        break;
      case "instructions.list-instruction":
        //console.warn("data: " + JSON.stringify(data));
        returnPromise = strapi.plugin('thingsboard-plugin').service('strapiService').updateInstructionStepsProgressFromDeployment(deploymentId, {
          ...data.step.data,
          __component: data.step.data.__component,
          id: data.step.data.id,
        }, null, data.parameter)
        returnPromise.then((response) => resolve(response), (reason) => reject(reason));
      default:
        break;
    }


    });

  },
  replaceUUIDsForDeployment(deployedProfiles: Array<ComponentStructure>, objectToReplaceWithin: any) {
    let replacementDictionary: Array<string> = new Array<string>();
    deployedProfiles.forEach((deployed: ComponentStructure) => {
      if (deployed.id && deployed.template) {
        replacementDictionary[deployed.template.id] = deployed.id;
      }
      if (deployed.tenantId && deployed.template.tenantId) {
        replacementDictionary[deployed.template.tenantId.id] = deployed.tenantId.id;
      }
    });
    return JSON.parse(JSON.stringify(objectToReplaceWithin).replace(new RegExp(Object.keys(replacementDictionary).join("|"), "gim"), (matched) => {
      return replacementDictionary[matched]
    }))
  }
});
