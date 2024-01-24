export default [
  {
    method: 'GET',
    path: '/',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/tenants',
    handler: 'myController.tenants',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/tenant/:tenantId/:component',
    handler: 'myController.components',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/firm/:firmId/createTenant',
    handler: 'myController.createTenantForFirm',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/firm/:firmId/setup/deploy/:useCaseId',
    handler: 'myController.newDeployment',
    config: {
      policies: [],
      auth: false
    },
  },
];
