'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Target, ArrowUpRight, ArrowDownRight, Minus, ChevronRight, ChevronDown } from 'lucide-react';

// 赛道数据（包含细分行业）
const trackData = [
  {
    name: '教育',
    percentage: 35,
    growth: 12,
    healthScore: 85,
    totalAmount: 10000,
    margin: 18,
    expanded: true, // 默认展开
    subcategories: [
      {
        industry: '幼教',
        target: 2000,
        actual: 960,
        rate: 48,
        margin: 16,
        productMix: { premium: 30, standard: 50, budget: 20 },
        status: '需加强',
        insight: '完成率仅48%，主要因为低价竞争激烈。产品配置中预算型产品占比20%，拉低了整体利润。',
        actions: ['减少预算型产品占比至10%', '增加幼教特色增值服务', '提升标准化产品销售效率'],
        priority: '高',
      },
      {
        industry: 'K12',
        target: 3000,
        actual: 2720,
        rate: 91,
        margin: 19,
        productMix: { premium: 40, standard: 45, budget: 15 },
        status: '良好',
        insight: '完成率91%，表现良好。高价值产品占比40%，产品配置合理。',
        actions: ['保持当前产品策略', '拓展在线教育解决方案'],
        priority: '中',
      },
      {
        industry: '高校含BOT',
        target: 5000,
        actual: 4100,
        rate: 82,
        margin: 20,
        productMix: { premium: 60, standard: 30, budget: 10 },
        status: '良好',
        insight: '大客户策略有效，高价值产品占比60%。但项目周期长影响回款。',
        actions: ['优化项目回款周期', '增加融资服务支持'],
        priority: '低',
      },
    ],
  },
  {
    name: '企业',
    percentage: 30,
    growth: -5,
    healthScore: 65,
    totalAmount: 8000,
    margin: 22,
    expanded: true,
    subcategories: [
      {
        industry: '国央企',
        target: 4000,
        actual: 3400,
        rate: 85,
        margin: 24,
        productMix: { premium: 50, standard: 40, budget: 10 },
        status: '良好',
        insight: '稳定客户，毛利率高。产品配置合理，高价值产品占比50%。',
        actions: ['扩大国央企覆盖范围', '提供定制化解决方案'],
        priority: '中',
      },
      {
        industry: '外资',
        target: 2500,
        actual: 2620,
        rate: 105,
        margin: 26,
        productMix: { premium: 70, standard: 25, budget: 5 },
        status: '优秀',
        insight: '超额完成！高价值产品占比70%，客户接受度高，是利润主要来源。',
        actions: ['保持高端定位', '增加外资客户投入'],
        priority: '低',
      },
      {
        industry: '民营',
        target: 3500,
        actual: 2800,
        rate: 80,
        margin: 18,
        productMix: { premium: 20, standard: 50, budget: 30 },
        status: '需关注',
        insight: '完成率刚好达标，但利润偏低。预算型产品占比30%，价格敏感度高。',
        actions: ['减少预算型产品占比', '聚焦中高价值民营企业', '提升服务差异化'],
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
        insight: '完成率仅60%，毛利率最低（12%）。预算型产品占比60%，几乎不赚钱。',
        actions: ['大幅减少水处理业务', '提高报价门槛', '或转向高端水处理解决方案'],
        priority: '高',
      },
    ],
  },
  {
    name: '金融',
    percentage: 15,
    growth: 25,
    healthScore: 92,
    totalAmount: 4500,
    margin: 28,
    expanded: true,
    subcategories: [
      {
        industry: '银行',
        target: 2500,
        actual: 2500,
        rate: 100,
        margin: 28,
        productMix: { premium: 65, standard: 30, budget: 5 },
        status: '优秀',
        insight: '完美达成！毛利率最高（28%），高价值产品占比65%。',
        actions: ['扩大金融行业投入', '培养金融行业专家团队'],
        priority: '低',
      },
      {
        industry: '保险',
        target: 1000,
        actual: 950,
        rate: 95,
        margin: 27,
        productMix: { premium: 60, standard: 35, budget: 5 },
        status: '优秀',
        insight: '表现优秀，高价值产品占比60%，客户接受度高。',
        actions: ['保持当前策略', '拓展保险行业覆盖'],
        priority: '低',
      },
      {
        industry: '证券',
        target: 1000,
        actual: 1050,
        rate: 105,
        margin: 29,
        productMix: { premium: 70, standard: 25, budget: 5 },
        status: '优秀',
        insight: '超额完成！高价值产品占比70%，盈利能力最强。',
        actions: ['加大证券行业投入', '提供高端定制方案'],
        priority: '低',
      },
    ],
  },
  {
    name: '医疗',
    percentage: 12,
    growth: 8,
    healthScore: 78,
    totalAmount: 3000,
    margin: 24,
    expanded: true,
    subcategories: [
      {
        industry: '医院',
        target: 2000,
        actual: 1780,
        rate: 89,
        margin: 24,
        productMix: { premium: 55, standard: 35, budget: 10 },
        status: '良好',
        insight: '表现良好，产品配置合理。但项目周期较长。',
        actions: ['优化项目交付效率', '标准化医疗行业解决方案'],
        priority: '中',
      },
      {
        industry: '诊所',
        target: 500,
        actual: 560,
        rate: 112,
        margin: 22,
        productMix: { premium: 45, standard: 40, budget: 15 },
        status: '优秀',
        insight: '超额完成！市场潜力大，可进一步拓展。',
        actions: ['扩大诊所市场覆盖', '标准化解决方案'],
        priority: '低',
      },
      {
        industry: '体检中心',
        target: 500,
        actual: 660,
        rate: 132,
        margin: 26,
        productMix: { premium: 50, standard: 40, budget: 10 },
        status: '优秀',
        insight: '超额完成32%！高价值产品占比50%，市场反应热烈。',
        actions: ['加大体检中心投入', '复制成功经验'],
        priority: '低',
      },
    ],
  },
  {
    name: '政府',
    percentage: 8,
    growth: -10,
    healthScore: 55,
    totalAmount: 2000,
    margin: 15,
    expanded: true,
    subcategories: [
      {
        industry: '政府机关',
        target: 3000,
        actual: 2550,
        rate: 85,
        margin: 15,
        productMix: { premium: 15, standard: 45, budget: 40 },
        status: '需关注',
        insight: '虽然完成率85%，但毛利率低（15%）。预算型产品占比40%，利润微薄。',
        actions: ['降低政府业务占比', '提升政府项目报价', '转向智慧政府高价值方案'],
        priority: '高',
      },
    ],
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
    case '高': return 'text-red-400 bg-red-500/20 border-red-500/40';
    case '中': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
    case '低': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40';
    default: return 'text-gray-400 bg-gray-500/20 border-gray-500/40';
  }
};

