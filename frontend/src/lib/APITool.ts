export class APITool {

    static StrapiURL: string = process.env.FRONTEND_STRAPI_API_URL || "";
    static FrontendStrapiURL: string = process.env.FRONTEND_STRAPI_API_URL || "";
    static ServerStrapiURL: string = process.env.SERVER_STRAPI_API_URL || "";

    constructor() {
        fetch("/init/").then((response) => response.json()).then((data) => {
            APITool.StrapiURL = typeof window === 'undefined' ? data.serverStrapiUrl : data.StrapiURL;
            APITool.FrontendStrapiURL = data.StrapiURL;
            APITool.ServerStrapiURL = data.serverStrapiUrl;
            console.info(`Frontend STRAPI API URL is: ${APITool.FrontendStrapiURL}`);
            console.info(`Server STRAPI API URL is: ${APITool.ServerStrapiURL}`);
        });


    }

}
