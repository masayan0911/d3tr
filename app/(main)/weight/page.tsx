'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeightChart } from '@/components/charts/weight-chart';
import { WeightForm } from '@/components/forms/weight-form';
import { useWeight } from '@/hooks/use-weight';
import { formatDateWithDay } from '@/lib/utils/date';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { WeightLog } from '@/types/database';

export default function WeightPage() {
  const { data, loading, refetch } = useWeight(30);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<WeightLog | null>(null);

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

  const handleEditSuccess = () => {
    setEditing(null);
    refetch();
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
                <li key={log.id} className="py-3">
                  {editing?.id === log.id ? (
                    <WeightForm
                      editId={log.id}
                      initialDate={log.date}
                      initialWeight={String(log.weight)}
                      onSuccess={handleEditSuccess}
                      onCancel={() => setEditing(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-600 text-sm">
                          {formatDateWithDay(log.date)}
                        </span>
                        <span className="ml-4 font-semibold">{log.weight}kg</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditing(log)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          disabled={deleting === log.id}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
