import { Writable } from "stream";
import { logger } from "./utils/utils";
import { request } from "./utils/networkUtils";
import { AGENTS_URL, APIHEADERS, COPILOT_TOKEN_URL, FUNCTIONS, GRAPHQL_URL, MODELS_URL, REPO_URL, THREADS_URL, WEBHEADERS } from "./utils/constants";


// Spreading header leads to data loss so first convert it
// to {key: value} pair and then spread it
const webHeadersObject: { [key: string]: string; } = {};
const apiHeadersObject: { [key: string]: string } = {};

WEBHEADERS.forEach((value, key) => {
    webHeadersObject[key] = value;
});
APIHEADERS.forEach((value, key) => {
    apiHeadersObject[key] = value;
});

class CopilotRE {
    private authToken?: string;
    private githubCookie: string;

    /**
     * Creates an instance of the class.
     * @param {Object} params - The configuration parameters
     * @param {string} [params.githubCookie] - The GitHub cookie string for authentication
     * @param {string} [params.authToken] - Optional authentication token
     */
    constructor({ githubCookie, authToken }: { githubCookie: string, authToken?: string }) {
        this.githubCookie = githubCookie;
        this.authToken = authToken;

        if (githubCookie)
            logger("Github Cookie", githubCookie);

        if (authToken)
            logger("Authentication Token", authToken);
    }

    /**
     * Generates authentication token that is used to interact with AI models
     * and maintains it internally
     */
    async generateAuthToken() {
        // Make a request to token grabber url
        const response = await request(COPILOT_TOKEN_URL, {
            body: null,
            method: "POST",
            headers: new Headers({
                ...webHeadersObject,
                'Cookie': this.githubCookie,
            })
        });

        if (response.status != "success" || !response.body)
            return response;

        try {
            // Parse the response to JSON
            const parsedResponse = await response.body.json();

            // If no authToken in JSON body
            if (!parsedResponse?.token)
                return {
                    status: "error",
                    body: response.body,    // Just in-case
                    error: Error("Failed to obtain authentication token"),
                }

            // Be careful here its .token for response 
            // and .authToken for internal representation
            this.authToken = String(parsedResponse.token);

            logger("Authentication Token", this.authToken);
            return {
                status: "success",
                body: this.authToken,
            };
        } catch (error) {
            // In-case of any other failures
            return {
                status: "error",
                error: (error instanceof Error) ? error : Error("Unknown error occured"),
            }
        }
    }

    /**
    * Get list of all available AI models
    *
    * @returns {Promise<Result<ModelsResponse>>} - Result representing AI models
    */
    async getModels(): Promise<Result<ModelsResponse>> {
        // Fetch models
        const response = await request(MODELS_URL, {
            method: "GET",
            headers: new Headers({
                ...apiHeadersObject,
                "Authorization": "GitHub-Bearer " + this.authToken,
            }),
        });

        // Assume errors
        if (response.status == "error" || !response.body)
            return {
                status: "error",
                error: response.error,
            };

        try {
            // try parsing to JSON
            const parsedResponse = await response.body.json();

            // If everything goes well
            return {
                status: "success",
                body: parsedResponse,
            }
        } catch (error) {
            return {
                status: "error",
                error: (error instanceof Error) ? error : Error("Unknown error"),
            }
        }
    }

    /**
     * Get all conversation history
     *
     * @returns {Promise<Result<ThreadResponse>>} - Result representing all conversation history / threads
    */
    async getAllThreads(): Promise<Result<ThreadResponse>> {
        // Request for conversations
        const response = await request(THREADS_URL, {
            method: "GET",
            headers: new Headers({
                ...webHeadersObject,
                "Authorization": "GitHub-Bearer " + this.authToken,
            }),
        });

        // Check for success
        if (response.status != "success" && !response.body)
            return {
                "status": "error",
                error: response.error,
            }

        try {
            // Parse response
            const parsedResponse = await response.body?.json()
            return {
                status: "success",
                body: parsedResponse,
            };
        } catch (error) {
            // Handle errors
            return {
                status: "error",
                error: (error instanceof Error) ? error : Error("Unknown error"),
            }
        }
    }

