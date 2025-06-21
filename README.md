
## Clean Image Opener

A Firefox browser extension that allows users to open images in new tabs with query parameters stripped from the URL. The extension adds a context menu item when right-clicking on images.

## Architecture

- **manifest.json**: Firefox extension manifest (version 2) defining permissions and background scripts
- **background.js**: Main extension logic handling context menu creation and clicks
- **utils.js**: Core utility function `stripQueryParameters()` that handles URL cleaning with robust support for various URL types (HTTP/HTTPS, data:, blob:, file:, FTP, etc.)
- **test/**: Test suite using Node.js built-in test runner

## Development Commands

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage reporting
npm run test:coverage
```

## Key Implementation Details

The `stripQueryParameters()` function in `utils.js` handles complex URL parsing scenarios including:
- Standard HTTP/HTTPS URLs with proper port handling
- Special URL protocols (data:, blob:, file:)
- URLs with authentication credentials
- Malformed URLs with fallback string splitting
- IPv6 addresses and internationalized domains

The extension uses Firefox's `browser` API for context menus and tab management, with error handling for tab creation failures.