const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
        crimson: "\x1b[38m", // Not a standard 16-color term
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        gray: "\x1b[100m",
        crimson: "\x1b[48m", // Not a standard 16-color term
    },
};

const truncate = (text) => {
    if (!process.stdout.columns) {
        return text; // Cannot determine terminal width, don't truncate
    }
    const maxLength = Math.floor(process.stdout.columns / 2);
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
};

const logWithStyle = (level, color, message) => {
    const timestamp = new Date().toLocaleTimeString();
    const truncatedMessage = truncate(message);
    console.log(
        `${colors.bright}${color}[${level} - ${timestamp}]${colors.reset} ${truncatedMessage}`
    );
};

const warning = (message) => {
    logWithStyle("WARNING", colors.fg.yellow, message);
};

const error = (message) => {
    logWithStyle("ERROR", colors.fg.red, message);
};

const info = (message) => {
    logWithStyle("INFO ", colors.fg.blue, message);
};

const debug = (name, value, timestamp) => {
    timestamp = timestamp || new Date().toLocaleTimeString();
    const truncatedValue = truncate(String(value));
    console.log(
        `${colors.bright}${colors.fg.gray}[DEBUG - ${timestamp}]${colors.reset} ${name}: ${colors.fg.green}${truncatedValue}${colors.reset}`
    );
};

export { warning, error, info, debug };
