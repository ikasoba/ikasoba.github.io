const bannerText = '<a title="いかそばの部屋" href="https://ikasoba.net">' +
  "<img" +
  ' width="110"' +
  ' height="40"' +
  ' src="https://ikasoba.net/static/banner.svg"' +
  "/>" +
  "</a>";

export function BannerCopyButton() {
  const copyBanner = async () => {
    if (!confirm("クリップボードにサイトバナーのHTMLをコピーしますか？")) {
      return;
    }

    await navigator.clipboard.writeText(bannerText);

    alert("コピーしました！");
  };

  return (
    <button onClick={copyBanner}>
      バナーをコピー
    </button>
  );
}
