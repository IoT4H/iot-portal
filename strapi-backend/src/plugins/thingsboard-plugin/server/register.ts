import { Strapi } from '@strapi/strapi';
import pluginId from "../admin/src/pluginId";

export default ({ strapi }: { strapi: Strapi }) => {
  // register phase
  strapi.customFields.register({
    name: "thingsboardUserId",
    plugin: pluginId,
    type: "string",
    inputSize: {
      // optional
      default: 4,
      isResizable: true,
    },
  });

  strapi.customFields.register({
    name: "componentLinksComponent",
    plugin: pluginId,
    type: "json",
    inputSize: {
      // optional
      default: 12,
      isResizable: false,
    },
  });

  strapi.customFields.register({
    name: "singleThingsboardComponent",
    plugin: pluginId,
    type: "json",
    inputSize: {
      // optional
      default: 12,
      isResizable: false,
    },
  });

  strapi.customFields.register({
    name: "thingsboardComponent",
    plugin: pluginId,
    type: "json",
    inputSize: {
      // optional
      default: 12,
      isResizable: false,
    },
  });
};
