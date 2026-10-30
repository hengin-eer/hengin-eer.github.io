# Cloudflare Workers への移行

Issue #65 の Phase 1 と Phase 2 のリポジトリ内の準備を行う。公開サイトは引き続き GitHub Pages で配信する。`wrangler.jsonc` にはカスタムドメインを設定せず、`workers_dev: true` にしてある。Astro は adapter を追加せず、静的な `dist/` を配信する。

## ローカルの確認

```sh
npm ci
npx playwright install chromium
make verify
make deploy-dry-run
```

`make deploy-dry-run` は Astro の build と Wrangler の dry run を実行する。Cloudflare の認証は不要で、リソースも変更しない。認証設定後の `make deploy` は build してアップロードする。`npm run deploy` は build 済みの `dist/` を使う。

## デプロイ workflow

`.github/workflows/deploy-cloudflare.yaml` は `main` への push と `workflow_dispatch` を受け付ける。`docs/**`、ルートの `*.md`、`.storybook/**`、`**/*.stories.*` だけの push は対象外。PR では実行しない。品質確認は既存の Quality / Storybook CI が担当する。

`CLOUDFLARE_API_TOKEN` が未登録なら、最初のステップで理由を表示して後続処理をスキップする。設定後は `CLOUDFLARE_ACCOUNT_ID` も必要。トークンは設定有無の確認と deploy ステップでのみ参照し、アカウント ID は deploy ステップだけに渡す。Secrets の作成・登録はこの変更には含めない。

手動実行（初期設定後）:

```sh
gh workflow run deploy-cloudflare.yaml --repo hengin-eer/hengin-eer.github.io --ref main
```

dispatch 時だけ `src/blogs` と `src/works` を remote の最新参照へ進め、変更があれば `github-actions[bot]` が `main` にコミットする。`contents: write` の `GITHUB_TOKEN` を使い、この push による workflow の二重起動を防ぐ。親リポジトリとサブモジュールは depth 1 で取得・更新する。push が競合した場合は `git fetch --depth=1 origin main` で最新 tip だけを取り直し、`git rebase --onto FETCH_HEAD HEAD^` で直前の bot コミット 1 件だけを移して一度だけ push を再試行する。浅い履歴の共通祖先を探さずに済み、通常の更新で全履歴を取得しない。同じサブモジュール参照への競合などで rebase できない場合や再度 push が拒否された場合は停止する。ブランチ保護を使う場合、この bot による push が許可されるか事前に確認する。

実行中のデプロイは中断せず、`deploy-production` グループで直列に処理する。checkout は `main` の最新状態を取得する。npm キャッシュに加え、`npm ci` 後に `node_modules/.astro` の画像キャッシュを復元する。

既存の `.github/workflows/deploy.yaml` は GitHub Pages 用として残す。Cloudflare 側を確認し、Phase 3 の切り替えが終わるまで削除しない。

## blogs / works からの dispatch

[workflow テンプレート](workflow-templates/dispatch-site-deploy.yaml) を各コンテンツリポジトリの `.github/workflows/dispatch-site-deploy.yaml` に配置する。この PR では配置も push も行わない。

fine-grained PAT は対象を `hengin-eer/hengin-eer.github.io` だけに絞り、Repository permissions の **Actions: write** を付ける。各コンテンツリポジトリに `SITE_DEPLOY_PAT` Secret として登録する。通常の `GITHUB_TOKEN` では別リポジトリの workflow を起動できない。PAT の作成と Secret 登録は別作業とする。本体側の workflow が `main` に存在し、Cloudflare Secrets を設定してから有効化する。

## www → apex の Redirect Rule（Phase 3 で適用）

[www-to-apex.json](cloudflare/www-to-apex.json) は `http_request_dynamic_redirect` の zone ruleset 定義。`www.hiro-to.moda` のリクエストを HTTPS の apex へ 301 で転送し、パスとクエリを保持する。Worker のカスタムドメインには `www` を追加しない。

適用には対象 zone の Dynamic URL Redirects の編集権限が必要。DNS 設定には別途 DNS の編集権限を使い、`www` の proxied `AAAA 100::` レコードを用意する。この PR ではルールと DNS を変更しない。

`cf` の beta 版では CLI の形式が変わり得る。以下は `cf@1.0.0-beta.26` 用で、古いグローバル `cf` は使わない。必要な Node.js バージョンは利用する CLI の `engines` に合わせる。実行前にルール一覧を確認し、同じ phase の ruleset が存在しない場合だけ作成する。

```sh
npx --yes --package=cf@1.0.0-beta.26 cf rulesets list --zone "$CLOUDFLARE_ZONE_ID"
# 実行前に --dry-run を付けてリクエストを確認する。
npx --yes --package=cf@1.0.0-beta.26 cf rulesets create --zone "$CLOUDFLARE_ZONE_ID" --body @docs/cloudflare/www-to-apex.json --dry-run
# Phase 3 の適用時のみ実行する。
npx --yes --package=cf@1.0.0-beta.26 cf rulesets create --zone "$CLOUDFLARE_ZONE_ID" --body @docs/cloudflare/www-to-apex.json
```

同じ phase の ruleset がある場合は、既存ルールを保持して `www_to_apex` を追加・更新する。定義全体で上書きすると他の Redirect Rules が消えるため、既存 ruleset を取得して差分を確認する。適用後は `curl -I 'https://www.hiro-to.moda/blog/?source=www'` で 301 と `Location: https://hiro-to.moda/blog/?source=www` を確認する。

JSON のフィールドは [Cloudflare の Single Redirects API](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-api/) に準拠する。

## 残作業

- Cloudflare API トークンと GitHub Secrets の作成・登録。
- blogs / works 用 PAT と dispatch workflow の配置。
- works 側の `timtim-tech.md` にある `worksLink: "https://hengin-eer.github.io/"` を公開ドメインへ更新する（コンテンツリポジトリでの別作業）。
- `workers.dev` へ初回デプロイし、表示・404・末尾スラッシュ・OGP 画像・フォントを確認。
- Phase 3: GitHub Pages 向け A レコードの削除、apex のカスタムドメイン設定、配信確認後の `workers_dev: false` への変更。
- Phase 3: `www` の DNS と Redirect Rule の適用・確認。
- Phase 3: GitHub Pages の無効化、旧 workflow と `github-pages` environment の削除。
- Phase 4: PR プレビューと、adapter なし静的 Astro に対応した後の `cf` 移行。

切り替え時の実作業は Issue #65 の手順に従う。
