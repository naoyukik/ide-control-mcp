# Track: ktfmt 導入による Kotlin コードフォーマットの統一

- Track ID: ktfmt-formatting_20261128
- Type: Chore
- Issue: #7

## Overview

Kotlin ソースの整形ルールを統一するため、ktfmt を ktfmt-gradle プラグイン経由で導入する。スタイルは kotlinlang-style（4 スペースインデント）を採用し、ローカルと CI の双方で同じ整形結果を適用して書式の乖離を自動検出する。

## Documents

- [Spec](./spec.md)
- [Plan](./plan.md)
- [Metadata](./metadata.json)
