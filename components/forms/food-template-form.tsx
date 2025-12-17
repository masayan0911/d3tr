'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface FoodTemplateFormProps {
  onSuccess?: () => void;
  initialName?: string;
  initialCalories?: string;
  editId?: string;
}

export function FoodTemplateForm({
  onSuccess,
  initialName = '',
  initialCalories = '',
  editId,
}: FoodTemplateFormProps) {
  const [name, setName] = useState(initialName);
  const [calories, setCalories] = useState(initialCalories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const method = editId ? 'PUT' : 'POST';
      const body = editId
        ? { id: editId, name, calories: caloriesNum }
        : { name, calories: caloriesNum };

      const res = await fetch('/api/foods', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error('保存に失敗しました');
      }

      if (!editId) {
        setName('');
        setCalories('');
      }
      onSuccess?.();
    } catch {
      setError('テンプレートの保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
      )}

      <Input
        type="text"
        label="食品名"
        placeholder="例: 鶏胸肉200g"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        {editId ? '更新する' : '追加する'}
      </Button>
    </form>
  );
}
