import CopilotRE from "../src/CopilotRE.js";

const copilot = new CopilotRE(process.env.GITHUB_COOKIE);

await copilot.init();

const newThread = await copilot.newThread(); // Create a new thread for chatting

copilot.generateContent(
    "Write me a simple hello copilot code in python",
    "gpt-4o",
    newThread.thread_id
);
