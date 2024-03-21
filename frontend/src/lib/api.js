import qs from "qs";

console.info(`NEXT PUBLIC STRAPI API URL is: ${process.env.NEXT_PUBLIC_STRAPI_API_URL}`);
console.info(`STRAPI API URL is: ${process.env.STRAPI_API_URL}`);

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = "") {
    let strapi_url = process.env.NEXT_PUBLIC_STRAPI_API_URL
    if (!strapi_url.startsWith('http') && typeof window === 'undefined') {
        strapi_url = `http://localhost:3000${strapi_url.startsWith('/') ? '' : '/'}${strapi_url}`
    }
    return `${(
        strapi_url || "/"
    ).replace(/\/$/, "")}${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} urlParamsObject URL params object, will be stringified
 * @param {Object} options Options passed to fetch
 * @returns Parsed API call response
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
    // Merge default and user options
    const mergedOptions = Object.assign({}, {
        headers: {
            "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
    }, options);

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${getStrapiURL(
        `${path}${queryString ? `?${queryString}` : ""}`
    )}`;

    // Trigger API call
    try {
        const response = await fetch(requestUrl, mergedOptions);
        // Handle response
        return await response.json();
    } catch (e) {
        return null;
    }

}
