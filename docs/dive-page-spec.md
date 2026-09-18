# DIVE Page Spec

Issue: [#55](https://github.com/hengin-eer/hengin-eer.github.io/issues/55)

## 目的

`/dive` は、Hiroki Tomoda / `timdaik` の関心と制作の航路を、海へ潜る体験としてたどるストーリーページである。プロフィールの詳細版ではなく、作品や文章の背景にある「何に惹かれ、どうつくるか」を伝える。

主な読者は採用担当者、知人・イベントで会った人、Works / Blog から訪れた人を想定する。短い自己紹介と SNS は `/profile` のデジタル名刺に集約し、そのページ下部の控えめな DIVE 導線から、このページへ進める。

## 採用デザイン: Ocean Descent

通常の縦スクロールを「海へ潜る」体験として使う。上部は `primary-green` と `primary-blue` を使った浅瀬、下部ほど藍色から深海色へ移行する。

- 写実的な背景画像には依存せず、CSS の深度別グラデーションと Canvas の控えめな気泡・水流で成立させる
- 情報量より余白、細い線、低密度の泡・水面表現を優先する
- 右側の固定深度メーターは PC のみで表示し、アンカー移動もできる
- モバイルはセクションラベルだけを残し、メーターを表示しない
- Footer は既存コンポーネントを維持し、海底への統合は後続の視覚調整として扱う
- 魚影・サメ・クジラ・海底イラスト、特別なカーソルは初回公開後の拡張とする

### 深度と情報

| 深度             | セクション  | 内容                                        |
| ---------------- | ----------- | ------------------------------------------- |
| 0m / Surface     | Opening     | 名前、ハンドル、短い導入、Works 導線        |
| 10m / Shallow    | Origins     | 何を学び、何をつくるか                      |
| 50m / Open water | Route       | 関心と制作の変遷                            |
| 120m / Deep      | Principles  | 制作姿勢を3つの短い文で表す                 |
| 300m / Abyss     | Connections | GitHub / X / Instagram と Works / Blog 導線 |

### カラートークン

| Token                  | Value     | 用途                         |
| ---------------------- | --------- | ---------------------------- |
| `primary-green`        | `#18EF95` | 浅瀬の光、主要操作、現在位置 |
| `primary-blue`         | `#13AED0` | 浅瀬から中層への基準色       |
| `ocean-mid`            | `#167AA6` | 中層の遷移色                 |
| `ocean-deep`           | `#12365F` | 深い区間                     |
| `ocean-indigo`         | `#0C294A` | Links手前の藍色              |
| `ocean-abyss`          | `#071A2D` | 最深部・Footer               |
| `ocean-bioluminescent` | `#7AF7D0` | 深海のリンク・発光アクセント |

## 実装アーキテクチャ

コンテンツとレイアウトは Astro、状態と描画は必要な箇所だけ React island とする。

- `src/pages/dive/index.astro`: ページ構成とメタデータ
- `src/components/dive/*.astro`: Opening / Origins / Route / Principles / Connections
- `src/components/dive/DiveExperience.tsx`: スクロール量から深度を計算し、メーターを更新
- `src/components/dive/DiveBackdrop.tsx`: p5 を dynamic import して、DIVE 本文内に気泡と水流だけを描画
- `src/data/dive.ts`: 公開情報と深度定義
- 各 Astro コンポーネントの scoped style: セクション固有の配色と静的 CSS fallback

p5 は最初の HTML をブロックせず、React island の mount 後に読み込む。Canvas と深度メーターは DIVE 本文の表示中だけ有効にし、Header と Footer には重ならない。p5 2.3.x の package entry が Vite で CJS 依存を解決できないため、`astro.config.mjs` の Vite plugin で libtess 内包済み ESM build を解決する。Canvas が使えない場合でも CSS の背景と全コンテンツが読めることを要件とする。

`prefers-reduced-motion: reduce` では p5 の loop を止め、CSS transition と smooth scroll を無効化する。

## Storybook 運用

`storybook-astro` で Astro セクションを named story として確認し、Canvas は React story で確認する。短い `/profile` の名刺コンポーネントも `Profile/ProfileCard` として独立して確認する。

1. Astro コンポーネントを小さく更新する
2. `make storybook` で余白、配色、a11y、viewport を確認する
3. `make test-stories` と `make test-storybook` を実行する
4. PR 前に `make verify` を実行する

初回実装の Story は `Dive/*` に置く。Canvas は shallow / abyss の named story を持ち、canvas生成を browser test で確認する。

## コンテンツポリシー

初回公開では確認済みの公開情報だけを使う。プロフィール本文・経歴・外部リンクの最終文言は公開前レビューで確定する。

- 公開済み: Hiroki Tomoda / `timdaik`、GitHub、X、Instagram、Works、Blog
- 現在の Route は年号を置かず、関心の流れとして表現する
- 未確定: 詳細な職歴・学歴・年号、技術サービスの追加リンク、連絡先、装飾用の生物・海底アセット

## 受け入れ基準

- Canvas が読み込めなくても、浅瀬から深海への変化と全コンテンツが読める
- PC ではスクロール量と深度メーターが対応し、キーボードでもアンカー移動できる
- モバイルに横スクロールがなく、深度メーターを省略しても各章が分かる
- `prefers-reduced-motion` で描画を停止できる
- Works、Blog、GitHub、SNS の導線がある
- Header から `/profile` に到達でき、`/profile` 下部のアイコン導線から `/dive` に到達できる
- `make verify` が成功する
