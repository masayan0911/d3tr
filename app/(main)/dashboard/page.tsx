'use client';

import { AIFeedbackCard } from '@/components/dashboard/ai-feedback-card';
import { CalorieCard } from '@/components/dashboard/calorie-card';
import { DistanceCard } from '@/components/dashboard/distance-card';
import { WeightCard } from '@/components/dashboard/weight-card';
import { WeightChart } from '@/components/charts/weight-chart';
import { useMeals } from '@/hooks/use-meals';
import { useUser } from '@/hooks/use-user';
import { useWeight } from '@/hooks/use-weight';
import { getToday } from '@/lib/utils/date';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const { data: weightData, loading: weightLoading, latestWeight } = useWeight(14);
  const today = getToday();
  const { totalCalories, loading: mealsLoading } = useMeals(today);

  const loading = userLoading || weightLoading || mealsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-gray-500">
        ユーザー情報を読み込めませんでした
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DistanceCard
        currentWeight={latestWeight}
        startWeight={user.start_weight ?? 70}
        startDistance={user.start_distance ?? 260}
        targetDistance={user.target_distance}
        kgToYdRatio={user.kg_to_yd_ratio}
      />

      <div className="grid grid-cols-2 gap-4">
        <WeightCard
          currentWeight={latestWeight}
          startWeight={user.start_weight ?? 70}
          targetWeight={user.target_weight ?? 80}
        />
        <CalorieCard
          consumedCalories={totalCalories}
          targetCalories={user.target_calories}
        />
      </div>

      <WeightChart
        data={weightData}
        startWeight={user.start_weight ?? undefined}
        targetWeight={user.target_weight ?? undefined}
      />

      <AIFeedbackCard />
    </div>
  );
}
