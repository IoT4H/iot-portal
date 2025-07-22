export default {
    default: ({ env }) => ({
        thingsboardUrl: env('THINGSBOARD_URL', 'http://localhost:9090'),
        backendUrl: '/',
        thingsboardSysAdminUsername: env('THINGSBOARD_SYSADMIN', 'sysadmin@thingsboard.org'),
        thingsboardSysAdminPassword: env('THINGSBOARD_PASSWORD', 'sysadmin')
    }),
    validator: (config) => {
        if (typeof config.thingsboardUrl !== 'string') {
            throw new Error('THINGSBOARD_URL has to be a string');
        }

        if (typeof config.backendUrl !== 'string') {
            throw new Error('backendUrl has to be a string');
        }

        if (typeof config.thingsboardSysAdminUsername !== 'string') {
            throw new Error('THINGSBOARD_SYSADMIN has to be a string');
        }

        if (typeof config.thingsboardSysAdminPassword !== 'string') {
            throw new Error('THINGSBOARD_PASSWORD has to be a string');
        }
    }
};
