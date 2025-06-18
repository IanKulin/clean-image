import { test, describe } from "node:test";
import assert from "node:assert";
import { createRequire } from "node:module";

// Use createRequire to import CommonJS module from ES module
const require = createRequire(import.meta.url);
const { stripQueryParameters } = require("../background.js");

describe("stripQueryParameters", () => {
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
});
