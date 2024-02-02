import pluginId from "../../../admin/src/pluginId";

export default [
  {
    method: 'GET',
    path: '/usecase/:useCaseId/setup/deploy',
    handler: `plugin::${pluginId}.myController.newDeployment`,
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
]