    /**
     * Get each conversation/thread message
     *
     * @returns {Promise<Result<ThreadContent>>} - Result representing thread content
     */
    async getThreadContent(threadID: string): Promise<Result<ThreadContent>> {
        // Make request for thread content
        const response = await request(
            `${THREADS_URL}/${threadID}/messages`,
            {
                method: "GET",
                headers: new Headers({
                    ...webHeadersObject,
                    "Authorization": "GitHub-Bearer " + this.authToken,
                }),
            }
        );

        if (response.status != "success" || !response.body)
            return {
                status: "error",
                error: response.error,
            }

        try {
            const parsedResponse = await response.body.json();
            return {
                status: "success",
                body: parsedResponse,
            };
        } catch (error) {
            return {
                status: "error",
                error: (error instanceof Error) ? error : Error("Unknown error"),
            }
        }
    }

    /**
     * Creates a new thread to start a new conversation.
     *
     * @returns {Promise<Result<Thread>>} - New thread details
     */
    async createThread(): Promise<Result<NewThread>> {
        // Request to create new thread
        const response = await request(THREADS_URL, {
            method: "POST",
            headers: new Headers({
                ...apiHeadersObject,
                "Authorization": "GitHub-Bearer " + this.authToken,
            }),
            body: JSON.stringify({ "custom_copilot_id": null }),
        });

        // Check for errors
        if (response.status != "success" || !response.body)
            return {
                status: "error",
                error: response.error,
            }

        try {
            // Try parsing and typecast NewThread
            const parsedResponse: NewThread = await response.body.json();

            return {
                status: "success",
                body: parsedResponse,
            }
        } catch (error) {
            // Handle errors
            return {
                status: "error",
                error: (error instanceof Error) ? error : Error("Unknown error"),
            }
        }
    }

    /**
     * Get list of installed extensions
     * NOTE: Some models don't support extensions, you can know about that
     * through getModels() method
     * 
     * @returns {Promise<Result<Extension[]>>} - Result representing installed extensions
     */
    async getExtensions(): Promise<Result<Extension[]>> {
        /**
         * TODO: Should I internally maintain supported extensions for a choosen model?
         * Lets see where this goes.
         */
        // Request for extensions
        const response = await request(AGENTS_URL, {
            method: "GET",
            headers: new Headers({
                ...apiHeadersObject,
                "Authorization": "GitHub-Bearer " + this.authToken,
            }),
        });

        // Check for errors
        if (response.status != "success" || !response.body)
            return {
                status: "error",
                error: response.error,
            }

        try {
            // Parse response
            const parsedResponse: Extension[] = await response.body.json();
            return {
                status: "success",
                body: parsedResponse,
            }
        }
        catch (error) {
            return {
                status: "error",
                error: (error instanceof Error) ? error : Error("Unknown error"),
            }
        }
    }

    /**
     * Search for public unarchived github repositories
     * @param {string} keyword - Name of reqpository in format: 'username/repo-name'
     */
    async getRepoList(keyword: string): Promise<Result<RepositorySearch>> {
        // Split to organization/user and repo name
        let newKeyword = keyword.split("/");

        if (newKeyword.length > 1) {
            keyword = `org:${newKeyword[0]} ${newKeyword.slice(1).join("")} `;
        } else {
            keyword = `${newKeyword[0]} `;
        }

        // Add some filters: public, not archived
        keyword += "in:name archived:false";

        // Prepare query with this hardcoded value
        const query = JSON.stringify({
            query: "d2ef0c47b5c4e3854e97a0db0982c254",
            variables: {
                after: null,
                searchQuery: keyword,
            },
        });

        // Make request
        const response = await request(`${GRAPHQL_URL}${query}`, {
            method: "GET",
            headers: new Headers({
                ...webHeadersObject,
                "Cookie": this.githubCookie,
            }),
        });

        // Check for errors
        if (response.status != "success" || !response.body)
            return {
                status: "error",
                error: response.error,
            }

        try {
            // Parse response
            const parsedResponse = await response.body.json();
            return {
                status: "success",
                body: parsedResponse,
            }
        } catch (error) {
            return {
                status: "error",
                error: (error instanceof Error) ? error : Error("Unknown error"),
            }
        }
    }

