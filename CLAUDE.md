# CLAUDE.md

このファイルはClaude Codeがこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

D3TR（ディースリーティーアール）は、ゴルファー向けの増量管理Webアプリです。体重増加と飛距離アップの相関を活用し、「300yd到達」という目標に向けてモチベーションを維持しながら増量を継続できます。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **バックエンド**: Supabase (PostgreSQL, Auth, RLS)
- **AI**: Google Gemini API
- **チャート**: Recharts
- **フォーム**: react-hook-form + zod
- **日付処理**: date-fns

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run lint     # ESLintチェック
```

## アーキテクチャ

### ルーティング

- `/login`, `/signup` - 認証ページ（未認証ユーザー向け）
- `/setup` - 初期設定（認証済み・未設定ユーザー向け）
- `/dashboard` - ダッシュボード（メイン画面）
- `/weight` - 体重管理
- `/meals` - 食事管理
- `/foods` - フードテンプレート
- `/settings` - 設定

### ミドルウェア

`middleware.ts`で認証フローを制御:
1. 未認証 → `/login`へリダイレクト
2. 認証済み + 未設定 → `/setup`へリダイレクト
3. 認証済み + 設定完了 → 通常アクセス

### データベース

4つのテーブル（全てRLS有効）:
- `users` - ユーザープロフィール・目標設定
- `weight_logs` - 体重記録
- `meals` - 食事記録
- `food_templates` - フードテンプレート

### 飛距離計算ロジック

```typescript
推定飛距離 = 開始飛距離 + (体重増加量 × 変換係数)
// 変換係数: デフォルト4 (1kg = 4yd)、設定で3〜5に調整可能
```

## コーディング規約

- コンポーネントは`'use client'`ディレクティブを明示
- Supabaseクライアントはブラウザ用(`lib/supabase/client.ts`)とサーバー用(`lib/supabase/server.ts`)を使い分け
- API RouteではSupabase RLSに依存してセキュリティを担保
- UIコンポーネントは`components/ui/`に配置
- カスタムフックは`hooks/`に配置
- 日本語UIを基本とする

## 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL     # Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anon key
GEMINI_API_KEY               # Google Gemini API key (オプション)
```

## 注意点

- Gemini APIキーがない場合でもアプリは動作（AIフィードバックのみ無効）
- 体重・飛距離の計算は`lib/utils/calculations.ts`に集約
- 日付処理は`lib/utils/date.ts`に集約
- クラス名結合は`lib/utils/cn.ts`の`cn()`関数を使用
