import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('thingsboard-plugin')
      .service('myService')
      .getWelcomeMessage();
  },
  setting(ctx) {
     strapi
      .plugin('thingsboard-plugin')
      .service('myService')
      .getURLSetting();
     ctx.body = null;
  },
  test(ctx) {
    ctx.body = strapi.plugin('thingsboard-plugin')
      .service('myService')
      .getTenants();
  }
});
