'use client';

import { useState } from 'react';
import { TrendingUp, AlertTriangle, ChevronLeft, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CoreMetrics from '@/components/dealer/CoreMetrics';
import DealerFinancialMetrics from '@/components/dealer/DealerFinancialMetrics';
import MarketInsightsPanel from '@/components/dealer/MarketInsightsPanel';
import ProjectDevelopmentPanel from '@/components/dealer/ProjectDevelopmentPanel';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// 页面标题
const PAGE_TITLE = '经销商销售预测';

// 时间范围类型
type TimeRange = 'current' | 'quarter' | 'year';

export default function DealerPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('current');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-cyan-50">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/gm">
              <button className="rounded-lg p-2 hover:bg-cyan-500/10 transition-colors">
                <ChevronLeft className="h-5 w-5 text-cyan-400" />
              </button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {PAGE_TITLE}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* 时间范围选择 */}
            <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-1 border border-cyan-500/20">
              {(['current', 'quarter', 'year'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                    timeRange === range
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                      : 'text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10'
                  )}
                >
                  {range === 'current' ? '本月' : range === 'quarter' ? '季度' : '年度'}
                </button>
              ))}
            </div>
            {/* 实时数据标识 */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-cyan-300">实时数据</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 - 三栏布局 */}
      <main className="flex-1 flex flex-col w-full px-4 py-4">
        {/* 驾驶舱风格布局 - 三栏 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
          {/* 左侧：核心指标 - 占3列 */}
          <div className="xl:col-span-3 flex flex-col">
            <Card className={cn(
              'backdrop-blur-xl border-2 flex-1 flex flex-col',
              'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
            )}>
              <CardContent className="p-4 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-base font-semibold text-cyan-300/90">核心指标</h3>
                </div>
                <CoreMetrics timeRange={timeRange} />
              </CardContent>
            </Card>
          </div>

          {/* 中间：月度销售趋势 - 占6列 */}
          <div className="xl:col-span-6 flex flex-col">
            <Card className={cn(
              'backdrop-blur-xl border-2 flex-1 flex flex-col',
              'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
            )}>
              <CardContent className="p-4 flex-1">
                <DealerFinancialMetrics showTitle={false} />
              </CardContent>
            </Card>
          </div>

          {/* 右侧：市场洞察及风险分析 - 占3列 */}
          <div className="xl:col-span-3 flex flex-col">
            <Card className={cn(
              'backdrop-blur-xl border-2 flex-1 flex flex-col',
              'bg-slate-900/60 border-red-500/30 shadow-lg shadow-red-500/10'
            )}>
              <CardContent className="p-4 flex-1">
                <MarketInsightsPanel timeRange={timeRange} showTitle={false} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 项目开发分析 - 占满整行 */}
        <div className="mt-4">
          <Card className={cn(
            'backdrop-blur-xl border-2',
            'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
          )}>
            <CardContent className="p-4">
              <ProjectDevelopmentPanel timeRange={timeRange} showTitle={false} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
