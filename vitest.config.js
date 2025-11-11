import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Keep the Vitest setup explicit so component tests run in a browser-like env with shared helpers.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    // Load DOM matchers and any global mocks before every test suite.
    setupFiles: "./setupTests.js",
  },
});
