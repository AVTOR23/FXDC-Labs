import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mochaPlugins } from "@getmocha/vite-plugins";

const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  plugins: [
    // Cloudflare/Mocha worker plugins are for Wrangler, not Vercel static hosting.
    ...(isVercel ? [] : mochaPlugins(process.env as never)),
    react(),
  ],
  server: {
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 5000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
