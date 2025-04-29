import BaseLayout from "../layouts/BaseLayout.tsx";
import { Markdown } from "dejamu/plugins/md/Markdown.tsx";
import { usePageInfos } from "dejamu/comptime.ts";
import { comparePage } from "../utils/page.ts";

const tsubuyaki = await Deno.readTextFile("./tsubuyaki.md");

export default (function Home() {
  const pages = usePageInfos();

  return (
    <BaseLayout>
      <h1>トップページ</h1>
      <p>
        適当に近況とかを書き足して行こうかな(´・ω・｀)
      </p>
      <h2>記事</h2>
      <ul>
        {[...pages.values()].filter((x) =>
          x.sourcePath.includes("pages/draft/")
        ).sort((a, b) => {
          return comparePage(a, b);
        }).map((page) => (
          <li>
            <a href={"./" + page.outputPath}>
              {page.title}
            </a>
          </li>
        ))}
      </ul>
      <h2>つぶやき</h2>
      <Markdown>
        {tsubuyaki}
      </Markdown>
    </BaseLayout>
  );
});
