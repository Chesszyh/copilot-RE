import CopilotRE from "../src";

if (!process.env.cookie) {
    console.error("Please set the cookie environment variable.");
    process.exit(1);
}

// Init CopilotRE
const copilot = new CopilotRE({
    githubCookie: process.env.cookie,
    authToken: process.env.auth,
});

// Generate thread
const threads = await copilot.getAllThreads();

if (threads.status == "success" && threads.body) {
    const data = threads.body.threads;

    // Traverse through threads
    data.forEach((thread) => {
        if (!thread.name)
            thread.name = "New Conversation";

        console.log(thread.name + " - " + thread.id);
    });
}