import pluginId from "../../../admin/src/pluginId";

export default [
  {
    method: 'GET',
    path: '/usecase/:useCaseId/setup/deploy',
    handler: `plugin::${pluginId}.deployment.create`,
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
    path: '/deployments',
    handler: `plugin::${pluginId}.deployment.findAll`,
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
    path: '/deployment/:id',
    handler: `plugin::${pluginId}.deployment.findOne`,
    config: {
      policies: [
        (policyContext, config, { strapi }) => {

          if (!policyContext.state.isAuthenticated) {
            return false;
          }

          strapi.entityService.findOne('plugin::users-permissions.user', policyContext.state.user.id, {
            fields: [],
            populate: { firm : { fields: ["id"] } }
          }).then((u: any) => {
            console.warn(u.firm.id)
          });



          strapi.entityService.findOne("api::deployment.deployment", Number(policyContext.params.id), {
            fields: [],
            populate: { firm : true }
          }).then((d: any) => {
            console.warn(d, d?.firm, d?.firm?.id);
          })

          return true;

        }
      ]
    },
  },
  {
    method: 'GET',
    path: '/deployment/:setupId/status',
    handler: `plugin::${pluginId}.deployment.status`,
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
    path: '/deployment/:setupId/dashboards',
    handler: `plugin::${pluginId}.deployment.getDashboards`,
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
    path: '/deployment/:setupId/deviceTypes',
    handler: `plugin::${pluginId}.deployment.getDevices`,
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
    path: '/deployment/:setupId/dashboard/:id',
    handler: `plugin::${pluginId}.deployment.getDashboardInfo`,
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
    path: '/deployment/:setupId/steps',
    handler: `plugin::${pluginId}.deployment.getStepsFromDeployment`,
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
    path: '/deployment/:setupId/steps/progress',
    handler: `plugin::${pluginId}.deployment.getStepsProgressFromDeployment`,
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
    method: 'POST',
    path: '/deployment/:setupId/steps/progress',
    handler: `plugin::${pluginId}.deployment.updateStepsProgressFromDeployment`,
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
    method: 'POST',
    path: '/deployment/:setupId/steps/action',
    handler: `plugin::${pluginId}.deployment.stepAction`,
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
