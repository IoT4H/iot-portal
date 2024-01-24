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
    const component = () => {
      switch (componentType) {
        case "dashboard":
          return "dashboards";
      }
    }
    console.log("STILL WORKS HERE", { "TEST": "WEIRD"}, JSON.stringify({ "TEST": "WEIRD"}));
    return this.axiosAsTenant(tenantId,{method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/tenant/dashboards`, params: params})
      .then((response: any) => {
        console.log("CHECK THIS: ", response.data  );
        return response.data
      });
  },
  async getThingsboardComponent(componentId: string, componentType: string, tenantId: string) {
      switch (componentType) {
        case "dashboard":
          return (await this.axiosAsTenant(tenantId, {
            method: 'get',
            url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/dashboard/${componentId}`
          })
            .then((response: any) => response.data));
      }
  },
  async createThingsboardComponentForTenant(tenantId: string, componentType: string, data: any) {
    data.id = null;
    data.tenantId = null;
    data.createdTime = null;
    data.assignedCustomers = null;

    switch (componentType) {
      case "dashboard":
        return this.axiosAsTenant(tenantId, {method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/dashboard`,headers: {
            'Content-Type': 'application/json'
          }, data: JSON.stringify(data)})
          .then((response: any) => { console.log("CREATE::", response?.data); return response?.data } );
    }
  },
  async copyThingsboardComponentForTenant(componentId: string, componentType: string, fromTenantId: string, toTenantId: string) {
    switch (componentType) {
      case "dashboard":
        return this.createThingsboardComponentForTenant(toTenantId, componentType, await this.getThingsboardComponent(componentId, componentType, fromTenantId));
    }
  },
  async getSysAdminToken() {
    return axios({method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/auth/login",headers: {
        'Content-Type': 'application/json'
      }, data: JSON.stringify({username: "sysadmin@thingsboard.org", password: "sysadmin"})})
      .then((response): string => response.data.token);
  },
  async getUserToken(userId: string) {
    return this.axiosAsSysAdmin({method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/user/${userId}/token`})
      .then((response): string => response.data.token);
  },
  async axiosAsSysAdmin(params) {
    params.headers = Object.assign(params.headers || {},  {'X-Authorization': "Bearer " + await this.getSysAdminToken()});
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
    try {
      response = await this.axiosAsUser(uNew.id.id, params);
    } catch (e) {
        console.error(e)
    }
    const delUser: any = await this.deleteUser(uNew.id.id);
    return new Promise((resolve) => {
      resolve(response);
    })
  },
  async axiosAsUser(userId: string, params) {
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
    strapi.log.warn("CREATING A NEW Thingsboard USER", params);
    return this.axiosAsSysAdmin({method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/user?sendActivationMail=false", headers: {
        'Content-Type': 'application/json'
      }, data: JSON.stringify(params)}).then((response) => response.data);
  },
  async deleteUser(userID: string) {
    return this.axiosAsSysAdmin({method: 'DELETE', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/user/${userID}`, headers: {
        'Content-Type': 'application/json'
      }}).then((response) => { strapi.log.info(`Deleted User ${userID}`); return response.data});
  },
});
