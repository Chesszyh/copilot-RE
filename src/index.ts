import { AGENTS_URL, APIHEADERS, COPILOT_TOKEN_URL, FUNCTIONS, GRAPHQL_URL, MODELS_URL, REPO_URL, THREADS_URL, WEBHEADERS } from "./utils/constants";
import { request } from "./utils/networkUtils";
import tty from "tty";

class CopilotRE {
    private authToken?: string;
    private githubCookie: string;

    /**
    * Creates an instance to interact with different AI models.
    * To get your cookie please go through the CopilotRE's `README.md`
    *
    * @param {string} githubCookie - Cookie of your github account
    * @param {string} authToken - Token to interact with AI models
    */
    constructor(githubCookie: string, authToken?: string) {
        this.githubCookie = githubCookie;
        this.authToken = authToken;
    }

    /**
     * Get authentication token that is used to interact with AI models
     *
     * @param {string} cookie - Cookie of your github account
     * @returns {Promise<Result<string | Response>>} - Result representing auth token
     */
    async getAuthToken(cookie = this.githubCookie): Promise<Result<string | Response>> {
        if (!cookie || cookie.length < 10)
            return {
                status: "error",
                error: Error("Invalid github cookie provided."),
            }

        // Make a request to token grabber url
        const response = await request(COPILOT_TOKEN_URL, {
            body: null,             // Yep, null body
            method: "POST",
            headers: new Headers({
                ...WEBHEADERS,
                'Authentication': 'Github Bearer ' + cookie,
            })
        });

        if (response.status != "success" || !response.body)
            return response;

        try {
            // Parse the response to JSON
            const parsedResponse = await response.body.json();

            // If no authToken in JSON body
            if (!parsedResponse?.authToken)
                return {
                    status: "error",
                    body: response.body,    // Just in-case
                    error: Error("Failed to obtain authentication token"),
                }


            this.authToken = parsedResponse.authToken;

            return {
                status: "success",
                body: parsedResponse.authToken,
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
    * @param {string} authToken - Authentication token used to interact with AI models
    * @returns {Promise<Result<ModelsResponse>>} - Result representing AI models
    */
    async getModels(authToken = this.authToken): Promise<Result<ModelsResponse>> {
        if (!authToken)
            return {
                status: "error",
                error: Error("No authentication token provided")
            }

        // Fetch models
        const response = await request(MODELS_URL, {
            method: "GET",
            headers: new Headers({
                ...APIHEADERS,
                "Authorization": "Github Bearer " + authToken,
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
     * @param {string} authToken - Authentication token to interact with API
     * @returns {Promise<Result<ThreadResponse>>} - Result representing conversation history
    */
    async getConversationHistory(authToken = this.authToken): Promise<Result<ThreadResponse>> {
        if (!authToken)
            return {
                status: "error",
                error: Error("Authentication token is missing, can't fetch conversations"),
            }

        // Request for conversations
        const response = await request(THREADS_URL, {
            method: "GET",
            headers: new Headers({
                ...WEBHEADERS,
                "Authorization": "Github Bearer " + authToken,
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
     * @param {string} authToken - Authentication token to interact with API
     * @returns {Promise<Result<ThreadContent>>} - Result representing thread content
     */
    async getThreadContent(authToken = this.authToken, threadID: string): Promise<Result<ThreadContent>> {
        if (!authToken) {
            return {
                status: "error",
                error: Error("Authentication token missing, can't fetch thread content"),
            }
        }

        // Make request for thread content
        const response = await request(
            `${THREADS_URL}/${threadID}/messages`,
            {
                method: "GET",
                headers: new Headers({
                    ...WEBHEADERS,
                    "Authorization": "Github Bearer " + authToken,
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
            return parsedResponse;
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
     * @param {string} authToken - Authentication token to interact with API
     * @returns {Promise<Result<Thread>>} - New thread details
     */
    async createThread(authToken = this.authToken): Promise<Result<NewThread>> {
        if (!authToken)
            return {
                status: "error",
                error: Error("Authentication token missing, cant create new thread"),
            }

        // Request to create new thread
        const response = await request(THREADS_URL, {
            body: null,         // Yes, thats a null body
            method: "POST",
            headers: new Headers({
                ...WEBHEADERS,
                "Authorization": "Github Bearer " + authToken,
            }),
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
     * @param {string} authToken - Authentication token to interact with API
     * @returns {Promise<Result<Extension[]>>} - Result representing installed extensions
     */
    async getExtensions(authToken = this.authToken): Promise<Result<Extension[]>> {
        /**
         * TODO: Should I internally maintail supported extensions for a choosen model?
         * Lets see where this goes.
         */

        if (!authToken)
            return {
                status: "error",
                error: Error("Authentication token missing, can't fetch extensions"),
            }

        // Request for extensions
        const response = await request(AGENTS_URL, {
            method: "GET",
            headers: new Headers({
                ...APIHEADERS,
                "Authorization": "Github Bearer " + authToken
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
    async getRepoList(keyword: string, authToken = this.authToken): Promise<Result<RepositorySearch>> {
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
                ...APIHEADERS,
                "Authorization": "Github Bearer " + authToken,
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
     * @param {string} repoID - ID of the repository
     * @param {string} authToken - Authentication token to interact with API
     * @returns {Promise<Result<RepositoryDetail>>} - Result representing repository details
     */
    async getRepoDetail(repoID: string, authToken = this.authToken): Promise<Result<RepositoryDetail>> {
        if (!authToken)
            return {
                status: "error",
                error: Error("Authentication token missing, can't fetch repository details"),
            }

        // Make request for repository details
        const response = await request(`${REPO_URL}/${repoID}`, {
            method: "GET",
            headers: new Headers({
                ...APIHEADERS,
                "Authorization": "Github Bearer " + authToken,
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
     * 
     * @param {string} prompt Prompt for the model
     * @param {string} model Name of model to use to generate content
     * @param {string} threadID UUID representing the specific thread / conversation
     * @param {WritableStream} sinkStream Stream to write the generated content
     * @param {object} reference Reference repository obtained from `repoDetail()`
     */
    async generateContent(
        prompt: string,
        model: string,
        threadID?: string,
        apiKey = this.authToken,
        // NodeJS version of write stream
        sinkStream?: NodeJS.WriteStream,
        reference?: RepositoryDetail,
    ): Promise<Result<string>> {

        if (!apiKey) {
            return {
                status: "error",
                error: Error("Authentication token missing, can't generate content"),
            }
        }

        // Generate a new thread if not provided
        if (!threadID) {
            const newThread = await this.createThread(apiKey);
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
                ...WEBHEADERS,
                "Authorization": "Github Bearer " + apiKey,
            },
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

            if (done)
                return {
                    status: "success",
                    body: message
                };

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
                    // TODO: Implement smth here

                    if (sinkStream) {
                        const status = FUNCTIONS.find((item) => item.id === currentValue.type);
                        // If stream is TTY i:e terminal then write the status
                        if (sinkStream.isTTY && status?.id) {
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