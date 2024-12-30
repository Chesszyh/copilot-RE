import CopilotRE from "../src/CopilotRE.js";

let copilot = new CopilotRE(`YOUR_COOKIE_HERE`);

await copilot.init();

let thread1 = await copilot.newThread();
let thread2 = await copilot.newThread();

async function call(prompt = (process.argv[2] || "Just ask me anything. Make it short and sweet")) {
  console.log("\n\x1b[32m");
  let response1 = await copilot.generateContent(prompt, "gpt-4o", thread1);
  console.log("\n\x1b[34m");
  let response2 = await copilot.generateContent(response1, "gpt-4o", thread2);
  setTimeout(() => call(response2), 2000);
}

call();