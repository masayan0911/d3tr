'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SetupFormProps {
  userId: string;
}

export function SetupForm({ userId }: SetupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    startWeight: '',
    targetWeight: '',
    startDistance: '',
    targetDistance: '300',
    targetCalories: '3000',
    kgToYdRatio: '4',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const startWeight = parseFloat(formData.startWeight);
    const targetWeight = parseFloat(formData.targetWeight);
    const startDistance = parseInt(formData.startDistance);
    const targetDistance = parseInt(formData.targetDistance);
    const targetCalories = parseInt(formData.targetCalories);
    const kgToYdRatio = parseFloat(formData.kgToYdRatio);

    // バリデーション
    if (startWeight < 30 || startWeight > 200) {
      setError('現在体重は30〜200kgの範囲で入力してください');
      setLoading(false);
      return;
    }

    if (targetWeight < 30 || targetWeight > 200) {
      setError('目標体重は30〜200kgの範囲で入力してください');
      setLoading(false);
      return;
    }

    if (targetWeight <= startWeight) {
      setError('目標体重は現在体重より大きい値を設定してください');
      setLoading(false);
      return;
    }

    if (startDistance < 150 || startDistance > 350) {
      setError('現在飛距離は150〜350ydの範囲で入力してください');
      setLoading(false);
      return;
    }

    if (kgToYdRatio < 3 || kgToYdRatio > 5) {
      setError('変換係数は3〜5の範囲で入力してください');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from('users')
      .update({
        start_weight: startWeight,
        target_weight: targetWeight,
        start_distance: startDistance,
        target_distance: targetDistance,
        target_calories: targetCalories,
        kg_to_yd_ratio: kgToYdRatio,
        start_date: new Date().toISOString().split('T')[0],
      })
      .eq('id', userId);

    if (updateError) {
      setError('設定の保存に失敗しました');
      setLoading(false);
      return;
    }

    // 初回体重も記録
    await supabase.from('weight_logs').upsert({
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
      weight: startWeight,
    });

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">体重設定</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            name="startWeight"
            label="現在体重 (kg)"
            placeholder="70"
            step="0.1"
            value={formData.startWeight}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="targetWeight"
            label="目標体重 (kg)"
            placeholder="80"
            step="0.1"
            value={formData.targetWeight}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">飛距離設定</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            name="startDistance"
            label="現在飛距離 (yd)"
            placeholder="260"
            value={formData.startDistance}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="targetDistance"
            label="目標飛距離 (yd)"
            placeholder="300"
            value={formData.targetDistance}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">食事設定</h3>
        <Input
          type="number"
          name="targetCalories"
          label="1日の目標カロリー (kcal)"
          placeholder="3000"
          value={formData.targetCalories}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">詳細設定</h3>
        <Input
          type="number"
          name="kgToYdRatio"
          label="体重→飛距離 変換係数 (yd/kg)"
          placeholder="4"
          step="0.1"
          min="3"
          max="5"
          value={formData.kgToYdRatio}
          onChange={handleChange}
          required
        />
        <p className="text-sm text-gray-500">
          体重1kg増加あたりの飛距離増加(yd)。推奨値: 4 (範囲: 3〜5)
        </p>
      </div>

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        設定を保存してはじめる
      </Button>
    </form>
  );
}
