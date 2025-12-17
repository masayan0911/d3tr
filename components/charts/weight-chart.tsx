'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils/date';
import { WeightLog } from '@/types/database';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface WeightChartProps {
  data: WeightLog[];
  startWeight?: number;
  targetWeight?: number;
}

export function WeightChart({ data, startWeight, targetWeight }: WeightChartProps) {
  const chartData = [...data]
    .reverse()
    .map((log) => ({
      date: formatDate(log.date),
      weight: log.weight,
    }));

  const weights = data.map((d) => d.weight);
  const minWeight = Math.min(...weights, startWeight ?? Infinity);
  const maxWeight = Math.max(...weights, targetWeight ?? 0);
  const padding = (maxWeight - minWeight) * 0.1 || 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">体重推移</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500">
            データがありません
          </div>
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  domain={[
                    Math.floor(minWeight - padding),
                    Math.ceil(maxWeight + padding),
                  ]}
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  width={40}
                />
                <Tooltip
                  formatter={(value) => [`${value}kg`, '体重']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
