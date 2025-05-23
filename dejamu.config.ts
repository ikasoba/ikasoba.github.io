import type { Config } from "dejamu/mod.ts";
import PreactPlugin from "dejamu/plugins/preact/mod.ts";
import MarkdownPlugin from "dejamu/plugins/md/mod.ts";
import HljsPlugin from "dejamu/plugins/md/hljs/mod.ts";
import PostCssPlugin from "dejamu/plugins/postcss/mod.ts";
import cssnano from "npm:cssnano";
import autoprefixer from "npm:autoprefixer";
import { XmlPlugin } from "dejamu/plugins/xml/mod.ts";

export default {
  entryPoints: [
    "pages/**/*.md",
    /^pages\/([^/]+\/)*[^/]+(?<!\.xml)\.(jsx|tsx)$/,
    "pages/**/*.xml.{jsx,tsx}",
    "styles/*.css",
  ],
  plugins: [
    XmlPlugin(),
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
