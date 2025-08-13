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

// Generate thread
const models = await copilot.getModels();

if (models.status == "success" && models.body) {
    const data = models.body.data;
    console.log(data);
    // Traverse through all models
    data.forEach((model) => {
        console.log(model.name + " - " + model.id);
    });
}
