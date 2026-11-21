---
layout: NormalPage.tsx
title: 近況と今年
---

<script>
(() => {
  if (Date.now() < new Date("2026-12-13 00:00:00+90:00").getTime()) {
    const script = document.currentScript;

    script.parentNode?.replaceChild(document.createTextNode("まだだよー"), script);
  }
})();
</script>

この記事は [ねこねっとアドベント '00 ミレニアム Advent Calendar 2026](https://adventar.org/calendars/12736) への投稿となります。<br />
やったね。

# 近況と今年

前日のたかしに続いて、まいど、いかそばでございます。

12/13 、おそらくクリスマスな季節なんだろうと思いますが 11/21 からじっくりと書き始めています。<br />
2026 の終盤、10 月以降から振り返ると今年はいつもの一年のようで、また変化のある年と思いました。

脆弱性の見つかる速度が上がったようにも、愛用のソフトウェアの開発が終了しまったり

[あずき][Azuki] 氏からのお誘いから、再び VRChat をやるようになり、[Udon][vrc-udon] を触ったりと新しいおもちゃを手に入れたり

OS を [Fedora Kinoite][fedora-kinoite] から [Nix OS][nixos] に変えて、開発環境を弄りやすくなり、気軽にツールや言語を試せる楽しい環境を手に入れたり

・・・そういった変化があったなと、[うんち][poop] をしながら思い至った次第であります。

いつのまにか空飛ぶ車ができてたり、AI はとうに人間より賢いモデルも生まれたり、仮想現実は当たり前になっていたり、<br />
すでに我々は未来の世界にいるように思います。

さて、そんな変化もありつつ僕の生活はいつもと変わらず、好きにプログラムを書いて遊んでいました。<br />
せっかくなので、今年に作ったソフトとかを紹介していきましょう。

- [github.com/ikasoba/miat-proxy](https://github.com/ikasoba/miat-proxy)

  AI のハーネスを Misskey クライアントに変身させる Open AI の Chat Completion API 互換サーバー

  チャットボックスから Misskey へ投稿し、その返信を LLM の返答に見せかけるという代物で人間にハーネスで指示を出すというギャグができます。

- [github.com/ikasoba/pipewire-scripts](https://github.com/ikasoba/pipewire-scripts)

  [Pipewire][pipewire] で仮想ループバックデバイスを生やすための CLI フロントエンド

  `pw-loopback` では細かくデバイスの設定を書くことになるので、名前を指定するだけで生やすことができるようにするラッパーとなっています。

  これで Linux でもボイスチェンジャーを利用する際にループバックデバイスを生やすのが面倒という問題を軽減できました。

- [github.com/ikasoba/computercraft-codes](https://github.com/ikasoba/computercraft-codes)

  Minecraft を Lua でいろいろできる Mod の Computer Craft 向けのスクリプト一式

  簡単なファイルのアーカイバーや自己展開ファイルを作るためのツール、モジュール読み込み、一部は放ったらかしで未完成なまま放置しています。

- [github.com/ikasoba/emoji-template](https://github.com/ikasoba/emoji-template)

  絵文字を作る際にいつもコピペしていたプロジェクトを Github のテンプレートにしたもの

  [Nix flakes][nix-flakes] で必要なツールを揃える devShell を記述しているのですぐに作業へ取りかかれます。

- [github.com/ikasoba/blobazuki](https://github.com/ikasoba/blobazuki)

  emoji-template をもとに [あずき][Azuki] 氏の絵文字を一匹つくってみたもの

  つくったきっかけとしては VRChat 内で僕が身につけているバッジを物珍しそうに見てくれるので友好の印として。

- [github.com/aiscript-dev/tree-sitter-aiscript](https://github.com/aiscript-dev/tree-sitter-aiscript)

  AiScript へ [Tree Sitter][tree-sitter] での文法定義を寄贈したもの

  以前作成した AiScript の言語サーバーのパーサーをリファクタする目的で作成しました。<br />
  JavaScript で木構造を取りやすくするヘルパーもついているので構文解析をしたい場合に使えるかもしれません。

[Azuki]: https://www.youtube.com/@azuki774
[fedora-kinoite]: https://fedoraproject.org/atomic-desktops/kinoite/download/
[nixos]: https://nixos.org/
[poop]: https://ja.wikipedia.org/wiki/%E7%B3%9E
[vrc-udon]: https://creators.vrchat.com/worlds/udon/
[tree-sitter]: https://tree-sitter.github.io/tree-sitter/
[nix-flakes]: https://nix.dev/concepts/flakes.html
[pipewire]: https://www.pipewire.org/

## 驚いたこと

思いつきで YouTube にアップロードした動画が 4000 回再生、これだけ異様に動画が再生されているのはとてもびっくりしました。

<div style="display: flex; justify-content: center;">
  <iframe width="512" height="256" src="https://www.youtube.com/embed/FR8XMCPcXDY?autoplay=0&mute=1&controls=0" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## 2027 年の抱負

今年は比較的活動は穏やか、これといって書ける内容は薄かったので来年の抱負でも考えてみましょうか。

やはり体力の少なさによって、趣味の活動もあまり精力的に続かないので体力をつけることが一番の目標になりそうです。

うーん、ち<sup>[[1]][poop]</sup> まちまやっていくことにします・・・。

## おわりに

あまり語れる内容はなかったものの、ここまで読んでくださりありがとうございました。<br />
また来年も、お世話になった方々も見知らぬ方々もごきげんよう。

またこんど！
