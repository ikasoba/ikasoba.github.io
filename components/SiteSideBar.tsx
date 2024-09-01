import { asset } from "dejamu/comptime.ts";
import { BannerCopyButton } from "./BannerCopyButton.islands.tsx";

export default function SiteSideBar() {
  return (
    <div className="sidebar">
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
          <a href="https://github.com/ikasoba/ikasoba.github.io/issues/new?labels=&projects=&template=%E7%9B%B8%E4%BA%92%E3%83%AA%E3%83%B3%E3%82%AF%E3%83%90%E3%83%8A%E3%83%BC.md&title=Link+Request%3A+%E7%9B%B8%E4%BA%92%E3%83%AA%E3%83%B3%E3%82%AF%E3%83%90%E3%83%8A%E3%83%BC%E3%81%AE%E7%94%B3%E8%BE%BC%E3%81%BF">
            <small>相互リンク募集中</small>
          </a>
          <br />
        </li>
      </ul>
    </div>
  );
}
