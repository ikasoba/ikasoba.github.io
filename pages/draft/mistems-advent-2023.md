---
layout: NormalPage.tsx
title: "フロントエンドフレームワークを自作してみた話 #みすてむずアドカレ"
timestamp: 2023/12/01
---

# フロントエンドフレームワークを自作してみた話

どうも、いかそば([@ikasoba](https://misskey.systems/@ikasoba))です。

今回は[みすてむず いず みすきーしすてむず (2) Advent Calendar 2023](https://adventar.org/calendars/8601)の5日目への投稿となります。やったね。

フロントエンドフレームワークというものを自作してみたので、そのお話をやっていきます。

＊筆者は説明が下手なので、この記事はだいぶ分かりづらいかもしれないです、

## 成果物のリポジトリ

https://github.com/ikasoba/ofuro-js

# きっかけ

作ったきっかけは楽しそうだったからです。

実はもともと投稿を考えてたものは、JSのコードを変態糞土方のコピペで難読化するものですが、<br/>
汚いものをこういう場に持ってくるのはやめようと思ったのでこちらを投稿することにしました。

# JSXについて

得られた知見としてJSXのことを書いていきます。
`react-jsx` でコンパイルされるものとして書いていきます。

## 大体こんな感じ

TypeScriptでは、JSXに対しても型付けができます。

JSX用のコードが `<oackage>/jsx-runtime` としてインポートできことが第１条件です。

```ts
// JSXというモジュールからJSXの型付けが行われる
export declare module JSX {
  // この型を元に属性の型付けが行われる、typeでも可
  interface IntrinsicElements {
    [name: string]: ...
  }

  // この型がJSXで生成されたノードの型となる
  type Element = ...

  // この型がクラスコンポーネントの元になる
  interface ElementClass {
    ...
  }

  // この型で指定されてるキー名がクラスコンポーネントの属性の型の指定に使われる
  // キーに対する値の型がどんなものでも `コンポーネント#<キー名>` の型が参照される
  interface ElementAttributesProperty {
    props: {};
  }

  // この型で指定されてるキー名がコンポーネントのchildrenの型の指定に使われる
  // キーに対する値の型がどんなものでも `属性#<キー名>` の型が参照される
  // コンパイル後の `jsx` への引数のキー名はchildrenから置換されないので注意
  interface ElementChildrenAttribute {
    children: {};
  }
}

export const jsx = ...;
export const jsxs = ...;
```

## `ElementAttributesProperty` について

この型で指定されてるキー名がクラスコンポーネントの属性の型の指定に使われます。
キーに対する値の型がどんなものでも `コンポーネント[<キー名>]` の型が参照されるのが特徴です。

ややこしいと思うので実践形式で補足していきます。

```ts
interface ElementAttributesProperty {
  piyo: {};
}
```

と定義した場合

```tsx
class Hoge {
  piyo!: {
    fuga: string;
  }

  /** 例なので適当に */
  render() {
    return (
      <div>
        { this.piyo.fuga }
      </div>
    );
  }
}
```

`ElementAttributesProperty`で指定したキーと、Hogeのpiyoプロパティが対応しているので、
上のようなの定義をします。

```ts
<Hoge fuga="..." />
```
このコードで割り当てられてるコンポーネントのpropsがpiyoに代入されます。

また、`ElementAttributesProperty` で指定したキーへの値の割当は `jsx` 関数などで実装しておく必要があります。

## `ElementChildrenAttribute` について

`JSX.ElementChildrenAttribute` を定義せずにコンポーネントを書いてみましょう。

```tsx
function Hoge(props: { children: string }) {
  return (
    <div>
      {props.children}
    </div>
  )
}
```

このコンポーネント、実は使おうとすると型エラーが出ます。

```tsx
<Hoge>
  {"ﾋﾟｷﾞﾓﾝｺﾞ"}
</Hoge>
```

こういったコードで、以下のエラーが出てしまいます。

```text
Property 'children' is missing in type '{}' but required in type '{ children: string; }'.
```

なんと、このエラーでは `children` が型上では引数に渡ってないように見えますね。

そこで `JSX.ElementChildrenAttribute` を定義してあげる必要があります。

```ts
export module JSX {
  interface ElementChildrenAttribute {
    /** コンポーネントのchildrenはchildrenという名前の属性に渡すよう指定される */
    children: {};
  }
}
```

この定義があると型エラーは出なくなります。

すこし変なところもあり、`ElementChildrenAttribute`で指定した属性の名前が`children`以外だった場合でも
```tsx
<Hoge>
  {"ﾋﾟｷﾞﾓﾝｺﾞ"}
</Hoge>
```

というコードは、以下のようにトランスパイルされてしまいます。
```js
jsx(Hoge, {
  children: "ﾋﾟｷﾞﾓﾝｺﾞ"
})
```

# JSXファクトリ

JSXの構文は `jsx`関数と `jsxs`関数の呼び出しとしてトランスパイルされます。

## `jsx`関数

`jsx`関数(以下 `jsx`)は、以下のような型になります。

(簡略化のため、propsの型は省略します。)
```ts
function jsx(type: string | Component, props: ..., key?: any): JSX.Element;
```

`children`は、以下のように`props`を介して一つの要素が渡されます。

```ts
jsx(..., {
  children: ...
})
```

## `jsxs`関数

`jsxs`関数(以下 `jsxs`)は、以下のような型になります。

(説明を簡単にするために一部の型は省略します。)
```ts
function jsxs(type: string | Component, props: ..., key?: any): JSX.Element;
```

`children`は、以下のように`props`を介して複数の要素からなる配列が渡されます。
```ts
jsxs(..., {
  children: [...]
})
```

## `jsxDEV`関数
これは、デバッグ向けのファクトリでviteなどのバンドラーから読み込まれます。

`jsxDEV`関数(以下 `jsxDEV`)は、以下のような型になります。

(説明を簡単にするために一部の型は省略します。)
```ts
function jsxDEV(type: string | Component, props: ..., key?: any, source: ..., self: any): JSX.Element;
```

### 引数 `source`

これは以下のような型の値が渡されるようです。
```ts
{
  fileName: string;
  lineNumber: number;
  columnNumber: number;
}
```

---

実装する上でJSXの型付けについて上記のような知識が得られました。

次は実装したフックの解説に移ります。


# 実装した主なフック

今回自作したフロントエンドフレームワークでは、以下のフックを実装しました。

## signal

状態を保持するためのフックの一つです。
Stateに比べて実装が楽そうだと判断したので今回はこちらを実装しました。

Signalの値が変更された時に呼び出されるイベントハンドラーと、その値を持っています。

```tsx
function Counter() {
  const count = signal(0);

  return (
    <button onClick={() => count.value++}>
      count: {count}
    </button>
  );
}
```

## useEffect

コンポーネント内で生成されたSignalを保持しておくことで依存しているフックの収集を自動で行えるようにしました。

## computed

参照しているSignalが変更された時にDOMへ変更を反映させるフックです。

一度、計算してから参照されたSignalを保持しておくことで自動で依存しているSignalを保持するようにしました。

```tsx
function Counter() {
  const count = signal(0);

  return (
    <button onClick={() => count.value++}>
      count: {computed(() => count.value * 2)}
    </button>
  );
}
```

# サーバーサイドレンダリング

サーバーサイドレンダリングをするために `deno_dom` を使用しました。

これらは、内部で使用しているdom apiを`render`内で`deno_dom`へ置き換えることで実現しました。

```tsx
import { signal, computed } from "ofuro-js/mod.ts";
import { render } from "ofuro-js/server.ts";

function Counter() {
  const count = signal(0);

  return (
    <button onClick={() => count.value++}>
      count: {computed(() => count.value)}
    </button>
  );
}

console.log(
  render(() => <Counter/>)
);
```

# さいごに

今回はなんとなく、フロントエンドフレームワークを自作するのに役に立ちそうな情報をまとめてみました。

12/13も記事を出すので良ければそちらも御覧ください！

以上、[いかそば](https://misskey.systems/@ikasoba)の記事でした。

12/6の記事は[みのかわ](https://misskey.systems/@minokavva)さんの[記事](https://adventar.org/calendars/8601#:~:text=ECHONET%20Lite%E3%81%A8Grafana%E3%81%A7%E9%81%8A%E3%82%93%E3%81%A0%E8%A9%B1%E3%82%92%E6%9B%B8%E3%81%8D%E3%81%BE%E3%81%99)です。楽しみですね。

最後に、リポジトリにstarをくださったsanaoさんに感謝申し上げます。
