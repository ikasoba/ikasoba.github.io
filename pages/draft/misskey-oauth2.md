---
layout: NormalPage.tsx
title: MisskeyのOAuth2.0認可について…お話します…
timestamp: 2023/12/01
---

# MisskeyのOAuth2.0認可について・・・お話します・・・

今回は[みすてむず いず みすきーしすてむず (4) Advent Calendar 2023](https://adventar.org/calendars/8652)の13日目への投稿となります。やったね。

MisskeyのOAuth2.0はIndieAuthを元に作られており、他の一般的な実装とはすこし異なります。

この記事ではそんなMisskeyのOAuth2.0について仕様を読みながら書いていきます。

## 普通のOAuth2.0と違うこと
- `client_id` が URL でなければならない
- クライアントの情報は microformats で記述しなければならない

以上の２つが一般的なものとは大きく異なるようです。

# 認可サーバーのメタデータ取得
misskeyには `/.well-known/oauth-authorization-server` というエンドポイントが実装されています。

これは、oauth2.0のエンドポイントや、スコープなどについての情報が得られるようです。

仕様は[RFC8414](https://tex2e.github.io/rfc-translater/html/rfc8414.html)で定義されているらしいです。

また、レスポンスは以下の形式で返されるようです。
```ts
{
  /**
   * 認可サーバーのURL
   */
  issuer: string;

  /**
   * 認可エンドポイント
   */
  authorization_endpoint: string;

  /**
   * トークンエンドポイント
   */
  token_endpoint: string;

  /**
   * サポートされてるスコープの一覧
   */
  scopes_supported: string[];

  /**
   * サポートされてる認可リクエストのレスポンスタイプの一覧
   *
   * 現時点では `code` のみ
   */
  response_types: string[];

  /**
   * サポートされてるトークンのgrantタイプの一覧
   *
   * 現時点では `authorization_code` のみ
   */
  grant_types_supported: string[];

  /**
   * ドキュメントへのリンク
   */
  service_documentation?: string;

  /**
   * PKCEのサポートされてる形式の一覧
   *
   * 現時点では `S256` のみ
   */
  code_challenge_methods_supported?: string[];
}
```

# クライアント

登録の必要はなく、代わりにクライアントのwebページを作成する必要があります。

そのwebページはクライアントのIDとしても使用されます。

クライアントの情報はmicroformatsの仕様に則って記述する必要があり、最小限の例は以下のようになります。
```html
<link rel="redirect_uri" href="./redirect" />
<div class="h-app">
  <a href="./" class="u-url p-name">
    クライアント名
  </a>
</div>
```

## で、これどうやって登録するの？？

その必要はありません！！！

しれっとクライアントのIDとしてこのページヘのURLを使いましょう。

# PKCEについて・・・お話します・・・

「PKCE」っていうのはね・・・

たとえば、認可コードを横取りされると・・・

気持ちが、良くないとか・・・

そういったことの対策として・・・「PKCE」というものがあるんだ・・・

## いつ役立つのか

- URI経由で認可レスポンスを受け取りたい場合(`my-app://`みたいな)
- クライアントがコンフィデンシャルでない場合

などに役立ちます。

また、スマホに限った話ではなく、WindowsやLinuxでもURI経由でソフトを呼び出せるためネイティブアプリなどで気をつける必要があるようです。

## 横取りの方法

認可レスポンスがサーバーから返される時に、不正なアプリケーションが`redirect_uri`で使用されているスキームに登録されていた場合に起こります。

当然、不正なアプリケーションに認可コードが含まれる認可レスポンスが渡ってしまうので横取りサれてしまうのです。

## <ruby>PKCE<rt>ピクシー</rt></ruby>３分クッキング

> misskeyでは`S256`のみ対応してるので`S256`の場合で説明します。

<p align="center">
～ <ruby>PKCE<rt>ピクシー</rt></ruby>３分クッキング ～
</p>

👩👵「「みなさんこんにちわ」」

👩「今回は、PKCEの`code_verifier`と`code_challenge`を生成していきます。」

👩「まず、`code_verifier`用のランダムな文字列を生成します。」

👵「これは毎度生成したほうが良いですね。」

👩「これを`sha-256`へハッシュドポテトにして`base64uri`の形式にエンコードしていきます。」

👵「だいたい、500Wで30秒くらいが目安ですね。」

<p align="center">
＼ ﾁｰﾝ ／
</p>

👩「この出来上がったものが`code_challenge`で使うものになります。」

👩「これらは認可サーバーとクライアントのみが知る秘密の文字列なので、悪意あるアプリケーションは認可コードを横取りをできたとしても`code_verifier`を検証する際に弾かれると言うことですね。」

👵「それではごきげんよう。」

## PKCEで認可リクエスト

認可リクエスト時には`code_challenge`と、その`code_challenge`がどのようにして生成されたのか認可サーバーに知らせるための`code_challenge_method`をパラメーターと一緒に渡します。

今回の例では`S256`の場合として説明しているので`code_challenge_method`の内容は`S256`としてください。

次に、認可コードをトークンに替えてもらう時の工程を説明します。

## PKCEでトークンリクエスト

`code_challenge`を検証するため`code_verifier`をトークンリクエストに含んで、認可サーバーへ送信します。

ここでようやく、PKCEの効果が発揮されます。

悪意あるアプリケーションは`code_verifier`がなんなのかわからず弾かれるという感じになります。

# 認可リクエスト

```
GET <authorization_endpoint>?<params>
```

認可リクエストエンドポイントは以下のクエリパラメーターを受け付けてるようです。
また、リクエストメソッドは`GET`を受け付けています。

アクセスするべき場所はメタデータの`authorization_endpoint`に書いてあるようです。

|名前                    |説明                             |任意         |
|------------------------|---------------------------------|-------------|
|`response_type`         |`code`のみ                       |いいえ       |
|`client_id`             |クライアントのURL                |いいえ       |
|`redirect_uri`          |リダイレクトURI                  |いいえ       |
|`state`                 |CSRF攻撃を防ぐためのパラメーター |はい         |
|`code_challenge`        |PKCEコードチャレンジ             |いいえ       |
|`code_challenge_method` |PKCEコードチャレンジの形式       |いいえ       |
|`scope`                 |要求するスコープ                 |いいえ       |

PKCEについては任意ではなく必ず使用しないといけないっぽいです。

認可レスポンスについては通常のOAuth2.0と違いはなさそうです。

## 成功レスポンス

レスポンスは認可リクエスト後、ユーザーが`redirect_uri`へリダイレクトされる形で返されます。

内容はクエリパラメータを介して渡されます。

|名前    |説明                                   |
|--------|---------------------------------------|
|`code`  | 生成された認可コード                  |
|`state` | リクエスト時に渡された `state` と同一 |
|`iss`   | 認可コードの発行者                    |

認可コードは、[トークンリクエスト](#トークンリクエスト)でトークンへ替える必要があります。

## 失敗レスポンス

|名前     |説明         |
|---------|-------------|
|`error`  |[エラーコード](https://openid-foundation-japan.github.io/rfc6749.ja.html#rfc.section.4.1.2.1) |
|`state`| リクエスト時に渡された `state` と同一 |

### `error` に渡されるエラーコードについて(一部)
- `invalid_request`

  リクエストに必須パラメーターなどが含まれてなかったりする場合などに返されます。

  HTTPの`400 Bad Request`のようなものです。

- `unsupported_response_type`

  認可サーバーがサポートしていない`response_type`を選択したときなどに返されます。

- `invalid_scope`

  スコープが変な時に返されます。

  これが返されたときには、スコープの名称に誤字脱字がないかチェックしてみましょう。

- `server_error`

  HTTPの`500 Internal Server Error`のようなもので、認可サーバー側でなんらかのエラーが起きた場合などに返されます。

他にもいろいろあるので、暇なときなどに仕様を読んでみましょう。

https://openid-foundation-japan.github.io/rfc6749.ja.html#rfc.section.4.1.2.1

# トークンリクエスト

```
POST <token_endpoint>
Content-Type: application/x-www-form-urlencoded
```

アクセスするべき場所はメタデータの`token_endpoint`に書いてあるようです。

トークンリクエストエンドポイントは以下のパラメーターを受け付けているようです。

また、リクエストメソッドは`POST`で受け付けており、パラメーターは`application/x-www-form-urlencoded`として送信する必要があります。

|名前            |説明                                          |
|----------------|----------------------------------------------|
|`grant_type`    |`authorization_code`のみ                      |
|`code`          |[成功レスポンス](#成功)で受け取った認可コード |
|`client_id`     |クライアントのID、[ここ](#クライアント)で用意したページのURLを渡してあげましょう |
|`redirect_uri`  |認可リクエストで使用した`redirect_uri`と同一である必要がある |
|`code_verifier` |認可リクエストで使用した`code_challenge`と対になる`code_verifier` |

## 成功レスポンス

以下の型に当てはまるJSONが返ってくるようです。

```ts
{
  // アクセストークン
  access_token: string;
  // スコープ
  scope: string;
  // 有効期限
  expires_in: number;
  // リフレッシュトークン
  refresh_token?: string;
}
```

## 失敗レスポンス

認可リクエストのものと同様です。

# 実際にリクエストを送信してみる

[コードの全体](https://gist.github.com/ikasoba/4cb175a79e7a329f1aff1bf20702abb4)

＊ JSランタイムにはdenoを使用する

base64uriのエンコーダーを適当に作る
```ts
import { nanoid } from "https://esm.sh/nanoid/";
import { encodeBase64 } from "https://deno.land/std/encoding/base64.ts";

const base64uri = (data: ArrayBuffer) =>
  encodeBase64(data)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
```

client_idなどを設定
```ts
const clientId = "https://ikasoba.github.io/misskey-oauth2-client-example";
const redirectUri =
  "https://ikasoba.github.io/misskey-oauth2-client-example/redirect";
```

code_challenge生成
```ts
const codeChallengeMethod = "S256";
const codeVerifier = nanoid();
const codeChallenge = base64uri(
  await crypto.subtle.digest("sha-256", new TextEncoder().encode(codeVerifier))
);
```

好きなインスタンスを設定して、メタデータを取る
```ts
const host = new URL("https://misskey.systems");

const meta = await fetch(
  new URL("/.well-known/oauth-authorization-server", host)
).then((res) => res.json());
```

認可リクエスト用のリンクを作る
```ts
const authRequest = new URL(meta.authorization_endpoint, host);
authRequest.searchParams.set("response_type", "code");
authRequest.searchParams.set("client_id", clientId);
authRequest.searchParams.set("redirect_uri", redirectUri);
authRequest.searchParams.set("code_challenge", codeChallenge);
authRequest.searchParams.set("code_challenge_method", codeChallengeMethod);
authRequest.searchParams.set("scope", "write:notes");
```

ブラウザでやってみる
```ts
console.log("ブラウザでリクエスト", authRequest.toString());
```

取得したcodeを標準入力から取る
```ts
const code = prompt("認可コードを入力")!;
```

トークンをリクエスト
```ts
const tokenResponse = await fetch(new URL(meta.token_endpoint, host), {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    client_id: clientId,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  }).toString(),
}).then((res) => res.json());

const token = tokenResponse.access_token;
```

投稿してみる
```ts
await fetch(new URL("/api/notes/create", host), {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text: "OAuth2.0 テスト",
  }),
});
```

# おわりに

こんな感じでmisskeyのoauth2.0認可について、indieoauthの仕様を調べながら紹介してみました。

以上、[いかそば](https://misskey.systems/@ikasoba)の記事でした。

12/14は[ゆんぽん](https://misskey.systems/@y_k_r4nk0)さんの[記事](https://adventar.org/calendars/8652#:~:text=%E3%82%86%E3%82%93%E3%81%BD%E3%82%93-,%E5%9E%8B%E5%BC%8F%E8%A9%A6%E9%A8%93%E3%81%A8%E3%82%B9%E3%83%AD%E3%83%83%E3%83%88%E3%81%AE%E6%AD%B4%E5%8F%B2,-12/15)です。楽しみですね。
