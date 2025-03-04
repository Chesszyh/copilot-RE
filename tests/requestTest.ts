import { request } from "../src/utils/networkUtils";

const response = await request("https://echo.free.beeceptor.com", {
    method: "POST",
    body: "Hello, world!",
    headers: new Headers({
        "Content-Type": "text/plain",
    }),
});

const answer = await (response.body as Response).text();
console.log(answer);