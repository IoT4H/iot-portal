import pluginId from "../../../admin/src/pluginId";

export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/tenants',
      handler: `plugin::${pluginId}.deployment.tenants`,
      config: {
        policies: [],
        auth: false
      },
    },
    {
      method: 'GET',
      path: '/tenant/:tenantId/:component',
      handler: `plugin::${pluginId}.deployment.components`,
      config: {
        policies: [],
        auth: false
      },
    },
    {
      method: 'GET',
      path: '/firm/:firmId/createTenant',
      handler: `plugin::${pluginId}.deployment.createTenantForFirm`,
      config: {
        policies: [],
        auth: false
      },
    },
  ]
}
