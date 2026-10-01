import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Arena / E2B live-preview hosts (e.g. https://3000-<sandbox-id>.e2b.app)
    allowedHosts: [".e2b.app"],
  },
});
