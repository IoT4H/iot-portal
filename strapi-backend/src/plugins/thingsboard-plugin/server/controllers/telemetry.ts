import { Strapi } from '@strapi/strapi';
import pluginId from "../../admin/src/pluginId";

export default ({ strapi }: { strapi: Strapi }) => ({
  async exportTelemetry(ctx) {
    const { entityType, id } = ctx.params;

    const keysParam = ctx.query.key;
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
      .getTelemetryForDevice(tenantId, entityType, id, keys);

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
  }
});
