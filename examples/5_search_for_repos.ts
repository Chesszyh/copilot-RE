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

// Traverse through all available repositories
const repoDetail = await copilot.getRepoList("github copilot");
repoDetail.body?.data.search.nodes.forEach((repo) => {
    console.log(repo.nameWithOwner);
});