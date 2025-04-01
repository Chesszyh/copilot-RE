import fs from "fs";
import CopilotRE from ".";
import {
    getCookie,
    saveCookie,
    toggleLogs,
    prompt,
    createTerminalBorder,
} from "./utils/utils";

toggleLogs();

let cookie = getCookie("cookie") || "";
let threadID = getCookie("threadID") || "";

if (!cookie) {
    cookie = await prompt(
        "[?] Your '\x1b[90musers_session\x1b[0m' value from cookies: ",
    );
    cookie = cookie.trim();

    if (!cookie) {
        console.error("[!] Invalid cookie");
        process.exit(1);
    }

    saveCookie("cookie", cookie);
    console.log("[+] Your cookies are stored in .cookie file for later use");
}

// Init CopilotRE
const copilot = new CopilotRE({
    githubCookie: cookie,
});

// Populate auth token internally
const token = await copilot.generateAuthToken();
if (token.status != "success") {
    console.log(token);
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
console.log(
    "[+] Supported commands: $models, $exit, $reset, $setmodel, $currentmodel",
);

let modelID = getCookie("modelId") || "gpt-4o";

while (true) {
    console.log(createTerminalBorder("You"), "\x1b[0;35m");

    const userPrompt = await prompt("\x1b[1;36m>\x1b[0m \x1b[1;32m");

    // End user message color
    process.stdout.write("\x1b[0m");

    if (userPrompt.toLowerCase() === "$models") {
        const models = await copilot.getModels();
        if (models.status != "success" || !models.body) {
            console.error("[!] Failed to get models");
            process.exit(1);
        }

        console.log(createTerminalBorder("Available Models", "\x1b[1;45m"));

        // Store in array of objects to beautifully display using console.table
        let availableModels: { model_id: string; model_name: string }[] = [];

        availableModels = models.body?.data.map((model) => {
            const modelName = model.name;
            const modelId = model.id;

            return { model_id: modelId, model_name: modelName };
        });

        // Log the table
        console.table(availableModels);
        continue;
    } else if (userPrompt.toLowerCase() === "$exit") {
        console.log("Goodbye!");
        process.exit(0);
    } else if (userPrompt.toLowerCase() === "$reset") {
        if (fs.existsSync(".cookie")) {
            fs.unlinkSync(".cookie");
            console.log("[+] Cookies removed");
            process.exit(0);
        }
    } else if (userPrompt.toLowerCase() === "$setmodel") {
        const typedModelID = await prompt("Enter model id: ");
        if (typedModelID) {
            modelID = typedModelID;
            saveCookie("modelId", modelID);
            console.log(`[+] Model set to ${modelID}`);
        } else {
            console.error("[!] Invalid model id, keeping: " + modelID);
        }
        continue;
    } else if (userPrompt.toLowerCase() === "$currentmodel") {
        console.log(`[+] Current model: ${modelID}`);
        continue;
    }

    const response = await copilot.generateContent({
        threadID,
        model: modelID,
        prompt: userPrompt,
        sinkStream: process.stdout,
    });

    if (response.status != "success" && response.error) {
        console.log(response);
    } else {
        process.stdout.write("\n\n");
    }
}
