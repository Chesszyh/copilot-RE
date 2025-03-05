import { logger } from "./utils";

/**
 * Makes an HTTP request to the specified URL with the given options.
 * 
 * @param {string} requestURL - The URL to send the request to.
 * @param {RequestOptions} [options] - The options for the request.
 * @returns {Promise<Result<Response>>} - A promise that resolves to the result of the request.
 */
const request = async (requestURL: string, options?: RequestOptions): Promise<Result<Response>> => {
    if (!options)
        options = {};

    // GET method can't have a body
    if (options.method == "GET" && options.body)
        return Promise.reject({
            status: "error",
            error: new Error("GET method can't have a body"),
        });
    logger(options.method || "GET", requestURL);

    try {
        const response = await fetch(requestURL, {
            method: options.method || "GET",
            body: options.body,
            headers: options.headers || {},
        });

        if (!response.ok) {
            return {
                status: "error",
                body: response, // Attach body just in case
                error: new Error(response.statusText),
            };
        }
        return {
            status: "success",
            body: response,
        };
    } catch (error) {
        return {
            status: "error",
            error: (error instanceof Error) ? error : Error("Unknown error in fetch.")
        }
    }
}

export { request };
