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
];
