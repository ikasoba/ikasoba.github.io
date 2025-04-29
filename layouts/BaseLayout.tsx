import { ComponentChildren } from "npm:preact";
import { Head } from "dejamu/mod.ts";
import { asset } from "dejamu/comptime.ts";
import SiteSideBar from "../components/SiteSideBar.tsx";
import Marquee from "../components/Marquee.tsx";
import Blink from "../components/Blink.tsx";
import StarEffectProvider from "../components/StarEffectProvider.islands.tsx";

export default function BaseLayout(
  { titleName, children }: { titleName?: string, children?: ComponentChildren },
) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {titleName ? `${titleName} - いかそばの部屋` : "いかそばの部屋"}
        </title>
        <link rel="icon" href={asset("/static/favicon.svg")} />
        <link rel="stylesheet" href={`${projectRoot}/styles/index.css`} />
        <link rel="schema.CC" href="http://web.resource.org/cc/" />
        <meta
          name="CC.license"
          content="https://creativecommons.org/licenses/by/4.0/"
        />
      </Head>
      <div className="site-container">
        <SiteSideBar />
        <div className="site-content">
          <header>
            <Marquee duration="10s" className="welcome-header">
              <h1>
                いかそばの部屋へようこそ
              </h1>
            </Marquee>
            <p className="center">
              <Blink duration="1.25s">
                当サイトはリンクフリーです！
              </Blink>
              <br />
              <Blink duration="1.25s" style={{ color: "magenta" }}>
                Sorry. this site is written only Japanese.
              </Blink>
            </p>
          </header>
          <main role="main">
            {children}
          </main>
          <footer>
            <p className="center">
              誤字・脱字の修正、記事の追加等は{" "}
              <a
                target="_blank"
                href="https://github.com/ikasoba/ikasoba.github.io"
              >
                こちら
              </a>{" "}
              へプルリクエストをお送りくださいな
            </p>
            <hr />
            <small>
              当サイトにおいて公開されているコンテンツは第三者のコンテンツの引用等を除いて
              {" "}
              <a
                rel="license"
                href="https://creativecommons.org/licenses/by/4.0/"
              >
                CC BY 4.0
              </a>{" "}
              として利用できます。
            </small>
          </footer>
        </div>
      </div>
      <StarEffectProvider />
    </>
  );
}
