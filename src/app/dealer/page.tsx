'use client';

import { useState } from 'react';
import { ChevronLeft, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import CoreMetrics from '@/components/dealer/CoreMetrics';
import MonthlySalesTrend from '@/components/dealer/MonthlySalesTrend';
import IndustryProgressPanel from '@/components/dealer/IndustryProgressPanel';
import DiscountReturnRateTrend from '@/components/dealer/DiscountReturnRateTrend';
import NationalIndustryDistribution from '@/components/dealer/NationalIndustryDistribution';
import CustomerGradingOnline from '@/components/dealer/CustomerGradingOnline';
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

      {/* 主内容区域 - 两行三列布局 */}
      <main className="flex-1 flex flex-col w-full px-4 py-4">
        <div className="flex flex-col gap-4 flex-1">
          {/* 第一行：核心指标 + 月度销售趋势 + 细分行业进展 */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-0">
            {/* 核心指标 - 占2列 */}
            <div className="xl:col-span-2 flex flex-col min-h-0">
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

            {/* 月度销售趋势 - 占4列 */}
            <div className="xl:col-span-4 flex flex-col min-h-0">
              <MonthlySalesTrend showTitle={false} />
            </div>

            {/* 细分行业进展 - 占6列 */}
            <div className="xl:col-span-6 flex flex-col min-h-0">
              <IndustryProgressPanel showTitle={false} />
            </div>
          </div>

          {/* 第二行：折扣折让率与退机率趋势 + 全国行业分布 + 客户分级在线 */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-0">
            {/* 折扣折让率与退机率趋势 - 占4列 */}
            <div className="xl:col-span-4 flex flex-col min-h-0">
              <DiscountReturnRateTrend showTitle={false} />
            </div>

            {/* 全国行业分布 - 占4列 */}
            <div className="xl:col-span-4 flex flex-col min-h-0">
              <NationalIndustryDistribution showTitle={false} />
            </div>

            {/* 客户分级在线 - 占4列 */}
            <div className="xl:col-span-4 flex flex-col min-h-0">
              <CustomerGradingOnline showTitle={false} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
