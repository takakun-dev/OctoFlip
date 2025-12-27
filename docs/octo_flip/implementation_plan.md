# 実装計画: OctoFlip - GitHub Account Switcher

## 目標
1台のPCで複数のGitHubアカウント（仕事用、プライベート用など）を簡単に切り替えられるデスクトップアプリケーションを開発する。
UI/UXは心理学原則（フィッツの法則、ヒックの法則など）に基づき、直感的かつ低負荷な操作性を実現する。

## ユーザーレビューが必要な事項
- **SSH鍵の管理**: 今回は `git config user.name/email` の切り替えを主軸としますが、SSH鍵のパス (`core.sshCommand`) の変更もオプションとして含めるか確認が必要です。
- **デザインシステム**: Tailwind CSS の導入を推奨しますが、既存プロジェクトの設定に従います。

## 提案される変更

### 1. データモデル (Profile)
`electron-store` を使用して以下の情報を保存します。
- **Profile Name**: (例: "Work", "Private")
- **Git User Name**: (例: "Taro Yamada")
- **Git User Email**: (例: "taro@company.com")
- **SSH Key Path** (Optional): (例: "~/.ssh/id_rsa_work")
- **GPG Key** (Optional)

### 2. コアロジック (Main Process)
- **Git Config Manager**:
    - `git config --global user.name "..."` 等を実行する機能。
    - 特定のリポジトリ（フォルダ）に対して設定を適用する機能（`git config --local`）。
- **Current Status Checker**:
    - 現在のグローバル設定を取得し、どのアカウントがアクティブか判定する機能。

### 3. UI/UX デザイン (Renderer Process)
UX心理学原則を適用したインターフェースを構築します。

- **メイン画面 (Dashboard)**:
    - **現在のステータス表示**: 大きく、明確に現在のアカウントを表示（*視認性と可読性*）。
    - **クイック切り替え**: 登録済みプロファイルをカード形式で表示。ワンクリックで適用（*フィッツの法則*、*ヒックの法則*）。
- **プロファイル管理**:
    - 設定項目をグループ化し、一度に表示する情報を制限（*ミラーの法則*）。
    - 入力フォームはシンプルに保つ（*認知的負荷の軽減*）。

### 4. ファイル構成の変更
#### [NEW] src/main/lib/git-manager.ts
Gitコマンドを実行するためのヘルパー関数群。

#### [NEW] src/renderer/src/components/ProfileCard.tsx
プロファイルを表示・選択するためのカードコンポーネント。

#### [NEW] src/renderer/src/stores/useProfileStore.ts
プロファイル状態を管理するストア（Zustand等を想定、あるいはContext）。

## 検証計画

### 自動テスト
- ユニットテスト: プロファイル保存ロジック、Gitコマンド生成ロジックのテスト。

### 手動検証
1. **プロファイル作成**: 仕事用・プライベート用の2つのプロファイルを作成できること。
2. **切り替え動作**: ボタン1つで `git config --global` の値が変更されることを確認（ターミナルで `git config --global -l` を叩いて検証）。
3. **UX確認**: ボタンの押しやすさ、現在の状態の分かりやすさを確認。
