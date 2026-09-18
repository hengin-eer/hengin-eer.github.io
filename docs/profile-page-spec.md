# Profile Page Spec

Issue: [#55](https://github.com/hengin-eer/hengin-eer.github.io/issues/55)

## 目的

`/profile` は、Hiroki Tomoda / `timdaik` の人となり、関心、制作への姿勢を簡潔に伝え、Works、Blog、GitHub、SNS への次の行動を用意する詳細プロフィールページである。

主な読者は採用担当者、知人・イベントで会った人、Works / Blog から訪れた人を想定する。トップページでは要約と導線だけを担い、詳細はこのページへ集約する。

## 採用デザイン: Ocean Descent

通常の縦スクロールを「海へ潜る」体験として使う。上部は `primary-green` と `primary-blue` を使った浅瀬、下部ほど藍色から深海色へ移行する。

- 写実的な背景画像には依存せず、CSS と Canvas の抽象表現で成立させる
- 情報量より余白、細い線、低密度の泡・水面表現を優先する
- 右側の固定深度メーターは PC のみで表示し、アンカー移動もできる
- モバイルはセクションラベルだけを残し、メーターを表示しない
- Footer は海底の延長として `ocean-abyss` に統合する
- 魚影・サメ・クジラ・海底イラスト、特別なカーソルは初回公開後の拡張とする

### 深度と情報

| 深度             | セクション | 内容                                        |
| ---------------- | ---------- | ------------------------------------------- |
| 0m / Surface     | Hero       | 名前、ハンドル、短い自己紹介、Works導線     |
| 10m / Shallow    | About      | 何を学び、何をつくるか                      |
| 50m / Open water | Timeline   | 関心と制作の変遷                            |
| 120m / Deep      | Values     | 制作姿勢を3つの短い文で表す                 |
| 300m / Abyss     | Links      | GitHub / X / Instagram と Works / Blog 導線 |

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

- `src/pages/profile/index.astro`: ページ構成とメタデータ
- `src/components/profile/*.astro`: Hero / About / Timeline / Values / Links
- `src/components/profile/OceanExperience.tsx`: スクロール量から深度を計算し、メーターを更新
- `src/components/profile/OceanBackdrop.tsx`: p5 を dynamic import して、波と粒子を描画
- `src/data/profile.ts`: 公開情報と深度定義
- `src/styles/profile-ocean.css`: 深度に応じた静的 CSS fallback

p5 は最初の HTML をブロックせず、React island の mount 後に読み込む。p5 2.3.x の package entry が Vite で CJS 依存を解決できないため、`astro.config.mjs` の Vite plugin で libtess 内包済み ESM build を解決する。Canvas が使えない場合でも CSS の背景と全コンテンツが読めることを要件とする。

`prefers-reduced-motion: reduce` では p5 の loop を止め、CSS transition と smooth scroll を無効化する。

## Storybook 運用

`storybook-astro` で Astro セクションを named story として確認し、Canvas は React story で確認する。

1. Astro コンポーネントを小さく更新する
2. `make storybook` で余白、配色、a11y、viewport を確認する
3. `make test-stories` と `make test-storybook` を実行する
4. PR 前に `make verify` を実行する

初回実装の Story は `Profile/*` に置く。Canvas は shallow / abyss の named story を持ち、canvas生成を browser test で確認する。

## コンテンツポリシー

初回公開では確認済みの公開情報だけを使う。プロフィール本文・経歴・外部リンクの最終文言は公開前レビューで確定する。

- 公開済み: Hiroki Tomoda / `timdaik`、GitHub、X、Instagram、Works、Blog
- 現在の Timeline は年号を置かず、関心の流れとして表現する
- 未確定: 詳細な職歴・学歴・年号、技術サービスの追加リンク、連絡先、装飾用の生物・海底アセット

## 受け入れ基準

- Canvas が読み込めなくても、浅瀬から深海への変化と全コンテンツが読める
- PC ではスクロール量と深度メーターが対応し、キーボードでもアンカー移動できる
- モバイルに横スクロールがなく、深度メーターを省略しても各章が分かる
- `prefers-reduced-motion` で描画を停止できる
- Works、Blog、GitHub、SNS の導線がある
- `make verify` が成功する
