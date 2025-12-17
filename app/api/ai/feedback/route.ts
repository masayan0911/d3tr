import { createClient } from '@/lib/supabase/server';
import { calculateEstimatedDistance } from '@/lib/utils/calculations';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ユーザープロフィール取得
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // 直近7日間の体重データ
  const { data: weights } = await supabase
    .from('weight_logs')
    .select('date, weight')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(7);

  // 直近3日間の食事データ（日別カロリー集計）
  const { data: meals } = await supabase
    .from('meals')
    .select('date, calories')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(30);

  const latestWeight = weights?.[0]?.weight ?? profile.start_weight ?? 70;
  const estimatedDistance = calculateEstimatedDistance(
    profile.start_weight ?? 70,
    latestWeight,
    profile.start_distance ?? 260,
    profile.kg_to_yd_ratio
  );

  // 日別カロリー集計
  const caloriesByDay: Record<string, number> = {};
  meals?.forEach((meal) => {
    caloriesByDay[meal.date] = (caloriesByDay[meal.date] || 0) + meal.calories;
  });

  const recentCalories = Object.entries(caloriesByDay)
    .slice(0, 3)
    .map(([date, calories]) => ({ date, calories }));

  // Gemini API呼び出し
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { feedback: 'AIフィードバック機能を使用するにはGEMINI_API_KEYの設定が必要です。' },
      { status: 200 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `あなたはフィットネスとゴルフのコーチです。ドライバーの飛距離を伸ばすために増量中のユーザーをサポートしてください。

ユーザープロフィール:
- 現在体重: ${latestWeight}kg
- 目標体重: ${profile.target_weight}kg
- 推定飛距離: ${estimatedDistance}yd
- 目標飛距離: ${profile.target_distance}yd

直近7日間の体重推移:
${weights?.map((w) => `${w.date}: ${w.weight}kg`).join('\n') || 'データなし'}

直近のカロリー摂取:
${recentCalories.map((c) => `${c.date}: ${c.calories}kcal`).join('\n') || 'データなし'}

以下を日本語で簡潔に回答してください（150文字以内）:
1. 増量ペースの評価
2. 食事の改善提案1つ
3. ゴルフ視点でのモチベーション（${profile.target_distance}yd到達予測）`;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { feedback: 'AIからのフィードバックを取得できませんでした。しばらく待ってから再度お試しください。' },
      { status: 200 }
    );
  }
}
