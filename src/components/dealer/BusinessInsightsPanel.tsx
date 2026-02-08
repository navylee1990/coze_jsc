'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DollarSign, BarChart3 } from 'lucide-react';

// 时间范围类型
type TimeRange = 'current' | 'quarter' | 'year';

// 盈利能力区间数据
const profitRanges = [
  {
    name: '高利润业务（≥25%）',
    margin: 28,
    industries: ['金融', '外资'],
    percentage: 42,
    status: '应重点投入',
    statusColor: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/30',
  },
  {
    name: '中利润业务（15-25%）',
    margin: 20,
    industries: ['国央企', '医疗', '高校', 'K12'],
    percentage: 38,
    status: '优化产品配置',
    statusColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/30',
  },
  {
    name: '低利润业务（10-15%）',
    margin: 15,
    industries: ['政府', '民营'],
    percentage: 15,
    status: '降低占比或提价',
    statusColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
  },
  {
    name: '微利业务（<15%）',
    margin: 12,
    industries: ['水处理'],
    percentage: 5,
    status: '建议收缩或退出',
    statusColor: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/30',
  },
];

export default function BusinessInsightsPanel({ timeRange = 'current', showTitle = false }: { timeRange?: TimeRange, showTitle?: boolean }) {
  return (
    <Card className="backdrop-blur-xl border-2 border-green-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-green-500/10 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-400" />
          盈利能力总览
        </CardTitle>
        <div className="text-xs text-cyan-300/70 mt-1">
          按毛利率区间分析业务分布，识别盈利能力强弱
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {profitRanges.map((range, idx) => (
            <div key={idx} className={`${range.bgColor} border rounded-lg p-3`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-cyan-50">{range.name}</div>
                <div className={cn('text-xs font-semibold', range.statusColor)}>{range.status}</div>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div>
                  <div className="text-xs text-cyan-300/70">平均毛利率</div>
                  <div className={cn('text-xl font-bold', range.statusColor)}>{range.margin}%</div>
                </div>
                <div>
                  <div className="text-xs text-cyan-300/70">营收占比</div>
                  <div className={cn('text-xl font-bold', range.statusColor)}>{range.percentage}%</div>
                </div>
              </div>
              <div className="text-xs text-cyan-300/70">
                涉及行业：{range.industries.join('、')}
              </div>
            </div>
          ))}

          {/* 盈利建议 */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-white/10">
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-cyan-300/70 space-y-2">
                <div className="text-green-400 font-semibold">💰 盈利提升策略：</div>
                <div>1. 将资源向高利润业务（金融、外资）倾斜，扩大覆盖范围</div>
                <div>2. 中利润业务优化产品配置，提升高价值产品占比</div>
                <div>3. 低利润和微利业务提高报价门槛，或逐步收缩退出</div>
                <div className="pt-1 text-yellow-300">
                  预计可将整体毛利率从当前的20%提升至23-25%
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
