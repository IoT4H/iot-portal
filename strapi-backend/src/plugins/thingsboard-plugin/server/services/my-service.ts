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
  async getTenants() {
    axios({method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/auth/login"})
      .then((response) => JSON.parse(response.data)).then((j) => console.log(j));
  },
  async getSysAdminToken() {
    return axios({method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/auth/login",headers: {
        'Content-Type': 'application/json'
      }, data: JSON.stringify({username: "sysadmin@thingsboard.org", password: "sysadmin"})})
      .then((response): string => response.data.token);
  },
  async getUserToken(userId: UUID) {
    return this.axiosAsSysAdmin({method: 'get', url: strapi.plugin(pluginId).config('thingsboardUrl') + `/api/user/${userId}/token`})
      .then((response) => JSON.parse(response.data)).then((r): string => r.token);
  },
  async axiosAsSysAdmin(params) {
    params.headers = Object.assign(params.headers || {},  {'X-Authorization': "Bearer " + await this.getSysAdminToken()});
    return axios(params);
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
    console.warn("TRYING TO CREATE A TENANT", JSON.stringify(params))
    return this.axiosAsSysAdmin({method: 'post', url: strapi.plugin(pluginId).config('thingsboardUrl') + "/api/tenant", headers: {
        'Content-Type': 'application/json'
      }, data: JSON.stringify(params)}).then((response) => response.data);
  }
});
