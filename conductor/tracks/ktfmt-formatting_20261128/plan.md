# Plan: ktfmt 導入による Kotlin コードフォーマットの統一

- Track ID: ktfmt-formatting_20261128
- Spec: [spec.md](./spec.md)

## Phase 1: 技術スタックの記録と Gradle 組み込み [checkpoint: 86b8408]

- [x] Task: tech-stack.md へ ktfmt の追記 `bbb48b9`
  - [x] 品質ツール方針へ ktfmt-gradle プラグイン、バージョン、kotlinlang-style を記録する
  - [x] 実装より先に `tech-stack.md` を更新する（workflow 原則 2）
- [x] Task: ktfmt-gradle プラグインの適用 `86b8408`
  - [x] ktfmt-gradle の最新安定版を確認する
  - [x] `build.gradle.kts` へプラグイン適用と kotlinlang-style を明示する
  - [x] `./gradlew tasks` で ktfmtFormat / ktfmtCheck が認識されることを確認する
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) `86b8408`

## Phase 2: 既存ソースへの整形適用（Red / Green 相当） [checkpoint: e176e63]

- [x] Task: Red - ktfmtCheck が未整形差分で失敗することを確認する `22da605`
  - [x] `./gradlew ktfmtCheck` を実行し、整形差分が検出されて失敗することを確認する
  - [x] 差分対象ファイル数を記録する（7 ファイル: Gradle スクリプト 2、main 4、test 1）
- [x] Task: Green - ktfmtFormat 適用と差分コミット `e176e63`
  - [x] `./gradlew ktfmtFormat` を実行する
  - [x] `git diff` で整形差分が書式のみであることを確認する
  - [x] 整形差分をコミットする（`fa8b09a`）
  - [x] `./gradlew check` が成功することを確認する（testData の VFS ルート許可修正後に成功）
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) `e176e63`

## Phase 3: CI 組み込みとドキュメント整備 [checkpoint: 3b16a37]

- [x] Task: CI Build ワークフローへの組み込み `75aae05`
  - [x] `.github/workflows/build.yml` で ktfmtCheck が実行されることを確認する（`check` 依存に含まれるため、ワークフロー変更は不要）
- [x] Task: IDE 設定の共有 `d609cf1`
  - [x] `.idea/ktfmt.xml` を作成し共有対象へ加える
- [x] Task: 運用ドキュメントの記載 `3b16a37`
  - [x] README または AGENTS.md へ実行コマンド（ktfmtFormat、ktfmtCheck）と運用方針を記載する
- [x] Task: Issue #7 のクローズ条件確認 `1c93d5c`
  - [x] spec.md の Acceptance Criteria を満たしていることを確認する
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) `3b16a37`

## Phase: PR Preparation [checkpoint: 73a85cb]
- [x] Task: main との差分に含まれる rootProject.name の巻き戻りを防止 `bb83935`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) `73a85cb`

## Phase: Review Fixes
- [~] Task: ktfmt プラグインバージョンを settings.gradle.kts へ集約
- [~] Task: 検証専用タスクの記録 SHA を修正
- [~] Task: PR Preparation のチェックポイントと Git note を補完
