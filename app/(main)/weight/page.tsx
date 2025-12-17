'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeightChart } from '@/components/charts/weight-chart';
import { WeightForm } from '@/components/forms/weight-form';
import { useWeight } from '@/hooks/use-weight';
import { formatDateWithDay } from '@/lib/utils/date';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function WeightPage() {
  const { data, loading, refetch } = useWeight(30);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('この記録を削除しますか？')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/weight?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        refetch();
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">体重を記録</CardTitle>
        </CardHeader>
        <CardContent>
          <WeightForm onSuccess={refetch} />
        </CardContent>
      </Card>

      <WeightChart data={data} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">記録履歴</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-gray-500">読み込み中...</div>
          ) : data.length === 0 ? (
            <div className="text-center py-4 text-gray-500">記録がありません</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.map((log) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <span className="text-gray-600 text-sm">
                      {formatDateWithDay(log.date)}
                    </span>
                    <span className="ml-4 font-semibold">{log.weight}kg</span>
                  </div>
                  <button
                    onClick={() => handleDelete(log.id)}
                    disabled={deleting === log.id}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
