import type { Attribute, Schema } from "@strapi/strapi";

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: "strapi_api_tokens";
  info: {
    description: "";
    displayName: "Api Token";
    name: "Api Token";
    pluralName: "api-tokens";
    singularName: "api-token";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"admin::api-token", "oneToOne", "admin::user"> & Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<"">;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<"admin::api-token", "oneToMany", "admin::api-token-permission">;
    type: Attribute.Enumeration<["read-only", "full-access", "custom"]> &
      Attribute.Required &
      Attribute.DefaultTo<"read-only">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"admin::api-token", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: "strapi_api_token_permissions";
  info: {
    description: "";
    displayName: "API Token Permission";
    name: "API Token Permission";
    pluralName: "api-token-permissions";
    singularName: "api-token-permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"admin::api-token-permission", "oneToOne", "admin::user"> & Attribute.Private;
    token: Attribute.Relation<"admin::api-token-permission", "manyToOne", "admin::api-token">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"admin::api-token-permission", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface AdminPermission extends Schema.CollectionType {
  collectionName: "admin_permissions";
  info: {
    description: "";
    displayName: "Permission";
    name: "Permission";
    pluralName: "permissions";
    singularName: "permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"admin::permission", "oneToOne", "admin::user"> & Attribute.Private;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    role: Attribute.Relation<"admin::permission", "manyToOne", "admin::role">;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"admin::permission", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: "admin_roles";
  info: {
    description: "";
    displayName: "Role";
    name: "Role";
    pluralName: "roles";
    singularName: "role";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"admin::role", "oneToOne", "admin::user"> & Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<"admin::role", "oneToMany", "admin::permission">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"admin::role", "oneToOne", "admin::user"> & Attribute.Private;
    users: Attribute.Relation<"admin::role", "manyToMany", "admin::user">;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: "strapi_transfer_tokens";
  info: {
    description: "";
    displayName: "Transfer Token";
    name: "Transfer Token";
    pluralName: "transfer-tokens";
    singularName: "transfer-token";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"admin::transfer-token", "oneToOne", "admin::user"> & Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<"">;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<"admin::transfer-token", "oneToMany", "admin::transfer-token-permission">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"admin::transfer-token", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: "strapi_transfer_token_permissions";
  info: {
    description: "";
    displayName: "Transfer Token Permission";
    name: "Transfer Token Permission";
    pluralName: "transfer-token-permissions";
    singularName: "transfer-token-permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"admin::transfer-token-permission", "oneToOne", "admin::user"> & Attribute.Private;
    token: Attribute.Relation<"admin::transfer-token-permission", "manyToOne", "admin::transfer-token">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"admin::transfer-token-permission", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: "admin_users";
  info: {
    description: "";
    displayName: "User";
    name: "User";
    pluralName: "users";
    singularName: "user";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"admin::user", "oneToOne", "admin::user"> & Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Attribute.String;
    registrationToken: Attribute.String & Attribute.Private;
    resetPasswordToken: Attribute.String & Attribute.Private;
    roles: Attribute.Relation<"admin::user", "manyToMany", "admin::role"> & Attribute.Private;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"admin::user", "oneToOne", "admin::user"> & Attribute.Private;
    username: Attribute.String;
  };
}

export interface ApiDeploymentDeployment extends Schema.CollectionType {
  collectionName: "deployments";
  info: {
    description: "";
    displayName: "Setups";
    pluralName: "deployments";
    singularName: "deployment";
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    "content-type-builder": {
      visible: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::deployment.deployment", "oneToOne", "admin::user"> & Attribute.Private;
    CustomerUID: Attribute.String &
      Attribute.Unique &
      Attribute.CustomField<"plugin::thingsboard-plugin.thingsboardUserId">;
    deployed: Attribute.JSON & Attribute.CustomField<"plugin::thingsboard-plugin.componentLinksComponent">;
    description: Attribute.Text;
    firm: Attribute.Relation<"api::deployment.deployment", "oneToOne", "api::firm.firm">;
    name: Attribute.String;
    status: Attribute.Enumeration<["created", "deploying", "deployed", "failed", "updating"]> &
      Attribute.Required &
      Attribute.DefaultTo<"created">;
    stepStatus: Attribute.JSON;
    sync: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"api::deployment.deployment", "oneToOne", "admin::user"> & Attribute.Private;
    use_case: Attribute.Relation<"api::deployment.deployment", "oneToOne", "api::use-case.use-case">;
  };
}

export interface ApiDeviceDevice extends Schema.CollectionType {
  collectionName: "devices";
  info: {
    description: "";
    displayName: "Device";
    pluralName: "devices";
    singularName: "device";
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    ComponentReference: Attribute.JSON &
      Attribute.CustomField<
        "plugin::thingsboard-plugin.singleThingsboardComponent",
        {
          type: "Dashboard";
        }
      >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::device.device", "oneToOne", "admin::user"> & Attribute.Private;
    name: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<["sensor", "microcontroller", "computer"]> &
      Attribute.Required &
      Attribute.DefaultTo<"sensor">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"api::device.device", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface ApiFirmFirm extends Schema.CollectionType {
  collectionName: "firms";
  info: {
    description: "";
    displayName: "Betriebe";
    pluralName: "firms";
    singularName: "firm";
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Address: Attribute.Component<"general.address">;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::firm.firm", "oneToOne", "admin::user"> & Attribute.Private;
    CustomerUID: Attribute.String &
      Attribute.Unique &
      Attribute.CustomField<"plugin::thingsboard-plugin.thingsboardUserId">;
    CustomerUserUID: Attribute.String &
      Attribute.Unique &
      Attribute.CustomField<"plugin::thingsboard-plugin.thingsboardUserId">;
    darkLogo: Attribute.Media<"images">;
    Logo: Attribute.Media<"images">;
    name: Attribute.String & Attribute.Required;
    platformButton: Attribute.Enumeration<["true", "false", "user"]> &
      Attribute.Required &
      Attribute.DefaultTo<"false">;
    TenentUID: Attribute.String &
      Attribute.Unique &
      Attribute.CustomField<"plugin::thingsboard-plugin.thingsboardUserId">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"api::firm.firm", "oneToOne", "admin::user"> & Attribute.Private;
    verified: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
  };
}

export interface ApiGlossarGlossar extends Schema.CollectionType {
  collectionName: "glossars";
  info: {
    description: "";
    displayName: "Wissenbasis";
    pluralName: "glossars";
    singularName: "glossar";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::glossar.glossar", "oneToOne", "admin::user"> & Attribute.Private;
    keyWords: Attribute.JSON & Attribute.CustomField<"plugin::thingsboard-plugin.componentListInput">;
    publishedAt: Attribute.DateTime;
    shortdescription: Attribute.Text & Attribute.Required;
    slug: Attribute.UID<"api::glossar.glossar", "word"> & Attribute.Required;
    text: Attribute.Blocks & Attribute.Required;
    thumbnail: Attribute.Media<"images">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"api::glossar.glossar", "oneToOne", "admin::user"> & Attribute.Private;
    word: Attribute.String;
  };
}

export interface ApiPagePage extends Schema.CollectionType {
  collectionName: "pages";
  info: {
    description: "";
    displayName: "Seiten";
    pluralName: "pages";
    singularName: "page";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    content: Attribute.Blocks & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::page.page", "oneToOne", "admin::user"> & Attribute.Private;
    publishedAt: Attribute.DateTime;
    title: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"api::page.page", "oneToOne", "admin::user"> & Attribute.Private;
    url: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<"/">;
  };
}

export interface ApiPortalEinstellungenPortalEinstellungen extends Schema.SingleType {
  collectionName: "portal_einstellungens";
  info: {
    description: "";
    displayName: "Portal Einstellungen";
    pluralName: "portal-einstellungens";
    singularName: "portal-einstellungen";
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::portal-einstellungen.portal-einstellungen", "oneToOne", "admin::user"> &
      Attribute.Private;
    description: Attribute.Text;
    title: Attribute.String & Attribute.Required & Attribute.DefaultTo<"Portal | IoT4H">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"api::portal-einstellungen.portal-einstellungen", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface ApiStartpageStartpage extends Schema.SingleType {
  collectionName: "startseites";
  info: {
    description: "";
    displayName: "Startseite";
    pluralName: "startseites";
    singularName: "startpage";
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    content: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::startpage.startpage", "oneToOne", "admin::user"> & Attribute.Private;
    locale: Attribute.String;
    localizations: Attribute.Relation<"api::startpage.startpage", "oneToMany", "api::startpage.startpage">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"api::startpage.startpage", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface ApiTagTag extends Schema.CollectionType {
  collectionName: "tags";
  info: {
    description: "";
    displayName: "Tag";
    pluralName: "tags";
    singularName: "tag";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::tag.tag", "oneToOne", "admin::user"> & Attribute.Private;
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    publishedAt: Attribute.DateTime;
    type: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"api::tag.tag", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface ApiUseCaseUseCase extends Schema.CollectionType {
  collectionName: "use_cases";
  info: {
    description: "";
    displayName: "Use-Case";
    pluralName: "use-cases";
    singularName: "use-case";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    complexity: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    components: Attribute.DynamicZone<
      ["thingsboard.asset-profile", "thingsboard.component", "thingsboard.dashboard", "thingsboard.rule-chain"]
    >;
    costs: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::use-case.use-case", "oneToOne", "admin::user"> & Attribute.Private;
    description: Attribute.Blocks & Attribute.Required;
    firms: Attribute.Relation<"api::use-case.use-case", "oneToMany", "api::firm.firm">;
    partnerLogos: Attribute.Media<"images", true>;
    pictures: Attribute.Media<"images", true>;
    publishedAt: Attribute.DateTime;
    setupDuration: Attribute.Integer & Attribute.DefaultTo<0>;
    setupSteps: Attribute.DynamicZone<
      ["instructions.setup-instruction", "instructions.list-instruction", "instructions.text-instruction"]
    >;
    slug: Attribute.UID<"api::use-case.use-case", "Titel"> & Attribute.Required;
    summary: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 100;
      }>;
    tags: Attribute.Relation<"api::use-case.use-case", "oneToMany", "api::tag.tag">;
    thumbnail: Attribute.Media<"images">;
    Titel: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"api::use-case.use-case", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: "strapi_releases";
  info: {
    displayName: "Release";
    pluralName: "releases";
    singularName: "release";
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    actions: Attribute.Relation<
      "plugin::content-releases.release",
      "oneToMany",
      "plugin::content-releases.release-action"
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"plugin::content-releases.release", "oneToOne", "admin::user"> & Attribute.Private;
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    status: Attribute.Enumeration<["ready", "blocked", "failed", "done", "empty"]> & Attribute.Required;
    timezone: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"plugin::content-releases.release", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction extends Schema.CollectionType {
  collectionName: "strapi_release_actions";
  info: {
    displayName: "Release Action";
    pluralName: "release-actions";
    singularName: "release-action";
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    contentType: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"plugin::content-releases.release-action", "oneToOne", "admin::user"> &
      Attribute.Private;
    entry: Attribute.Relation<"plugin::content-releases.release-action", "morphToOne">;
    isEntryValid: Attribute.Boolean;
    locale: Attribute.String;
    release: Attribute.Relation<
      "plugin::content-releases.release-action",
      "manyToOne",
      "plugin::content-releases.release"
    >;
    type: Attribute.Enumeration<["publish", "unpublish"]> & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"plugin::content-releases.release-action", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: "i18n_locale";
  info: {
    collectionName: "locales";
    description: "";
    displayName: "Locale";
    pluralName: "locales";
    singularName: "locale";
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"plugin::i18n.locale", "oneToOne", "admin::user"> & Attribute.Private;
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"plugin::i18n.locale", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface PluginMenusMenu extends Schema.CollectionType {
  collectionName: "menus";
  info: {
    displayName: "Menu";
    name: "Menu";
    pluralName: "menus";
    singularName: "menu";
    tableName: "menus";
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"plugin::menus.menu", "oneToOne", "admin::user"> & Attribute.Private;
    items: Attribute.Relation<"plugin::menus.menu", "oneToMany", "plugin::menus.menu-item">;
    slug: Attribute.UID<"plugin::menus.menu", "title"> & Attribute.Required;
    title: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"plugin::menus.menu", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface PluginMenusMenuItem extends Schema.CollectionType {
  collectionName: "menu_items";
  info: {
    displayName: "Menu Item";
    name: "MenuItem";
    pluralName: "menu-items";
    singularName: "menu-item";
    tableName: "menu_items";
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"plugin::menus.menu-item", "oneToOne", "admin::user"> & Attribute.Private;
    order: Attribute.Integer;
    parent: Attribute.Relation<"plugin::menus.menu-item", "oneToOne", "plugin::menus.menu-item">;
    root_menu: Attribute.Relation<"plugin::menus.menu-item", "manyToOne", "plugin::menus.menu"> & Attribute.Required;
    target: Attribute.Enumeration<["_blank", "_parent", "_self", "_top"]>;
    title: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"plugin::menus.menu-item", "oneToOne", "admin::user"> & Attribute.Private;
    url: Attribute.String;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: "files";
  info: {
    description: "";
    displayName: "File";
    pluralName: "files";
    singularName: "file";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Attribute.String;
    caption: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"plugin::upload.file", "oneToOne", "admin::user"> & Attribute.Private;
    ext: Attribute.String;
    folder: Attribute.Relation<"plugin::upload.file", "manyToOne", "plugin::upload.folder"> & Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    height: Attribute.Integer;
    mime: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<"plugin::upload.file", "morphToMany">;
    size: Attribute.Decimal & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"plugin::upload.file", "oneToOne", "admin::user"> & Attribute.Private;
    url: Attribute.String & Attribute.Required;
    width: Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: "upload_folders";
  info: {
    displayName: "Folder";
    pluralName: "folders";
    singularName: "folder";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    children: Attribute.Relation<"plugin::upload.folder", "oneToMany", "plugin::upload.folder">;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"plugin::upload.folder", "oneToOne", "admin::user"> & Attribute.Private;
    files: Attribute.Relation<"plugin::upload.folder", "oneToMany", "plugin::upload.file">;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    parent: Attribute.Relation<"plugin::upload.folder", "manyToOne", "plugin::upload.folder">;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"plugin::upload.folder", "oneToOne", "admin::user"> & Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission extends Schema.CollectionType {
  collectionName: "up_permissions";
  info: {
    description: "";
    displayName: "Permission";
    name: "permission";
    pluralName: "permissions";
    singularName: "permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"plugin::users-permissions.permission", "oneToOne", "admin::user"> &
      Attribute.Private;
    role: Attribute.Relation<"plugin::users-permissions.permission", "manyToOne", "plugin::users-permissions.role">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"plugin::users-permissions.permission", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: "up_roles";
  info: {
    description: "";
    displayName: "Role";
    name: "role";
    pluralName: "roles";
    singularName: "role";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"plugin::users-permissions.role", "oneToOne", "admin::user"> & Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Attribute.Relation<
      "plugin::users-permissions.role",
      "oneToMany",
      "plugin::users-permissions.permission"
    >;
    type: Attribute.String & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"plugin::users-permissions.role", "oneToOne", "admin::user"> & Attribute.Private;
    users: Attribute.Relation<"plugin::users-permissions.role", "oneToMany", "plugin::users-permissions.user">;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: "up_users";
  info: {
    description: "";
    displayName: "User";
    name: "user";
    pluralName: "users";
    singularName: "user";
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"plugin::users-permissions.user", "oneToOne", "admin::user"> & Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firm: Attribute.Relation<"plugin::users-permissions.user", "oneToOne", "api::firm.firm">;
    firmname: Attribute.String;
    firstname: Attribute.String & Attribute.Required;
    lastname: Attribute.String & Attribute.Required;
    merkliste: Attribute.Relation<"plugin::users-permissions.user", "oneToMany", "api::use-case.use-case">;
    middlename: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    phone: Attribute.String;
    platformButton: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
    profilPic: Attribute.Media<"images">;
    provider: Attribute.String;
    resetPasswordToken: Attribute.String & Attribute.Private;
    role: Attribute.Relation<"plugin::users-permissions.user", "manyToOne", "plugin::users-permissions.role">;
    thingsboardUserId: Attribute.String &
      Attribute.Unique &
      Attribute.CustomField<"plugin::thingsboard-plugin.thingsboardUserId">;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<"plugin::users-permissions.user", "oneToOne", "admin::user"> & Attribute.Private;
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module "@strapi/types" {
  export module Shared {
    export interface ContentTypes {
      "admin::api-token": AdminApiToken;
      "admin::api-token-permission": AdminApiTokenPermission;
      "admin::permission": AdminPermission;
      "admin::role": AdminRole;
      "admin::transfer-token": AdminTransferToken;
      "admin::transfer-token-permission": AdminTransferTokenPermission;
      "admin::user": AdminUser;
      "api::deployment.deployment": ApiDeploymentDeployment;
      "api::device.device": ApiDeviceDevice;
      "api::firm.firm": ApiFirmFirm;
      "api::glossar.glossar": ApiGlossarGlossar;
      "api::page.page": ApiPagePage;
      "api::portal-einstellungen.portal-einstellungen": ApiPortalEinstellungenPortalEinstellungen;
      "api::startpage.startpage": ApiStartpageStartpage;
      "api::tag.tag": ApiTagTag;
      "api::use-case.use-case": ApiUseCaseUseCase;
      "plugin::content-releases.release": PluginContentReleasesRelease;
      "plugin::content-releases.release-action": PluginContentReleasesReleaseAction;
      "plugin::i18n.locale": PluginI18NLocale;
      "plugin::menus.menu": PluginMenusMenu;
      "plugin::menus.menu-item": PluginMenusMenuItem;
      "plugin::upload.file": PluginUploadFile;
      "plugin::upload.folder": PluginUploadFolder;
      "plugin::users-permissions.permission": PluginUsersPermissionsPermission;
      "plugin::users-permissions.role": PluginUsersPermissionsRole;
      "plugin::users-permissions.user": PluginUsersPermissionsUser;
    }
  }
}
