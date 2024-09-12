import { getUrls } from "@iot-portal/frontend/lib/urls";

export class APITool {

    static StrapiURL: string = "";
    static FrontendStrapiURL: string = "";
    static ServerStrapiURL: string = "";
    static initComplete = false;

    static isServer() {
        return typeof window === 'undefined';
    }

    static init(): {StrapiURL: string, serverStrapiUrl: string} {

            if (APITool.isServer()) {
                const {StrapiURL, serverStrapiUrl} = getUrls();

                APITool.FrontendStrapiURL = StrapiURL;
                APITool.ServerStrapiURL = serverStrapiUrl;
                APITool.initComplete = true;
                return {StrapiURL, serverStrapiUrl};
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
                    console.info(`Frontend STRAPI API URL is: ${APITool.FrontendStrapiURL}`);
                    console.info(`Server STRAPI API URL is: ${APITool.ServerStrapiURL}`);
                    APITool.initComplete = true;

                }
            }

        return {StrapiURL: APITool.FrontendStrapiURL, serverStrapiUrl: APITool.ServerStrapiURL};
    }
}
