import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Mirrors the /ingest rewrites in vercel.json so PostHog works in dev.
    proxy: {
      "/ingest/static": {
        target: "https://us-assets.i.posthog.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ingest/, ""),
      },
      "/ingest": {
        target: "https://us.i.posthog.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ingest/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
