import pluginId from "../../../admin/src/pluginId";

export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/tenants',
      handler: `plugin::${pluginId}.myController.tenants`,
      config: {
        policies: [],
        auth: false
      },
    },
    {
      method: 'GET',
      path: '/tenant/:tenantId/:component',
      handler: `plugin::${pluginId}.myController.components`,
      config: {
        policies: [],
        auth: false
      },
    },
    {
      method: 'GET',
      path: '/firm/:firmId/createTenant',
      handler: `plugin::${pluginId}.myController.createTenantForFirm`,
      config: {
        policies: [],
        auth: false
      },
    },
  ]
}
