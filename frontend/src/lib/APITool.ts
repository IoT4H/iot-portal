export class APITool {

    static StrapiURL: string = process.env.FRONTEND_STRAPI_API_URL || "http://localhost:1337";

    constructor() {
        fetch("/init").then((response) => response.json()).then((data) => {
            APITool.StrapiURL = data.StrapiURL;
            console.info(`Frontend STRAPI API URL is: ${APITool.StrapiURL}`);
        });


    }

}
