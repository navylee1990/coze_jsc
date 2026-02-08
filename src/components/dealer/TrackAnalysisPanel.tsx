'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Target, ArrowUpRight, ArrowDownRight, AlertTriangle, TrendingUp, ChevronRight, ChevronDown } from 'lucide-react';

// 赛道数据（包含细分行业）
const trackData = [
  {
    name: '教育',
    growth: 12,
    healthScore: 85,
    totalAmount: 10000,
    margin: 18,
    subcategories: [
      {
        industry: '幼教',
        target: 2000,
        actual: 960,
        rate: 48,
        margin: 16,
        productMix: { premium: 30, standard: 50, budget: 20 },
        status: '需加强',
        insight: '完成率仅48%，低价竞争激烈。预算型产品占比20%拉低利润。',
        actions: ['减少预算型产品至10%', '增加幼教增值服务', '提升标准化销售效率'],
        priority: '高',
      },
      {
        industry: 'K12',
        target: 3000,
        actual: 2720,
        rate: 91,
        margin: 19,
        status: '良好',
        priority: '低',
      },
      {
        industry: '高校含BOT',
        target: 5000,
        actual: 4100,
        rate: 82,
        margin: 20,
        status: '良好',
        priority: '低',
      },
    ],
  },
  {
    name: '企业',
    growth: -5,
    healthScore: 65,
    totalAmount: 8000,
    margin: 22,
    subcategories: [
      {
        industry: '民营',
        target: 3500,
        actual: 2800,
        rate: 80,
        margin: 18,
        productMix: { premium: 20, standard: 50, budget: 30 },
        status: '需关注',
        insight: '利润偏低，预算型产品占比30%，价格敏感度高。',
        actions: ['减少预算型产品', '聚焦中高价值民营客户', '提升服务差异化'],
        priority: '高',
      },
      {
        industry: '水处理',
        target: 1500,
        actual: 900,
        rate: 60,
        margin: 12,
        productMix: { premium: 10, standard: 30, budget: 60 },
        status: '需加强',
        insight: '完成率仅60%，毛利率最低（12%），预算型产品占比60%。',
        actions: ['大幅减少水处理业务', '提高报价门槛', '转向高端水处理方案'],
        priority: '高',
      },
      {
        industry: '国央企',
        target: 4000,
        actual: 3400,
        rate: 85,
        margin: 24,
        status: '良好',
        priority: '低',
      },
      {
        industry: '外资',
        target: 2500,
        actual: 2620,
        rate: 105,
        margin: 26,
        status: '优秀',
        priority: '低',
      },
    ],
  },
  {
    name: '金融',
    growth: 25,
    healthScore: 92,
    totalAmount: 4500,
    margin: 28,
    subcategories: [
      {
        industry: '银行',
        target: 2500,
        actual: 2500,
        rate: 100,
        margin: 28,
        status: '优秀',
        priority: '低',
      },
      {
        industry: '保险',
        target: 1000,
        actual: 950,
        rate: 95,
        margin: 27,
        status: '优秀',
        priority: '低',
      },
      {
        industry: '证券',
        target: 1000,
        actual: 1050,
        rate: 105,
        margin: 29,
        status: '优秀',
        priority: '低',
      },
    ],
  },
  {
    name: '医疗',
    growth: 8,
    healthScore: 78,
    totalAmount: 3000,
    margin: 24,
    subcategories: [
      {
        industry: '医院',
        target: 2000,
        actual: 1780,
        rate: 89,
        margin: 24,
        status: '良好',
        priority: '低',
      },
      {
        industry: '诊所',
        target: 500,
        actual: 560,
        rate: 112,
        margin: 22,
        status: '优秀',
        priority: '低',
      },
      {
        industry: '体检中心',
        target: 500,
        actual: 660,
        rate: 132,
        margin: 26,
        status: '优秀',
        priority: '低',
      },
    ],
  },
  {
    name: '政府',
    growth: -10,
    healthScore: 55,
    totalAmount: 2000,
    margin: 15,
    subcategories: [
      {
        industry: '政府机关',
        target: 3000,
        actual: 2550,
        rate: 85,
        margin: 15,
        productMix: { premium: 15, standard: 45, budget: 40 },
        status: '需关注',
        insight: '毛利率低（15%），预算型产品占比40%，利润微薄。',
        actions: ['降低政府业务占比', '提升政府项目报价', '转向智慧政府高价值方案'],
        priority: '高',
      },
    ],
  },
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

const getPriorityIcon = (priority: string) => {
  if (priority === '高') return <AlertTriangle className="h-3 w-3 text-red-400" />;
  if (priority === '中') return <TrendingUp className="h-3 w-3 text-yellow-400" />;
  return null;
};

export default function TrackAnalysisPanel() {
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  const [expandedDetail, setExpandedDetail] = useState<string | null>(null);

  return (
    <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-cyan-50 font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-cyan-400" />
            <span>赛道定位分析</span>
          </div>
          <div className="text-xs text-cyan-300/70 font-normal">
            仅显示需关注的细分行业
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {trackData.map((track, trackIdx) => {
            // 只显示有问题的细分行业
            const problematicSubs = track.subcategories.filter(
              sub => sub.status === '需加强' || sub.status === '需关注' || sub.status === '风险'
            );

            // 如果没有问题，不显示
            if (problematicSubs.length === 0) return null;

            return (
              <div key={trackIdx} className="bg-slate-800/20 rounded-lg border border-white/10">
                {/* 赛道标题 */}
                <button
                  onClick={() => setExpandedTrack(expandedTrack === track.name ? null : track.name)}
                  className="w-full p-2.5 text-left hover:bg-slate-700/30 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {expandedTrack === track.name ? (
                      <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />
                    )}
                    <span className="font-semibold text-sm text-cyan-50">{track.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                      {problematicSubs.length}个需关注
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {track.growth > 0 ? (
                      <span className="text-green-400 flex items-center gap-0.5">
                        <ArrowUpRight className="h-3 w-3" />{track.growth}%
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-0.5">
                        <ArrowDownRight className="h-3 w-3" />{track.growth}%
                      </span>
                    )}
                  </div>
                </button>

                {/* 有问题的细分行业列表 */}
                {expandedTrack === track.name && (
                  <div className="px-2 pb-2 space-y-2">
                    {problematicSubs.map((sub, subIdx) => (
                      <div key={subIdx} className="bg-slate-800/50 rounded border border-white/10">
                        <button
                          onClick={() => setExpandedDetail(expandedDetail === sub.industry ? null : sub.industry)}
                          className="w-full p-2 text-left hover:bg-slate-700/30 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {expandedDetail === sub.industry ? (
                              <ChevronDown className="h-3 w-3 text-cyan-400" />
                            ) : (
                              <ChevronRight className="h-3 w-3 text-cyan-400" />
                            )}
                            <span className="text-sm font-semibold text-cyan-50">{sub.industry}</span>
                            {getPriorityIcon(sub.priority)}
                            <span className={cn('text-xs px-1.5 py-0.5 rounded border', getStatusColor(sub.status))}>
                              {sub.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <div className="text-center">
                              <div className={cn('font-bold', sub.rate >= 80 ? 'text-yellow-400' : 'text-red-400')}>
                                {sub.rate}%
                              </div>
                              <div className="text-cyan-400/60 text-[10px]">完成率</div>
                            </div>
                            <div className="text-center">
                              <div className={cn('font-bold', sub.margin >= 20 ? 'text-yellow-400' : 'text-red-400')}>
                                {sub.margin}%
                              </div>
                              <div className="text-cyan-400/60 text-[10px]">毛利率</div>
                            </div>
                          </div>
                        </button>

                        {/* 详细信息 */}
                        {expandedDetail === sub.industry && (
                          <div className="p-2.5 bg-slate-900/50 space-y-2 border-t border-white/5">
                            {/* 核心问题 */}
                            <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-xs text-red-400 font-medium mb-1">核心问题</div>
                                  <div className="text-xs text-cyan-300/70 leading-relaxed">{sub.insight}</div>
                                </div>
                              </div>
                            </div>

                            {/* 行动建议 */}
                            <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                              <div className="text-xs text-green-400 font-medium mb-1">✅ 紧急行动</div>
                              <ul className="text-xs text-cyan-300/70 space-y-0.5">
                                {sub.actions.map((action, actionIdx) => (
                                  <li key={actionIdx} className="flex items-start gap-2">
                                    <span className="text-green-400 mt-0.5">•</span>
                                    <span className="leading-relaxed">{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="mt-3 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
          <div className="text-xs text-cyan-300/70 flex items-start gap-2">
            <Target className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              仅展示需关注的细分行业（需加强/需关注）。其他表现良好的行业已隐藏，点击赛道名称可查看详情。
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
