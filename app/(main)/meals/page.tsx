'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { MealForm } from '@/components/forms/meal-form';
import { useMeals } from '@/hooks/use-meals';
import { useFoodTemplates } from '@/hooks/use-food-templates';
import { formatDateWithDay, getToday } from '@/lib/utils/date';
import { Meal, MealType } from '@/types/database';
import { Cookie, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';

const mealTypeLabels: Record<string, string> = {
  breakfast: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '間食',
};

const mealTypeOptions = [
  { value: 'breakfast', label: '朝食' },
  { value: 'lunch', label: '昼食' },
  { value: 'dinner', label: '夕食' },
  { value: 'snack', label: '間食' },
];

export default function MealsPage() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const { data, loading, refetch, totalCalories, mealsByType } = useMeals(selectedDate);
  const { data: foodTemplates, refetch: refetchTemplates } = useFoodTemplates();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [savingTemplate, setSavingTemplate] = useState<string | null>(null);

  // 編集フォームの状態
  const [editForm, setEditForm] = useState({
    date: '',
    meal_type: '' as MealType,
    food_name: '',
    calories: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('この記録を削除しますか？')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/meals?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        refetch();
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleEditStart = (meal: Meal) => {
    setEditingMeal(meal);
    setEditForm({
      date: meal.date,
      meal_type: meal.meal_type,
      food_name: meal.food_name,
      calories: meal.calories.toString(),
    });
    setEditError('');
  };

  const handleEditCancel = () => {
    setEditingMeal(null);
    setEditError('');
  };

  const handleEditSave = async () => {
    if (!editingMeal) return;

    setEditLoading(true);
    setEditError('');

    try {
      const res = await fetch('/api/meals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingMeal.id,
          date: editForm.date,
          meal_type: editForm.meal_type,
          food_name: editForm.food_name,
          calories: parseInt(editForm.calories),
        }),
      });

      if (!res.ok) {
        throw new Error('更新に失敗しました');
      }

      setEditingMeal(null);
      refetch();
    } catch {
      setEditError('更新に失敗しました');
    } finally {
      setEditLoading(false);
    }
  };

  const handleSaveAsTemplate = async (meal: Meal) => {
    setSavingTemplate(meal.id);

    try {
      const res = await fetch('/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: meal.food_name,
          calories: meal.calories,
        }),
      });

      if (res.ok) {
        refetchTemplates();
        alert(`「${meal.food_name}」をテンプレートに登録しました`);
      }
    } finally {
      setSavingTemplate(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">食事を記録</CardTitle>
        </CardHeader>
        <CardContent>
          <MealForm
            onSuccess={refetch}
            initialDate={selectedDate}
            foodTemplates={foodTemplates}
          />
        </CardContent>
      </Card>

      {/* 編集モーダル */}
      {editingMeal && (
        <Card className="border-emerald-500 border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">食事を編集</CardTitle>
            <button
              onClick={handleEditCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent>
            {editError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                {editError}
              </div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="日付"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
                <Select
                  label="食事タイプ"
                  options={mealTypeOptions}
                  value={editForm.meal_type}
                  onChange={(e) => setEditForm({ ...editForm, meal_type: e.target.value as MealType })}
                />
              </div>
              <Input
                type="text"
                label="食品名"
                value={editForm.food_name}
                onChange={(e) => setEditForm({ ...editForm, food_name: e.target.value })}
              />
              <Input
                type="number"
                label="カロリー (kcal)"
                value={editForm.calories}
                onChange={(e) => setEditForm({ ...editForm, calories: e.target.value })}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleEditSave}
                  loading={editLoading}
                  className="flex-1"
                >
                  保存
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEditCancel}
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {formatDateWithDay(selectedDate)}の食事
          </CardTitle>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          />
        </CardHeader>
        <CardContent>
          <div className="text-center py-2 mb-4 bg-emerald-50 rounded-lg">
            <span className="text-sm text-gray-600">合計</span>
            <span className="ml-2 text-xl font-bold text-emerald-600">
              {totalCalories.toLocaleString()}kcal
            </span>
          </div>

          {loading ? (
            <div className="text-center py-4 text-gray-500">読み込み中...</div>
          ) : data.length === 0 ? (
            <div className="text-center py-4 text-gray-500">記録がありません</div>
          ) : (
            <div className="space-y-4">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => {
                const meals = mealsByType[type];
                if (meals.length === 0) return null;

                return (
                  <div key={type}>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      {mealTypeLabels[type]}
                    </h4>
                    <ul className="divide-y divide-gray-100 bg-gray-50 rounded-lg">
                      {meals.map((meal) => (
                        <li
                          key={meal.id}
                          className="flex items-center justify-between px-3 py-2"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-900 block truncate">
                              {meal.food_name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {meal.calories}kcal
                            </span>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => handleSaveAsTemplate(meal)}
                              disabled={savingTemplate === meal.id}
                              className="p-2 text-gray-400 hover:text-emerald-500 transition-colors disabled:opacity-50"
                              title="テンプレートに登録"
                            >
                              <Cookie className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditStart(meal)}
                              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                              title="編集"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(meal.id)}
                              disabled={deleting === meal.id}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                              title="削除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
