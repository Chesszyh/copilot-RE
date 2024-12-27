import CopilotRE from "../src/CopilotRE.js";
import { debug, info } from "../src/utils/logger.js";

const copilot = new CopilotRE(process.env.GITHUB_COOKIE);

await copilot.init();

// First lets create a new thread for chat
let newThread = await copilot.newThread();

// Lets search for some repositories
let repoList = await copilot.getReposList("openai/evals");

// Let's select first repo (randomly)
let selectedRepo = repoList[0];

// Let's get selected repository detail
let repoDetail = await copilot.getRepoDetail(selectedRepo.databaseId);

// Now plug the detail into `generate_content`
copilot.generateContent(
    "can you explain me this repository",
    "gpt-4o",
    newThread.thread_id,
    repoDetail
);
