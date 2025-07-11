import { APITool } from "@iot-portal/frontend/lib/APITool";
import qs from "qs";

export function isServer() {
    return typeof window === "undefined";
}

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = "") {
    APITool.init();
    const strapi_url = isServer() ? APITool.ServerStrapiURL : APITool.FrontendStrapiURL;

    return `${(strapi_url || "/").replace(/\/$/, "")}${path}`;
}

export function getStrapiURLForFrontend(path = "") {
    APITool.init();

    const strapi_url = APITool.FrontendStrapiURL;

    return `${(strapi_url || "/").replace(/\/$/, "")}${path}`;
}

export function getLittleFSURL() {
    APITool.init();

    return APITool.LittlefsURL;
}

export function getPlatformURL() {
    APITool.init();

    return APITool.PlatformURL;
}

export function getDashboardURL() {
    APITool.init();

    return APITool.DashboardURL;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} urlParamsObject URL params object, will be stringified
 * @param {Object} options Options passed to fetch
 * @returns Parsed API call response
 */
export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
    // Merge default and user options
    const mergedOptions = Object.assign(
        {},
        {
            headers: {
                "Content-Type": "application/json"
            },
            next: { revalidate: 0 }
        },
        options
    );

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${getStrapiURL(`${path}${queryString ? `?${queryString}` : ""}`)}`;

    // Trigger API call
    try {
        const response = await fetch(requestUrl, mergedOptions);
        // Handle response
        return await response.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}
