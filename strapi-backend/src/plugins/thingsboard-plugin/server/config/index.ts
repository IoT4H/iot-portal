export default {
  default: ({ env }) =>
    ({
      thingsboardUrl: env('THINGSBOARD_URL',"http://localhost:9090"),
      backendUrl: '/',
      thingsboardSysAdminUsername: env('THINGSBOARD_SYSADMIN',"sysadmin@thingsboard.org"),
      thingsboardSysAdminPassword: env('THINGSBOARD_PASSWORD',"sysadmin")
    }),
  validator: (config) => {
    if (typeof config.thingsboardUrl !== 'string') {
      throw new Error('optionA has to be a string');
    }



  },
};
