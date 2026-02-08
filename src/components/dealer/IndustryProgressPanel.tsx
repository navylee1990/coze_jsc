'use client';

import { Building2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 细分行业数据
const industryData = [
  { name: '商用空调', target: 3000, completed: 2480, forecast: 2650, growth: 12.5 },
  { name: '家用空调', target: 2500, completed: 2100, forecast: 2280, growth: 8.6 },
  { name: '中央空调', target: 1800, completed: 1620, forecast: 1750, growth: 15.2 },
  { name: '空气能热泵', target: 1500, completed: 1380, forecast: 1450, growth: 10.3 },
  { name: '新风系统', target: 1200, completed: 1080, forecast: 1150, growth: 6.4 },
  { name: '热水系统', target: 1000, completed: 920, forecast: 980, growth: 7.8 },
  { name: '空调配件', target: 800, completed: 760, forecast: 790, growth: 9.2 },
  { name: '商用厨电', target: 700, completed: 640, forecast: 680, growth: 5.6 },
];

export default function IndustryProgressPanel({ showTitle = false }: { showTitle?: boolean }) {
  return (
    <div className="h-full flex flex-col">
      {/* 标题（可选） */}
      {showTitle && (
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-cyan-50">细分行业进展</h2>
        </div>
      )}

      {/* 细分行业进展卡片 */}
      <Card className={cn(
        'backdrop-blur-xl border-2 flex-1 flex flex-col',
        'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
      )}>
        <CardHeader className="pb-4">
          <CardTitle className={cn('text-base font-semibold text-cyan-300/80', 'flex items-center gap-2')}>
            <Building2 className="h-4 w-4" />
            细分行业进展
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden">
          {/* 可滚动内容区域 */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {industryData.map((industry, index) => {
              const completedPercentage = Math.min((industry.completed / industry.target) * 100, 100);
              const forecastPercentage = Math.min((industry.forecast / industry.target) * 100, 100);
              const isOnTrack = industry.completed >= industry.target * 0.8;

              return (
                <div key={index} className="space-y-2">
                  {/* 行业名称和增长率 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className={cn(
                        'h-3.5 w-3.5',
                        isOnTrack ? 'text-green-400' : 'text-yellow-400'
                      )} />
                      <span className="text-sm font-medium text-cyan-100/90">{industry.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded',
                        isOnTrack
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      )}>
                        {industry.growth > 0 ? '+' : ''}{industry.growth}%
                      </span>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="relative h-6 bg-slate-800/60 rounded-full overflow-hidden border border-slate-700/50">
                    {/* 已完成进度 */}
                    <div
                      className={cn(
                        'absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out',
                        isOnTrack
                          ? 'bg-gradient-to-r from-green-600 to-green-400'
                          : 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                      )}
                      style={{
                        width: `${completedPercentage}%`,
                        boxShadow: isOnTrack
                          ? '0 0 10px rgba(74,222,128,0.6)'
                          : '0 0 10px rgba(250,204,21,0.6)',
                      }}
                    />
                    {/* 预计进度（虚线指示） */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-cyan-400/80"
                      style={{
                        left: `${forecastPercentage}%`,
                      }}
                    >
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* 数值显示 */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400">目标: <span className="text-cyan-200/80 font-medium">{industry.target}万</span></span>
                      <span className="text-green-400">已完成: <span className="font-semibold">{industry.completed}万</span></span>
                    </div>
                    <span className="text-cyan-300/70">预计: {industry.forecast}万</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
