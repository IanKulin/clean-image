// Function to remove query parameters from URL
function stripQueryParameters(url) {
  try {
    const urlObj = new URL(url);
    
    // Special handling for data:, blob:, and file: URLs since they have unusual origin behavior
    if (urlObj.protocol === 'data:') {
      return urlObj.protocol + urlObj.pathname;
    }
    
    if (urlObj.protocol === 'blob:') {
      return urlObj.protocol + urlObj.pathname;
    }
    
    if (urlObj.protocol === 'file:') {
      return urlObj.protocol + '//' + urlObj.pathname;
    }
    
    // For regular URLs, construct the clean URL preserving all parts except search and hash
    let cleanUrl = urlObj.protocol + '//';
    
    // Add authentication if present
    if (urlObj.username) {
      cleanUrl += urlObj.username;
      if (urlObj.password) {
        cleanUrl += ':' + urlObj.password;
      }
      cleanUrl += '@';
    }
    
    cleanUrl += urlObj.hostname;
    
    // Handle port - need to check original URL since URL API normalizes standard ports
    if (urlObj.port) {
      // Port is explicitly set and non-standard
      cleanUrl += ':' + urlObj.port;
    } else {
      // Check if the original URL had an explicit standard port
      const hostPart = url.split('://')[1]?.split('/')[0]?.split('?')[0]?.split('#')[0];
      if (hostPart && hostPart.includes(':')) {
        const portMatch = hostPart.match(/:(\d+)$/);
        if (portMatch) {
          cleanUrl += ':' + portMatch[1];
        }
      }
    }
    
    cleanUrl += urlObj.pathname;
    
    return cleanUrl;
  } catch (error) {
    // Fallback for malformed URLs - just split on '?' and '#'
    console.warn("Could not parse URL:", url, error);
    return url.split("?")[0].split("#")[0];
  }
}

// Export for CommonJS
module.exports = { stripQueryParameters };