import { Strapi } from "@strapi/strapi";
import pluginId from "../../admin/src/pluginId";

export default ({ strapi }: { strapi: Strapi }) => ({
  async exportTelemetry(ctx) {
    const { entityType, id } = ctx.params;

    const keysParam = ctx.query.key;
    const startTs = parseInt(ctx.query.startTs, 10);
    const endTs = parseInt(ctx.query.endTs, 10);

    const keys: string[] = Array.isArray(keysParam)
      ? keysParam
      : typeof keysParam === 'string'
        ? keysParam.split(',')
        : [];

    if (!keys.length) {
      return ctx.badRequest('Missing keys query param');
    }

    const user: any = await strapi.entityService?.findOne('plugin::users-permissions.user', ctx.state.user.id, {
      populate: { firm: { fields: ["TenentUID"] } }
    });

    const tenantId = user.firm.TenentUID;

    const data = await strapi
      .plugin(pluginId)
      .service('thingsboardService')
      .getTelemetryForDevice(tenantId, entityType, id, keys, startTs, endTs);

    strapi.log.info(`📦 Sending telemetry data for keys: ${keys.join(', ')}`);
    ctx.send(data || {});
  },


  async getTelemetryKeys(ctx) {
    const { entityType, id } = ctx.params;

    const user: any = await strapi.entityService?.findOne('plugin::users-permissions.user', ctx.state.user.id, {
      populate: { firm: { fields: ["TenentUID"] } }
    });

    const tenantId = user.firm.TenentUID;

    ctx.body = await strapi
      .plugin(pluginId)
      .service('thingsboardService')
      .getTelemetryKeysForDevice(tenantId, entityType, id);
  },


  async getTelemetry(ctx) {
    const user: any = await strapi.entityService?.findOne("plugin::users-permissions.user", ctx.state.user.id, {
      populate: { firm: { fields: ["TenentUID"] } }
    });
    const tenantId = user.firm.TenentUID;
    ctx.body = await strapi
      .plugin(pluginId)
      .service("thingsboardService")
      .getTelemetryForDeviceAsset(
        tenantId,
        ctx.params.entityType,
        ctx.params.entityId,
        ctx.params.scope,
        ctx.query.keys
      );
  },

  async postTelemetry(ctx) {
    const user: any = await strapi.entityService?.findOne("plugin::users-permissions.user", ctx.state.user.id, {
      populate: { firm: { fields: ["TenentUID"] } }
    });
    const tenantId = user.firm.TenentUID;

    ctx.body = await strapi
      .plugin(pluginId)
      .service("thingsboardService").setTelemetryForDeviceAsset(tenantId, ctx.params.entityType, ctx.params.entityId, ctx.params.scope, ctx.body);

  }
});
