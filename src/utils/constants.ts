/**
 * Used for website related requests
 * Like getting authentication token,
 */
export const WEBHEADERS = new Headers({
  'accept': 'application/json',
  'accept-language': 'en-GB,en;q=0.8',
  'cache-control': 'no-cache',
  'content-length': '0',
  'content-type': 'application/json',
  'github-verified-fetch': 'true',
  'origin': 'https://github.com',
  'pragma': 'no-cache',
  'priority': 'u=1, i',
  'referer': 'https://github.com/copilot',
  'sec-ch-ua': '"Not(A:Brand";v="99", "Brave";v="133", "Chromium";v="133"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'sec-gpc': '1',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  'x-requested-with': 'XMLHttpRequest',
})
/**
 * Used for API related requests
 */
export const APIHEADERS = new Headers({
  accept: "application/json",
  "accept-language": "en-GB,en;q=0.7",
  "content-type": "application/json",
  dnt: "1",
  "github-verified-fetch": "true",
  origin: "https://github.com",
  priority: "u=1, i",
  referer: "https://github.com/copilot",
  "sec-ch-ua": '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Linux"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "sec-gpc": "1",
  "user-agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
});

/** URL for fetching copilot token */
export const COPILOT_TOKEN_URL = "https://github.com/github-copilot/chat/token";

/** URL for fetching available models */
export const MODELS_URL = "https://api.individual.githubcopilot.com/models";

/** URL for chatting */
export const THREADS_URL = "https://api.individual.githubcopilot.com/github/chat/threads";

/** URL for extensions and repositories */
export const AGENTS_URL = "https://github.com/github-copilot/chat/agents";

/** URL for searching repository details */
export const GRAPHQL_URL = "https://github.com/_graphql?body=";

/** URL for specific repository detail */
export const REPO_URL = "https://github.com/github-copilot/chat/repositories";

export const FUNCTIONS = [
  {
    "id": "bing-search",
    "status": "Using Bing to search for "
  },
  {
    "id": "codesearch",
    "status": "Search for "
  },
  {
    "id": "kb-search",
    "status": "Searching for "
  },
  {
    "id": "pathsearch",
    "status": "Reading file "
  },
  {
    "id": "show-symbol-definition",
    "status": "Search for "
  },
  {
    "id": "getissue",
    "status": "Retrieving issue #"
  },
  {
    "id": "getalert",
    "status": "Retrieving information about alerts"
  },
  {
    "id": "getprcommits",
    "status": "Retrieving commits for pull request #"
  },
  {
    "id": "getcommit",
    "status": "Retrieving commit #"
  },
  {
    "id": "getrelease",
    "status": "Retrieving release "
  },
  {
    "id": "get-github-data",
    "status": "Fetching "
  },
  {
    "id": "getrepo",
    "status": "Fetching information about "
  },
  {
    "id": "get-actions-jog-logs",
    "status": "Retrieving "
  },
  {
    "id": "getdiff",
    "status": "Fetching diff"
  },
  {
    "id": "getdiscussion",
    "status": "Fetching discussion "
  },
  {
    "id": "get-diff-by-range",
    "status": "Fetching diff"
  },
  {
    "id": "getfile",
    "status": "Searching for file"
  },
  {
    "id": "getfilechanges",
    "status": "Searching for file changes"
  },
  {
    "id": "getpullrequest",
    "status": "Fetching pull request"
  },
  {
    "id": "planskill",
    "status": "Planning response..."
  },
  {
    "id": "supportsearch",
    "status": "Searching for support documents"
  }
]