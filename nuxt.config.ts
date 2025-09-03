import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  app: {
    head: {
      title: "HeadScout",
    },
  },
  modules: ["shadcn-nuxt"],
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  css: ["~/assets/css/style.css"],
  vite: {
    plugins: [tailwindcss()],

    server: {
      proxy: {
        "/api/ig-caption": {
          target: "https://www.instagram.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ig-caption/, ""),
        },
      },
    },
  },
});
