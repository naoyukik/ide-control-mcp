# アーキテクチャ規則（Kotlin / IntelliJ Platform Plugin）

## 目的

IntelliJ Platform API とドメインロジックの結合を抑え、変更に強いプラグイン構造を維持する。本規則は Issue #5 の要求に基づき、Kotlin プラグイン向けに定義した。

## レイヤーと依存方向

依存方向は常に上位から下位へ向かう。下位から上位への依存を禁止する。

4 層（UI / App / Domain / Infra）は DDD のレイヤードアーキテクチャに基づく。依存は内側の `Domain` へ向かうことを原則とし、外側から内側への依存は許可される。`Infra` は `Domain` に定義したインターフェースを実装するため、`Infra` から `Domain` への依存も許可される。前述の「上位／下位」は図における層の重ね順を指す。禁止されるのは外側から内側への依存ではなく、その逆方向である内側から外側への依存（`Domain` から `App` や `UI` への参照）だ。

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

### 層とパッケージの対応

`com.github.naoyukik.idecontrolmcp.` 配下のパッケージは次のとおりとする。

| 層 | パッケージ | 状態 |
| --- | --- | --- |
| UI | `toolWindow`、`actions` | `toolWindow` は既存。`actions` は追加時に新設する |
| App | `services`、`startup` | 既存 |
| Domain | `domain` | 新設時に作成する |
| Infra | `infra` | 新設時に作成する |

1 つの層が複数のパッケージを持つことを許す。ただし層に属するパッケージは表に列挙されたものに限る。表にないパッケージを新設する場合は、先に本表を更新する。パッケージから層を判定する逆引きも本表に従う。

### ルートパッケージの例外

- ルートパッケージには層に属さない共用資材のみ置ける。
- 現時点ではリソースバンドルアクセサ `MyBundle` が該当する。
- `MyBundle` は `com.intellij.DynamicBundle` を継承するため IntelliJ Platform 依存であり、`Domain` から参照してはならない。
- `Domain` で必要な文言は文言キーの定数だけを `Domain` に定義する。`MyBundle` 経由の解決は `UI` / `App` / `Infra` で行う。

## テスト

- 各レイヤーに対応するテストを配置する。`src/test/kotlin/...` に本番と同じパッケージ構造を使う。
- `Domain` のテストは IntelliJ Platform を起動せずに実行できる状態を保つ。
- `Infra` のテストでは IntelliJ Platform Test Framework を使用する。
- 新規機能は tdd に従い、失敗するテストを先に追加する。

## 検証

変更後に依存方向を確認する。上位レイヤーへの参照が見つかった場合は、インターフェースを `Domain` に定義し、`Infra` で実装する形に修正する。
