import { usePageInfos } from "dejamu/comptime.ts";
import { comparePage, getPageDate } from "../utils/page.ts";
import { xml } from "dejamu/plugins/xml/mod.ts";

export default (function AtomPage() {
  const pages = usePageInfos();

  const Feed = xml("feed");
  const Author = xml("author");
  const Name = xml("name");
  const Id = xml("id");
  const Entry = xml("entry");
  const Updated = xml("updated");

  return (
    <Feed xmlns="http://www.w3.org/2005/Atom">
      <title>いかそばの部屋</title>

      <Author>
        <Name>いかそば</Name>
      </Author>

      <Id>https://ikasoba.net</Id>

      {[...pages.values()].filter((x) => x.sourcePath.includes("pages/draft/"))
        .sort((a, b) => {
          return comparePage(a, b) * -1;
        }).slice(0, 50).map((page) => {
          const href =
            new URL("./" + page.outputPath, "https://ikasoba.net/").href;

          return (
            <Entry>
              <Id>
                {href}
              </Id>
              <title>
                {page.title}
              </title>
              <link href={href} />
              <summary>
                本文: {href}
              </summary>
              <Updated>{getPageDate(page)?.toISOString()}</Updated>
            </Entry>
          );
        })}
    </Feed>
  );
});
