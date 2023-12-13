import { Strapi } from '@strapi/strapi';
import pluginId from "../../admin/src/pluginId";

export default ({ strapi }: { strapi: Strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },
  getURLSetting(): string {
    return strapi.plugin(pluginId).config('thingsboardUrl')
  },
  async getTenants() {
    await fetch(strapi.plugin(pluginId).config('thingsboardUrl') + "/api/auth/login", {
      method: 'POST',
      body: null
    }).then((response) => response.json()).then((j) => console.log(j));
  }
});
