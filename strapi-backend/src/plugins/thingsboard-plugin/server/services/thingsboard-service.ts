import { Strapi } from '@strapi/strapi';
import { responses } from "@strapi/strapi/dist/middlewares/responses";
import axios, { AxiosResponse } from "axios";
import { randomUUID } from "crypto";
import pluginId from "../../admin/src/pluginId";

export default ({ strapi }: { strapi: Strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },
  getURLSetting(): string {
    return strapi.plugin(pluginId).config('thingsboardUrl')
  },
  async getTenants(params : { page: number, pageSize: number, sortOrder: string, sortProperty: string, textSearch: string}) {
    return this.axiosAsSysAdmin({method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/tenants", params: params})
      .then((response) => response.data);
  },
  async getThingsboardComponents(tenantId: string, componentType: string, params : { page: number, pageSize: number, sortOrder: string, sortProperty: string, textSearch: string}) {
      switch (componentType) {
        case "dashboard":
          return this.axiosAsTenant(tenantId,{method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/tenant/dashboards`, params: params})
            .then((response: any) => {
              return response.data
            });
        case "assetprofile":
          return  this.axiosAsTenant(tenantId,{method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/assetProfiles`, params: params})
            .then((response: any) => {
              return response.data
            })
        case "deviceprofile":
          return  this.axiosAsTenant(tenantId,{method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/deviceProfiles`, params: params})
            .then((response: any) => {
              return response.data
            })
        case "rulechain":
          return  this.axiosAsTenant(tenantId,{method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/ruleChains`, params: params})
            .then((response: any) => {
              return response.data
            })
      }

  },
  async getThingsboardComponent(componentId: string, componentType: string, tenantId: string) {
      switch (componentType) {
        case "dashboard":
          return (await this.axiosAsTenant(tenantId, {
            method: 'get',
            url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/dashboard/${componentId}`
          })
            .then((response: any) => response.data));
        case "assetprofile":
          return (await this.axiosAsTenant(tenantId, {
            method: 'get',
            url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/assetProfile/${componentId}`
          })
            .then((response: any) => response.data));
        case "deviceprofile":
          return (await this.axiosAsTenant(tenantId, {
            method: 'get',
            url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/deviceProfile/${componentId}`
          })
            .then((response: any) => response.data));
        case "rulechain":
          return (await this.axiosAsTenant(tenantId, {
            method: 'get',
            url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/ruleChain/${componentId}`
          })
            .then((response: any) => response.data));

        case "rulechain_metadata":
          return (await this.axiosAsTenant(tenantId, {
            method: 'get',
            url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/ruleChain/${componentId}/metadata`
          })
            .then((response: any) => response.data));
      }
  },
  async getThingsboardDashboardInfo(componentId: string,  tenantId: string) {
    return (await this.axiosAsTenant(tenantId, {
      method: 'get',
      url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/dashboard/info/${componentId}`
    })
      .then((response: any) => response.data));
  }
  ,
  async createDummytThingsboardComponentForTenant(tenantId: string, componentType: string) {
    let data: any = {
      name: "temp dummy name " + randomUUID()
    };

    switch (componentType) {
      case "dashboard":
        data.title = data.name;
      case "deviceprofile":
        data.type = "DEFAULT";
        data.transportType = "DEFAULT";
        data.provisionType = "DISABLED";
        data.profileData = {
                            configuration: { type: "DEFAULT"},
                            transportConfiguration: { type:"DEFAULT"},
                            provisionConfiguration: { type:"DISABLED"}
                           }
      default:
    }

    return this.createThingsboardComponentForTenant(tenantId, componentType, data);
  },
  async createThingsboardComponentForTenant(tenantId: string, componentType: string, data: any) {
    delete  data.id;
    delete  data.tenantId;
    delete  data.createdTime;

    switch (componentType) {
      case "dashboard":
        data.assignedCustomers = null;
        break;
      case "assetprofile":
        data.defaultRuleChainId = null;
        data.defaultEdgeRuleChainId = null;
        break;
      case "deviceprofile":
        data.defaultRuleChainId = null;
        data.defaultEdgeRuleChainId = null;
        break;
      case "rulechain_metadata":
        data.firstRuleNodeId = null;
        break;
      default:
        break;
    }

    return this.updateThingsboardComponentForTenant(tenantId, componentType, data);
  },
  async updateThingsboardComponentForTenant(tenantId: string, componentType: string, data: any) {
    switch (componentType) {
      case "dashboard":
        return this.axiosAsTenant(tenantId, {method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/dashboard`,headers: {
            'Content-Type': 'application/json'
          }, data: JSON.stringify(data)})
          .then((response: any) => response?.data);

      case "assetprofile":
        return this.axiosAsTenant(tenantId, {method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/assetProfile`,headers: {
            'Content-Type': 'application/json'
          }, data: JSON.stringify(data)})
          .then((response: any) => response?.data);

      case "deviceprofile":
        return this.axiosAsTenant(tenantId, {method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/deviceProfile`,headers: {
            'Content-Type': 'application/json'
          }, data: JSON.stringify(data)})
          .then((response: any) => response?.data);

      case "rulechain":
        return this.axiosAsTenant(tenantId, {method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/ruleChain`,headers: {
            'Content-Type': 'application/json'
          }, data: JSON.stringify(data)})
          .then((response: any) => response?.data);

      case "rulechain_metadata":
        data.nodes = data.nodes.map((n) => {
          delete n.id;
          delete n.ruleChainId;
          return n;
        })
        return this.axiosAsTenant(tenantId, {method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/ruleChain/metadata`, params: { updateRelated: true }, headers: {
            'Content-Type': 'application/json'
          }, data: JSON.stringify(data)})
          .then((response: any) => response?.data);
    }
  },
  async syncThingsboardComponentForTenant(fromComponentId: string, fromTenantId: string , toComponentId: string, toTenantId: string, componentType: string, replacementDictionary: any, title?: string) {

    let template = await this.getThingsboardComponent(fromComponentId, componentType, fromTenantId);

    if(template.id) {
      template.id.id = toComponentId;
    }
    if(template.tenantId) {
      template.tenantId.id = toTenantId;
    }

    console.warn("title", title, template, template.name);

    if(title) {
      if(template.title) {
        template.title = title + " | " + template.title;
      }

      if(template.name) {
        template.name = title + " | " + template.name;
      }

    }

    console.info("title", title, template);

    try {
      template = JSON.parse(JSON.stringify(template).replace(new RegExp(Object.keys(replacementDictionary).join("|"), "gi"), (matched) => {
        return replacementDictionary[matched]
      }));
    } catch (e) {
      console.error(e)
    }

    if(componentType === "rulechain") {
      try {
        this.syncThingsboardComponentForTenant(fromComponentId, fromTenantId, toComponentId, toTenantId, "rulechain_metadata", replacementDictionary, title);
      } catch (e) {
        console.error(e)
      }
    }

    return this.updateThingsboardComponentForTenant(toTenantId, componentType, template);
  },
  /*async copyThingsboardComponentForTenant(componentId: string, componentType: string, fromTenantId: string, toTenantId: string) {
    switch (componentType) {
      case "rulechain":
        const gotRuleChain = await this.getThingsboardComponent(componentId, componentType, fromTenantId);
        return this.createThingsboardComponentForTenant(toTenantId, componentType, gotRuleChain).then((response) => {

          this.getThingsboardComponent(componentId, "rulechain_metadata", fromTenantId).then((metadata) => {

            metadata.ruleChainId = { id: response.id.id, entityType: response.id.entityType };
            metadata.nodes = metadata.nodes.map((n) => {
              n.id = null;
              n.ruleChainId = null;
              return n;
            })

            this.axiosAsTenant(toTenantId, {
              method: 'post',
              url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/ruleChain/metadata`,
              params: {updateRelated: true},
              headers: {
                'Content-Type': 'application/json'
              },
              data: JSON.stringify(metadata)
            });

          });


          //TODO remove. Code is unused now.

          return response;
        });
      default:
        return this.createThingsboardComponentForTenant(toTenantId, componentType, await this.getThingsboardComponent(componentId, componentType, fromTenantId));
    }
  },*/
  async getSysAdminToken() {
    return axios({method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/auth/login",headers: {
        'Content-Type': 'application/json'
      }, data: JSON.stringify({username: "sysadmin@thingsboard.org", password: "sysadmin"})})
      .then((response:any) => response.data);
  },
  async getUserToken(userId: string) {
    console.warn("get user token");
    return this.axiosAsSysAdmin({method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/user/${userId}/token`})
      .then((response):any => response.data);
  },
  async axiosAsSysAdmin(params) {
    params.headers = Object.assign(params.headers || {},  {'X-Authorization': "Bearer " + (await this.getSysAdminToken()).token});
    return axios(params);
  },
  async axiosAsTenant(tenantId: string, params) {
    const uNew: any = await this.createUser({
      "tenantId": {
        "id": tenantId,
        "entityType": "TENANT"
      },
      "firstName": "system",
      "lastName": "",
      "authority": "TENANT_ADMIN",
      "phone": "",
      "email": tenantId + "_" + randomUUID() + "-system@system.local",
      "additionalInfo": {}
    });
    let response: any = null;
    let error: any = null;
    try {
      response = await this.axiosAsUser(uNew.id.id, params);
    } catch (e) {
      error = e;
    }
    const delUser: any = await this.deleteUser(uNew.id.id);
    return new Promise((resolve, reject) => {
      if ( !error ) {
        resolve(response);
      } else {
        reject(error)
      }
    })
  },
  async axiosAsUser(userId: string, params) {
    params.headers = Object.assign(params.headers || {},  {'X-Authorization': "Bearer " + (await this.getUserToken(userId)).token});
    return axios(params);
  },
  async createTenant(params : {
                       "title": string,
                       "region": string,
                       "country": string,
                       "state": string,
                       "city": string,
                       "address": string,
                       "address2": string,
                       "zip": string,
                       "phone": string,
                       "email": string,
                       "additionalInfo": any
                     }): Promise<{
    "id": {
      "id": string,
      "entityType": string
    },
    "title": string,
    "region": string,
    "tenantProfileId": {
      "id": string,
      "entityType": string
    },
    "country": string,
    "state": string,
    "city": string,
    "address": string,
    "address2": string,
    "zip": string,
    "phone": string,
    "email": string,
    "additionalInfo": any
  }> {
    strapi.log.warn("CREATING A NEW Thingsboard TENANT")
    return this.axiosAsSysAdmin({method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/tenant", headers: {
        'Content-Type': 'application/json'
      }, data: JSON.stringify(params)}).then((response) => response.data);
  },
  async createUser(params : {
    "tenantId"?: {
      "id": string,
      "entityType": "TENANT"
    },
    "customerId"?: {
      "id": string,
      "entityType": "CUSTOMER"
    },
    "firstName": string,
    "lastName": string,
    "authority": string
    "phone": string,
    "email": string,
    "additionalInfo": any
  }): Promise<{
    "id": {
      "id": string,
      "entityType": "USER"
    },
    "tenantId"?: {
      "id": string,
      "entityType": "TENANT"
    },
      "customerId"?: {
        "id": string,
        "entityType": "CUSTOMER"
      },
      "firstName": string,
      "lastName": string,
      "authority": string
      "phone": string,
      "email": string,
      "additionalInfo": any
  }> {
    strapi.log.warn("CREATING A NEW Thingsboard USER", params);
    return this.axiosAsSysAdmin({method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/user?sendActivationMail=false", headers: {
        'Content-Type': 'application/json'
      }, data: JSON.stringify(params)}).then((response) => response.data);
  },
  async createCustomer(tenantID: string, params: {
    "id"?: {
      "id": string,
      "entityType": string
    },
    "title": string,
    "tenantId"?: {
      "id": string,
      "entityType": string
    },
    "country": string,
    "state": string,
    "city": string,
    "address": string,
    "address2": string,
    "zip": string,
    "phone": string,
    "email": string,
    "additionalInfo": any
  }) {
    strapi.log.warn("CREATING A NEW Thingsboard Customer", params);
    return this.axiosAsTenant(tenantID, {method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/customer", headers: {
        'Content-Type': 'application/json'
      }, data: JSON.stringify(params)}).then((response) => response.data);
  },
  async deleteUser(userID: string) {
    return this.axiosAsSysAdmin({method: 'DELETE', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/user/${userID}`, headers: {
        'Content-Type': 'application/json'
      }}).then((response) => { strapi.log.info(`Deleted User ${userID}`); return response.data});
  },
  async deleteCustomer(tenantID: string, userID: string) {
    return this.axiosAsTenant(tenantID, {method: 'DELETE', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/customer/${userID}`, headers: {
        'Content-Type': 'application/json'
      }}).then((response) => { strapi.log.info(`Deleted Customer ${userID}`); return response.data});
  },
  async deleteTenant(tenantID: string) {
    return this.axiosAsSysAdmin({method: 'DELETE', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/tenant/${tenantID}`, headers: {
        'Content-Type': 'application/json'
      }}).then((response) => { strapi.log.info(`Deleted Tenant ${tenantID}`); return response.data});
  },
});
