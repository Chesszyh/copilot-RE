import fs, { WriteStream } from "fs";
import CopilotRE from "../src";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

if (!process.env.cookie) {
    console.error("Please set the cookie environment variable.");
    process.exit(1)
}

// Init CopilotRE
const copilot = new CopilotRE({
    githubCookie: process.env.cookie,
});

await copilot.generateAuthToken();

// Lets search for some repo
const repoList = await copilot.getRepoList("microsoft");

if (repoList.status != "success") {
    console.error("Error fetching repo list");
    process.exit(1);
}

if (repoList.body?.data.search.nodes.length == 0) {
    console.error("No repo found with that name");
    process.exit(1);
}

const choosenRepo = repoList.body!.data.search.nodes[0].databaseId;

// Now lets get the specific detail about the choosen repository
const repoDetail = await copilot.getRepoDetail(choosenRepo);

if (repoDetail.status != "success") {
    console.error("Error fetching repo detail");
    process.exit(1);
}

const response = await copilot.generateContent({
    "prompt": "Can you describe about the repository that I have attached",
    "model": "gpt-4o",
    "reference": repoDetail.body,
    "sinkStream": process.stdout,
});