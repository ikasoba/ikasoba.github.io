import { LayoutComponent } from "dejamu/plugins/md/MarkdownPlugin.tsx";
import { Head } from "dejamu/plugins/Head.tsx";
import { Markdown } from "dejamu/plugins/md/Markdown.tsx";
import StarEffectProvider from "../components/StarEffectProvider.islands.tsx";
import SiteSideBar from "../components/SiteSideBar.tsx";
import Marquee from "../components/Marquee.tsx";
import Blink from "../components/Blink.tsx";

export default (function NormalPage({ data, children }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {data.title ? `${data.title} - いかそばの部屋` : "いかそばの部屋"}
        </title>
        <link rel="stylesheet" href={`${projectRoot}/styles/index.css`} />
      </Head>
      <div className="site-container">
        <SiteSideBar />
        <div className="site-content">
          <header>
            <Marquee duration="10s" className="welcome-header">
              <h1>いかそばの部屋へようこそ</h1>
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
          <main>
            <Markdown>
              {children}
            </Markdown>
          </main>
          <footer>
            <p className="center">
              誤字・脱字の修正、記事の追加等は <a href="https://github.com/ikasoba/ikasoba.github.io">こちら</a> へプルリクエストをお送りくださいな
            </p>
          </footer>
        </div>
      </div>
      <StarEffectProvider />
    </>
  );
}) satisfies LayoutComponent;
