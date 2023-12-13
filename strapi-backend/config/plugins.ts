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
};
