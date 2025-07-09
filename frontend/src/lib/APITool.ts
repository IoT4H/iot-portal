import { getUrls, URLS } from "@iot-portal/frontend/lib/urls";

export class APITool {
    static StrapiURL = "";
    static FrontendStrapiURL = "";
    static ServerStrapiURL = "";
    static LittlefsURL = "";
    static PlatformURL = "";
    static DashboardURL = "";
    static initComplete = false;

    static isServer() {
        return typeof window === "undefined";
    }

    static init(): URLS {
        if (APITool.isServer()) {
            const currentUrls = getUrls();

            APITool.FrontendStrapiURL = currentUrls.StrapiURL;
            APITool.ServerStrapiURL = currentUrls.serverStrapiUrl;
            APITool.LittlefsURL = currentUrls.littlefsUrl;
            APITool.PlatformURL = currentUrls.platformUrl;
            APITool.DashboardURL = currentUrls.dashboardUrl;
            APITool.initComplete = true;

            return currentUrls;
        } else if (!APITool.initComplete) {
            const request = new XMLHttpRequest();
            request.open(
                "GET",
                (APITool.isServer() ? process.env.FRONTEND_URL : "") + "/init/",
                false
            ); // `false` makes the request synchronous
            request.send(null);

            if (request.status === 200) {
                console.log(request.responseText);
                const data = JSON.parse(request.responseText);
                APITool.StrapiURL = data.StrapiURL;
                APITool.FrontendStrapiURL = data.StrapiURL;
                APITool.ServerStrapiURL = data.serverStrapiUrl;
                APITool.PlatformURL = data.platformUrl;
                APITool.DashboardURL = data.dashboardUrl;
                APITool.LittlefsURL = data.littlefsUrl;
                console.info(`Frontend STRAPI API URL is: ${APITool.FrontendStrapiURL}`);
                console.info(`Server STRAPI API URL is: ${APITool.ServerStrapiURL}`);
                console.info(`Littlefs URL is: ${APITool.LittlefsURL}`);
                console.info(`Platform URL is: ${APITool.PlatformURL}`);
                console.info(`Dashboard URL is: ${APITool.DashboardURL}`);
                APITool.initComplete = true;
            }
        }

        return {
            StrapiURL: APITool.FrontendStrapiURL,
            serverStrapiUrl: APITool.ServerStrapiURL,
            littlefsUrl: APITool.LittlefsURL,
            platformUrl: APITool.PlatformURL,
            dashboardUrl: APITool.DashboardURL
        };
    }
}
