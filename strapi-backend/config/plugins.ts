// ./config/plugins.js`
'use strict';
export default {
  menus: {
    config: {
      maxDepth: 2,
    },
  },
  'thingsboard-plugin': {
    enabled: true,
    resolve: './src/plugins/thingsboard-plugin'
  },
  "users-permissions": {
    config: {
      register: {
        allowedFields: ["firstname", "lastname", "firm", "firmname"],
      },
    },
  },
};
