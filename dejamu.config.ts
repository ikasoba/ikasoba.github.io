import type { Config } from "dejamu/mod.ts";
import PreactPlugin from "dejamu/plugins/preact/mod.ts";
import MarkdownPlugin from "dejamu/plugins/md/mod.ts";
import PostCssPlugin from "dejamu/plugins/postcss/mod.ts";
import cssnano from "npm:cssnano";
import autoprefixer from "npm:autoprefixer";

export default {
  entryPoints: ["pages/*.{jsx,tsx,md}", "styles/*.css"],
  plugins: [
    PreactPlugin(),
    MarkdownPlugin("layouts/"),
    PostCssPlugin([".css"], [
      cssnano({ preset: "default" }) as any,
      autoprefixer() as any,
    ]),
  ],
} satisfies Config;
