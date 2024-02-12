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
  async create(ctx) {
    const user: any = await strapi.entityService.findOne('plugin::users-permissions.user', ctx.state.user.id, {
      populate: "*",
    });
    console.warn("req parmas", ctx.query);
    const s = await strapi.plugin(pluginId)
      .service('strapiService').createNewDeployment(Number(ctx.params.useCaseId), Number(user.firm.id), ctx.query.title, ctx.query.description);
    ctx.body = s;
  },
  async findAll(ctx) {
    try {
      let pagination = {};
      if(ctx.params.page && ctx.params.pageSize) {
        pagination = {
          page: ctx.params.page,
          pageSize: ctx.params.pageSize
        }
      }
      const user: any = await strapi.entityService.findOne('plugin::users-permissions.user', ctx.state.user.id, {
        populate: "*",
      });

      const s = await strapi.entityService.findMany("api::deployment.deployment", { fields: ["id", "status", "name", "description"],filters: { firm: { id: user.firm.id }}, ...pagination });
      ctx.body = s;

    } catch (err) {
      ctx.body = err;
    }
  },
  async findOne(ctx) {
    try {
      ctx.body = await strapi.entityService.findOne("api::deployment.deployment", Number(ctx.params.id));
    } catch (err) {
      ctx.body = err;
    }
  },
  async status(ctx) {
    try {
    ctx.body = await strapi.entityService.findOne("api::deployment.deployment", ctx.params.setupId, {fields: ["status"]});
  } catch (err) {
    ctx.body = err;
  }
  },
  async deploySetup(ctx) {
    const s = await strapi.plugin(pluginId)
      .service('strapiService').deploySetup(Number(ctx.params.setupId));
    ctx.body = s;
  },
  async getDashboards(ctx) {
    const s = await strapi.plugin(pluginId)
      .service('strapiService').getDashboardsFromDeployment(Number(ctx.params.setupId));
    ctx.body = s;
  }
});
