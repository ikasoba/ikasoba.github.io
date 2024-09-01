import type { Config } from "dejamu/mod.ts";
import PreactPlugin from "dejamu/plugins/preact/mod.ts";
import MarkdownPlugin from "dejamu/plugins/md/mod.ts";
import HljsPlugin from "dejamu/plugins/md/hljs/mod.ts";
import PostCssPlugin from "dejamu/plugins/postcss/mod.ts";
import cssnano from "npm:cssnano";
import autoprefixer from "npm:autoprefixer";

export default {
  entryPoints: ["pages/**/*.{jsx,tsx,md}", "styles/*.css"],
  plugins: [
    PreactPlugin(),
    MarkdownPlugin({
      layouts: "layouts/",
      plugins: [
        HljsPlugin({
          theme: "far",
        }),
      ],
    }),
    PostCssPlugin([".css"], [cssnano({ preset: "default" }), autoprefixer()]),
  ],
} satisfies Config;
