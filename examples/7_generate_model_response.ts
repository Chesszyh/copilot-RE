import CopilotRE from "../src";

if (!process.env.cookie) {
    console.error("Please set the cookie environment variable.");
    process.exit(1)
}

// Init CopilotRE
const copilot = new CopilotRE({
    githubCookie: process.env.cookie,
    authToken: process.env.auth,
});

const response = await copilot.generateContent({
    "model": "gpt-4o",
    "prompt": "What is Proxy in JavaScript ",
    "sinkStream": process.stdout,
});

console.log(response);