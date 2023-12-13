import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import('./pages/HomePage');

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });

    app.customFields.register({
      name: "thingsboardUserId",
      pluginId: pluginId, // the custom field is created by a color-picker plugin
      type: "string", // the color will be stored as a string
      intlLabel: {
        id: "thingsboard-plugin.thingsboardUserId.label",
        defaultMessage: "Thingsboard UID",
      },
      intlDescription: {
        id: "thingsboard-plugin.thingsboardUserId.description",
        defaultMessage: "Enter the matching Thingsboard UID",
      },
      icon: PluginIcon, // don't forget to create/import your icon component
      components: {
        Input: async () =>
          import(/* webpackChunkName: "input-component" */ "./components/InputTBId"),
      },
      options: {
        // declare options here
      },
    });

    app.createSettingSection(
      { id: "thingsboard", intlLabel: { id: "thingsboard", defaultMessage: "Thingsboard" } }, // Section to create
      [
        // links
        {
          intlLabel: { id: "thingsboard-config", defaultMessage: "Configuratons" },
          id: "thingsboard-config",
          to: `/settings/${pluginId}`,
          Component: async () => {
            const component = await import('./pages/HomePage');

            return component;
          },
          permissions: [],
        },
      ]
    );

    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};


