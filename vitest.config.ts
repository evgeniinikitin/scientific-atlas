import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  esbuild: { jsx: "automatic" },
  test: { environment: "jsdom", setupFiles: ["./src/test/setup.ts"], globals: true, css: false, exclude: ["e2e/**", "node_modules/**"] },
});
