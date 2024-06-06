export const dynamic = 'force-dynamic';

export class APITool {

    static StrapiURL: string = "";
    static FrontendStrapiURL: string = "";
    static ServerStrapiURL: string = "";

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
