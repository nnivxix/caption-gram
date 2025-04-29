import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    proxy: {
      "/api/ig-caption": {
        target: "https://www.instagram.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ig-caption/, ""),
      },
    },
  },
});
