# Technology Stack

## 言語と実行環境

| 要素 | バージョン | 根拠 |
| --- | --- | --- |
| Kotlin | 2.4.21 | `settings.gradle.kts` の `org.jetbrains.kotlin.jvm` |
| Java | 21 | GitHub Actions の `actions/setup-java@v6` |
| IntelliJ IDEA | 2026.2.3 | `build.gradle.kts` の `intellijIdea(...)` |

## ビルド

| 要素 | バージョン | 根拠 |
| --- | --- | --- |
| Gradle Wrapper | 9.9.2 | `gradle/wrapper/gradle-wrapper.properties` |
| IntelliJ Platform Gradle Plugin | 2.20.1 | `settings.gradle.kts` の `org.jetbrains.intellij.platform.settings` |
| Gradle Changelog Plugin | 2.5.0 | `settings.gradle.kts` の `org.jetbrains.changelog` |
| ktfmt-gradle | 0.28.0 | Gradle Plugin Portal。内部で ktfmt 0.65 を使用し、Kotlin 2.4.21 に対応する |
| Foojay Resolver Convention | 1.0.0 | `settings.gradle.kts` の `org.gradle.toolchains.foojay-resolver-convention` |

有効な設定。

- Gradle Configuration Cache（`org.gradle.configuration-cache = true`）
- Gradle Build Cache（`org.gradle.caching = true`）
- Kotlin 標準ライブラリのバンドル無効化（`kotlin.stdlib.default.dependency = false`）

## テスト

- JUnit 4.13.2（`build.gradle.kts` の `testImplementation`）
- IntelliJ Platform Test Framework（`TestFrameworkType.Platform`）
- 統合テスト向けバンドルプラグイン: `com.intellij.modules.ultimate`

## CI/CD

- GitHub Actions（`.github/workflows/build.yml`）
  - `buildPlugin`: プラグイン ZIP の作成
  - `check`: テストの実行
  - `verifyPlugin`: プラグイン構造と Plugin Verifier による検証
  - `releaseDraft`: 手動確認用のドラフトリリース作成
- `main` への push と pull request をトリガーとする。

## 品質ツール方針

- `check` と `verifyPlugin` を CI のゲートとして扱う。
- ktfmt-gradle の `kotlinLangStyle()` を採用し、4 スペースインデントの Kotlin 公式コーディング規約に統一する。
- `ktfmtCheck` を `check` 経由で実行し、ローカルと CI で同じ書式検証を行う。
- カバレッジ計測ツールと ktfmt 以外の静的解析ツールは未導入である。導入時は本ファイルに追記する。

## 変更手順

技術スタックを変更する場合は、実装より先に本ファイルを更新し、変更理由を記載する。
