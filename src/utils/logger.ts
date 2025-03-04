type LogLevel = 'info' | 'error' | 'warn' | 'debug';

const colors = {
    info: '\x1b[1;32m',    // Green
    error: '\x1b[1;31m',   // Red
    warn: '\x1b[1;33m',    // Yellow
    debug: '\x1b[1;34m',   // Blue
    reset: '\x1b[0m'     // Reset
};

/**
 * Logs a message to the console.
 * 
 * @param key The key of the message
 * @param value The value of the message
 * @param level The log level of the message (info, error, warn, debug)
 * 
 * @example logger("message", "Hello, World!", "info");
 */
export const logger = (key: string, value: any, level: LogLevel = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Trim longer strings
    if (typeof value == "string" && value.length + key.length > 65)
        value = value.slice(0, 65 - key.length) + "...";

    console.log(
        `[\x1b[1;36m${timestamp}\x1b[0m] \x1b[1;35m${key}\x1b[0m: ${colors[level]}${value}${colors.reset}`
    );
};