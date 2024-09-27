import { getUrls } from "@iot-portal/frontend/lib/urls";

export class APITool {

    static StrapiURL: string = "";
    static FrontendStrapiURL: string = "";
    static ServerStrapiURL: string = "";
    static LittlefsURL: string = "";
    static initComplete = false;

    static isServer() {
        return typeof window === 'undefined';
    }

    static init(): {StrapiURL: string, serverStrapiUrl: string, littlefsUrl: string} {

            if (APITool.isServer()) {
                const {StrapiURL, serverStrapiUrl, littlefsUrl} = getUrls();

                APITool.FrontendStrapiURL = StrapiURL;
                APITool.ServerStrapiURL = serverStrapiUrl;
                APITool.LittlefsURL = littlefsUrl;
                APITool.initComplete = true;
                return { StrapiURL, serverStrapiUrl, littlefsUrl };
            } else if(!APITool.initComplete) {

                const request = new XMLHttpRequest();
                request.open("GET", (APITool.isServer() ? process.env.FRONTEND_URL : "") + "/init/", false); // `false` makes the request synchronous
                request.send(null);

                if (request.status === 200) {
                    console.log(request.responseText);
                    const data = JSON.parse(request.responseText);
                    APITool.StrapiURL = data.StrapiURL;
                    APITool.FrontendStrapiURL = data.StrapiURL;
                    APITool.ServerStrapiURL = data.serverStrapiUrl;
                    APITool.LittlefsURL = data.littlefsUrl;
                    console.info(`Frontend STRAPI API URL is: ${APITool.FrontendStrapiURL}`);
                    console.info(`Server STRAPI API URL is: ${APITool.ServerStrapiURL}`);
                    console.info(`Littlefs URL is: ${APITool.LittlefsURL}`);
                    APITool.initComplete = true;

                }
            }

        return {StrapiURL: APITool.FrontendStrapiURL, serverStrapiUrl: APITool.ServerStrapiURL, littlefsUrl: APITool.LittlefsURL};
    }
}
