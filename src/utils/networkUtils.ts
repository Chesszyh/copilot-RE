const request = async (requestURL: string, options?: RequestOptions): Promise<Result<Response>> => {
    // GET method can't have a body
    if (options?.method == "GET" && options?.body)
        return Promise.reject({
            status: "error",
            error: new Error("GET method can't have a body"),
        });

    try {
        const response = await fetch(requestURL, options);

        // Assume a failure if response != 200
        if (response.status != 200)
            return {
                status: "error",
                body: response, // Attach body just in case
                error: new Error(response.statusText),
            };

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
