[![Netlify Status](https://api.netlify.com/api/v1/badges/f44e3ce3-044b-41f0-b1da-ab7152caaf02/deploy-status)](https://app.netlify.com/sites/rese-vue/deploys)

# Rese

飲食店予約アプリケーションです。飲食店の検索・お気に入り・予約をすることができます。ユーザーの他に飲食店のオーナー、このアプリを管理する管理者のアカウントも用意されています。

<img width="1280" alt="スクリーンショット 2021-07-02 12 45 09" src="https://user-images.githubusercontent.com/55875685/124218214-c6802000-db34-11eb-8bab-6ec2d895d35f.png">

## 作成した目的
スクールの課題として取り組みました。決められていなかった機能も実装し自身のスキル向上を目指しました。

## アプリケーションURL
https://rese-vue.netlify.app/login

ログイン画面の「ゲストログイン」ボタンからアプリを体験してみてください。ゲストログインでは一部機能が制限されています。

## バックエンドリポジトリ
https://github.com/sky2432/rese-laravel

## 機能一覧
- レスポンシブ対応（スマートフォン・タブレット・PC）
- トークン認証
- フォームバリデーション
- アカウント（ユーザー・オーナー・管理者）のCRUD
- 予約・店舗のCRUD
- 店舗のお気に入り
- 店舗の検索（エリア・ジャンル・店舗名）
- 店舗の評価
- グーグルマップの表示
- 店舗画像の設定とダウンロード
- ユーザーとオーナーに対してのメール送信
- 予約リマインドメール通知
- 郵便番号から住所を自動入力

## 使用技術
フロントエンド
- HTML/CSS
- JavaScript
- Vue.js 2.6.12
- Vuetify 2.4.11
- VeeValidate 3.4.5

バックエンド
- PHP 7.3
- Laravel 8.12
- league/flysystem-aws-s3-v3 1.0.29
- Mysql 8.0.23

インフラ
- Netlify
- Heroku
- ClearDB MySQL(Heroku)
- AWS S3

API
- Google Maps API
- PostcodeJP API

## ER図
![ReseER図](https://user-images.githubusercontent.com/55875685/124217053-7dc76780-db32-11eb-893c-7a322858aff9.png)

## アカウントの種類と機能
- ユーザー: 飲食店の検索・お気に入り・予約をすることができます。
- オーナー: 店舗の管理と予約一覧を確認できます。
- 管理者: 店舗・ユーザー・オーナー・管理者の管理ができます。その他に詳細情報の確認とメール送信が可能です。







