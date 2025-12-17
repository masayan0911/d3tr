'use client';

import { WeightLog } from '@/types/database';
import { useCallback, useEffect, useState } from 'react';

export function useWeight(days: number = 30) {
  const [data, setData] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeight = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/weight?days=${days}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setData(data);
    } catch {
      setError('体重データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchWeight();
  }, [fetchWeight]);

  const latestWeight = data[0]?.weight ?? null;

  return { data, loading, error, refetch: fetchWeight, latestWeight };
}
