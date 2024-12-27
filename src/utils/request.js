import { error } from "./logger.js";

const request = (detail, url, options) => {
    if (typeof url != "string") {
        const msg = `Expected "string" but obtained ${typeof url} in URL`;
        error(msg);
        throw new Error(msg);
    }

    if (typeof options != "object") {
        const msg = `Expected "object" but obtained ${typeof options} in URL`;
        error(msg);
        throw new Error(msg);
    }

    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then((data) => {
                if (!data.ok) {
                    const msg = `Failed to fetch (${detail}): ${data.statusText}`;
                    error(msg);
                    throw new Error(msg);
                }

                return data.json();
            })
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

export { request };
