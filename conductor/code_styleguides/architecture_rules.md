# アーキテクチャ規則（Kotlin / IntelliJ Platform Plugin）

## 目的

IntelliJ Platform API とドメインロジックの結合を抑え、変更に強いプラグイン構造を維持する。本規則は Issue #5 の要求に基づき、Kotlin プラグイン向けに定義した。

## レイヤーと依存方向

依存方向は常に上位から下位へ向かう。下位から上位への依存を禁止する。

```text
UI (toolWindow, actions)
  -> App (services, startup)
    -> Domain
      <- Infra (IntelliJ Platform API, 外部通信)
```

- `UI`: ツールウィンドウ、アクション、ダイアログ。表示と入力の変換だけを担う。
- `App`: ユースケースの調整。`ProjectService` などの IntelliJ サービスが該当する。
- `Domain`: IDE に依存しない純粋な Kotlin コード。MCP のプロトコル定義や操作モデルを含む。
- `Infra`: IntelliJ Platform API と外部通信の実装。Domain のインターフェースを実装する。

## 禁止事項

- `Domain` から `com.intellij.*` を import しない。
- `Domain` から `App` と `UI` を参照しない。
- `UI` から外部通信やファイルアクセスを直接行わない。
- `Infra` から `UI` を参照しない。

## IntelliJ Platform の制約

- `Project` スコープのサービスは `@Service(Service.Level.PROJECT)` を付与する。
- UI スレッドをブロックする処理を実行しない。長時間処理はバックグラウンドで実行し、結果を UI スレッドへ反映する。
- `Disposable` を実装するオブジェクトは、登録したリソースを `dispose()` で解放する。リスナーとコールバックは登録時に解除処理を対応させる。
- `plugin.xml` への拡張登録は、対応する実装クラスを削除する場合に必ず削除する。

## 命名

- サービスは `〜Service`、ファクトリは `〜Factory`、起動時処理は `〜Activity` とする。
- パッケージは `com.github.naoyukik.idecontrolmcp.<layer>` に配置する。
- サンプル実装の `My` 接頭辞は、製品コードへの置換時に意味のある名前に変更する。

## テスト

- 各レイヤーに対応するテストを配置する。`src/test/kotlin/...` に本番と同じパッケージ構造を使う。
- `Domain` のテストは IntelliJ Platform を起動せずに実行できる状態を保つ。
- `Infra` のテストでは IntelliJ Platform Test Framework を使用する。
- 新規機能は tdd に従い、失敗するテストを先に追加する。

## 検証

変更後に依存方向を確認する。上位レイヤーへの参照が見つかった場合は、インターフェースを `Domain` に定義し、`Infra` で実装する形に修正する。
