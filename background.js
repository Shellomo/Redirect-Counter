let redirectCounts = {};
let lastReset = new Date().toDateString();

// Check and reset counts at midnight
function checkAndResetCounts() {
  const today = new Date().toDateString();
  if (today !== lastReset) {
    redirectCounts = {};
    lastReset = today;
    chrome.storage.local.set({ redirectCounts, lastReset });
  }
}

// Load saved data
chrome.storage.local.get(['redirectCounts', 'lastReset'], (result) => {
  if (result.redirectCounts) redirectCounts = result.redirectCounts;
  if (result.lastReset) lastReset = result.lastReset;
  checkAndResetCounts();
});

// Track redirects
chrome.webRequest.onBeforeRedirect.addListener(
  (details) => {
    const url = new URL(details.url);
    const domain = url.hostname;

    redirectCounts[domain] = (redirectCounts[domain] || 0) + 1;
    chrome.storage.local.set({ redirectCounts });
  },
  { urls: ["<all_urls>"] }
);
