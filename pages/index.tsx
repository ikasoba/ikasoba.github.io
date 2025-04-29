import { DejamuContext } from "dejamu/core/context.ts";
import BaseLayout from "../layouts/BaseLayout.tsx";
import { PageInfo } from "dejamu/core/PageInfo.ts";
import { Markdown } from "dejamu/plugins/md/Markdown.tsx";
import { usePageInfos } from "dejamu/comptime.ts";

function comparePage(a: PageInfo, b: PageInfo) {
  if (a.timestamp && b.timestamp) {
    return a.timestamp.getTime() - b.timestamp.getTime();
  } else {
    const am = a.sourcePath.match(/([0-9]{4})-([0-9]{2})\/([0-9]{2})/);
    const bm = b.sourcePath.match(/([0-9]{4})-([0-9]{2})\/([0-9]{2})/);

    const ad = am ? new Date(am.slice(1).join("/")) : a.timestamp;
    const bd = bm ? new Date(bm.slice(1).join("/")) : b.timestamp;

    return ad && bd ? ad.getTime() - bd.getTime() : -1;
  }
}

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
