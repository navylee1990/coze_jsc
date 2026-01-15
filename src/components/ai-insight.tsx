'use client';

import { useAIInsight } from '@/hooks/useAIInsight';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles } from 'lucide-react';

interface AIInsightProps {
  chartType: string;
  data: any;
}

export function AIInsight({ chartType, data }: AIInsightProps) {
  const { content, isLoading, error, regenerate } = useAIInsight(chartType, data);

  return (
    <div className="p-3 bg-blue-50 rounded-lg">
      <div className="flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs text-blue-800 mb-2 font-medium">AI 智能分析：</p>
          <div className="text-xs text-blue-700 leading-relaxed min-h-[40px]">
            {isLoading && <span className="text-blue-400">正在分析数据...</span>}
            {error && <span className="text-red-600">分析失败：{error}</span>}
            {!isLoading && !error && content && <span>{content}</span>}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
          onClick={regenerate}
          disabled={isLoading}
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
}
