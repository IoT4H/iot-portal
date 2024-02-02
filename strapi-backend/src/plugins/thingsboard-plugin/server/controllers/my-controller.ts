import { Strapi } from '@strapi/strapi';
import pluginId from "../../admin/src/pluginId";

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin(pluginId)
      .service('thingsboardService')
      .getWelcomeMessage();
  },
  setting(ctx) {
     strapi
      .plugin(pluginId)
      .service('thingsboardService')
      .getURLSetting();
     ctx.body = null;
  },
  async tenants(ctx) {
      const s = JSON.stringify(await strapi.plugin(pluginId)
        .service('thingsboardService')
        .getTenants({ page: ctx.query.pagination?.page || 0, pageSize: ctx.query.pagination?.pageSize || 30}));
      ctx.body = s;

  },
  async components(ctx) {
    const s = JSON.stringify(await strapi.plugin(pluginId)
      .service('thingsboardService')
      .getThingsboardComponents(ctx.params.tenantId, ctx.params.component, { page: ctx.query.pagination?.page || 0, pageSize: ctx.query.pagination?.pageSize || 30}));
    ctx.body = s;
  },
  async createTenantForFirm(ctx) {
    const s = JSON.stringify(await strapi.plugin(pluginId)
      .service('strapiService').createTenantForBetrieb(Number(ctx.params.firmId)));
      ctx.body = s;
  },
  async newDeployment(ctx) {
    console.log(ctx);
    //TODO get firm id from User who requested the deployment
    const s = await strapi.plugin(pluginId)
      .service('strapiService').createNewDeployment(Number(ctx.params.useCaseId), Number(ctx.params.firmId));
    ctx.body = s;
  },
  async deploySetup(ctx) {
    const s = await strapi.plugin(pluginId)
      .service('strapiService').deploySetup(Number(ctx.params.setupId));
    ctx.body = s;
  }
});
