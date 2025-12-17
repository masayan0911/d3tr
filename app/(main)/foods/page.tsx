'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FoodTemplateForm } from '@/components/forms/food-template-form';
import { useFoodTemplates } from '@/hooks/use-food-templates';
import { Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export default function FoodsPage() {
  const { data, loading, refetch } = useFoodTemplates();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingItem = data.find((t) => t.id === editingId);

  const handleDelete = async (id: string) => {
    if (!confirm('このテンプレートを削除しますか？')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/foods?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        refetch();
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleEditSuccess = () => {
    setEditingId(null);
    refetch();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            {editingId ? 'テンプレートを編集' : 'テンプレートを追加'}
            {editingId && (
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FoodTemplateForm
            key={editingId || 'new'}
            onSuccess={handleEditSuccess}
            editId={editingId ?? undefined}
            initialName={editingItem?.name ?? ''}
            initialCalories={editingItem?.calories?.toString() ?? ''}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">登録済みテンプレート</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-gray-500">読み込み中...</div>
          ) : data.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              テンプレートがありません
              <br />
              <span className="text-sm">
                よく食べるメニューを登録すると、食事記録が楽になります
              </span>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.map((template) => (
                <li
                  key={template.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <span className="text-gray-900">{template.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {template.calories}kcal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(template.id)}
                      className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      disabled={deleting === template.id}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
