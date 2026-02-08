'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Target, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

// 赛道数据
const trackData = [
  {
    name: '教育',
    percentage: 35,
    growth: 12,
    health: '良好',
    healthScore: 85,
    totalAmount: 10000,
    margin: 18,
    issues: ['幼教完成率不足', 'K12增长放缓'],
    suggestions: ['加强幼教渠道建设', 'K12转型在线教育方案'],
  },
  {
    name: '企业',
    percentage: 30,
    growth: -5,
    health: '需关注',
    healthScore: 65,
    totalAmount: 8000,
    margin: 22,
    issues: ['民营客户流失严重', '水处理项目利润低'],
    suggestions: ['优化民营客户服务', '提升水处理项目报价'],
  },
  {
    name: '金融',
    percentage: 15,
    growth: 25,
    health: '优秀',
    healthScore: 92,
    totalAmount: 4500,
    margin: 28,
    issues: [],
    suggestions: ['扩大金融行业覆盖'],
  },
  {
    name: '医疗',
    percentage: 12,
    growth: 8,
    health: '良好',
    healthScore: 78,
    totalAmount: 3000,
    margin: 24,
    issues: ['医院项目周期长'],
    suggestions: ['优化项目交付流程'],
  },
  {
    name: '政府',
    percentage: 8,
    growth: -10,
    health: '风险',
    healthScore: 55,
    totalAmount: 2000,
    margin: 15,
    issues: ['政府采购需求萎缩', '竞标压力大'],
    suggestions: ['转向智慧政府解决方案', '降低政府业务占比'],
  },
];

// 辅助函数
const getHealthColor = (score: number) => {
  if (score >= 85) return 'bg-green-500';
  if (score >= 70) return 'bg-cyan-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getGrowthIcon = (growth: number) => {
  if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-green-400" />;
  if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-cyan-400" />;
};

export default function TrackAnalysisPanel() {
  return (
    <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
          <Target className="h-4 w-4 text-cyan-400" />
          当前赛道定位分析
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {trackData.map((track, idx) => (
            <div key={idx} className="bg-slate-800/30 rounded-lg p-3 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-cyan-50">{track.name}</span>
                  {getGrowthIcon(track.growth)}
                  <span className={cn('text-xs font-medium', track.growth > 0 ? 'text-green-400' : track.growth < 0 ? 'text-red-400' : 'text-cyan-400')}>
                    {track.growth > 0 ? '+' : ''}{track.growth}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-cyan-300/70">健康度</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', getHealthColor(track.healthScore))}
                        style={{ width: `${track.healthScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-cyan-50">{track.healthScore}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div className="text-cyan-300/70">占比: <span className="font-semibold text-cyan-50">{track.percentage}%</span></div>
                <div className="text-cyan-300/70">金额: <span className="font-semibold text-cyan-50">{track.totalAmount}万</span></div>
                <div className="text-cyan-300/70">毛利率: <span className={cn('font-semibold', track.margin >= 20 ? 'text-green-400' : track.margin >= 15 ? 'text-yellow-400' : 'text-red-400')}>{track.margin}%</span></div>
              </div>
              {track.issues.length > 0 && (
                <div className="text-xs">
                  <span className="text-red-400 font-medium">⚠️ 问题：</span>
                  <span className="text-cyan-300/70 ml-1">{track.issues.join('、')}</span>
                </div>
              )}
              {track.suggestions.length > 0 && (
                <div className="text-xs mt-1">
                  <span className="text-cyan-400 font-medium">💡 建议：</span>
                  <span className="text-cyan-300/70 ml-1">{track.suggestions.join('、')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
