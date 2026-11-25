# Product Definition: ide-control-mcp

## 概要

`ide-control-mcp` は、IntelliJ IDEA 上で Model Context Protocol（MCP）経由の IDE 制御を提供するプラグインを目指すリポジトリである。これはリポジトリ名から読み取れる意図であり、実装はまだ目標に到達していない。

現状は JetBrains の IntelliJ Platform Plugin Template から生成された雛形である。テンプレートが提供する以下のサンプル実装が残る。

- ツールウィンドウ（`MyToolWindowFactory`）
- 起動時アクティビティ（`MyProjectActivity`）
- プロジェクトレベルのサービス（`MyProjectService`）

MCP サーバー機能、IDE 操作の公開 API、クライアントとの通信手順は未実装である。プラグインの説明文と README もテンプレートのままである。

## ターゲットユーザー

- IntelliJ IDEA で開発する開発者
- エージェントから IDE の操作を自動化したいユーザー

上記はリポジトリ名と Issue #5 の文脈から推測した想定である。ユーザーインタビューによる検証は未実施である。

## 中核機能（構想）

- MCP クライアントから IDE の操作を呼び出すためのサーバー機能
- プロジェクトコンテキストをエージェントへ提供する手段
- 操作結果を IDE のツールウィンドウで確認する手段

いずれも構想であり、既存コードには対応する実装がない。

## 現在のスコープ外

- JetBrains Marketplace への公開（README の ToDo が未完了）
- プラグイン署名とデプロイトークンの設定
- カバレッジ計測と静的解析ツールの導入

## 参考

- Issue #5: docs: Conductor ドキュメントをセットアップ
- テンプレート: https://github.com/JetBrains/intellij-platform-plugin-template
