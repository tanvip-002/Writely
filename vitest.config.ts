import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    include: ["src/**/*.test.ts", "tests/unit/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "tests/e2e/**"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
