export function getUrls() {
    const url = process.env.FRONTEND_STRAPI_API_URL || '';
    const serverUrl = process.env.SERVER_STRAPI_API_URL || process.env.FRONTEND_STRAPI_API_URL || '';
    const littlefsUrl = process.env.LITTLEFS_API_URL || 'http://localhost:3001/littlefs.bin';
    return { StrapiURL: url, serverStrapiUrl: serverUrl, littlefsUrl: littlefsUrl };
}
