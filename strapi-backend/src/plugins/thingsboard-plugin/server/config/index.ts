export default {
  default: ({ env }) =>
    ({
      thingsboardUrl: env('THINGSBOARD_URL',"http://localhost:9090"),
      backendUrl: '/'

    }),
  validator: (config) => {
    if (typeof config.thingsboardUrl !== 'string') {
      throw new Error('optionA has to be a string');
    }



  },
};
