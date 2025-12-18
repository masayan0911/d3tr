'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getToday } from '@/lib/utils/date';
import { useState } from 'react';

interface WeightFormProps {
  onSuccess?: () => void;
  initialDate?: string;
  initialWeight?: string;
  editId?: string;
  onCancel?: () => void;
}

export function WeightForm({ onSuccess, initialDate, initialWeight, editId, onCancel }: WeightFormProps) {
  const [date, setDate] = useState(initialDate || getToday());
  const [weight, setWeight] = useState(initialWeight || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!editId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const weightNum = parseFloat(weight);
    if (weightNum < 30 || weightNum > 200) {
      setError('体重は30〜200kgの範囲で入力してください');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/weight', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isEditMode
            ? { id: editId, weight: weightNum }
            : { date, weight: weightNum }
        ),
      });

      if (!res.ok) {
        throw new Error('保存に失敗しました');
      }

      if (!isEditMode) {
        setWeight('');
      }
      onSuccess?.();
    } catch {
      setError('体重の保存に失敗しました');
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
          disabled={isEditMode}
        />
        <Input
          type="number"
          label="体重 (kg)"
          placeholder="70.5"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>
      <div className={isEditMode ? 'flex gap-2' : ''}>
        <Button type="submit" className="w-full" loading={loading}>
          {isEditMode ? '更新する' : '記録する'}
        </Button>
        {isEditMode && onCancel && (
          <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
            キャンセル
          </Button>
        )}
      </div>
    </form>
  );
}
