'use client';

import { Users, Crown, Diamond, Medal, CircleDot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 客户分级数据
const customerGrades = [
  {
    name: 'VIP客户',
    icon: Crown,
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/30',
    count: 42,
    online: 38,
    totalSales: 8500,
    avgSales: 202.38,
  },
  {
    name: '钻石客户',
    icon: Diamond,
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    count: 86,
    online: 75,
    totalSales: 12800,
    avgSales: 148.84,
  },
  {
    name: '黄金客户',
    icon: Medal,
    color: 'from-yellow-500 to-orange-500',
    borderColor: 'border-yellow-500/30',
    count: 156,
    online: 132,
    totalSales: 18500,
    avgSales: 118.59,
  },
  {
    name: '普通客户',
    icon: CircleDot,
    color: 'from-slate-500 to-slate-400',
    borderColor: 'border-slate-500/30',
    count: 324,
    online: 268,
    totalSales: 24600,
    avgSales: 75.93,
  },
];

export default function CustomerGradingOnline({ showTitle = false }: { showTitle?: boolean }) {
  return (
    <div className="h-full flex flex-col">
      {/* 标题（可选） */}
      {showTitle && (
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-cyan-50">客户分级在线</h2>
        </div>
      )}

      {/* 客户分级在线卡片 */}
      <Card className={cn(
        'backdrop-blur-xl border-2 flex-1 flex flex-col',
        'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
      )}>
        <CardHeader className="pb-4">
          <CardTitle className={cn('text-base font-semibold text-cyan-300/80', 'flex items-center gap-2')}>
            <Users className="h-4 w-4" />
            客户分级在线
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-3 h-full">
            {customerGrades.map((grade, index) => {
              const Icon = grade.icon;
              const onlinePercentage = Math.round((grade.online / grade.count) * 100);

              return (
                <div
                  key={index}
                  className={cn(
                    'relative p-4 rounded-xl border-2 overflow-hidden',
                    'bg-gradient-to-br',
                    grade.color,
                    'opacity-90 hover:opacity-100 transition-opacity duration-300',
                    grade.borderColor
                  )}
                >
                  {/* 背景装饰 */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />

                  {/* 标题行 */}
                  <div className="relative flex items-center gap-2 mb-3">
                    <Icon className="h-5 w-5 text-white/90" />
                    <span className="text-sm font-bold text-white/95">{grade.name}</span>
                  </div>

                  {/* 在线状态 */}
                  <div className="relative flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-white/80">
                      在线: <span className="font-semibold text-white">{grade.online}</span>
                    </span>
                    <span className="text-xs text-white/60">
                      / 总数: <span className="font-medium">{grade.count}</span>
                    </span>
                  </div>

                  {/* 在线率 */}
                  <div className="relative mb-3">
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/90 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${onlinePercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-white/70">在线率</span>
                      <span className="text-xs font-semibold text-white/90">{onlinePercentage}%</span>
                    </div>
                  </div>

                  {/* 销售数据 */}
                  <div className="relative space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">总销售额</span>
                      <span className="text-xs font-bold text-white/95">{grade.totalSales.toLocaleString()}万</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">平均销售额</span>
                      <span className="text-xs font-semibold text-white/90">{grade.avgSales.toFixed(2)}万</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 总计统计 */}
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-cyan-100/80">客户总计</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-slate-400">总客户数</div>
                  <div className="text-sm font-bold text-cyan-300">
                    {customerGrades.reduce((sum, g) => sum + g.count, 0)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">在线客户</div>
                  <div className="text-sm font-bold text-green-400">
                    {customerGrades.reduce((sum, g) => sum + g.online, 0)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">总销售额</div>
                  <div className="text-sm font-bold text-cyan-300">
                    {customerGrades.reduce((sum, g) => sum + g.totalSales, 0).toLocaleString()}万
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
