export default [
    'strapi::logger',
    'strapi::errors',
    {
        name: 'strapi::security',
        config: {
            contentSecurityPolicy: {
                directives: {
                    'connect-src': ["'self'", 'https:'],
                    'img-src': ['*'],
                    'media-src': ['localhost:9090']
                }
            }
        }
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public'
];
