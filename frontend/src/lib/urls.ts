export function getUrls() {
const url = process.env.FRONTEND_STRAPI_API_URL || '';
    const serverUrl = process.env.SERVER_STRAPI_API_URL || process.env.FRONTEND_STRAPI_API_URL || '';
    return { StrapiURL: url, serverStrapiUrl: serverUrl };
}
