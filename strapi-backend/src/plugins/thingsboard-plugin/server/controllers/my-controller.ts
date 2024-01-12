import { Strapi } from '@strapi/strapi';
import pluginId from "../../admin/src/pluginId";

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin(pluginId)
      .service('myService')
      .getWelcomeMessage();
  },
  setting(ctx) {
     strapi
      .plugin(pluginId)
      .service('myService')
      .getURLSetting();
     ctx.body = null;
  },
  async tenants(ctx) {
      const s = JSON.stringify(await strapi.plugin(pluginId)
        .service('myService')
        .getTenants({ page: ctx.query.pagination?.page || 0, pageSize: ctx.query.pagination?.pageSize || 30}));
      ctx.body = s;

  },
  async components(ctx) {
    strapi.log.warn(JSON.stringify(ctx.params));
    const s = JSON.stringify(await strapi.plugin(pluginId)
      .service('myService')
      .getThingsboardComponent(ctx.params.tenantId, ctx.params.component, { page: ctx.query.pagination?.page || 0, pageSize: ctx.query.pagination?.pageSize || 30}));
    ctx.body = s;

  }
});
