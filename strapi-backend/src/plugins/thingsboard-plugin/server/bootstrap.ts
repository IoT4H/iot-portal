import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  // bootstrap phase

  strapi.db.lifecycles.subscribe({
    models: ['plugin::users-permissions.user'], // optional;

    async beforeCreate(event: any) {
      const { data, where, select, populate } = event.params;
      const firm = data.firm.connect.length > 0 && await strapi.query('api::firm.firm').findOne({ where: { id: data.firm.connect[0].id}})
      const tenant = await strapi.plugin('thingsboard-plugin').service('myService').createUser({
        "firstName": data.firstname,
        "lastName": data.lastname,
        "phone": data.phone,
        "email": data.email,
        "authority": "TENANT_ADMIN",
        "tenantId": {
          "id": firm.TenentUID,
          "entityType": "TENANT"
        },
        "additionalInfo": {}
      });
      data.thingsboardUserId = tenant.id.id;

    },
  });

  strapi.db.lifecycles.subscribe({
    models: ['api::firm.firm'], // optional;

    async beforeCreate(event: any) {
      const { data, where, select, populate } = event.params;
      const address = await strapi.query('general.addresse').findOne({ where: { id: data.Address.id}})
      const tenant = await strapi.plugin('thingsboard-plugin').service('myService').createTenant({
        "title": data.name,
        "region": "",
        "country": address.Country || "",
        "state": address.State || "",
        "city": address.City || "",
        "address": address.Address || "",
        "address2": address.Address_2 || "",
        "zip": address.Postal_code || "",
        "phone": "",
        "email": "",
        "additionalInfo": {}
      });
      data.TenentUID = tenant.id.id;
    },
  });

};
