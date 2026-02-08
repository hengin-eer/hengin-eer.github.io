---
title: "寮生もぐもぐチェッカー"
ruby: "Ryosei Mogu Mogu Checker"
summary: "寮食の欠食申請を簡単に行えるスマホアプリ。直感的なカレンダービューで欠食管理ができます。"
thumbnail: "./cancel-meals-check/thumbnail.png"
# worksLink: ""
githubLink: "https://github.com/hengin-eer/cancel-meals-check"
worksCategory: ["モバイルアプリ", "ハッカソン"]
termFrom: 2023-04
termTo: 2023-04
isPickup: false
techCategory: ["Flutter", "Firebase", "Firestore", "GitHub", "Marp"]
---
## 概要
2023年4月29日に開催された技育CAMPハッカソン@京都 にて発表したプロダクトです。
初めてのハッカソンでした。

今までHTML/CSS/JSやReactなどWeb技術に触れてきたものの、アプリ開発の経験はなかったのでちょうど気になっていたFlutterを使ってモバイルアプリ開発に挑戦してみました。

結果は受賞は遠く、当初予定していた完成度の半分にも満たず、開発体験はかなり悪く、周りのレベルに圧倒されて、と初回にしてハッカソンの洗礼を受けました。

ただし思ったよりうまくいかなかった開発経験から、もう少し事細かに見積もりを行う重要性や、タスクの取捨選択、初めてのそこそこの規模での技術的な発表と、貴重な経験ができて非常に勉強になりました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr"><a href="https://twitter.com/hashtag/%E6%8A%80%E8%82%B2CAMP%E3%82%AD%E3%83%A3%E3%83%A9%E3%83%90%E3%83%B3?src=hash&amp;ref_src=twsrc%5Etfw">#技育CAMPキャラバン</a> @京都<br> <a href="https://twitter.com/hashtag/%E3%83%8F%E3%83%83%E3%82%AB%E3%82%BD%E3%83%B3?src=hash&amp;ref_src=twsrc%5Etfw">#ハッカソン</a><br><br>全コンテンツが無事に終了しました。<br>最後はみんなで集合写真📸<br><br>30チーム80人と7社のメンターが一つになった瞬間。<br><br>本当にお疲れ様でした‼️‼️ <a href="https://t.co/HluiuePmsh">pic.twitter.com/HluiuePmsh</a></p>&mdash; 【公式】技育プロジェクト | サポーターズ (@geek_pjt) <a href="https://twitter.com/geek_pjt/status/1652263343976235008?ref_src=twsrc%5Etfw">April 29, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### 開発の動機
このスマホアプリは当時寮生であった僕が寮食についてとある不満を抱いており、周りの友達も同じような考えを持っていたをキッカケに開発しました。

その不満とは「寮食の欠食確認が面倒」というものです。
寮食は週末と祝日に限り欠食を申請することができるのですが、申請するためには入力項目が冗長な紙の欠食届を食堂に提出する必要がありました。

また、寮食のメニューにはA/Bセットのうち1つを選択できる日があり、開発当時はちょうどこの制度が導入されたばかりでした。
しかし、このA/Bセットがある日は明らかに寮生を上回る料理が用意されており、事前にどちらを選択するかを決めておけば、このフードロス問題を解決できるのではないかと考えました。

そこで、欠食の管理から寮食周りのお困りごとをまとめて解決するアプリとして「寮生もぐもぐチェッカー」の開発に取り組みました。

### できること
メイン機能にして唯一実装できた「カレンダービューでの欠食確認機能」があります。

下のGifアニメーションのように、まずカレンダーから欠食を行う日時を選択し、欠食したい時間帯をチェックボックスより選択することで、欠食の申請を行うことができます。

カレンダーの日付下部に注目してもらうと、3つのドット型UIがあります。
これは欠食申請状況を表しており、デフォルトの未申請では緑色、欠食申請をしていれば赤色に変化します。

ダミーデータとなっていますが、最終的にはその日のメニューもチェックボックス横のテキストから確認ができる予定です（でした）。

![calendar meal's management](./cancel-meals-check/calendar-meals-management.gif)

次の機能は未実装に終わってしまったものです。
- 欠食申請
- A/Bセットの選択＆申請

## 技術構成
- Flutter
	- cupertino_icons
	- table_calendar
- Firebase
	- Firestore
	- FirebaseAuth

### 開発の振り返り
FlutterとFirebaseが初めてでした。

Flutterはクロスプラットフォーム対応ということで、iOSとAndroid両方で動作するスマホアプリを開発するべく思い切って挑戦してみました。
しかし、Flutterの開発環境構築に非常に多くの時間をかけてしまい、開発時間の半分ほどは環境周りのエラー解決とFlutterの学習に費やしてしまいました。

基本的なWidgetの使い方については、スタイルの装飾がCSSの知識を活かせることが出来たのでそこまで苦労しませんでした。
ただしFlutter特有の状態管理や非同期処理については、初めて触れる概念が多く、理解するのに時間がかかりました。

Firebaseに接続できたはいいものの、Firestoreの利用方法を理解するのと、上記作業に手間取ってしまいあまり有効活用できなかったです。

スライド作成にはMarkdownベースでスライドを作成できるツールMarpを使用しました。

作成したスライドは[こちら](https://hengin-eer.github.io/hackathon-2023-4-29/)から閲覧できます。
