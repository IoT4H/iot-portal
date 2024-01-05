import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  // bootstrap phase

  strapi.db.lifecycles.subscribe({
    models: ['plugin::users-permissions.user'], // optional;

    async beforeCreate(event: any) {
      const { data, where, select, populate } = event.params;
      const tenant = await strapi.plugin('thingsboard-plugin').service('myService').createTenant({
        "title": "Test-"+data.username,
        "region": "Germany",
        "country": "Germany",
        "state": "NRW",
        "city": "Aachen",
        "address": "someadress",
        "address2": "",
        "zip": "52070",
        "phone": "900000",
        "email": data.email,
        "additionalInfo": {}
      });
      data.thingsboardUserId = tenant.id.id;

      console.log(data);
    },
  });

};