export default function TrackAnalysisPanel() {
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  const [expandedDetail, setExpandedDetail] = useState<string | null>(null);

  return (
    <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
          <Target className="h-4 w-4 text-cyan-400" />
          当前赛道定位分析
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {trackData.map((track, trackIdx) => (
            <div key={trackIdx} className="bg-slate-800/20 rounded-lg border border-white/10">
              {/* 赛道标题 */}
              <button
                onClick={() => setExpandedTrack(expandedTrack === track.name ? null : track.name)}
                className="w-full p-3 text-left hover:bg-slate-700/30 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {expandedTrack === track.name ? (
                    <ChevronDown className="h-4 w-4 text-cyan-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-cyan-400" />
                  )}
                  <span className="font-bold text-sm text-cyan-50">{track.name}</span>
                  {getGrowthIcon(track.growth)}
                  <span className={cn('text-xs font-medium', track.growth > 0 ? 'text-green-400' : track.growth < 0 ? 'text-red-400' : 'text-cyan-400')}>
                    {track.growth > 0 ? '+' : ''}{track.growth}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-cyan-300/70">{track.subcategories.length}个细分</span>
                  <span className="text-cyan-300/70">{track.totalAmount}万</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', getHealthColor(track.healthScore))}
                        style={{ width: `${track.healthScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-cyan-50">{track.healthScore}</span>
                  </div>
                </div>
              </button>

              {/* 细分行业列表 - 默认展开 */}
              {(expandedTrack === track.name || track.expanded) && (
                <div className="px-3 pb-3 space-y-2">
                  {track.subcategories.map((sub, subIdx) => (
                    <div key={subIdx} className="bg-slate-800/50 rounded border border-white/10">
                      <button
                        onClick={() => setExpandedDetail(expandedDetail === sub.industry ? null : sub.industry)}
                        className="w-full p-2.5 text-left hover:bg-slate-700/30 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {expandedDetail === sub.industry ? (
                            <ChevronDown className="h-3 w-3 text-cyan-400" />
                          ) : (
                            <ChevronRight className="h-3 w-3 text-cyan-400" />
                          )}
                          <span className="text-sm font-semibold text-cyan-50">{sub.industry}</span>
                          <span className={cn('text-xs px-1.5 py-0.5 rounded border', getStatusColor(sub.status))}>
                            {sub.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-cyan-400/60 text-[10px]">目标</div>
                            <div className="font-semibold text-cyan-50">{sub.target}万</div>
                          </div>
                          <div className="text-center">
                            <div className="text-cyan-400/60 text-[10px]">实际</div>
                            <div className="font-semibold text-cyan-50">{sub.actual}万</div>
                          </div>
                          <div className="text-center">
                            <div className="text-cyan-400/60 text-[10px]">完成率</div>
                            <div className={cn('font-semibold', sub.rate >= 100 ? 'text-green-400' : sub.rate >= 80 ? 'text-yellow-400' : 'text-red-400')}>
                              {sub.rate}%
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-cyan-400/60 text-[10px]">毛利率</div>
                            <div className={cn('font-semibold', sub.margin >= 20 ? 'text-green-400' : sub.margin >= 15 ? 'text-yellow-400' : 'text-red-400')}>
                              {sub.margin}%
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* 详细信息 */}
                      {expandedDetail === sub.industry && (
                        <div className="p-3 bg-slate-900/50 space-y-2 border-t border-white/5">
                          {/* 关键指标 */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-800/50 p-2 rounded flex items-center justify-between">
                              <span className="text-xs text-cyan-300/70">完成率</span>
                              <span className={cn('text-base font-bold', sub.rate >= 100 ? 'text-green-400' : sub.rate >= 80 ? 'text-yellow-400' : 'text-red-400')}>
                                {sub.rate}%
                              </span>
                            </div>
                            <div className="bg-slate-800/50 p-2 rounded flex items-center justify-between">
                              <span className="text-xs text-cyan-300/70">毛利率</span>
                              <span className={cn('text-base font-bold', sub.margin >= 20 ? 'text-green-400' : sub.margin >= 15 ? 'text-yellow-400' : 'text-red-400')}>
                                {sub.margin}%
                              </span>
                            </div>
                          </div>

                          {/* 产品配置 */}
                          <div className="bg-slate-800/50 p-2 rounded">
                            <div className="text-xs text-cyan-300/70 mb-1.5">产品配置分布</div>
                            <div className="flex gap-2 text-xs">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                <span className="text-cyan-300/70">高端</span>
                                <span className="font-semibold text-cyan-50">{sub.productMix.premium}%</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500"></div>
                                <span className="text-cyan-300/70">标准</span>
                                <span className="font-semibold text-cyan-50">{sub.productMix.standard}%</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <span className="text-cyan-300/70">预算</span>
                                <span className="font-semibold text-cyan-50">{sub.productMix.budget}%</span>
                              </div>
                            </div>
                          </div>

                          {/* 洞察 */}
                          <div className="bg-slate-800/50 p-2 rounded">
                            <div className="text-xs text-cyan-400 font-medium mb-1">📊 业务洞察</div>
                            <div className="text-xs text-cyan-300/70 leading-relaxed">{sub.insight}</div>
                          </div>

                          {/* 行动建议 */}
                          <div className="bg-slate-800/50 p-2 rounded">
                            <div className="text-xs text-green-400 font-medium mb-1">✅ 行动建议</div>
                            <ul className="text-xs text-cyan-300/70 space-y-0.5">
                              {sub.actions.map((action, actionIdx) => (
                                <li key={actionIdx} className="flex items-start gap-2">
                                  <span className="text-cyan-400 mt-0.5">•</span>
                                  <span className="leading-relaxed">{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 优先级 */}
                          <div className="flex justify-end">
                            <span className={cn('text-xs px-2 py-1 rounded border', getPriorityColor(sub.priority))}>
                              优先级: {sub.priority}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
