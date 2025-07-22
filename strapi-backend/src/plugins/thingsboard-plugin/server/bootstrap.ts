import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
    // bootstrap phase

    strapi
        .plugin('thingsboard-plugin')
        .service('thingsboardService')
        .getSysAdminToken()
        .then((data: any) => {
            if (data.status && data.status === 401) {
                throw new Error(`Sysadmin ${data.message} - Error ${data.errorCode}`);
            }
        });

    strapi.db.lifecycles.subscribe({
        models: ['plugin::users-permissions.user'], // optional;

        async beforeCreate(event: any) {
            const { data, where, select, populate, result } = event.params;
            const firm =
                data.firm.connect.length > 0 &&
                (await strapi.query('api::firm.firm').findOne({ where: { id: data.firm.connect[0].id } }));
            const tenant = await strapi
                .plugin('thingsboard-plugin')
                .service('thingsboardService')
                .createUser({
                    firstName: data.firstname,
                    lastName: data.lastname,
                    phone: data.phone,
                    email: data.email,
                    authority: 'TENANT_ADMIN',
                    tenantId: {
                        id: firm.TenentUID,
                        entityType: 'TENANT'
                    },
                    additionalInfo: {}
                });
            data.thingsboardUserId = tenant.id.id;
        }
    });

    strapi.db.lifecycles.subscribe({
        models: ['api::firm.firm'], // optional;

        async afterCreate(event: any) {
            const { result } = event;
            if (!result.TenantUID) {
                await strapi
                    .plugin('thingsboard-plugin')
                    .service('strapiService')
                    .createTenantForBetrieb(Number(result.id));
            }
            if (!result.CustomerUID || !result.CustomerUserUID) {
                await strapi
                    .plugin('thingsboard-plugin')
                    .service('strapiService')
                    .createCustomerForBetrieb(Number(result.id));
            }
        },
        async beforeDelete(event: any) {
            const firm = await strapi.query('api::firm.firm').findOne(event.params);
            await strapi.plugin('thingsboard-plugin').service('thingsboardService').deleteTenant(firm.TenentUID);
        },
        async beforeDeleteMany(event: any) {
            const firms = await strapi.query('api::firm.firm').findMany(event.params);
            firms.forEach(
                async (firm: any) =>
                    await strapi.plugin('thingsboard-plugin').service('thingsboardService').deleteTenant(firm.TenentUID)
            );
        }
    });

    strapi.db.lifecycles.subscribe({
        models: ['api::deployment.deployment'], // optional;

        async afterCreate(event: any) {
            const data = event.result;
            strapi.plugin('thingsboard-plugin').service('strapiService').deploySetup(Number(data.id));
        },
        async afterUpdate(event: any) {
            const deployment = await strapi.query('api::deployment.deployment').findOne(event.params);
        },
        async afterUpdateMany(event: any) {
            const deployments = await strapi.query('api::deployment.deployment').findMany(event.params);
        },
        async beforeDelete(event: any) {
            await strapi
                .plugin('thingsboard-plugin')
                .service('strapiService')
                .deleteAllThingsboardComponentOfDeployment(Number(event.params.where.id));
        },
        async beforeDeleteMany(event: any) {
            await Promise.all(
                event.params.where.$and[0].id.$in.map(async (id) => {
                    return await strapi
                        .plugin('thingsboard-plugin')
                        .service('strapiService')
                        .deleteAllThingsboardComponentOfDeployment(Number(id));
                })
            );
        }
    });
};
