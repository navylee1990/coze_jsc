'use client';

import { useState } from 'react';
import { TrendingUp, AlertTriangle, ChevronLeft, Target, BarChart3, DollarSign, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CoreMetrics from '@/components/dealer/CoreMetrics';
import DealerFinancialMetrics from '@/components/dealer/DealerFinancialMetrics';
import ProjectDevelopmentPanel from '@/components/dealer/ProjectDevelopmentPanel';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// 页面标题
const PAGE_TITLE = '经销商销售预测';

// 时间范围类型
type TimeRange = 'current' | 'quarter' | 'year';

// 简化的赛道数据
const trackSummary = [
  { name: '教育', percentage: 35, health: 85, margin: 18, status: 'good' },
  { name: '企业', percentage: 30, health: 65, margin: 22, status: 'warning' },
  { name: '金融', percentage: 15, health: 92, margin: 28, status: 'excellent' },
  { name: '医疗', percentage: 12, health: 78, margin: 24, status: 'good' },
  { name: '政府', percentage: 8, health: 55, margin: 15, status: 'risk' },
];

// 整体建议摘要
const quickActions = [
  { type: '紧急', icon: AlertTriangle, color: 'text-red-400 bg-red-500/10 border-red-500/30', items: ['砍掉水处理业务', '优化民营客户'] },
  { type: '重点', icon: TrendingUp, color: 'text-green-400 bg-green-500/10 border-green-500/30', items: ['扩大金融行业', '加强外资客户'] },
  { type: '优化', icon: Lightbulb, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', items: ['优化产品配置', '提升回款效率'] },
];

// 行业关键洞察（简化版）
const keyInsights = [
  { industry: '幼教', rate: 48, margin: 16, budgetRatio: 20, status: '需加强', priority: '高' },
  { industry: 'K12', rate: 91, margin: 19, budgetRatio: 15, status: '良好', priority: '中' },
  { industry: '高校', rate: 82, margin: 20, budgetRatio: 10, status: '良好', priority: '低' },
  { industry: '国央企', rate: 85, margin: 24, budgetRatio: 10, status: '良好', priority: '中' },
  { industry: '外资', rate: 105, margin: 26, budgetRatio: 5, status: '优秀', priority: '低' },
  { industry: '民营', rate: 80, margin: 18, budgetRatio: 30, status: '需关注', priority: '高' },
  { industry: '水处理', rate: 60, margin: 12, budgetRatio: 60, status: '需加强', priority: '高' },
  { industry: '金融', rate: 100, margin: 28, budgetRatio: 5, status: '优秀', priority: '低' },
  { industry: '医疗', rate: 89, margin: 24, budgetRatio: 10, status: '良好', priority: '中' },
  { industry: '政府', rate: 85, margin: 15, budgetRatio: 40, status: '需关注', priority: '高' },
];

// 辅助函数
const getStatusColor = (status: string) => {
  switch (status) {
    case '优秀': return 'text-green-400 bg-green-500/20 border-green-500/40';
    case '良好': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40';
    case '需关注': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
    case '需加强': return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
    case '风险': return 'text-red-400 bg-red-500/20 border-red-500/40';
    default: return 'text-gray-400 bg-gray-500/20 border-gray-500/40';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case '高': return 'text-red-400';
    case '中': return 'text-yellow-400';
    case '低': return 'text-green-400';
    default: return 'text-gray-400';
  }
};

const getHealthColor = (health: number) => {
  if (health >= 85) return 'bg-green-500';
  if (health >= 70) return 'bg-cyan-500';
  if (health >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function DealerPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('current');

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-cyan-50 overflow-hidden">
      {/* 顶部导航栏 - 固定高度 */}
      <div className="flex-shrink-0 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
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

      {/* 主内容区域 - 使用flex布局，内容可滚动 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 上半部分：三栏布局 */}
        <div className="flex-1 overflow-hidden px-4 py-3">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 h-full">
            {/* 左侧：核心指标 - 占2列 */}
            <div className="xl:col-span-2 flex flex-col h-full overflow-hidden">
              <Card className={cn(
                'backdrop-blur-xl border-2 flex-1 flex flex-col overflow-hidden',
                'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
              )}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-cyan-400" />
                    <CardTitle className="text-base font-semibold text-cyan-300/90">核心指标</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-3 flex-1 overflow-auto">
                  <CoreMetrics timeRange={timeRange} />
                </CardContent>
              </Card>
            </div>

            {/* 中间：月度销售趋势 - 占5列 */}
            <div className="xl:col-span-5 flex flex-col h-full overflow-hidden">
              <Card className={cn(
                'backdrop-blur-xl border-2 flex-1 flex flex-col overflow-hidden',
                'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
              )}>
                <CardContent className="p-3 flex-1 overflow-auto">
                  <DealerFinancialMetrics showTitle={false} />
                </CardContent>
              </Card>
            </div>

            {/* 右侧：业务洞察 - 占5列，分栏显示 */}
            <div className="xl:col-span-5 flex flex-col gap-3 h-full overflow-hidden">
              {/* 快速行动建议 */}
              <Card className={cn(
                'backdrop-blur-xl border-2 flex-shrink-0',
                'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-cyan-300/90 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-cyan-400" />
                    快速行动
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="grid grid-cols-3 gap-2">
                    {quickActions.map((action, idx) => (
                      <div key={idx} className={cn('rounded-lg border p-2', action.color)}>
                        <div className="flex items-center gap-1 mb-1">
                          <action.icon className="h-3 w-3" />
                          <span className="text-xs font-semibold">{action.type}</span>
                        </div>
                        <div className="space-y-0.5">
                          {action.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="text-xs text-cyan-300/80 truncate" title={item}>
                              • {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 赛道定位 - 简化版 */}
              <Card className={cn(
                'backdrop-blur-xl border-2 flex-1 flex flex-col overflow-hidden',
                'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-cyan-300/90 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-cyan-400" />
                    赛道定位
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 flex-1 overflow-auto">
                  <div className="space-y-2">
                    {trackSummary.map((track, idx) => (
                      <div key={idx} className="bg-slate-800/30 rounded p-2 border border-white/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-cyan-50">{track.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-cyan-300/70">{track.percentage}%</span>
                            <div className="w-12 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                              <div className={cn('h-full rounded-full', getHealthColor(track.health))} style={{ width: `${track.health}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={cn('text-cyan-300/70', track.margin >= 20 ? 'text-green-400' : track.margin >= 15 ? 'text-yellow-400' : 'text-red-400')}>
                            毛利率: {track.margin}%
                          </span>
                          <span className={cn('text-xs px-1.5 py-0.5 rounded border', getStatusColor(track.status === 'excellent' ? '优秀' : track.status === 'good' ? '良好' : track.status === 'warning' ? '需关注' : '风险'))}>
                            {track.status === 'excellent' ? '优秀' : track.status === 'good' ? '良好' : track.status === 'warning' ? '需关注' : '风险'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* 下半部分：项目开发分析 - 固定高度 */}
        <div className="flex-shrink-0 h-64 px-4 pb-3">
          <Card className={cn(
            'backdrop-blur-xl border-2 h-full flex flex-col',
            'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
          )}>
            <CardContent className="p-3 flex-1 overflow-auto">
              <ProjectDevelopmentPanel timeRange={timeRange} showTitle={false} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
