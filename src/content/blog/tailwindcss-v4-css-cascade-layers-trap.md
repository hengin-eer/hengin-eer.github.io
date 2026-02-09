---
cover: "./no-cover.png"
title: "Tailwind CSS v4で「* { padding: 0; }」が全ユーティリティを破壊する理由 ── CSS Cascade Layersの落とし穴"
author: timdaik
updatedAt: "2026-02-09"
tag: ["Tech"]
draft: true
---

## TL;DR

- Tailwind CSS v4 は内部で **CSS Cascade Layers**（`@layer`）を使用している
- CSS の仕様上、**レイヤー外（unlayered）のスタイルは、どんなレイヤー内のスタイルよりも優先される**
- そのため、レイヤー外に書いた `* { padding: 0; margin: 0; }` が、`px-5` や `mx-auto` など**すべてのTailwindユーティリティを上書き**してしまう
- 解決策：カスタムリセットCSSを `@layer base { ... }` の中に移動する

## はじめに

Tailwind CSS を v3 から v4 にアップグレードしたら、**サイトのレイアウトが大崩れ**した。padding も margin も効かない、flexbox の配置もおかしい、レスポンシブも死んでいる。何が起きたのか。

犯人は、Webフロント開発者なら**誰もが書いたことがある**であろう、このたった3行だった。

```css
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
```

え、これ？　**よくあるリセットCSS**じゃん。なんでこれが問題になるの？

## CSS Cascade Layers とは

CSS Cascade Layers は、2022年に全主要ブラウザで使えるようになった比較的新しいCSS仕様だ。`@layer` ディレクティブを使って、CSSの**カスケード（優先順位）を明示的に制御**できる。

```css
@layer base, components, utilities;

@layer base {
  h1 { font-size: 2rem; }
}

@layer utilities {
  .text-xl { font-size: 1.25rem; }
}
```

レイヤーは宣言順に優先度が上がる。上の例では `utilities` が `base` より後に宣言されているため、`utilities` 内のスタイルが `base` 内のスタイルに勝つ。Tailwind CSS はまさにこの仕組みを利用して `base < components < utilities` という優先順位を実現している。

## 落とし穴：レイヤー外のCSSは「最強」

CSS Cascade Layers には**重要なルール**がある。

> **レイヤーに属さない（unlayered）スタイルは、すべてのレイヤー内のスタイルよりも優先される。**

[MDN: @layer - CSS Cascade Layers](https://developer.mozilla.org/ja/docs/Web/CSS/@layer)

つまり、こういう構造になる：

```
優先度（低 → 高）:
  @layer base        ← Tailwindのリセット・プリフライト
  @layer components   ← コンポーネントスタイル
  @layer utilities    ← px-5, mx-auto, flex など
  (レイヤー外)         ← ★ここが最強 ★
```

レイヤー外のCSSが最も強い。**詳細度に関係なく。**

## 何が起きていたのか

v3 → v4 アップグレード前後の `global.css` を比較してみよう。

### v3 時代（正常に動いていた）

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
```

v3 では `@tailwind` ディレクティブはビルド時に**普通のCSS**として展開される。レイヤーは使われない。そのため、通常のCSSカスケード（詳細度 + ソース順序）に従い、ユーティリティクラスは具体的なセレクタなので `*` に勝つ。

### v4 にアップグレード後（壊れた）

```css
@import "tailwindcss";

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
```

`@import "tailwindcss"` は内部で以下のようなレイヤー構造を確立する：

```css
@layer theme, base, components, utilities;
```

つまり、`px-5` → `padding: 1.25rem` は `@layer utilities` の**中**に入る。一方、`* { padding: 0; }` はどのレイヤーにも属さない **unlayered スタイル**。

CSS の仕様により：

```
unlayered の * { padding: 0; }  >  @layer utilities の .px-5 { padding: 1.25rem; }
```

**`*` の詳細度はたったの `(0,0,0)` なのに、レイヤー外というだけで `.px-5`（詳細度 `(0,1,0)`）に勝ってしまう。**

これが「余白が消えた」「レスポンシブが効かない」「サイズがおかしい」の正体だった。

## 解決策

カスタムリセットCSSを `@layer base` の中に移動するだけ。

```css
@import "tailwindcss";

@layer base {
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
}
```

こうすれば `@layer base` < `@layer utilities` の関係により、ユーティリティクラスが正しくリセットを上書きできる。

ちなみに、Tailwind CSS v4 には**デフォルトでプリフライト**（Preflight）が含まれており、`box-sizing: border-box` や margin のリセットが組み込まれている。そのため、このカスタムリセット自体が不要になるケースも多い。

## なぜ面白いのか

この問題が興味深いのは、**「正しいCSS」が「新しいCSS」と衝突した**という点だ。

- `* { margin: 0; padding: 0; }` は何年も前からWebフロントの**ベストプラクティス**とされてきた
- CSS Cascade Layers は**カスケードの制御を改善するため**に導入された
- しかし、レイヤー外のCSSが最強になるという仕様が、まさに**常識的なリセットCSS**を最大の破壊者に変えてしまった

いわば、**「いつもの書き方」が「新しい仕組み」の中でアンチパターンになった**という、技術進化あるあるの一例かもしれない。

## 教訓

1. **Tailwind v4 にアップグレードする際は、`@import "tailwindcss"` と同じファイルにあるレイヤー外のCSSをすべて確認する**
2. **カスタムCSS は適切な `@layer` 内に配置する**（`base`、`components`、`utilities` のいずれか）
3. **CSS Cascade Layers を理解する**。v4 に限らず、今後のCSSフレームワークはレイヤーを積極的に使う流れになっている

## 参考リンク

- [Tailwind CSS v4.0 ドキュメント](https://tailwindcss.com/docs)
- [MDN: CSS Cascade Layers](https://developer.mozilla.org/ja/docs/Web/CSS/@layer)
- [CSS Cascading and Inheritance Level 5 仕様](https://www.w3.org/TR/css-cascade-5/#layering)
