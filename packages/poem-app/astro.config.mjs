import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import { poemServer } from "./src/integrations/poem-server.js";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  server: {
    port: parseInt(process.env.PORT || "9500", 10),
    host: process.env.HOST || true,
  },
  integrations: [tailwind(), poemServer()],
});
