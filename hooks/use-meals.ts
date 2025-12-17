'use client';

import { Meal } from '@/types/database';
import { useCallback, useEffect, useState } from 'react';

export function useMeals(date?: string) {
  const [data, setData] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = date ? `/api/meals?date=${date}` : '/api/meals';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setData(data);
    } catch {
      setError('食事データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const totalCalories = data
    .filter((m) => !date || m.date === date)
    .reduce((sum, m) => sum + m.calories, 0);

  const mealsByType = {
    breakfast: data.filter((m) => m.meal_type === 'breakfast'),
    lunch: data.filter((m) => m.meal_type === 'lunch'),
    dinner: data.filter((m) => m.meal_type === 'dinner'),
    snack: data.filter((m) => m.meal_type === 'snack'),
  };

  return { data, loading, error, refetch: fetchMeals, totalCalories, mealsByType };
}
