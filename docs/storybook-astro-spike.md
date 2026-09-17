# Storybook Astro Compatibility Spike

Issue #56 で、プロフィールページの反復実装に `storybook-astro` を採用できるか 2026-09-16 に検証した記録です。

## 結論

判定は **B: 条件付き採用** です。

Astro コンポーネント、React、p5 を同じ Storybook で表示し、portable test、Chromium 上の story test、static build、HMR まで動作しました。プロフィールページのコンポーネント調整ループに利用できます。ただし、下記の制約を運用ルールとして維持する必要があります。

- `storybook-astro` 1.12.0 の内部 SSR server はプロジェクトの `vite.optimizeDeps` を継承しません。`astro.config.mjs` の `preserveOptimizeDeps` plugin を外すと、Story と無関係な OGP utility と native addon を dependency scan し、static build 内で `UnhandledRejection` が発生します。
- Astro static story は Controls の変更を再 SSR しません。表示したい状態は named story として定義します。
- `astro-iconify` 1.2.0 は type-only の `Props` を runtime import するため、addon-vitest の browser transform では import できません。該当 Story は browser project から除外し、portable SSR test と静的 Storybook の Chromium smoke check で描画を検証します。
- addon-vitest はテスト成功後も内部 Vite server の file handle を保持し、Node.js 24 では終了まで10秒待ちます。終了コードは 0 です。
- 既存の `primary-green` / `primary-blue` 見出しは白背景で WCAG の色コントラストを満たしません。該当 Story の a11y は `todo` とし、新規 fixture は `error` のまま維持します。

## 検証バージョン

| 対象                         | Version |
| ---------------------------- | ------- |
| Node.js（local）             | 24.15.0 |
| Astro                        | 5.16.6  |
| Vite                         | 6.4.1   |
| React                        | 19.2.4  |
| Storybook                    | 10.6.0  |
| `@storybook-astro/framework` | 1.12.0  |
| Vitest                       | 4.1.11  |
| Playwright                   | 1.60.0  |
| p5                           | 2.3.3   |

Storybook CI は Node.js 24 LTS を使用します。既存のデプロイ workflow の Node.js 設定は別管理です。

## Compatibility matrix

| 検証項目                | 結果                 | 根拠・補足                                                                                                              |
| ----------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Astro props             | Pass                 | `ProfileBadge` の文字列 props と `SectionHeading` の boolean props を portable test で確認                              |
| default slot            | Pass                 | `SectionHeading` の `args.slots.default` を named story と portable test で確認                                         |
| scoped CSS              | Pass                 | `Hero` の mask style を dev / static build でコンパイル                                                                 |
| Tailwind CSS v4         | Pass                 | `global.css` を preview から読み、既存 utility と theme token を適用                                                    |
| Fontsource              | Pass                 | preview import と static output の font asset 出力を確認                                                                |
| `astro:assets`          | Pass with warning    | `Hero` を portable SSR / static build で描画。既存の `public/hero.jpg` import は browser test で Vite warning が出る    |
| tsconfig alias          | Pass                 | `@components/*` と `src/*` を `viteFinal` で明示し、`Hero` で確認                                                       |
| Astro Icon              | Conditional          | portable SSR / static Chromium smoke は Pass。addon-vitest browser import は `astro-iconify` 1.2.0 の runtime type import で失敗 |
| nested Astro components | Pass                 | `Hero` → `ProfileBadge` / `ContactButton` を portable SSR / static build で確認                                         |
| React story             | Pass                 | `OceanScene.stories.tsx` を React renderer と Chromium で実行                                                           |
| Astro + React island    | Pass                 | `OceanIsland.astro` の `client:load` と static island chunk 出力を確認                                                  |
| p5 Canvas               | Pass                 | dynamic import、canvas 生成、props による描画更新、ResizeObserver、`remove()` cleanup を Chromium の lifecycle story で確認 |
| HMR                     | Pass                 | 開いた iframe が story args の更新を再読み込み操作なしで反映                                                            |
| Storybook static build  | Pass with workaround | `preserveOptimizeDeps` plugin 適用後、エラーなしで完了                                                                  |
| a11y smoke              | Conditional          | 新規 Ocean / integration stories は Pass。既存 heading の色コントラストは `todo`                                        |
| Existing Astro build    | Pass                 | `npm run build` が成功                                                                                                  |

## Performance notes

