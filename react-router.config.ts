import type { Config } from "@react-router/dev/config";
import { ViteConfig } from "vite.config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  //prerender: true,
  basename: ViteConfig.base,
} satisfies Config;
