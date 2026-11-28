# Plan: ktfmt 導入による Kotlin コードフォーマットの統一

- Track ID: ktfmt-formatting_20261128
- Spec: [spec.md](./spec.md)

## Phase 1: 技術スタックの記録と Gradle 組み込み

- [x] Task: tech-stack.md へ ktfmt の追記 `bbb48b9`
  - [x] 品質ツール方針へ ktfmt-gradle プラグイン、バージョン、kotlinlang-style を記録する
  - [x] 実装より先に `tech-stack.md` を更新する（workflow 原則 2）
- [ ] Task: ktfmt-gradle プラグインの適用
  - [ ] ktfmt-gradle の最新安定版を確認する
  - [ ] `build.gradle.kts` へプラグイン適用と kotlinlang-style を明示する
  - [ ] `./gradlew tasks` で ktfmtFormat / ktfmtCheck が認識されることを確認する
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: 既存ソースへの整形適用（Red / Green 相当）

- [ ] Task: Red - ktfmtCheck が未整形差分で失敗することを確認する
  - [ ] `./gradlew ktfmtCheck` を実行し、整形差分が検出されて失敗することを確認する
  - [ ] 差分対象ファイル数を記録する
- [ ] Task: Green - ktfmtFormat 適用と差分コミット
  - [ ] `./gradlew ktfmtFormat` を実行する
  - [ ] `git diff` で整形差分が書式のみであることを確認する
  - [ ] 整形差分をコミットする（`style: apply ktfmt formatting to existing sources`）
  - [ ] `./gradlew check` が成功することを確認する
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: CI 組み込みとドキュメント整備

- [ ] Task: CI Build ワークフローへの組み込み
  - [ ] `.github/workflows/build.yml` で ktfmtCheck が実行されることを確認する（`check` 依存に含まれる場合は明示不要、その旨を確認する）
- [ ] Task: IDE 設定の共有
  - [ ] `.idea/ktfmt.xml` を作成し共有対象へ加える
- [ ] Task: 運用ドキュメントの記載
  - [ ] README または AGENTS.md へ実行コマンド（ktfmtFormat、ktfmtCheck）と運用方針を記載する
- [ ] Task: Issue #7 のクローズ条件確認
  - [ ] spec.md の Acceptance Criteria を満たしていることを確認する
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
