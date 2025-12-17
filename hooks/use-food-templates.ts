'use client';

import { FoodTemplate } from '@/types/database';
import { useCallback, useEffect, useState } from 'react';

export function useFoodTemplates() {
  const [data, setData] = useState<FoodTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/foods');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setData(data);
    } catch {
      setError('テンプレートの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { data, loading, error, refetch: fetchTemplates };
}
