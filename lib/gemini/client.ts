import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateFeedback(params: {
  currentWeight: number;
  targetWeight: number;
  estimatedDistance: number;
  targetDistance: number;
  recentWeights: { date: string; weight: number }[];
  recentCalories: { date: string; calories: number }[];
}): Promise<string> {
  const {
    currentWeight,
    targetWeight,
    estimatedDistance,
    targetDistance,
    recentWeights,
    recentCalories,
  } = params;

  const prompt = `あなたはフィットネスとゴルフのコーチです。ドライバーの飛距離を伸ばすために増量中のユーザーをサポートしてください。

ユーザープロフィール:
- 現在体重: ${currentWeight}kg
- 目標体重: ${targetWeight}kg
- 推定飛距離: ${estimatedDistance}yd
- 目標飛距離: ${targetDistance}yd

直近7日間の体重推移:
${recentWeights.map((w) => `${w.date}: ${w.weight}kg`).join('\n')}

直近のカロリー摂取:
${recentCalories.map((c) => `${c.date}: ${c.calories}kcal`).join('\n')}

以下を日本語で簡潔に回答してください（150文字以内）:
1. 増量ペースの評価
2. 食事の改善提案1つ
3. ゴルフ視点でのモチベーション（${targetDistance}yd到達予測）`;

  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}
