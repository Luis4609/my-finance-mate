import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

/// <reference types="vitest" />
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    setupFiles: ['./vitest.setup.ts'], // Or wherever you put your setup file
    globals: true, // Often useful for testing-library
    environment: 'happy-dom', // Or 'jsdom'
  },
});
