'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, refetch } = useUser();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    targetWeight: '',
    targetDistance: '',
    targetCalories: '',
    kgToYdRatio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        targetWeight: user.target_weight?.toString() ?? '',
        targetDistance: user.target_distance.toString(),
        targetCalories: user.target_calories.toString(),
        kgToYdRatio: user.kg_to_yd_ratio.toString(),
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const targetWeight = parseFloat(formData.targetWeight);
    const targetDistance = parseInt(formData.targetDistance);
    const targetCalories = parseInt(formData.targetCalories);
    const kgToYdRatio = parseFloat(formData.kgToYdRatio);

    if (kgToYdRatio < 3 || kgToYdRatio > 5) {
      setError('変換係数は3〜5の範囲で入力してください');
      setSaving(false);
      return;
    }

    if (!user) {
      setError('ユーザー情報が見つかりません');
      setSaving(false);
      return;
    }

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from('users')
      .update({
        target_weight: targetWeight,
        target_distance: targetDistance,
        target_calories: targetCalories,
        kg_to_yd_ratio: kgToYdRatio,
      })
      .eq('id', user.id);

    if (updateError) {
      setError('設定の保存に失敗しました');
    } else {
      setSuccess('設定を保存しました');
      refetch();
    }

    setSaving(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">目標設定</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm mb-4">
              {success}
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                name="targetWeight"
                label="目標体重 (kg)"
                step="0.1"
                value={formData.targetWeight}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                name="targetDistance"
                label="目標飛距離 (yd)"
                value={formData.targetDistance}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              type="number"
              name="targetCalories"
              label="1日の目標カロリー (kcal)"
              value={formData.targetCalories}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              name="kgToYdRatio"
              label="体重→飛距離 変換係数 (yd/kg)"
              step="0.1"
              min="3"
              max="5"
              value={formData.kgToYdRatio}
              onChange={handleChange}
              required
            />
            <p className="text-sm text-gray-500">
              体重1kg増加あたりの飛距離増加(yd)。推奨値: 4 (範囲: 3〜5)
            </p>
            <Button type="submit" className="w-full" loading={saving}>
              保存する
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">現在の設定</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">開始体重</dt>
              <dd className="font-medium">{user?.start_weight}kg</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">開始飛距離</dt>
              <dd className="font-medium">{user?.start_distance}yd</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">開始日</dt>
              <dd className="font-medium">{user?.start_date}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">アカウント</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
          <Button variant="outline" onClick={handleLogout} className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            ログアウト
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
