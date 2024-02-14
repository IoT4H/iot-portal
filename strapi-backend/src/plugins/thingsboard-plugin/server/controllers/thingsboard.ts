import { Strapi } from '@strapi/strapi';
import pluginId from "../../admin/src/pluginId";

export default ({ strapi }: { strapi: Strapi }) => ({
  async index(ctx) {
    ctx.body = "index";
  },
  async token(ctx) {

    const userId: any = await strapi.entityService.findOne('plugin::users-permissions.user', Number(ctx.state.user.id), {
      fields: ["thingsboardUserId"],
    });

    const tokens = await strapi
      .plugin(pluginId)
      .service('thingsboardService')
      .getUserToken(userId.thingsboardUserId);

    ctx.body = tokens;
  },
  url(ctx) {
    return null;
  }
});
