import { Strapi } from '@strapi/strapi';
import axios from "axios";
import pluginId from "../../admin/src/pluginId";
import fetch from 'node-fetch';

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
  }
});
