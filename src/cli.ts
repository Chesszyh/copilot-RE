import CopilotRE from ".";
import { getCookie, saveCookie, toggleLogs, prompt } from "./utils/utils";

toggleLogs();

// Default AI model
const DEFAULT_MODEL = "gpt-4o";

let cookie = getCookie("cookie") || "";
let threadID = getCookie("threadID") || "";

if (!cookie) {
    cookie = await prompt("[?] Your github cookie: ");
    cookie = cookie.trim();

    if (!cookie) {
        console.error("[!] Invalid cookie");
        process.exit(1);
    }

    saveCookie("cookie", cookie);
}

// Init CopilotRE
const copilot = new CopilotRE({
    githubCookie: cookie,
});

// Populate auth token internally
const token = await copilot.generateAuthToken();
if (token.status != "success") {
    console.log(token)
    console.error("[!] Failed to generate auth token");
    process.exit(1);
}

// Create new thread for conversation
if (!threadID) {
    const newThread = await copilot.createThread();
    if (newThread.status != "success" || !newThread.body) {
        console.error("[!] Failed to create thread");
        process.exit(1);
    }

    saveCookie("threadID", newThread.body.thread_id);
    threadID = newThread.body.thread_id;
}

while (true) {
    const userPrompt = await prompt("\x1b[1;35mYou\x1b[0m: \x1b[1;32m");

    process.stdout.write("\x1b[0m");

    const response = await copilot.generateContent({
        threadID,
        model: DEFAULT_MODEL,
        prompt: userPrompt,
        sinkStream: process.stdout,
    });

    if (response.status != "success" && response.error) {
        console.error(response.error?.message);
    }
}