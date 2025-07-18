/**
 * This file was automatically generated by Strapi.
 * Any modifications made will be discarded.
 */
import i18N from "@strapi/plugin-i18n/strapi-admin";
import usersPermissions from "@strapi/plugin-users-permissions/strapi-admin";
import duplicateButton from "strapi-plugin-duplicate-button/strapi-admin";
import heroiconsField from "strapi-plugin-heroicons-field/strapi-admin";
import menus from "strapi-plugin-menus/strapi-admin";
import thingsboardPlugin from "../../src/plugins/thingsboard-plugin/strapi-admin";
import { renderAdmin } from "@strapi/strapi/admin";

import customisations from "../../src/admin/app.tsx";

renderAdmin(document.getElementById("strapi"), {
  customisations,

  plugins: {
    i18n: i18N,
    "users-permissions": usersPermissions,
    "duplicate-button": duplicateButton,
    "heroicons-field": heroiconsField,
    menus: menus,
    "thingsboard-plugin": thingsboardPlugin,
  },
});
