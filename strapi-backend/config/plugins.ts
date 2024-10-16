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
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: process.env.EMAILHOST || '',
        port: process.env.EMAILPORT || 465,
        secure: process.env.EMAILSECURE || true,
        auth: {
          user: process.env.EMAILUSER || '',
          pass: process.env.EMAILPASSWORD || '',
        },
        tls: { rejectUnauthorized: false },
      },
      settings: {
        defaultFrom: process.env.EMAILFROM || '',
      },
    }
  }
};
