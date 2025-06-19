const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const { stripQueryParameters } = require("../utils.js");

describe("stripQueryParameters", () => {
  let originalConsoleLog;
  
  beforeEach(() => {
    // Store the original console.log and replace it with a no-op function
    originalConsoleLog = console.log;
    console.log = () => {};
  });
  
  afterEach(() => {
    // Restore the original console.log after each test
    console.log = originalConsoleLog;
  });

  test("removes query parameters from HTTP URL", () => {
    const input = "https://example.com/image.jpg?param1=value1&param2=value2";
    const expected = "https://example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("removes query parameters from HTTPS URL", () => {
    const input =
      "https://secure.example.com/photos/image.png?width=300&height=200";
    const expected = "https://secure.example.com/photos/image.png";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("removes hash fragments", () => {
    const input = "https://example.com/image.jpg#section1";
    const expected = "https://example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("removes both query parameters and hash fragments", () => {
    const input = "https://example.com/image.jpg?size=large#gallery";
    const expected = "https://example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles URL with no query parameters", () => {
    const input = "https://example.com/image.jpg";
    const expected = "https://example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles URL with port number", () => {
    const input = "https://example.com:8080/image.jpg?param=value";
    const expected = "https://example.com:8080/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles URL with subdirectories", () => {
    const input =
      "https://cdn.example.com/images/gallery/photo.jpg?quality=high&format=webp";
    const expected = "https://cdn.example.com/images/gallery/photo.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles root path URL", () => {
    const input = "https://example.com/?homepage=true";
    const expected = "https://example.com/";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles malformed URL - falls back to string splitting", () => {
    const input = "not-a-valid-url?param=value#hash";
    const expected = "not-a-valid-url";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles malformed URL with only query parameters", () => {
    const input = "malformed-url?param1=value1&param2=value2";
    const expected = "malformed-url";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles malformed URL with only hash", () => {
    const input = "malformed-url#section";
    const expected = "malformed-url";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles empty query parameters", () => {
    const input = "https://example.com/image.jpg?";
    const expected = "https://example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles data URLs", () => {
    const input =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==?param=value";
    const expected =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles blob URLs", () => {
    const input =
      "blob:https://example.com/550e8400-e29b-41d4-a716-446655440000?param=value";
    const expected =
      "blob:https://example.com/550e8400-e29b-41d4-a716-446655440000";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles URLs with encoded characters in path", () => {
    const input = "https://example.com/images/my%20image%20file.jpg?size=large";
    const expected = "https://example.com/images/my%20image%20file.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles URLs with encoded characters in query params", () => {
    const input = "https://example.com/image.jpg?name=my%20file&type=photo";
    const expected = "https://example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles file:// URLs", () => {
    const input = "file:///Users/username/Pictures/image.jpg?timestamp=123";
    const expected = "file:///Users/username/Pictures/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles ftp:// URLs", () => {
    const input = "ftp://files.example.com/images/photo.png?mode=binary";
    const expected = "ftp://files.example.com/images/photo.png";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles URLs with multiple consecutive question marks", () => {
    const input = "https://example.com/image.jpg??param=value";
    const expected = "https://example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles URLs with multiple consecutive hash symbols", () => {
    const input = "https://example.com/image.jpg##section1";
    const expected = "https://example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles URLs with hash before query params", () => {
    const input = "https://example.com/image.jpg#section?param=value";
    const expected = "https://example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles very long URLs", () => {
    const longParam = "a".repeat(1000);
    const input = `https://example.com/image.jpg?longparam=${longParam}`;
    const expected = "https://example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles URLs with special characters in domain", () => {
    const input = "https://xn--fsq.example.com/image.jpg?param=value"; // internationalized domain
    const expected = "https://xn--fsq.example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles empty string", () => {
    const input = "";
    const expected = "";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles whitespace-only string", () => {
    const input = "   ";
    const expected = "   ";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles URL with just protocol", () => {
    const input = "https://?param=value";
    // This might throw in URL constructor, testing fallback behavior
    const result = stripQueryParameters(input);
    assert.strictEqual(result, "https://");
  });

  test("handles URL with authentication", () => {
    const input = "https://username:password@example.com/image.jpg?size=large";
    const expected = "https://username:password@example.com/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles URLs with non-standard ports", () => {
    const input = "https://example.com:443/image.jpg?param=value"; // standard HTTPS port
    const expected = "https://example.com:443/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles localhost URLs", () => {
    const input = "http://localhost:3000/image.jpg?dev=true";
    const expected = "http://localhost:3000/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles IP address URLs", () => {
    const input = "http://192.168.1.1:8080/image.jpg?param=value";
    const expected = "http://192.168.1.1:8080/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });

  test("handles IPv6 URLs", () => {
    const input = "http://[2001:db8::1]/image.jpg?param=value";
    const expected = "http://[2001:db8::1]/image.jpg";
    assert.strictEqual(stripQueryParameters(input), expected);
  });
});