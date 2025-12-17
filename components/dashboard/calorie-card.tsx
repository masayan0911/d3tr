'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateCalorieProgress } from '@/lib/utils/calculations';
import { cn } from '@/lib/utils/cn';
import { Flame } from 'lucide-react';

interface CalorieCardProps {
  consumedCalories: number;
  targetCalories: number;
}

export function CalorieCard({ consumedCalories, targetCalories }: CalorieCardProps) {
  const progress = calculateCalorieProgress(consumedCalories, targetCalories);
  const remaining = Math.max(0, targetCalories - consumedCalories);

  const isOnTrack = progress >= 80;
  const isComplete = progress >= 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
          <Flame className="w-4 h-4" />
          今日のカロリー
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {consumedCalories.toLocaleString()}
          </span>
          <span className="text-lg text-gray-500">
            / {targetCalories.toLocaleString()}kcal
          </span>
        </div>

        <div className="space-y-2">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isComplete ? 'bg-emerald-500' : isOnTrack ? 'bg-amber-500' : 'bg-red-400'
              )}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">達成率</span>
            <span
              className={cn(
                'font-medium',
                isComplete ? 'text-emerald-600' : isOnTrack ? 'text-amber-600' : 'text-red-500'
              )}
            >
              {progress}%
            </span>
          </div>

          {remaining > 0 && (
            <p className="text-xs text-gray-500 text-center mt-1">
              あと {remaining.toLocaleString()}kcal
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