- warm cache の dev 起動は manager 192 ms / preview 4.23 s、実ブラウザでの初回 Story 表示は約 2.25 s でした。
- static build は約 20.94 s、`storybook-static` は 39 MiB でした。大部分は Storybook 本体と Fontsource の日本語 subset です。
- p5 は dynamic chunk に分離され、約 1.16 MiB（build 出力上の gzip 約 341 KiB）でした。プロフィール本体へ組み込む際も dynamic import を維持し、Intersection Observer、`prefers-reduced-motion`、画質段階を追加して初期表示から分離します。
- Chromium の canvas 生成は通常数秒以内ですが、並列テスト時の負荷競合で 5 秒待ちが一度失敗したため、CI は直列実行・10 秒上限にしています。production 実装では低性能端末の frame time と memory を別途計測します。

## 日常の開発ループ

1. Astro を基本に小さな component と named story を作る。
2. client state、Canvas、p5 lifecycle が必要な部分だけ React island にする。
3. `npm run storybook` で props、slot、viewport、a11y を調整する。
4. `make test-stories` で Astro SSR の回帰を確認する。
5. `make test-storybook` で React / island / interaction / a11y を Chromium で確認する。
6. PR 更新前に `make verify` でサイト build、両テスト、Storybook build、除外した Astro Icon Story の Chromium smoke check を通す。

`make test` は 2 テストを順番に実行します。一度は並列実行が通りましたが、再実行時に Canvas の 5 秒待ちが負荷競合でタイムアウトしたため、CI の標準経路には採用していません。局所的な修正中は個別 target を使えますが、CI は `make verify` で両方を実行し、部分テストのみで成功とは扱いません。Storybook build は既知の「内部 `UnhandledRejection` を出しても終了コード 0」問題に備え、Makefile でログも検査します。`astro-iconify` のため addon-vitest から除外した Story は、build 後に Chromium で表示と画像読み込みを検査します。色コントラストなどの a11y 判定まで補完するものではありません。

## 設定ファイルの役割

- `.storybook/main.ts`: Story ファイルの探索、addon、Astro/React integration、静的 build モード、Vite のパス alias と dependency optimization を設定します。`stories` の glob はファイル名に、`resolve.alias` は `@components` などの import に対応します。React は唯一の JSX renderer なので、fixture 限定の `include` は付けません。
- `.storybook/preview.ts`: 各 Story の iframe に共通する font・CSS と表示パラメーターを設定します。`layout` は配置、`controls.expanded` は props 表示、`docs.codePanel` はコード表示、`a11y.test` は違反時の扱い、`backgrounds.options` は浅瀬・深海などの背景選択肢です。
- `.storybook/vitest.setup.ts`: Node で行う portable SSR test に browser 相当の DOM を `happy-dom` で用意し、preview の annotations をテストへ適用します。Node 24 の `navigator` は setter のない getter なので、`Object.defineProperty` で差し替えます。Chromium test にはこの代用 DOM は使いません。

## Story の規約

- Astro Story の slot は `args.slots.default` で渡します。
- Astro static mode で確認したい props の組み合わせは named story にします。
- React Story には `parameters.renderer = "react"` を設定します。
- React island は Storybook 用 Astro shell でも確認し、React 単体 Story と二重に検証します。
- p5 は component mount 後に dynamic import し、unmount 時に `instance.remove()` を呼びます。
- animation story の play test は canvas 生成を `waitFor` し、固定 seed と明示 props で再現可能にします。
- a11y の新規違反は `error` のまま直します。既存違反を `todo` にする場合は Story と本ドキュメントに理由を残します。

## 再現コマンド

```sh
npm ci
npx playwright install chromium
make verify
```

## Security audit

導入時に Vitest 4.1.9 の browser provider に critical advisory が確認されたため、互換範囲内の 4.1.11 に更新しました。更新後の `npm audit` は main と同じ 37件（critical 3 / high 18 / moderate 5 / low 11）で、今回の追加による件数増加はありません。

既存 critical は Astro 5 系、`form-data`、`tar` の依存鎖です。Astro 7 への major upgrade や `astro-iconify` の置換を含むため、この Spike には混ぜず別 Issue で扱います。

## OSS contribution candidates

`storybook-astro` は採用可能ですが、次の upstream 改善余地があります。

1. internal SSR server にユーザーの `vite.optimizeDeps` を継承するか、専用の Vite hook を提供する。
2. static build 内の `UnhandledRejection` を成功終了として扱わず、build を失敗させる。
3. addon-vitest 終了時に内部 Vite server の file handle を確実に close する。
4. browser test が Astro component の server-only frontmatter dependency を import しない経路を整える。

まず再現リポジトリまたは failing test を小さく切り出し、upstream Issue で期待仕様を確認してから PR に進むのがよいです。
