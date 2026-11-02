# Cloudflare Workers への移行

Issue #65 で GitHub Pages から Cloudflare Workers へ移行する。`hiro-to.moda` は Worker `hiro-to-moda` の Custom Domain として配信する。切り替え後の確認と切り戻しのため、安定するまで `workers_dev: true` も残す。Astro は adapter を追加せず、静的な `dist/` を配信する。

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

`CLOUDFLARE_API_TOKEN` が未登録なら、最初のステップで理由を表示して後続処理をスキップする。`CLOUDFLARE_ACCOUNT_ID` も必要。トークンは設定有無の確認と deploy ステップでのみ参照し、アカウント ID は deploy ステップだけに渡す。両 Secrets は登録済みで、マージ後の `main` push から `workers.dev` への実デプロイが動く。登録値そのものはリポジトリに保存しない。

手動実行（初期設定後）:

```sh
gh workflow run deploy-cloudflare.yaml --repo hengin-eer/hengin-eer.github.io --ref main
```

dispatch 時だけ `src/blogs` と `src/works` を remote の最新参照へ進め、変更があれば `github-actions[bot]` が `main` にコミットする。`contents: write` の `GITHUB_TOKEN` を使い、この push による workflow の二重起動を防ぐ。親リポジトリとサブモジュールは depth 1 で取得・更新する。push が競合した場合は `git fetch --depth=1 origin main` で最新 tip だけを取り直し、`git rebase --onto FETCH_HEAD HEAD^` で直前の bot コミット 1 件だけを移して一度だけ push を再試行する。浅い履歴の共通祖先を探さずに済み、通常の更新で全履歴を取得しない。同じサブモジュール参照への競合などで rebase できない場合や再度 push が拒否された場合は停止する。ブランチ保護を使う場合、この bot による push が許可されるか事前に確認する。

実行中のデプロイは中断せず、`deploy-production` グループで直列に処理する。checkout は `main` の最新状態を取得する。npm キャッシュに加え、`npm ci` 後に `node_modules/.astro` の画像キャッシュを復元する。lockfile が同じ過去のキャッシュを prefix で探し、成功した新しい実行では `github.run_id` を含むキーで保存する。同じ実行の再実行では既存キーが完全一致すると再保存しない。

既存の `.github/workflows/deploy.yaml` は GitHub Pages 用として残す。切り戻し先を保つため、Workers での配信が安定してから削除する。

## blogs / works からの dispatch

[workflow テンプレート](workflow-templates/dispatch-site-deploy.yaml) を各コンテンツリポジトリの `.github/workflows/dispatch-site-deploy.yaml` に配置する。この PR では配置も push も行わない。

fine-grained PAT は対象を `hengin-eer/hengin-eer.github.io` だけに絞り、Repository permissions の **Actions: write** を付ける。`SITE_DEPLOY_PAT` Secret は blogs / works の両リポジトリに登録済み。通常の `GITHUB_TOKEN` では別リポジトリの workflow を起動できない。本体側の workflow が `main` に存在してからテンプレートを配置・有効化する。

テンプレートは repository variable をトップレベルの `env` に受け取り、shell では引用した環境変数を使う。未設定または空の場合は以下の既定値を使う。

| Repository variable | 既定値 | 用途 |
| :-- | :-- | :-- |
| `SITE_REPOSITORY` | `hengin-eer/hengin-eer.github.io` | 起動先リポジトリ |
| `SITE_WORKFLOW` | `deploy-cloudflare.yaml` | 起動先 workflow ファイル |
| `SITE_REF` | `main` | 起動先 ref |

変更する場合は、各コンテンツリポジトリで変数を設定する。以下は blogs の例で、works は `--repo` を `hengin-eer/works` に置き換える。既定値のまま使う場合は設定不要。

```sh
gh variable set SITE_REPOSITORY --repo hengin-eer/blogs --body 'hengin-eer/hengin-eer.github.io'
gh variable set SITE_WORKFLOW --repo hengin-eer/blogs --body 'deploy-cloudflare.yaml'
gh variable set SITE_REF --repo hengin-eer/blogs --body 'main'
```

この PR では変数の設定や別リポジトリの workflow 配置・実行は行わない。

## apex の切り替え（Phase 3）

`wrangler.jsonc` の `routes` に `{ "pattern": "hiro-to.moda", "custom_domain": true }` を設定している。この変更が `main` に入ると、`deploy-cloudflare.yaml` の `wrangler deploy` が apex を Custom Domain として割り当てる。

切り替え前の apex には GitHub Pages 向けの proxied A レコードが 4 件ある（`185.199.108.153`〜`185.199.111.153`）。Wrangler は TTY がない CI では、競合する DNS レコードを確認なしで上書きする（`override_existing_dns_record`）。そのため、手動で A レコードを削除する必要はなく、削除から deploy までの空白時間も生じない。MX と TXT（SPF / DKIM）は Custom Domain の対象外で、変更しない。

API トークンには、Workers Scripts の編集権限に加えて、`hiro-to.moda` zone の Workers Routes の編集権限が必要。権限が足りない場合、Worker のアップロード後に Custom Domain の設定で失敗し、DNS は変わらない。

確認:

```sh
cf dns records list -z hiro-to.moda   # apex の A レコードが消え、MX / TXT が残っていること
curl -sI https://hiro-to.moda/ | grep -i -E '^(HTTP|server|cf-ray)'
curl -s -o /dev/null -w '%{http_code}\n' https://hiro-to.moda/not-found-check   # 404
curl -sI https://hiro-to.moda/blog | grep -i -E '^(HTTP|location)'             # 末尾スラッシュへの転送
```

ブラウザで、トップ・ブログ記事・Works・OGP 画像・フォント・404 ページを確認する。

切り戻し:

1. Cloudflare ダッシュボードの Workers & Pages → `hiro-to-moda` → Settings → Domains & Routes で `hiro-to.moda` を削除する。
2. apex に proxied A レコードを 4 件（`185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`）作り直す。
3. `wrangler.jsonc` の `routes` を外す変更を `main` に入れ、次の deploy で再び割り当てられないようにする。

GitHub Pages の設定と `deploy.yaml` は残してあるので、DNS を戻せば Pages の配信に戻る。

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

- blogs / works に dispatch workflow を配置する（`SITE_DEPLOY_PAT` は登録済み）。
- works 側の `timtim-tech.md` にある `worksLink: "https://hengin-eer.github.io/"` を公開ドメインへ更新する（コンテンツリポジトリでの別作業）。
- Phase 3: `www` の DNS と Redirect Rule の適用・確認。
- Phase 3: 配信が安定した後、`workers_dev: false` への変更、GitHub Pages の無効化、旧 workflow と `github-pages` environment の削除。
- Phase 4: PR プレビューと、adapter なし静的 Astro に対応した後の `cf` 移行。

切り替え時の実作業は Issue #65 の手順に従う。
