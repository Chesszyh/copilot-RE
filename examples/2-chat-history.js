import CopilotRE from "../src/CopilotRE.js";
import { debug, info } from "../src/utils/logger.js";

const copilot = new CopilotRE(process.env.GITHUB_COOKIE);

await copilot.init();

// Get all past conversations
let threadList = await copilot.getThreads();

// Loop through all conversation list
threadList.forEach((item) => {
    console.log(`ID: ${item.id}`);
    console.log(`Title: ${item.name}\n`);
});

if (threadList.length <= 0) {
    error("No conversation history found");
    process.exit(0);
}

info("Using last conversation");
let selectedThread = threadList[0];

// Get specific conversation history
let content = await copilot.getThreadContent(selectedThread.id);

content?.messages?.forEach((item) => {
    debug(
        item.role.toUpperCase(),
        item.content,
        new Date(item.createdAt).toLocaleTimeString()
    );
});

// Ask question on that specific thread
copilot.generateContent(
    "What was my last message",
    "gpt-4o",
    selectedThread.id
);
