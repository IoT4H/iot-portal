import { prefixPluginTranslations } from '@strapi/helper-plugin';
import { Text } from "@strapi/icons";
import pluginPkg from '../../package.json';
import createCustomerButton from "./components/createCustomerButton";
import createTenantButton from "./components/createTenantButton";
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import pluginId from './pluginId';

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {

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
        defaultMessage: "Multiple Thingsboard Component",
      },
      intlDescription: {
        id: "thingsboard-plugin.thingsboardComponent.description",
        defaultMessage: "Choose multiple component from ThingsBoard",
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

    app.customFields.register({
        name: "singleThingsboardComponent",
        pluginId: pluginId,
        type: "json",
        intlLabel: {
          id: "thingsboard-plugin.singleThingsboardComponent.label",
          defaultMessage: "Thingsboard Component",
        },
        intlDescription: {
          id: "thingsboard-plugin.singleThingsboardComponent.description",
          defaultMessage: "Choose a component from ThingsBoard",
        },
        icon: PluginIcon, // don't forget to create/import your icon component
        components: {
          Input: async () =>
            import(/* webpackChunkName: "input-component" */ "./components/SingleThingsboardComponent"),
        },
        options: {
          // declare options here
          base: [
            {
              sectionTitle: {
                // Add a "Format" settings section
                id: "thingsboard-plugin.singleThingsboardComponent.type",
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
                    id: "thingsboard-plugin.singleThingsboardComponent.type.label",
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
                          id: "thingsboard-plugin.singleThingsboardComponent.type.Dashboard",
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
                          id: "thingsboard-plugin.singleThingsboardComponent.type.DeviceProfile",
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
                          id: "thingsboard-plugin.singleThingsboardComponent.type.AssetProfile",
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
                          id: "thingsboard-plugin.singleThingsboardComponent.type.RuleChain",
                          defaultMessage: "Rule Chain",
                        },
                      },
                    }
                  ],
                }
              ]
            }
          ],
          // declare options here
          advanced: [
            {
              sectionTitle: {
                // Add a "Format" settings section
                id: "thingsboard-plugin.singleThingsboardComponent.type",
                defaultMessage: "Type",
              },
              items: [
                // Add settings items to the section
                {
                  intlLabel: {
                    id: "thingsboard-plugin.singleThingsboardComponent.types.Dashboard",
                    defaultMessage: "Dashboard selectable",
                  },
                  name: "options.types.dashboard",
                  type: 'checkbox',
                  value: true,
                },
                {
                  intlLabel: {
                    id: "thingsboard-plugin.singleThingsboardComponent.types.AssetProfile",
                    defaultMessage: "Asset Profile selectable",
                  },
                  name: "options.types.AssetProfile",
                  type: 'checkbox',
                  value: true,
                },
                {
                  intlLabel: {
                    id: "thingsboard-plugin.singleThingsboardComponent.types.DeviceProfile",
                    defaultMessage: "Device Profile selectable",
                  },
                  name: "options.types.DeviceProfile",
                  type: 'checkbox',
                  value: true,
                },
                {
                  intlLabel: {
                    id: "thingsboard-plugin.singleThingsboardComponent.types.RuleChain",
                    defaultMessage: "Rule Chain selectable",
                  },
                  name: "options.types.RuleChain",
                  type: 'checkbox',
                  value: true,
                }
              ]
            }
          ]
        }
      }
    );


    app.customFields.register({
        name: "componentLinksComponent",
        pluginId: pluginId,
        type: "json",
        intlLabel: {
          id: "thingsboard-plugin.componentLinksComponent.label",
          defaultMessage: "Thingsboard Component Mapping",
        },
        intlDescription: {
          id: "thingsboard-plugin.componentLinksComponent.description",
          defaultMessage: "Shows Thingsboard Component ID Map",
        },
        icon: PluginIcon, // don't forget to create/import your icon component
        components: {
          Input: async () =>
            import(/* webpackChunkName: "input-component" */ "./components/ComponentLinksComponent"),
        },
      }
    );

    app.customFields.register({
        name: "componentListInput",
        pluginId: pluginId,
        type: "json",
        intlLabel: {
          id: "thingsboard-plugin.componentListInput.label",
          defaultMessage: "Custom List Input",
        },
        intlDescription: {
          id: "thingsboard-plugin.componentListInput.description",
          defaultMessage: "Gives User an UI to write a list of strings as JSON Array",
        },
        icon: Text, // don't forget to create/import your icon component
        components: {
          Input: async () =>
            import(/* webpackChunkName: "input-component" */ "./components/componentListInput"),
        },
      },
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

  bootstrap(app: any) {
    app.injectContentManagerComponent('editView', 'right-links', { name: 'createTenant', Component: () => createTenantButton()})
    app.injectContentManagerComponent('editView', 'right-links', { name: 'createCustomer', Component: () => createCustomerButton()})
  },

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
