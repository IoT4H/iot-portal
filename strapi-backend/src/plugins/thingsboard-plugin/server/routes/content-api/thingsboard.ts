import pluginId from "../../../admin/src/pluginId";

export default [
  {
    method: 'GET',
    path: '/login/token',
    handler: `plugin::${pluginId}.thingsboard.token`,
    config: {
      policies: [
        (policyContext, config, { strapi }) => {
          if (policyContext.state.isAuthenticated) {
            return true;
          }

          return false;
        }
      ]
    },
  },
  {
    method: 'GET',
    path: '/url',
    handler: `plugin::${pluginId}.thingsboard.url`,
    config: {
      auth: false,
      middlewares: [`plugin::${pluginId}.url`],
    }
  }
]
