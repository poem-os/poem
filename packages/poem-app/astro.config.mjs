import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    port: parseInt(process.env.PORT || "4321", 10),
    host: process.env.HOST || true,
  },
  integrations: [tailwind()],
});