    /**
     * Get details of a specific repository
     * 
     * @param {number} databaseId - Database ID of the repository
     * @returns {Promise<Result<RepositoryDetail>>} - Result representing repository details
     */
    async getRepoDetail(databaseId: number): Promise<Result<RepositoryDetail>> {
        // Make request for repository details
        const response = await request(`${REPO_URL}/${databaseId}`, {
            method: "GET",
            headers: new Headers({
                ...webHeadersObject,
                "Cookie": this.githubCookie,
            }),
        });

        // Check for errors
        if (response.status != "success" || !response.body)
            return {
                status: "error",
                error: response.error,
            }

        try {
            // Parse response
            const parsedResponse = await response.body.json();
            return {
                status: "success",
                body: parsedResponse,
            }
        } catch (error) {
            return {
                status: "error",
                error: (error instanceof Error) ? error : Error("Unknown error"),
            }
        }
    }

    /**
     * Generate content using a specific model
     */
    async generateContent(params: {
        prompt: string,
        model: string,
        threadID?: string,
        sinkStream?: Writable, // Node JS stream
        reference?: RepositoryDetail,    // Reference to repo i:e getRepoDetail()
        githubCookie?: string,
        authToken?: string,
    }): Promise<Result<string>> {
        let {
            prompt,
            model,
            threadID,
            sinkStream,
            reference,
            githubCookie,
            authToken,
        } = params;

        if (authToken)
            this.authToken = authToken;

        if (githubCookie)
            this.githubCookie = githubCookie;

        if (!threadID) {
            const newThread = await this.createThread();
            if (newThread.status != "success" || !newThread.body)
                return {
                    status: "error",
                    error: newThread.error,
                };

            threadID = newThread.body.thread_id;
        }

        // Make a request to generate content
        const response = await fetch(`${THREADS_URL}/${threadID}/messages`, {
            method: "POST",
            headers: {
                ...apiHeadersObject,
                "Authorization": "GitHub-Bearer " + this.authToken,
            },
            body: JSON.stringify({
                confirmations: [],
                content: prompt,
                context: [],
                currentURL: "https://github.com/copilot/c/" + threadID,
                references: reference ? [{ ...reference, "type": "repository" }] : [],
                customCopilotID: null,
                customInstructions: [],
                intent: "conversation",
                mediaContent: [],
                mode: "immersive",
                model: model,
                streaming: true,
                tools: [],
            }),
        });

        // Check for errors
        if (response.status != 200 || !response.body) {
            return {
                status: "error",
                error: Error("Failed to generate content"),
            }
        }

        // Get the reader from response
        const reader = response.body.getReader();
        let message = ""; // Will be our complete message

        // Read the chunks untill return
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                // New line because last message line gets overwritten
                // by the user prompt (no idea why)
                if (sinkStream) {
                    sinkStream.write("\n");
                }

                return {
                    status: "success",
                    body: message
                };
            }

            const decoder = new TextDecoder();
            const text = decoder.decode(value);
            const lines = text.trim().split("data: ");
            const buffer: Array<{ type: string, body: string }> = [];

            // Parse each line as seperate JSON
            lines.forEach((item: string) => {
                const trimmed = item.trim();
                if (trimmed === "")
                    return;

                try {
                    buffer.push(JSON.parse(trimmed));
                } catch (e) {
                    // TODO: Implement smth here
                }
            });

            // Take content from buffer and join their values
            const chunk = buffer.reduce((accumulator: string, currentValue) => {
                if (currentValue.type === "content") {
                    if (sinkStream) {
                        sinkStream.write(currentValue.body);
                    }

                    return accumulator + currentValue.body;
                } else {
                    if (sinkStream) {
                        const status = FUNCTIONS.find((item) => item.id === currentValue.type);
                        // If stream is TTY i:e terminal then write the status
                        if ("isTTY" in sinkStream && status?.id) {
                            // Use greyish color to print status
                            sinkStream.write(`\n\x1b[90m[${status.status}]\n`);
                        }
                    }
                }

                return accumulator;
            }, "");

            // Keep adding to message to make a complete message
            message += chunk;
        }
    }
}

export default CopilotRE;