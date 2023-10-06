export default function SiteSideBar() {
  return (
    <div className="sidebar">
      ― めにゅ～ ―
      <ul className="sidebar-menu">
        <li>
          <a href={`${projectRoot}/`}>★トップ★</a>
        </li>
      </ul>

      ― リンク集 ―
      <ul className="sidebar-menu">
        <li>
          <a href="https://github.com/ikasoba">★ｷﾞｯﾄﾊﾌﾞ★</a>
        </li>
        <li>
          <a href="https://twitter.com/ikasoba000">★ﾂｲｯﾀｰ★</a>
        </li>
      </ul>
    </div>
  );
}
