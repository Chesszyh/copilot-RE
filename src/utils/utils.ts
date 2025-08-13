import fs from "fs";
import readLine from "readline";

type LogLevel = "info" | "error" | "warn" | "debug";

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let logDisabled = false;

/**
 * Logs a message to the console.
 *
 * @param key The key of the message
 * @param value The value of the message
 * @param level The log level of the message (info, error, warn, debug)
 *
 * @example logger("message", "Hello, World!", "info");
 */
export const logger = (key: string, value: any, level: LogLevel = "info") => {
    if (logDisabled) return;

    const timestamp = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const colors = {
        info: "\x1b[1;32m", // Green
        error: "\x1b[1;31m", // Red
        warn: "\x1b[1;33m", // Yellow
        debug: "\x1b[1;34m", // Blue
        reset: "\x1b[0m", // Reset
    };

    // Trim longer strings
    if (typeof value == "string" && value.length + key.length > 65)
        value = value.slice(0, 65 - key.length) + "...";

    console.log(
        `[\x1b[1;36m${timestamp}\x1b[0m] \x1b[1;35m${key}\x1b[0m: ${colors[level]}${value}${colors.reset}`,
    );
};

// Quick input() implementation
export const prompt = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

export const saveCookie = (key: string, value: string) => {
    let cookieContent = "{}";

    if (fs.existsSync(".cookie")) {
        cookieContent = fs.readFileSync(".cookie", "utf-8");
    }

    const cookieJSON = JSON.parse(cookieContent);
    cookieJSON[key] = value;

    fs.writeFileSync(".cookie", JSON.stringify(cookieJSON));
};

export const getCookie = (key: string): string | undefined => {
    if (!fs.existsSync(".cookie")) {
        return undefined;
    }

    return JSON.parse(fs.readFileSync(".cookie", "utf-8"))[key];
};

export const toggleLogs = () => {
    logDisabled = !logDisabled;
};

/**
 * Creates a centered string with terminal border and color
 * @param {string} str - The string to center in the terminal
 * @param {string} textColor - ANSI color code for the text (default: white)
 * @returns {string} - Formatted string with colored border
 */
export const createTerminalBorder = (str: string, textColor = "\x1b[37m") => {
    const BOLD_LIGHT_BLUE = "\x1b[1;94m";
    const RESET = "\x1b[0m";

    // Terminal width
    const termWidth = process.stdout.columns || 80;

    const stringPortion = `┤ ${str} ├`;
    const stringWidth = stringPortion.length;

    const availableDashSpace = termWidth - 2 - stringWidth;

    const dashesBeforeString = Math.floor(availableDashSpace / 2);
    const dashesAfterString = availableDashSpace - dashesBeforeString;

    const border =
        BOLD_LIGHT_BLUE +
        "┌" +
        "─".repeat(dashesBeforeString) +
        RESET +
        textColor +
        stringPortion +
        RESET +
        BOLD_LIGHT_BLUE +
        "─".repeat(dashesAfterString) +
        "┐" +
        RESET;

    return border;
};
