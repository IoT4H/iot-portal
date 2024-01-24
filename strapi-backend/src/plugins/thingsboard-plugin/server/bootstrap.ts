import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  // bootstrap phase

  strapi.db.lifecycles.subscribe({
    models: ['plugin::users-permissions.user'], // optional;

    async beforeCreate(event: any) {
      const { data, where, select, populate } = event.params;
      const firm = data.firm.connect.length > 0 && await strapi.query('api::firm.firm').findOne({ where: { id: data.firm.connect[0].id}})
      const tenant = await strapi.plugin('thingsboard-plugin').service('thingsboardService').createUser({
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

    async afterCreate(event: any) {
      const { data, where, select, populate } = event.params;
     // await strapi.plugin('thingsboard-plugin').service('strapiService').createTenantForBetrieb(data.id);
    },
  });

  strapi.db.lifecycles.subscribe({
    models: ['api::deployment.deployment'], // optional;

    async afterCreate(event: any) {
      const data = event.result;
      strapi.plugin('thingsboard-plugin').service('strapiService').deploySetup(Number(data.id)).then(() => {
        console.log('deployed')
      });
    },
  });




};
