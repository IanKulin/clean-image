// Import the utility function
const { stripQueryParameters } = require('./utils.js');

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