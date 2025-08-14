---
title: "部屋グラム"
ruby: "Heyagram"
summary: "Heyagramはお部屋のお掃除をサポートするSNSです。お部屋の掃除を記録し、他のユーザーと共有することで、掃除のモチベーションを高めることを目的としています。"
thumbnail: "./heyagram/thumbnail.png"
worksLink: "https://heya-gram.vercel.app/"
githubLink: "https://github.com/QwerTayu/heya-gram"
worksCategory: ["Webアプリ", "ハッカソン"]
termFrom: 2023-09
termTo: 2023-10
isPickup: false
techCategory: ["Next.js", "Tailwind CSS", "Firebase", "NextAuth.js", "Recoil", "PWA", "Web Push API"]
---
## 概要
2023年10月9日に開催された技育CAMPハッカソン@大阪にて発表したプロダクトです。
チーム「薩摩納豆」として開発を行い、お部屋の掃除をサポートするSNSアプリを制作しました。

Heyagramは、お部屋の掃除を習慣化したい人々を対象とした、Instagram風のSNSプラットフォームです。
従来の掃除アプリとは異なり、__掃除の記録を他のユーザーと共有することで、モチベーションの維持と向上を図る__ ことを目的としています。

発表スライド👉 [Heyagram Presentation \- Google スライド](https://docs.google.com/presentation/d/1NgDnh75AsJ1gcwud1DQwOGwahaxg9ulGqU5rCNoCtxc/edit?usp=sharing)

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr"><a href="https://twitter.com/hashtag/%E6%8A%80%E8%82%B2CAMP%E3%82%AD%E3%83%A3%E3%83%A9%E3%83%90%E3%83%B3?src=hash&amp;ref_src=twsrc%5Etfw">#技育CAMPキャラバン</a> @大阪<a href="https://twitter.com/hashtag/%E3%83%8F%E3%83%83%E3%82%AB%E3%82%BD%E3%83%B3?src=hash&amp;ref_src=twsrc%5Etfw">#ハッカソン</a><br><br>/／<br>📣 実況中継〜〜🍁<br>\＼<br><br>チーム名：薩摩納豆<br>作品名：Heyagram <a href="https://t.co/pk9kpdrzxp">pic.twitter.com/pk9kpdrzxp</a></p>&mdash; 【公式】技育プロジェクト | サポーターズ (@geek_pjt) <a href="https://twitter.com/geek_pjt/status/1711271316987494831?ref_src=twsrc%5Etfw">October 9, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### できること
主要な機能として以下があります：
- **投稿機能**: お部屋の掃除前後の写真とコメントを投稿
- **いいね・フォロー機能**: 他のユーザーの投稿にいいねし、フォローして交流
- **ユーザープロフィール**: 自分の掃除履歴と成果を一覧表示
- **検索機能**: 他のユーザーを検索してフォロー
- **PWA対応**: スマートフォンにアプリとしてインストール可能

### ターゲット
__掃除を習慣化したいが、一人では続かない人__ をメインターゲットとしています。
- 掃除のモチベーションが続かない人
- 一人暮らしで掃除の成果を共有したい人
- 他の人の掃除方法やアイデアを参考にしたい人
- SNSを通じて新しい習慣を身につけたい人

特に、__「見られている」という意識により掃除への取り組みが促進される__ 効果を狙っています。
また、他のユーザーのきれいなお部屋を見ることで、__掃除へのインスピレーションを得られる__ プラットフォームとしても機能します。

### 技術的特徴
モダンなWebアプリケーションとして以下の技術を採用：
- **Next.js**: React.jsフレームワークによる高速なWebアプリ
- **PWA**: ネイティブアプリのような使用感をWebで実現
- **Firebase**: リアルタイムデータベースと画像ストレージ
- **NextAuth.js**: セキュアなソーシャルログイン機能
- **Tailwind CSS**: 効率的なスタイリングとレスポンシブデザイン

### 感じた課題
本格的にFirestoreデータベースを使用したアプリケーション開発が初めてだったため、データ構造の設計やリアルタイム更新の実装に苦労しました。
その中でもとりわけデータの構造の把握に苦しみ、使用したいデータを直感的に利用できず命名規則の限界を感じました。

そのため、プログラムを書く前に、どのようなデータをどのように保存するかをしっかりと設計することの重要性を学びました。
**また、データ構造の理解の助けと保守性の観点から、TypeScriptを使用することの重要性も再認識しました**。
このVanilla JavaScriptでの開発経験から、以降のプロジェクトではTypeScriptを積極的に採用するようになりました。

## 取り組み
### プロジェクト立ち上げとPWA実装
2023年9月30日にプロジェクトを開始し、まずNext.jsプロジェクトのセットアップを行いました。早期の段階でPWA（Progressive Web App）対応を実装し、アプリとしてインストール可能な機能を実現しました。これにより、お部屋の掃除を記録するSNSとして、より身近で使いやすいアプリケーションを目指しました。

### モダンなフロントエンド開発の実践
UI構築にはTailwind CSSを採用し、コンポーネントベースの設計を重視しました。ナビゲーションバーやポストコンポーネントなど、再利用可能なUIコンポーネントを作成し、一貫性のあるデザインシステムを構築しました。

### データベース設計とFirebase活用
お部屋の投稿データやユーザー情報を管理するためにFirebase（Firestore）を採用しました。リアルタイムデータベースとして投稿の保存・取得機能を実装し、画像アップロード機能も含めて包括的なデータ管理システムを構築しました。

### 認証システムの実装
NextAuth.jsを活用してGoogleとTwitterによるソーシャルログイン機能を実装しました。Firebase Authenticationと連携させることで、セキュアで使いやすい認証システムを構築しました。また、ログイン状態の管理にはRecoilを使用し、グローバルステートとして効率的に管理しました。

### SNS機能の充実
インスタグラム風のSNS機能として以下を実装しました：
- **投稿機能**: 画像とテキストでお部屋の状況を投稿
- **いいね機能**: 投稿に対するいいね機能とリアルタイム集計
- **フォロー機能**: ユーザー同士のフォロー・フォロワー機能
- **ユーザープロフィール**: 各ユーザーの投稿一覧とプロフィール表示
- **検索機能**: ユーザー検索機能

### レスポンシブデザインとUX改善
モバイルファーストなアプローチでレスポンシブデザインを実装しました。特にログインページやナビゲーション、投稿表示において、スマートフォンでの使いやすさを重視したUI/UX設計を行いました。

### チーム開発とGitHub運用
ハッカソンという短期間での開発において、効率的なチーム開発を実現するためにGitHubのIssue・Pull Requestテンプレート、GitHub Projectsを活用しました。機能ごとにブランチを切り、適切なコードレビューを通してコード品質の維持に努めました。
