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
    path: '/test',
    handler: 'myController.test',
    config: {
      policies: [],
    },
  },
];
