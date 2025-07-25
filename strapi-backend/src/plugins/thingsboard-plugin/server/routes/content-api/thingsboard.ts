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
  },
  {
    method: 'GET',
    path: '/deployment/:setupId/:type/:pid/components',
    handler: `plugin::${pluginId}.deployment.getComponentsForDeploymentByProfile`,
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
    path: '/deployment/:setupId/:type/:pid/relation',
    handler: `plugin::${pluginId}.deployment.createComponentsRelation`,
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
    path: '/deployment/:setupId/device/:did/credentials',
    handler: `plugin::${pluginId}.deployment.getDeviceCredentialsForDeploymentByUUID`,
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
    method: 'DELETE',
    path: '/deployment/:setupId/:type/:did/delete',
    handler: `plugin::${pluginId}.deployment.deleteComponent`,
    config: {
      policies: [
        (policyContext, config, { strapi }) => {
          if (policyContext.state.isAuthenticated) {
            return true;
          }

          return false;
        }
      ]
    }
  },
  {
    method: 'GET',
    path: '/deployment/telemetry/:entityType/:id/keys/timeseries',
    handler: `plugin::${pluginId}.telemetry.getTelemetryKeys`,
    config: {
      policies: [
        (policyContext, config, { strapi }) => {
          if (policyContext.state.isAuthenticated) {
            return true;
          }

          return false;
        }
      ]
    }
  },
  {
    method: 'GET',
    path: '/deployment/telemetry/:entityType/:id/export',
    handler: `plugin::${pluginId}.telemetry.exportTelemetry`,
    config: {
      policies: [
        (policyContext, config, { strapi }) => {
          if (policyContext.state.isAuthenticated) {
            return true;
          }

          return false;
        }
      ]
    }
  },
  {
    method: "POST",
    path: "/deployment/:setupId/telemetry/:entityType/:entityId/attributes/:scope",
    handler: `plugin::${pluginId}.telemetry.postTelemetry`,
    config: {
      policies: [
        (policyContext, config, { strapi }) => {
          if (policyContext.state.isAuthenticated) {
            return true;
          }

          return false;
        }
      ]
    }
  },
  {
    method: "GET",
    path: "/deployment/:setupId/telemetry/:entityType/:entityId/values/attributes/:scope",
    handler: `plugin::${pluginId}.telemetry.getTelemetry`,
    config: {
      policies: [
        (policyContext, config, { strapi }) => {
          if (policyContext.state.isAuthenticated) {
            return true;
          }

          return false;
        }
      ]
    }
  }
]
