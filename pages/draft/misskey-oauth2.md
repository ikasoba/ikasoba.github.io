---
layout: NormalPage.tsx
title: MisskeyのOAuth2.0認可について…お話します…
---

# MisskeyのOAuth2.0認可について・・・お話します・・・

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

# PKCEについて・・・お話します・・・

「PKCE」っていうのはね・・・

たとえば、認可コードを横取りされると・・・

気持ちが、良くないとか・・・

そういったことの対策として・・・「PKCE」というものがあるんだ・・・

## いつ役立つのか

- URI経由で認可レスポンスを受け取りたい場合(`my-app://`みたいな)
- クライアントがコンフィデンシャルでない場合

に役立ちます。

また、スマホに限った話ではなく、WindowsやLinuxでもURI経由でソフトを呼び出せるためネイティブアプリなどで気をつける必要がある

## 横取りの方法

認可レスポンスがサーバーから返される時に、不正なアプリケーションが`redirect_uri`で使用されているスキームに登録されていた場合に起こります。

当然、不正なアプリケーションに認可コードが含まれる認可レスポンスが渡ってしまうので横取りサれてしまうのです。

## PKCEの使い方

misskeyでは`S256`のみ対応してるので`S256`の場合で説明します。

まず`code_verifier`用の適当な文字列を生成します。(毎度生成したほうが良い)

これを`sha-256`でハッシュ化して`base64uri`の形式にエンコードします。

そして、そのエンコードされたものが`code_challenge`で使うものです。

これらは認可サーバーとクライアントのみが知る秘密の文字列なので、悪意あるアプリケーションは超能力を使わない限り、横取りをできたとしても認可サーバーから拒否されるのです。

## 認可リクエスト

認可リクエスト時には`code_challenge`と、その`code_challenge`がどのようにして生成されたのか認可サーバーに知らせるための`code_challenge_method`をパラメーターと一緒に渡します。

今回の例では`S256`の場合として説明しているので`code_challenge_method`の内容は`S256`としてください。

次に、認可コードをトークンに替えてもらう時の工程を説明します。

## トークンリクエスト

`code_challenge`を検証するため、`code_verifier`を認可サーバーへ送信します。

ここでようやく、PKCEの効果が発揮されます。

もし、悪意あるアプリケーションが来た場合、そいつは最初に送信された`code_verifier`の内容を知る由もないので認可サーバーから拒否されることになるのです。

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

## レスポンス

レスポンスは認可リクエスト後、ユーザーが`redirect_uri`へリダイレクトされる形で返されます。

内容はクエリパラメータを介して渡されます。

### 成功

|名前    |説明                                   |
|--------|---------------------------------------|
|`code`  | 生成された認可コード                  |
|`state` | リクエスト時に渡された `state` と同一 |
|`iss`   | 認可コードの発行者                    |

認可コードは、[トークンリクエスト](#トークンリクエスト)でトークンへ替える必要があります。

### 失敗

|名前     |説明         |
|---------|-------------|
|`error`  |[エラーコード](https://openid-foundation-japan.github.io/rfc6749.ja.html#rfc.section.4.1.2.1) |
|`state`| リクエスト時に渡された `state` と同一 |

#### `error` に渡されるエラーコードについて(一部)
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

トークンリクエストエンドポイントは以下のパラメーターを受け付けているようです。

また、リクエストメソッドは`POST`で受け付けており、パラメーターは`application/x-www-form-urlencoded`として送信する必要があります。

|名前            |説明                                          |
|----------------|----------------------------------------------|
|`grant_type`    |`authorization_code`のみ                      |
|`code`          |[成功レスポンス](#成功)で受け取った認可コード |
|`client_id`     |クライアントのID、[ここ](#クライアント)で用意したページのURLを渡してあげましょう |
|`redirect_uri`  |認可リクエストで使用した`redirect_uri`と同一である必要がある |
|`code_verifier` |