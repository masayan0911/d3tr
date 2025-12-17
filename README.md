# D3TR - 飛距離300yd増量管理アプリ

体重・食事を記録し、AIからゴルフ文脈でのフィードバックを得ることで、300ydに近づいている感覚を持ちながら増量を継続できるアプリ。

## 機能

- **ダッシュボード**: 体重・飛距離・カロリーの進捗を一目で確認
- **体重管理**: 日々の体重を記録・グラフで推移を確認
- **食事管理**: 食事記録の追加・編集・削除、テンプレート登録
- **フードテンプレート**: よく食べるメニューを登録して素早く入力
- **AIフィードバック**: Gemini APIによる増量・ゴルフ視点でのアドバイス
- **飛距離推定**: 体重増加量から推定飛距離を自動計算

## 技術スタック

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend/DB/Auth**: Supabase
- **AI**: Google Gemini API (gemini-1.5-flash)
- **Charts**: Recharts
- **Icons**: Lucide React

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`を作成:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Supabaseのテーブル作成

Supabase SQL Editorで以下を実行:

```sql
-- Users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  target_weight DECIMAL(5,2),
  target_distance INTEGER DEFAULT 300,
  start_weight DECIMAL(5,2),
  start_distance INTEGER,
  start_date DATE,
  target_calories INTEGER DEFAULT 3000,
  kg_to_yd_ratio DECIMAL(3,1) DEFAULT 4.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weight logs table
CREATE TABLE public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Meals table
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food templates table
CREATE TABLE public.food_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_weight_logs_user_date ON public.weight_logs(user_id, date DESC);
CREATE INDEX idx_meals_user_date ON public.meals(user_id, date DESC);
CREATE INDEX idx_food_templates_user ON public.food_templates(user_id);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own weight logs" ON public.weight_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own meals" ON public.meals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own food templates" ON public.food_templates
  FOR ALL USING (auth.uid() = user_id);
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 にアクセス

## ディレクトリ構造

```
app/
├── (auth)/           # 認証ページ (login, signup)
├── (main)/           # メインページ (dashboard, weight, meals, foods, settings)
├── api/              # APIルート
├── setup/            # 初期設定ページ
└── layout.tsx

components/
├── ui/               # 基本UIコンポーネント
├── forms/            # フォームコンポーネント
├── charts/           # グラフコンポーネント
├── dashboard/        # ダッシュボードカード
└── navigation/       # ナビゲーション

lib/
├── supabase/         # Supabaseクライアント
├── utils/            # ユーティリティ関数
└── gemini/           # Gemini APIクライアント

hooks/                # カスタムフック
types/                # TypeScript型定義
```

## デプロイ

Vercelでのデプロイを推奨:

```bash
vercel
```

環境変数をVercelダッシュボードで設定してください。

## ライセンス

MIT
