import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import yup from 'yup'

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    /* app.addMenuLink({
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
    }); */

    app.customFields.register({
      name: "thingsboardUserId",
      pluginId: pluginId,
      type: "string",
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

    app.customFields.register({
      name: "thingsboardComponent",
      pluginId: pluginId,
      type: "json",
      intlLabel: {
        id: "thingsboard-plugin.thingsboardComponent.label",
        defaultMessage: "Thingsboard Component",
      },
      intlDescription: {
        id: "thingsboard-plugin.thingsboardComponent.description",
        defaultMessage: "Choose a component from ThingsBoard",
      },
      icon: PluginIcon, // don't forget to create/import your icon component
      components: {
        Input: async () =>
          import(/* webpackChunkName: "input-component" */ "./components/ThingsboardComponent"),
      },
      options: {
        // declare options here
        base: [
          {
            sectionTitle: {
              // Add a "Format" settings section
              id: "thingsboard-plugin.thingsboardComponent.type",
              defaultMessage: "Type",
            },
            items: [
              // Add settings items to the section
              {
                /*
                  Add a "Color format" dropdown
                  to choose between 2 different format options
                  for the color value: hexadecimal or RGBA
                */
                intlLabel: {
                  id: "thingsboard-plugin.thingsboardComponent.type.label",
                  defaultMessage: "Thingsboard Component Type",
                },
                name: "options.type",
                type: "select",
                value: "Dashboard", // option selected by default
                options: [
                  // List all available "Color format" options
                  {
                    key: "Dashboard",
                    defaultValue: "Dashboard",
                    value: "Dashboard",
                    metadatas: {
                      intlLabel: {
                        id: "thingsboard-plugin.thingsboardComponent.type.Dashboard",
                        defaultMessage: "Dashboard",
                      },
                    },
                  },
                  {
                    key: "Device Profile",
                    defaultValue: "DeviceProfile",
                    value: "DeviceProfile",
                    metadatas: {
                      intlLabel: {
                        id: "thingsboard-plugin.thingsboardComponent.type.DeviceProfile",
                        defaultMessage: "Device Profile",
                      },
                    },
                  },
                  {
                    key: "Asset Profile",
                    defaultValue: "AssetProfile",
                    value: "AssetProfile",
                    metadatas: {
                      intlLabel: {
                        id: "thingsboard-plugin.thingsboardComponent.type.AssetProfile",
                        defaultMessage: "Asset Profile",
                      },
                    },
                  },
                  {
                    key: "Rule Chain",
                    defaultValue: "RuleChain",
                    value: "RuleChain",
                    metadatas: {
                      intlLabel: {
                        id: "thingsboard-plugin.thingsboardComponent.type.RuleChain",
                        defaultMessage: "Rule Chain",
                      },
                    },
                  }
                ],
              }
            ]
          }
        ]
      }
    }
    );

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


