import fs, { WriteStream } from "fs";
import CopilotRE from "../src";

if (!process.env.cookie) {
    console.error("Please set the cookie environment variable.");
    process.exit(1)
}

// Init CopilotRE
const copilot = new CopilotRE({
    githubCookie: process.env.cookie,
});

await copilot.generateAuthToken();

const myStream: WriteStream = fs.createWriteStream("model_output.txt");

// I have not specified a thread so it will start a new one
const response = await copilot.generateContent({
    "model": "gpt-4o",
    "prompt": "What is Proxy in JavaScript ",
    "sinkStream": myStream, // This part will make output stream to file
});