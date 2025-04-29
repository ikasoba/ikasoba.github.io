import { LayoutComponent } from "dejamu/plugins/md/MarkdownPlugin.tsx";
import { Head } from "dejamu/plugins/Head.tsx";
import { Markdown } from "dejamu/plugins/md/Markdown.tsx";
import StarEffectProvider from "../components/StarEffectProvider.islands.tsx";
import SiteSideBar from "../components/SiteSideBar.tsx";
import Marquee from "../components/Marquee.tsx";
import Blink from "../components/Blink.tsx";
import { asset } from "dejamu/comptime.ts";
import { DejamuContext } from "dejamu/core/context.ts";
import BaseLayout from "./BaseLayout.tsx";

export default (function NormalPage({ data, children, path }) {
  const lastUpdated = Deno.statSync(path).mtime;

  return (
    <BaseLayout titleName={data.title}>
      <Markdown>
        {children}
      </Markdown>
      {lastUpdated && (
        <small>
          最終更新：<time datetime={lastUpdated.toISOString()}>
            {lastUpdated.toUTCString()}
          </time>
        </small>
      )}
    </BaseLayout>
  );
}) satisfies LayoutComponent;
