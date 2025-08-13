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

// Generate a thread id
const resp = await copilot.createThread();
if (resp.status == "error" || !resp.body) {
    console.log("Failed: ", resp.error);
    process.exit(1);
}

console.log("[+] Obtained thread id:", resp.body.thread_id);
console.log("[+] Trying to delete this thread...");

// Delete thread
const deleteResp = await copilot.deleteThread(resp.body.thread_id);
if (deleteResp.status == "success") {
    console.log("[+] Deleted thread successfully");
} else {
    console.log("Failed: ", deleteResp.error);
}
process.exit(0);
