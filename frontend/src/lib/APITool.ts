import { getUrls } from "@iot-portal/frontend/lib/urls";

export class APITool {

    static StrapiURL: string = "";
    static FrontendStrapiURL: string = "";
    static ServerStrapiURL: string = "";
    static initComplete = false;

    static isServer() {
        return typeof window === 'undefined';
    }

    static init(): Promise<{StrapiURL: string, serverStrapiUrl: string}> {
        return APITool.initComplete ? new Promise((resolve) => {
            resolve({StrapiURL: APITool.FrontendStrapiURL, serverStrapiUrl: APITool.ServerStrapiURL})
        }) : new Promise((resolve, reject) => {
            if (APITool.isServer()) {
                const {StrapiURL, serverStrapiUrl} = getUrls();

                APITool.FrontendStrapiURL = StrapiURL;
                APITool.ServerStrapiURL = serverStrapiUrl;
                resolve({StrapiURL, serverStrapiUrl});
                APITool.initComplete = true;
            } else {
                fetch("/init/").then((response) => response.json()).then((data) => {
                    APITool.StrapiURL = data.StrapiURL;
                    APITool.FrontendStrapiURL = data.StrapiURL;
                    APITool.ServerStrapiURL = data.serverStrapiUrl;
                    console.info(`Frontend STRAPI API URL is: ${APITool.FrontendStrapiURL}`);
                    console.info(`Server STRAPI API URL is: ${APITool.ServerStrapiURL}`);
                    APITool.initComplete = true;
                    resolve(data);
                });
            }

        })

    }
}
