import CopilotRE from "../src";

if (!process.env.cookie) {
    console.error("Please set the cookie environment variable.");
    process.exit(1);
}

// Init CopilotRE
const copilot = new CopilotRE({
    githubCookie: process.env.cookie,
});

// Generate auth token
await copilot.generateAuthToken();

let response = await copilot.getAllThreads();
if (response.status != "success" || !response.body) {
    console.error("Failed to get all threads:", response);
    process.exit(1);
}

const threads = response.body.threads;

// Some time you might get error code 429: Too Many Requests
// while deleting like bulk of them (haven't counted)
for (const thread of threads) {
    console.log("[+] Deleting thread: " + thread.id);
    await copilot.deleteThread(thread.id);
}

console.log("All threads deleted successfully. (maybe)");
process.exit(0);
