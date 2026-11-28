# Spec: ktfmt 導入による Kotlin コードフォーマットの統一

- Track ID: ktfmt-formatting_20261128
- Type: Chore
- Issue: #7（chore: ktfmt を導入して Kotlin コードのフォーマットを統一する）

## Overview

本プロジェクトは Kotlin / Gradle で構成される IntelliJ Platform プラグインである。Kotlin ソースの整形ルールが未定義で、フォーマッタも未導入である。そのため変更者ごとに書式差分が発生し、レビューで意味のない差分が混在する。

ktfmt を ktfmt-gradle プラグイン経由で導入する。スタイルは kotlinlang-style（Kotlin 公式コーディング規約、4 スペースインデント）を採用する。ローカルと CI の双方で同じ整形結果を適用し、書式の乖離を自動検出する。

## 決定事項

| 項目 | 決定 | 根拠 |
| --- | --- | --- |
| フォーマッタ | ktfmt | Issue #7。出力が決定的で設定項目が少ない |
| スタイル | kotlinlang-style（4 スペース） | kotlinlang.org の公式コーディング規約に対応し、IntelliJ IDEA の既定インデントと一致する |
| Gradle 組み込み | ktfmt-gradle プラグイン（`com.ncorti.ktfmt.gradle`） | ktfmt 専用で軽量。ktfmtFormat / ktfmtCheck タスクを直接提供する |
| 検証タイミング | `./gradlew check` と CI Build ワークフロー | Issue #7 のゴール。既存の CI ゲート構成を踏襲する |

## Functional Requirements

1. `build.gradle.kts` へ ktfmt-gradle プラグインを適用する
2. ktfmt のバージョンと kotlinlang-style をビルド設定へ明示し、リポジトリ内で共有できる状態にする
3. `ktfmtFormat` タスクで全 Kotlin ソースへ整形を適用し、その差分をコミットする
4. `ktfmtCheck` が `check` タスクの依存に含まれ、書式乖離時に `./gradlew check` が失敗する
5. CI の Build ワークフローで ktfmtCheck が実行される
6. `.idea/ktfmt.xml` を共有対象へ加え、IDE 側でも同じスタイルが適用される
7. README または AGENTS.md へ実行コマンドと運用方針を記載する
8. `tech-stack.md` の品質ツール方針へ ktfmt を追記する

## Non-Functional Requirements

- 整形結果は決定的であり、ローカルと CI で同一であること
- 既存のテストと `verifyPlugin` が引き続き成功すること
- `check` の実行時間に過大な影響を与えないこと

## Acceptance Criteria

- [ ] `./gradlew check` に ktfmtCheck が含まれ、未整形コードが存在すると失敗する
- [ ] 既存の全 Kotlin ソースが kotlinlang-style で整形済みである
- [ ] CI の Build ワークフローで書式乖離が検出される
- [ ] `.idea/ktfmt.xml` がリポジトリに存在する
- [ ] README または AGENTS.md に運用方針が記載されている
- [ ] `tech-stack.md` に ktfmt の導入記録がある
- [ ] 既存テストがすべて成功する

## Out of Scope

- ktfmt 以外の静的解析ツール（Detekt、ktlint 等）の導入
- カバレッジ計測ツールの導入
- 整形と無関係なリファクタリング
