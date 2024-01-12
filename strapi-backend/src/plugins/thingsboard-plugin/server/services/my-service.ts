import { Strapi } from '@strapi/strapi';
import axios from "axios";
import { UUID } from "crypto";
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
  async getThingsboardComponent(tenantId: UUID, componentType: string, params : { page: number, pageSize: number, sortOrder: string, sortProperty: string, textSearch: string}) {
    const component = () => {
      switch (componentType) {
        case "dashboard":
          return "dashboards";
      }
    }
    return this.axiosAsTenant(tenantId,{method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/tenant/dashboards`, params: params})
      .then((response) => response.data);
  },
  async getSysAdminToken() {
    return axios({method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/auth/login",headers: {
        'Content-Type': 'application/json'
      }, data: JSON.stringify({username: "sysadmin@thingsboard.org", password: "sysadmin"})})
      .then((response): string => response.data.token);
  },
  async getUserToken(userId: UUID) {
    return this.axiosAsSysAdmin({method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/user/${userId}/token`})
      .then((response): string => response.data.token);
  },
  async axiosAsSysAdmin(params) {
    params.headers = Object.assign(params.headers || {},  {'X-Authorization': "Bearer " + await this.getSysAdminToken()});
    return axios(params);
  },
  async axiosAsTenant(tenantId: UUID, params) {
    const uNew = await this.createUser({
      "tenantId": {
        "id": tenantId,
        "entityType": "TENANT"
      },
      "firstName": "system",
      "lastName": "",
      "authority": "TENANT_ADMIN",
      "phone": "",
      "email": "system@system.local",
      "additionalInfo": {}
    });
    params.headers = Object.assign(params.headers || {},  {'X-Authorization': "Bearer " + await this.getUserToken(uNew.id.id)});
    return axios(params).finally(() => this.deleteUser(uNew.id.id));
  },
  async axiosAsUser(userId: UUID, params) {
    params.headers = Object.assign(params.headers || {},  {'X-Authorization': "Bearer " + await this.getUserToken(userId)});
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
    strapi.log.warn("CREATING A NEW Thingsboard USER", JSON.stringify(params));
    return this.axiosAsSysAdmin({method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/user?sendActivationMail=false", headers: {
        'Content-Type': 'application/json'
      }, data: JSON.stringify(params)}).then((response) => response.data);
  },
  async deleteUser(userID: UUID) {
    return this.axiosAsSysAdmin({method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/user/${userID}`, headers: {
        'Content-Type': 'application/json'
      }}).then((response) => response.data);
  }
});
