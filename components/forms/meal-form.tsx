'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getToday } from '@/lib/utils/date';
import { FoodTemplate, MealType } from '@/types/database';
import { useState } from 'react';

interface MealFormProps {
  onSuccess?: () => void;
  initialDate?: string;
  foodTemplates?: FoodTemplate[];
}

const mealTypeOptions = [
  { value: 'breakfast', label: '朝食' },
  { value: 'lunch', label: '昼食' },
  { value: 'dinner', label: '夕食' },
  { value: 'snack', label: '間食' },
];

export function MealForm({ onSuccess, initialDate, foodTemplates = [] }: MealFormProps) {
  const [date, setDate] = useState(initialDate || getToday());
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTemplateSelect = (templateId: string) => {
    const template = foodTemplates.find((t) => t.id === templateId);
    if (template) {
      setFoodName(template.name);
      setCalories(template.calories.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const caloriesNum = parseInt(calories);
    if (caloriesNum < 0 || caloriesNum > 5000) {
      setError('カロリーは0〜5000の範囲で入力してください');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          meal_type: mealType,
          food_name: foodName,
          calories: caloriesNum,
        }),
      });

      if (!res.ok) {
        throw new Error('保存に失敗しました');
      }

      setFoodName('');
      setCalories('');
      onSuccess?.();
    } catch {
      setError('食事の保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="日付"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Select
          label="食事タイプ"
          options={mealTypeOptions}
          value={mealType}
          onChange={(e) => setMealType(e.target.value as MealType)}
          required
        />
      </div>

      {foodTemplates.length > 0 && (
        <Select
          label="テンプレートから選択"
          options={[
            { value: '', label: '選択してください' },
            ...foodTemplates.map((t) => ({
              value: t.id,
              label: `${t.name} (${t.calories}kcal)`,
            })),
          ]}
          onChange={(e) => handleTemplateSelect(e.target.value)}
        />
      )}

      <Input
        type="text"
        label="食品名"
        placeholder="例: 鶏胸肉200g"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        required
      />

      <Input
        type="number"
        label="カロリー (kcal)"
        placeholder="例: 500"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        required
      />

      <Button type="submit" className="w-full" loading={loading}>
        記録する
      </Button>
    </form>
  );
}
