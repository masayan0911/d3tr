'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateProgress, calculateRemainingWeight } from '@/lib/utils/calculations';
import { Scale, TrendingUp } from 'lucide-react';

interface WeightCardProps {
  currentWeight: number | null;
  startWeight: number;
  targetWeight: number;
}

export function WeightCard({ currentWeight, startWeight, targetWeight }: WeightCardProps) {
  const weight = currentWeight ?? startWeight;
  const remaining = calculateRemainingWeight(weight, targetWeight);
  const progress = calculateProgress(startWeight, weight, targetWeight);
  const gained = weight - startWeight;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
          <Scale className="w-4 h-4" />
          体重
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold text-gray-900">{weight}</span>
          <span className="text-lg text-gray-500">kg</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">目標まで</span>
            <span className="font-medium text-emerald-600">
              {remaining > 0 ? `+${remaining.toFixed(1)}kg` : '達成!'}
            </span>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-400">
            <span>{startWeight}kg</span>
            <span>{targetWeight}kg</span>
          </div>

          {gained > 0 && (
            <div className="flex items-center gap-1 text-sm text-emerald-600 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>+{gained.toFixed(1)}kg 増量</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
