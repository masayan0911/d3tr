'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  calculateEstimatedDistance,
  calculateProgress,
  calculateRemainingDistance,
} from '@/lib/utils/calculations';
import { Target } from 'lucide-react';

interface DistanceCardProps {
  currentWeight: number | null;
  startWeight: number;
  startDistance: number;
  targetDistance: number;
  kgToYdRatio: number;
}

export function DistanceCard({
  currentWeight,
  startWeight,
  startDistance,
  targetDistance,
  kgToYdRatio,
}: DistanceCardProps) {
  const weight = currentWeight ?? startWeight;
  const estimatedDistance = calculateEstimatedDistance(
    startWeight,
    weight,
    startDistance,
    kgToYdRatio
  );
  const remaining = calculateRemainingDistance(estimatedDistance, targetDistance);
  const progress = calculateProgress(startDistance, estimatedDistance, targetDistance);
  const gained = estimatedDistance - startDistance;

  return (
    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-emerald-100 flex items-center gap-2">
          <Target className="w-4 h-4" />
          推定飛距離
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-bold">{estimatedDistance}</span>
          <span className="text-xl text-emerald-100">yd</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-emerald-100">目標まで</span>
            <span className="font-medium">
              {remaining > 0 ? `+${remaining}yd` : '達成!'}
            </span>
          </div>

          <div className="h-2 bg-emerald-400/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-emerald-200">
            <span>{startDistance}yd</span>
            <span>{targetDistance}yd</span>
          </div>

          {gained > 0 && (
            <div className="text-sm mt-2 text-center bg-white/20 rounded-lg py-1">
              +{gained}yd UP!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
