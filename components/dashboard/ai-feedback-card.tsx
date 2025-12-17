'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface AIFeedbackCardProps {
  initialFeedback?: string;
}

export function AIFeedbackCard({ initialFeedback }: AIFeedbackCardProps) {
  const [feedback, setFeedback] = useState(initialFeedback || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFeedback = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ai/feedback');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFeedback(data.feedback);
    } catch {
      setError('フィードバックの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            AIコーチ
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchFeedback}
            disabled={loading}
            className="h-8 px-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : feedback ? (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{feedback}</p>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-3">
              AIからフィードバックをもらおう
            </p>
            <Button onClick={fetchFeedback} loading={loading}>
              アドバイスをもらう
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
