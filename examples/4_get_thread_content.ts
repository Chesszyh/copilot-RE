import CopilotRE from "../src";

if (!process.env.cookie) {
    console.error("Please set the cookie environment variable.");
    process.exit(1)
}


// Init CopilotRE
const copilot = new CopilotRE({
    githubCookie: process.env.cookie,
});

// Generate auth token
await copilot.generateAuthToken();

// Let's get all our old conversations
const threads = await copilot.getAllThreads();


// Let's get the first thread content
const thread = threads.body?.threads[0];

if (!thread) {
    console.log(threads)
    console.error("No threads found");
    process.exit(1);
}

// Get the thread ID
const threadID = thread.id;

// Get conversation content
const content = await copilot.getThreadContent(threadID);

// Traverse through all the messages
content.body?.messages.forEach((message) => {
    console.log("========From " + message.role + "=========");

    console.log(message.content);
});