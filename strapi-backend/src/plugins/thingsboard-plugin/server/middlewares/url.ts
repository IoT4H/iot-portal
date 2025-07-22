import pluginId from '../../admin/src/pluginId';

export default (config, { strapi }) => {
    return async (ctx, next) => {
        try {
            const url = new URL(ctx.query.url);
            const neurl = new URL(strapi.plugin(pluginId).config('thingsboardUrl'));
            url.hostname = neurl.hostname;
            url.port = neurl.port;
            url.protocol = neurl.protocol;
            ctx.redirect(url);
        } catch (e) {
            ctx.redirect(strapi.plugin(pluginId).config('thingsboardUrl') + ctx.query.url);
        }

        await next();
    };
};
