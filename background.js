// Create the context menu item when the extension starts
browser.contextMenus.create({
  id: "open-clean-image",
  title: "Open image in new tab (no parameters)",
  contexts: ["image"],
  documentUrlPatterns: ["<all_urls>"],
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-clean-image") {
    // Get the image URL and strip query parameters
    const originalUrl = info.srcUrl;
    const cleanUrl = stripQueryParameters(originalUrl);

    // Open the clean URL in a new tab
    browser.tabs
      .create({
        url: cleanUrl,
        active: true,
      })
      .catch((error) => {
        console.error("Failed to create tab:", error);
      });
  }
});

// Function to remove query parameters from URL
function stripQueryParameters(url) {
  try {
    const urlObj = new URL(url);
    // Return just the origin + pathname (no search params or hash)
    return urlObj.origin + urlObj.pathname;
  } catch (error) {
    // Fallback for malformed URLs - just split on '?'
    console.warn("Could not parse URL:", url, error);
    return url.split("?")[0].split("#")[0];
  }
}

// Export for tests
if (typeof module !== "undefined" && module.exports) {
  module.exports = { stripQueryParameters };
}
