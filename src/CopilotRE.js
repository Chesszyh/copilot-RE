import { request } from "./utils/request.js";
import { warning, error, info, debug } from "./utils/logger.js";

const links = {
    copilotToken: "https://github.com/github-copilot/chat/token", // For fetching copilot token
    models: "https://api.individual.githubcopilot.com/models", // For fetching available models
    threads: "https://api.individual.githubcopilot.com/github/chat/threads", // For chatting
    agents: "https://github.com/github-copilot/chat/agents", // For extensions and repositories
    graphql: "https://github.com/_graphql?body=", // For searching repository details
    repo: "https://github.com/github-copilot/chat/repositories", // FOr specific repository detail
};

const headers = {
    accept: "*/*",
    "accept-language": "en-GB,en;q=0.7",
    "cache-control": "max-age=0",
    "copilot-integration-id": "copilot-chat",
    priority: "u=1, i",
    "sec-ch-ua": '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "sec-gpc": "1",
    Referer: "https://github.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
};

const headers_web = {
    accept: "application/json",
    "accept-language": "en-GB,en;q=0.7",
    "content-type": "application/json",
    dnt: "1",
    "github-verified-fetch": "true",
    origin: "https://github.com",
    priority: "u=1, i",
    referer: "https://github.com/copilot",
    "sec-ch-ua": '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
};

class CopilotRE {
    /**
     * Update/Set new cookie in request header (above).
     * @param {Request} cookie
     */
    #updateCookie(cookie) {
        if (cookie.constructor.name == "Response") {
            cookie = request.headers.get("set-cookie");
        }

        if (cookie) {
            debug("Updating cookie with", cookie);
            headers_web["cookie"] = cookie;
        } else {
            warning("Didn't find any cookie");
        }
    }

    constructor(cookie) {
        if (!cookie) {
            const msg = `Expected cookie as "string" but obtained ${typeof cookie}`;
            error(msg);
            throw new Error(msg);
        }

        this.#updateCookie(cookie);
    }

    /**
     * Used for initializing internal variables and tokens
     *
     * The following are performed:
     * - Get authorization token
     */
    async init() {
        let response = await request("Copilot Token", links.copilotToken, {
            headers: headers_web,
            method: "POST",
            body: null,
        });

        if (!response?.token) {
            throw new Error(`Didn't find copilot token: ${data}`);
        }

        debug("Obtained Copilot Token", response.token);
        headers["authorization"] = `GitHub-Bearer ${response.token}`;
    }

    /**
     * Get list of all available models
     * @returns {object} JSON response about available models with details
     */
    async getModels() {
        let response = await request("AI Models", links.models, {
            headers,
            method: "GET",
            body: null,
        });

        info("Models Fetched");
        return response?.data;
    }

    /**
     * Get list of all conversations
     * @returns {object} Array containing conversation / thread id
     */
    async getThreads() {
        let response = await request("Chat Threads", links.threads, {
            headers,
            method: "GET",
            body: null,
        });

        info("Fetching threads");
        return response.threads;
    }

    /**
     * Get contents of a specific conversation
     * @param {string} threadID UUID representing the specific thread / conversation
     * @returns
     */
    async getThreadContent(threadID) {
        if (typeof threadID != "string" || threadID.length != 36) {
            throw new Error(`Invalid thread id provided: ${threadID}`);
        }

        let response = await request(
            "Thread Content",
            `${links.threads}/${threadID}/messages`,
            {
                headers,
                method: "GET",
                body: null,
            }
        );

        info("Fetched thread content");
        return response;
    }

    /**
     * Generate ai response from a prompt
     * @param {string} prompt Prompt for the model
     * @param {string} model Name of model to use to generate content
     * @param {string} threadID UUID representing the specific thread / conversation
     * @param {object} reference Reference repository obtained from `repoDetail()`
     */
    async generateContent(prompt, model, threadID, reference) {
        if (
            typeof prompt != "string" ||
            typeof threadID != "string" ||
            prompt.length == 0 ||
            threadID.length != 36
        ) {
            throw new Error(
                "Invalid parameters provided as prompt or thread id."
            );
        }

        const response = await fetch(`${links.threads}/${threadID}/messages`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                content: prompt,
                intent: "conversation",
                references: reference ? [reference] : [],
                context: [],
                currentURL: "https://github.com/copilot/c/" + threadID,
                streaming: true,
                confirmations: [],
                customInstructions: [],
                model: model,
                mode: "immersive",
            }),
        });
        const reader = response.body.getReader();
        let message = "";

        while (true) {
            let { done, value } = await reader.read();

            if (done) {
                break;
            }

            value = Buffer.from(value, "utf8").toString();
            value = value.trim();

            value = value.split("data: ");
            let buffer = [];

            value.forEach((item) => {
                item = item.trim();
                if (item == "") {
                    return;
                }

                try {
                    buffer.push(JSON.parse(item));
                } catch (e) {}
            });

            let chunk = buffer.reduce((accumulator, currentValue) => {
                if (currentValue.type == "content") {
                    process.stdout.write(currentValue.body);
                    accumulator += currentValue.body;
                }

                return accumulator;
            }, "");

            //      process.stdout.write(chunk);
            message += chunk;
        }

        return message;
    }

    /**
     * Get all available and installed extensions
     * @returns JSON list of installed extensions
     */
    async getExtensions() {
        let response = await request("Installed Extensions", links.agents, {
            headers: headers_web,
            method: "GET",
            body: null,
        });

        info("Found available extensions");
        return response;
    }

    /**
     * Search for public unarchived github repositories
     * @param {string} keyword Name of reqpository
     * @returns List of searched repositories
     */
    async getReposList(keyword) {
        keyword = keyword.split("/");

        if (keyword.length > 1) {
            keyword = `org:${keyword[0]} ${keyword.slice(1).join("")} `;
        } else {
            keyword = `${keyword[0]} `;
        }

        keyword += "in:name archived:false";

        const query = JSON.stringify({
            query: "d2ef0c47b5c4e3854e97a0db0982c254",
            variables: {
                after: null,
                searchQuery: keyword,
            },
        });

        let response = await request(
            "Repository Search",
            `${links.graphql}${query}`,
            {
                headers: headers_web,
                method: "GET",
                body: null,
            }
        );

        info("Obtained repository list");
        return response.data.search.nodes;
    }

    /**
     * Get specific repository detail
     * @param {string} repoId Unique ID obtained from `getRepoList()`
     * @returns {object} Object containing repository details
     */
    async getRepoDetail(repoId) {
        let response = await request(
            "Repository Details",
            `${links.repo}/${repoId}`,
            {
                headers: headers_web,
                method: "GET",
                body: null,
            }
        );

        debug("Repository detail found for", repoId);
        return response;
    }

    /**
     * Create new thread for chat
     * @returns JSON object containing new thread details eg: thread_id, etc
     */
    async newThread() {
        let response = await request("Creating New Thread", links.threads, {
            headers: headers,
            method: "POST",
            body: null,
        });

        debug("Thread created: ", response.thread_id);
        return response;
    }
}

export default CopilotRE;
