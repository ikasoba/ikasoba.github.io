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

type Heading = {
  level: number;
  tag: string;
  name: string;
};

function parseHeadings(text: string) {
  return [
    ...text.matchAll(/^<h([1-6])\s+id=([^>]+)>((?:(?!<\/h[1-6]).)+)/gm),
  ].map(([_, level, tag, name]): Heading => ({
    level: +level,
    tag: (tag[0] == '"' && tag[tag.length - 1] == '"') ? tag.slice(1, -1) : tag,
    name,
  }));
}

type HeadingWithChildren = Heading & {
  isChildren?: boolean;
  children?: HeadingWithChildren[];
};

function createHeadingTree(headings: HeadingWithChildren[]) {
  const res: HeadingWithChildren[] = [];
  const stack: HeadingWithChildren[] = [];

  for (const h of headings) {
    const parent = stack[stack.length - 1];

    if (!parent) {
      stack.push({ ...h });
      continue;
    }

    if (parent.level < h.level) {
      const child = !h.isChildren ? { ...h, isChildren: true } : h;

      (parent.children ??= []).push(child);
      continue;
    } else {
      stack.pop();

      res.push(parent);

      stack.push({ ...h });
      continue;
    }
  }

  for (; stack.length;) {
    const node = stack.pop()!;

    if (!node?.isChildren) {
      res.push(node);
    }
  }

  return res;
}

function HeadingTree({ headings }: { headings: HeadingWithChildren[] }) {
  return (
    <ul>
      {headings.map(({ tag, name, children }) => (
        <li>
          <a href={"#" + tag}>
            {name}
          </a>
          { children?.length ? HeadingTree({ headings: children }) : null }
        </li>
      ))}
    </ul>
  );
}

export default (function NormalPage({ data, children, path }) {
  const lastUpdated = Deno.statSync(path).mtime;

  const headings = parseHeadings(children);

  const headingTree = createHeadingTree(headings);

  return (
    <BaseLayout titleName={data.title}>
      {headings.length
        ? (
          <nav>
            目次
            <HeadingTree headings={headingTree} />
          </nav>
        )
        : null}
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
