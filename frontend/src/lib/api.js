import qs from "qs";

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = "") {
    return `${
        process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337"
    }${path}`;
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
    const mergedOptions = {
        headers: {
            "Content-Type": "application/json",
        },
        next: { revalidate: 5 },
        ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${getStrapiURL(
        `/api${path}${queryString ? `?${queryString}` : ""}`
    )}`;

    // Trigger API call
    try {
        const response = await fetch(requestUrl, mergedOptions);
        // Handle response
        return await response.json();
    } catch (e) {
        console.error(requestUrl, e)
        return null;
    }

}
