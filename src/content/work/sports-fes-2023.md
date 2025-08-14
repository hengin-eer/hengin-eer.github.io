---
title: "スポーツ大会2023"
ruby: "Sports Festival 2023"
summary: "2023年度の学内のスポーツ大会のために制作したホームページです。運営情報やトーナメント情報を学生向けにリアルタイムで配信します。"
thumbnail: "./sports-fes-2023/thumbnail.png"
worksLink: "https://sports2023.nitacwpl.tech/"
githubLink: "https://github.com/NITACwpl/sports-fes-2023"
worksCategory: ["ホームページ", "Web製作研究部"]
termFrom: 2023-10
termTo: 2023-11
isPickup: true
techCategory: ["Astro", "Google Apps Script", "Google Spreadsheet API", "GitHub", "Figma"]
---
## 概要
2023.11月に開発を行っていたサイトです。
運営情報やトーナメント情報を学生向けにリアルタイムで配信できるようにしました。

以下にライトな開発の振り返りを書いてます。
[スポーツ大会のHP製作を振り返ってみて｜timdaik](https://sizu.me/tim_daik/posts/5x0mneu5codr)

### 技術
- Astro: コンポーネントを細かく分けてタスク分担した
- GAS: Spreadsheetでのデータを整理し、APIとして配信
- Google Spreadsheet API: CMSとして運用。運営情報や各種目のトーナメント情報を管理・配信した

## 取り組み
デジタルトーナメントの実装を担当しました。CMSから配信するデータ構造から考え、トーナメント情報をSVG画像に反映する作業を行いました。
また、全体ではGitを使った初めてのチーム開発だったので、タスク分担しやすくコンポーネントの分け方を工夫しました。ほとんどのメンバーのコードレビューも対応しました。
