export type URLS = {
    StrapiURL: string;
    serverStrapiUrl: string;
    littlefsUrl: string;
    platformUrl: string;
    dashboardUrl: string;
};

export function getUrls(): URLS {
    const url = process.env.FRONTEND_STRAPI_API_URL || "";
    const serverUrl =
        process.env.SERVER_STRAPI_API_URL || process.env.FRONTEND_STRAPI_API_URL || "";
    const littlefsUrl = process.env.LITTLEFS_API_URL || "http://localhost:3001/littlefs.bin";
    const platformUrl = process.env.PLATFORM_URL || "http://localhost:9090";
    const dashboardUrl = process.env.DASHBOARD_URL || "http://localhost:9090";
    return {
        StrapiURL: url,
        serverStrapiUrl: serverUrl,
        littlefsUrl: littlefsUrl,
        platformUrl: platformUrl,
        dashboardUrl: dashboardUrl
    };
}
