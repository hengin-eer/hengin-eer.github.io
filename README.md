# hengin-eer.github.io

Astro で構築した個人サイトです。依存関係のインストールには npm を使い、開発・品質確認・検証の入口は Make に統一しています。

## Setup

```sh
npm ci
npx playwright install chromium
```

Chromium は browser Storybook test と `make verify` に必要です。

## Commands

| Command | Action |
| :-- | :-- |
| `make dev` | Astro 開発サーバーを `localhost:4321` で起動する |
| `make storybook` | Storybook を `localhost:6006` で起動する |
| `make build` | Astro の production build を作成する |
| `make test-stories` | Astro portable Story tests を実行する |
| `make test-storybook` | Chromium の Storybook/a11y tests を実行する |
| `make format` | 対象コードを整形する |
| `make check-format` | 整形差分を検出する |
| `make lint` | Oxlint を実行する |
| `make check-astro` | `astro check` を実行する |
| `make quality` | format check、lint、Astro diagnostics を実行する |
| `make verify` | quality と全 build/test/smoke check を実行する |

`make dev` と `make storybook` は独立したサーバーです。比較が必要な場合だけ別々の terminal で起動してください。

## Formatting and linting

Oxfmt は TypeScript、TSX、JavaScript、CSS、JSON、YAML、設定ファイルを整形し、Prettier と `prettier-plugin-astro` は `.astro` を整形します。Markdown、生成物、lockfile、コンテンツ用サブモジュールは整形対象外です。

Oxlint は JavaScript/TypeScript と `.astro` の `<script>` 部分を検査します。Astro template 自体の lint は行わず、型・構文診断は `make check-astro` に委ねます。

## Neovim

Neovim 0.10+ では、project-local config を有効化してこのリポジトリを trust すると、対象ファイルを保存するたびに整形されます。

```vim
set exrc
```

初回は Neovim の trust prompt で `.nvim.lua` を確認・承認してください。設定は `npm ci` 後の `node_modules/.bin/oxfmt` と `prettier` を使い、`.astro` は Prettier、それ以外の対象拡張子は Oxfmt へ渡します。

Storybook の制約と Story の規約は [docs/storybook-astro-spike.md](docs/storybook-astro-spike.md) に記載しています。
