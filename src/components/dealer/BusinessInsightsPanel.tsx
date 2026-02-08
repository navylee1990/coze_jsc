'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, AlertTriangle, CheckCircle2, DollarSign, Target, BarChart3, Lightbulb, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

// 时间范围类型
type TimeRange = 'current' | 'quarter' | 'year';

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

// 行业细分深度分析
const industryDeepDive = [
  {
    industry: '幼教',
    category: '教育',
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
    category: '教育',
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
    category: '教育',
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
  {
    industry: '国央企',
    category: '企业',
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
    category: '企业',
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
    category: '企业',
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
    category: '企业',
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
  {
    industry: '金融',
    category: '金融',
    target: 4500,
    actual: 4500,
    rate: 100,
    margin: 28,
    productMix: { premium: 65, standard: 30, budget: 5 },
    status: '优秀',
    insight: '完美达成！毛利率最高（28%），高价值产品占比65%。',
    actions: ['扩大金融行业投入', '培养金融行业专家团队'],
    priority: '低',
  },
  {
    industry: '医疗',
    category: '医疗',
    target: 3000,
    actual: 2675,
    rate: 89,
    margin: 24,
    productMix: { premium: 55, standard: 35, budget: 10 },
    status: '良好',
    insight: '表现良好，产品配置合理。但项目周期较长。',
    actions: ['优化项目交付效率', '标准化医疗行业解决方案'],
    priority: '中',
  },
  {
    industry: '政府',
    category: '政府',
    target: 5000,
    actual: 4250,
    rate: 85,
    margin: 15,
    productMix: { premium: 15, standard: 45, budget: 40 },
    status: '需关注',
    insight: '虽然完成率85%，但毛利率低（15%）。预算型产品占比40%，利润微薄。',
    actions: ['降低政府业务占比', '提升政府项目报价', '转向智慧政府高价值方案'],
    priority: '高',
  },
];

// 整体建议
const overallRecommendations = [
  {
    category: '紧急行动',
    icon: AlertTriangle,
    color: 'text-red-400 bg-red-500/10 border-red-500/30',
    items: [
      {
        title: '砍掉低利润业务',
        description: '水处理业务毛利率仅12%，预算型产品占比60%，建议立即收缩或提高报价门槛',
        impact: '预计可提升整体毛利率2-3个百分点',
      },
      {
        title: '优化民营客户结构',
        description: '民营客户预算型产品占比30%，利润率低，应聚焦中高价值客户',
        impact: '预计可提升民营企业毛利率5个百分点',
      },
      {
        title: '调整政府业务策略',
        description: '政府业务毛利率15%，预算型产品占比40%，建议降低占比至30%以下',
        impact: '预计可提升整体毛利率1-2个百分点',
      },
    ],
  },
  {
    category: '重点投入',
    icon: TrendingUp,
    color: 'text-green-400 bg-green-500/10 border-green-500/30',
    items: [
      {
        title: '扩大金融行业覆盖',
        description: '金融行业毛利率最高（28%），完成率100%，是优质赛道',
        impact: '每增加1000万金融业务，可多贡献280万毛利',
      },
      {
        title: '加强外资客户开发',
        description: '外资客户超额完成，高价值产品占比70%，客户接受度高',
        impact: '外资客户毛利率26%，应作为重点拓展方向',
      },
      {
        title: '提升国央企业务',
        description: '国央企稳定、毛利率高（24%），是核心收入来源',
        impact: '保持当前策略，扩大覆盖范围',
      },
    ],
  },
  {
    category: '持续优化',
    icon: Lightbulb,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    items: [
      {
        title: '优化幼教产品配置',
        description: '幼教预算型产品占比20%，应减少至10%',
        impact: '预计可提升幼教毛利率3-4个百分点',
      },
      {
        title: '优化高校项目回款',
        description: '高校项目周期长影响现金流，需优化回款策略',
        impact: '预计可缩短回款周期15-20天',
      },
      {
        title: '标准化医疗解决方案',
        description: '医疗行业项目周期长，需标准化解决方案提升效率',
        impact: '预计可提升交付效率20%',
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
    case '低': return 'text-green-400 bg-green-500/20 border-green-500/40';
    default: return 'text-gray-400 bg-gray-500/20 border-gray-500/40';
  }
};

const getGrowthIcon = (growth: number) => {
  if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-green-400" />;
  if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-cyan-400" />;
};

export default function BusinessInsightsPanel({ timeRange = 'current', showTitle = false }: { timeRange?: TimeRange, showTitle?: boolean }) {
  return (
    <div className="space-y-4">
      {/* 标题（可选） */}
      {showTitle && (
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-50">业务洞察与指导</h2>
        </div>
      )}

      {/* 整体建议卡片 */}
      <div className="space-y-3">
        {overallRecommendations.map((rec, idx) => (
          <Card key={idx} className={cn(
            'backdrop-blur-xl border-2',
            rec.color,
            'shadow-lg'
          )}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <rec.icon className="h-5 w-5" />
                {rec.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {rec.items.map((item, itemIdx) => (
                <div key={itemIdx} className="bg-slate-900/50 rounded-lg p-3 border border-white/10">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-cyan-50 mb-1">{item.title}</div>
                      <div className="text-xs text-cyan-300/70 mb-2">{item.description}</div>
                      <div className="text-xs text-green-400 font-medium">💡 预期收益：{item.impact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 赛道定位分析 */}
      <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
            <Target className="h-4 w-4 text-cyan-400" />
            当前赛道定位分析
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                      <div className="w-24 h-2 bg-slate-700/50 rounded-full overflow-hidden">
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
                  <div className="text-cyan-300/70">营收占比: <span className="font-semibold text-cyan-50">{track.percentage}%</span></div>
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

      {/* 行业细分深度分析 */}
      <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
            行业细分深度分析
          </CardTitle>
          <div className="text-xs text-cyan-300/70 mt-1">
            分析每个细分行业的完成率、盈利能力、产品配置合理性
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {industryDeepDive.map((item, idx) => (
              <div key={idx} className="bg-slate-800/30 rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.category}
                    </span>
                    <span className="font-semibold text-sm text-cyan-50">{item.industry}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded border', getStatusColor(item.status))}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded border", getPriorityColor(item.priority))}>
                      优先级: {item.priority}
                    </span>
                  </div>
                </div>

                {/* 关键指标 */}
                <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                  <div className="text-cyan-300/70">
                    目标: <span className="font-semibold text-cyan-50">{item.target}万</span>
                  </div>
                  <div className="text-cyan-300/70">
                    实际: <span className="font-semibold text-cyan-50">{item.actual}万</span>
                  </div>
                  <div className="text-cyan-300/70">
                    完成率: <span className={cn('font-semibold', item.rate >= 100 ? 'text-green-400' : item.rate >= 80 ? 'text-yellow-400' : 'text-red-400')}>{item.rate}%</span>
                  </div>
                  <div className="text-cyan-300/70">
                    毛利率: <span className={cn('font-semibold', item.margin >= 20 ? 'text-green-400' : item.margin >= 15 ? 'text-yellow-400' : 'text-red-400')}>{item.margin}%</span>
                  </div>
                </div>

                {/* 产品配置分析 */}
                <div className="mb-2">
                  <div className="text-xs text-cyan-300/70 mb-1">产品配置：</div>
                  <div className="flex gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-cyan-300/70">高端 {item.productMix.premium}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                      <span className="text-cyan-300/70">标准 {item.productMix.standard}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-cyan-300/70">预算 {item.productMix.budget}%</span>
                    </div>
                  </div>
                </div>

                {/* 洞察 */}
                <div className="text-xs mb-2 p-2 bg-slate-900/50 rounded border border-white/5">
                  <span className="text-cyan-400 font-medium">📊 洞察：</span>
                  <span className="text-cyan-300/70 ml-1">{item.insight}</span>
                </div>

                {/* 行动建议 */}
                <div className="text-xs">
                  <span className="text-green-400 font-medium">✅ 行动建议：</span>
                  <ul className="mt-1 space-y-0.5 ml-4 list-disc">
                    {item.actions.map((action, actionIdx) => (
                      <li key={actionIdx} className="text-cyan-300/70">{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 盈利能力总览 */}
      <Card className="backdrop-blur-xl border-2 border-green-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-green-500/10">
        <CardHeader>
          <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            盈利能力总览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="text-xs text-green-400 mb-1">高利润业务（≥25%）</div>
              <div className="text-2xl font-bold text-green-400 mb-1">28%</div>
              <div className="text-xs text-cyan-300/70">金融、外资</div>
              <div className="text-xs text-green-300 mt-1">✅ 应重点投入</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="text-xs text-yellow-400 mb-1">中利润业务（15-25%）</div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">20%</div>
              <div className="text-xs text-cyan-300/70">国央企、医疗、高校</div>
              <div className="text-xs text-yellow-300 mt-1">⚠️ 优化产品配置</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
              <div className="text-xs text-orange-400 mb-1">低利润业务（10-15%）</div>
              <div className="text-2xl font-bold text-orange-400 mb-1">15%</div>
              <div className="text-xs text-cyan-300/70">政府</div>
              <div className="text-xs text-orange-300 mt-1">⚠️ 降低占比或提价</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="text-xs text-red-400 mb-1">微利业务（&lt;15%）</div>
              <div className="text-2xl font-bold text-red-400 mb-1">12%</div>
              <div className="text-xs text-cyan-300/70">水处理</div>
              <div className="text-xs text-red-300 mt-1">❌ 建议收缩或退出</div>
            </div>
          </div>
          <div className="text-xs text-cyan-300/70 p-3 bg-slate-900/50 rounded-lg border border-white/10">
            <span className="text-green-400 font-semibold">💰 盈利建议：</span>
            <span className="ml-1">将资源从低利润业务（水处理、政府）向高利润业务（金融、外资）转移，预计可将整体毛利率从当前的20%提升至23-25%。</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
