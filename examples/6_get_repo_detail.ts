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

// First we search for repositories to get its ID
const repoLists = await copilot.getRepoList("rohitaryal/copilot-RE");

// We may have an error
if (repoLists.status == "error") {
    console.error(repoLists.error);
    process.exit(1);
}

// We may have an empty list
if (!repoLists.body?.data.search.nodes.length) {
    console.error("No repository found.");
    process.exit(1);
}

// We select a first repository's database id
// Note that repo id is different from 'id' field
const chosenRepoID = repoLists.body?.data.search.nodes[0].databaseId;
const repoDetail = await copilot.getRepoDetail(chosenRepoID);

console.log(repoDetail);
