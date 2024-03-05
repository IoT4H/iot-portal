import { Strapi } from '@strapi/strapi';
import pluginId from "../../admin/src/pluginId";

export default ({ strapi }: { strapi: Strapi }) => ({
  async index(ctx) {
    ctx.body = "index";
  },
  async token(ctx) {
    const userId: any = await strapi.entityService.findOne('plugin::users-permissions.user', Number(ctx.state.user.id), {
      fields: ["thingsboardUserId"],
      populate: { firm: { fields: ["TenentUID","CustomerUID", "CustomerUserUID"]}}
    });
    const tokens = await strapi
      .plugin(pluginId)
      .service('thingsboardService')
      .getCustomerUserToken(userId.firm.TenentUID, userId.firm.CustomerUserUID);
    ctx.body = tokens;
  },
  url(ctx) {
    return null;
  }
});
