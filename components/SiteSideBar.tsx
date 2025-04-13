import { asset } from "dejamu/comptime.ts";
import { BannerCopyButton } from "./BannerCopyButton.islands.tsx";

export default function SiteSideBar() {
  return (
    <div role="navigation" className="sidebar">
      ❏ めにゅ～ ❏
      <ul className="sidebar-menu">
        <li>
          <a href={`${projectRoot}/`}>★トップ★</a>
        </li>
        <li>
          <a href={`${projectRoot}/bbs.html`}>★掲示板★</a>
        </li>
      </ul>

      ❏ リンク集 ❏
      <ul className="sidebar-menu">
        <li>
          <a href="https://github.com/ikasoba">★ｷﾞｯﾄﾊﾌﾞ★</a>
        </li>
        <li>
          <a href="https://twitter.com/ikasoba000">★ﾂｲｯﾀｰ★</a>
        </li>
      </ul>

      ❏ バナー集 ❏
      <ul className="sidebar-menu">
        <small>◇ なうぷれ ◇</small>
        <li>
          <a href="https://nowplaying.ikasoba.net/playing/ikasoba/url">
            <img
              width="112"
              height="28"
              src="https://nowplaying.ikasoba.net/playing/ikasoba"
            />
          </a>
          <br />
        </li>
        <small>◇ 当サイト ◇</small>
        <li>
          <a title="いかそばの部屋" href="https://ikasoba.net">
            <img
              width="110"
              height="40"
              src={asset("/static/banner.svg")}
            />
          </a>
          <br />
          <BannerCopyButton />
          <br />
        </li>
        <small title="管理人の友人が所有するホームページへのリンクです ٩(๑òωó๑)۶">
          ◇ 相互リンク ◇
        </small>
        <li>
          <a title="CAT5のホームページ" href="https://www.nekonet.cyou">
            <img
              width="110"
              height="32.5"
              src={asset(
                'https://nekonet.cyou/assets/img/Links/CAT5%E3%83%90%E3%83%8A%E3%83%BC.png',
              )}
            />
          </a>
          <br />
        </li>
        <li>
          <a title="Pikutsuki Meteor" href="https://piyopuffin.github.io/meteor/" target="_blank" rel="noopener">
            <img
              src={asset("https://piyopuffin.github.io/meteor/banner.svg")}
              width="110"
              height="34.73"
              alt="Pikutsuki Meteor"
            />
          </a>
          <br />
        </li>
      </ul>
    </div>
  );
}
