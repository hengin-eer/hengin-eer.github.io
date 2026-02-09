---
cover: "./no-cover.png"
title: "Tailwind CSS v4 移行ガイド：JS設定ファイルからCSS-first構成へ"
author: timdaik
updatedAt: "2026-02-09"
tag: ["Tech"]
draft: true
---

## TL;DR

- Tailwind CSS v4 では設定方法が **JavaScript（`tailwind.config.js`）から CSS（`@theme`）**に移行した
- `@config` での JS ファイル参照はまだ使えるが、今後廃止予定
- `@theme` ディレクティブで **カラー・フォント・ブレークポイント** などをすべてCSS内で定義できる
- カスタム CSS は必ず **適切な `@layer`** に配置する必要がある

## はじめに

Tailwind CSS v4 は、v3 からのメジャーアップデートで設計思想に大きな変化があった。最も目立つ変更は **CSS-first configuration**、つまり設定を JavaScript ファイルからCSS内で完結させるアプローチへの転換だ。

この記事では、実際に自分のポートフォリオサイト（Astro製）を v3 → v4 に移行した際の変更点をまとめる。

## 1. パッケージの変更

### v3

```json
{
  "dependencies": {
    "tailwindcss": "^3.x",
    "@astrojs/tailwind": "^x.x"
  }
}
```

### v4

```json
{
  "dependencies": {
    "tailwindcss": "^4.x",
    "@tailwindcss/vite": "^4.x"
  }
}
```

v4 では Astro 公式の Tailwind インテグレーション（`@astrojs/tailwind`）の代わりに、**Vite プラグイン**（`@tailwindcss/vite`）を直接使う形になった。

```js
// astro.config.mjs
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

## 2. CSSエントリーポイントの変更

### v3

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### v4

```css
@import "tailwindcss";
```

たった1行になった。`@import "tailwindcss"` が内部で CSS Cascade Layers（`@layer theme, base, components, utilities`）を確立し、すべてのユーティリティを提供する。

## 3. `tailwind.config.js` → `@theme`

### v3: JavaScript で設定

```js
// tailwind.config.mjs
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      "primary-green": "#18ef95",
      "primary-blue": "#13aed0",
      white: "#ffffff",
      black: "#000000",
      // ...
    },
  },
  plugins: [],
};
```

### v4: CSS で設定

```css
@import "tailwindcss";

@theme {
  --color-*: initial;  /* デフォルトカラーをクリア */
  --color-primary-green: #18ef95;
  --color-primary-blue: #13aed0;
  --color-white: #ffffff;
  --color-black: #000000;

  --font-shippori: "Shippori Antique B1";
  --font-comfortaa: "Comfortaa Variable";
  --font-averia: "Averia Serif Libre";
}
```

`@theme` ディレクティブ内で **CSS カスタムプロパティ** の形式で定義する。命名規則は以下の通り：

| 設定項目         | v3 の書き方                     | v4 の書き方             |
| ---------------- | ------------------------------- | ----------------------- |
| カラー           | `theme.colors["primary-green"]` | `--color-primary-green` |
| フォント         | `theme.fontFamily.sans`         | `--font-sans`           |
| ブレークポイント | `theme.screens.md`              | `--breakpoint-md`       |
| スペーシング     | `theme.spacing[4]`              | `--spacing` (自動計算)  |

### ポイント：`--color-*: initial` の意味

v4 にはデフォルトで大量のカラー（`red-500`, `blue-300` など）が組み込まれている。`--color-*: initial` を指定すると、**デフォルトカラーをすべてクリア**して自分が定義したカラーだけにできる。使わないカラーのCSSが生成されないので、バンドルサイズの削減にもなる。

## 4. カスタムユーティリティクラスの定義

### v3

```css
.font-shippori {
  font-family: "Shippori Antique B1";
}
```

### v4

`@theme` でフォントを定義すれば、`font-shippori` クラスが**自動生成**される：

```css
@theme {
  --font-shippori: "Shippori Antique B1";
}
```

```html
<!-- 自動的に使える -->
<h1 class="font-shippori">見出し</h1>
```

手動でユーティリティクラスを書く必要がなくなった。

## 5. カスタムCSSと `@layer` の関係（最重要）

v4 で最もハマりやすいのがこの点。**別記事（[CSS Cascade Layers の落とし穴](/blog/tailwindcss-v4-css-cascade-layers-trap)）**で詳しく解説しているが、ここでも概要を示す。

### NG パターン

```css
@import "tailwindcss";

/* レイヤー外 → 全ユーティリティを上書きしてしまう！ */
* {
  padding: 0;
  margin: 0;
}

html {
  font-family: "Zen Kaku Gothic New";
}
```

### OK パターン

```css
@import "tailwindcss";

@layer base {
  * {
    padding: 0;
    margin: 0;
  }
  html {
    font-family: "Zen Kaku Gothic New";
  }
}
```

CSS Cascade Layers の仕様上、レイヤー外のスタイルはすべてのレイヤーに優先する。そのため、**`@import "tailwindcss"` と同じファイル内のカスタムCSSは必ず `@layer` 内に配置する**必要がある。

## 6. `content` の指定が不要に

v3 では `tailwind.config.js` の `content` フィールドで、Tailwind がスキャンすべきファイルを明示的に指定する必要があった：

```js
content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
```

v4 では、**ソースファイルの自動検出**が行われる。Vite プラグイン経由で使用している場合、モジュールグラフからクラス名を自動的に収集するため、`content` の設定は基本的に不要になった。

## 7. 移行手順のまとめ

1. **パッケージ更新**: `tailwindcss` v4 + `@tailwindcss/vite` をインストール
2. **Astro 設定変更**: `@astrojs/tailwind` → Vite プラグインに切り替え
3. **CSS エントリーポイント**: `@tailwind base/components/utilities` → `@import "tailwindcss"`
4. **設定の CSS 化**: `tailwind.config.js` のテーマ設定を `@theme` に移植
5. **カスタム CSS の修正**: レイヤー外のCSS を `@layer base` に移動
6. **`@config` 参照の削除**: JS 設定ファイルが不要なら削除
7. **ビルド確認**: 各ページの見た目を確認

## 8. 公式アップグレードツール

Tailwind CSS は公式のアップグレードツールを提供している：

```bash
npx @tailwindcss/upgrade
```

これを実行すると、多くの変更を自動的に処理してくれるが、**カスタムCSSの `@layer` 配置は自動では行われない**ケースがある。特に `*` セレクタや `html`/`body` へのスタイリングはレイヤー外に残りがちなので、手動で確認が必要。

## おわりに

Tailwind CSS v4 の CSS-first approach は、JavaScript 設定ファイルの管理が不要になり、**CSS の世界だけで完結する**という点で開発体験が向上した。一方で、CSS Cascade Layers への理解が必要になるため、移行時には「今まで動いていたCSS」が突然壊れるケースがある。

特に `* { padding: 0; }` のような**誰もが書くリセットCSS**が最大の破壊者になるという点は、知らないとデバッグに相当な時間を費やすことになるだろう。この記事が移行のお役に立てば幸いです。

## 参考リンク

- [Tailwind CSS v4.0 ドキュメント](https://tailwindcss.com/docs)
- [Tailwind CSS v4 アップグレードガイド](https://tailwindcss.com/docs/upgrade-guide)
- [MDN: CSS Cascade Layers](https://developer.mozilla.org/ja/docs/Web/CSS/@layer)
