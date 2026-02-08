'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, TrendingUp, CheckCircle2, Clock, DollarSign, Target, ArrowUpRight, ArrowDownRight, Lightbulb, Zap, Shield, XCircle, AlertCircle } from 'lucide-react';

// 时间范围类型
type TimeRange = 'current' | 'quarter' | 'year';

// 项目风险分析
const projectRiskAnalysis = [
  {
    category: '高风险项目',
    count: 28,
    percentage: 11.2,
    amount: 2800,
    avgAmount: 100,
    color: 'text-red-400 bg-red-500/10 border-red-500/30',
    issues: ['超期超过30天', '客户预算未确认', '竞争对手强势'],
    suggestions: ['立即停止投入', '重新评估项目价值', '清理报备资源'],
    impact: '释放报备资源28个，可报备新项目',
  },
  {
    category: '中风险项目',
    count: 65,
    percentage: 26.0,
    amount: 5200,
    avgAmount: 80,
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    issues: ['项目周期过长', '决策流程复杂', '价格敏感度高'],
    suggestions: ['明确项目优先级', '简化报价方案', '定期跟进节奏'],
    impact: '预计可挽回35个项目，减少资源浪费',
  },
  {
    category: '低风险项目',
    count: 95,
    percentage: 38.0,
    amount: 7600,
    avgAmount: 80,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    issues: [],
    suggestions: ['保持跟进频率', '优化服务体验', '提升转化效率'],
    impact: '保持正常推进，预计转化率25%',
  },
  {
    category: '高价值项目',
    count: 18,
    percentage: 7.2,
    amount: 3600,
    avgAmount: 200,
    color: 'text-green-400 bg-green-500/10 border-green-500/30',
    issues: [],
    suggestions: ['投入最优资源', '快速响应需求', '缩短成交周期'],
    impact: '每个项目成功可贡献200万，应重点关注',
  },
  {
    category: '即将成交项目',
    count: 12,
    percentage: 4.8,
    amount: 1800,
    avgAmount: 150,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    issues: [],
    suggestions: ['加速合同流程', '确保资源到位', '防范临时变卦'],
    impact: '预计本月可签约1800万',
  },
];

// 项目漏斗分析
const funnelAnalysis = [
  { stage: '初报备', count: 250, conversion: 100, issues: '无', risk: '低', actions: '保持报备节奏' },
  { stage: '现场勘察', count: 180, conversion: 72, issues: '客户配合度低', risk: '中', actions: '提前准备勘察清单，减少等待时间' },
  { stage: '需求确认', count: 140, conversion: 56, issues: '需求不明确', risk: '高', actions: '增加需求调研投入，使用标准化问卷' },
  { stage: '方案提交', count: 95, conversion: 38, issues: '方案定制化周期长', risk: '中', actions: '建立方案模板库，提升效率' },
  { stage: '方案确认', count: 70, conversion: 28, issues: '竞争对手方案更优', risk: '高', actions: '分析竞品方案，强化差异化优势' },
  { stage: '采购流程', count: 50, conversion: 20, issues: '采购流程复杂', risk: '中', actions: '协助客户梳理采购流程，提供支持' },
  { stage: '合同签约', count: 30, conversion: 12, issues: '价格谈判僵持', risk: '高', actions: '明确折扣权限，快速决策' },
];

// 漏斗流失分析
const funnelDropAnalysis = [
  {
    fromStage: '初报备',
    toStage: '现场勘察',
    dropCount: 70,
    dropRate: 28,
    reasons: ['客户暂无需求(40%)', '预算不足(30%)', '选择其他供应商(20%)', '其他(10%)'],
    actions: ['提前筛选客户需求', '评估客户预算能力', '了解竞争对手情况'],
    priority: '中',
  },
  {
    fromStage: '现场勘察',
    toStage: '需求确认',
    dropCount: 40,
    dropRate: 22,
    reasons: ['需求复杂无法满足(50%)', '客户内部决策(30%)', '价格预期过低(20%)'],
    actions: ['提前技术评估可行性', '识别决策关键人', '管理客户价格预期'],
    priority: '高',
  },
  {
    fromStage: '需求确认',
    toStage: '方案提交',
    dropCount: 45,
    dropRate: 32,
    reasons: ['方案准备时间过长(40%)', '技术方案不可行(30%)', '客户改变需求(30%)'],
    actions: ['建立快速方案响应机制', '技术前置评审', '需求变更管理流程'],
    priority: '高',
  },
  {
    fromStage: '方案提交',
    toStage: '方案确认',
    dropCount: 25,
    dropRate: 26,
    reasons: ['竞品方案更优(50%)', '客户预算不足(30%)', '方案理解偏差(20%)'],
    actions: ['竞品分析，强化差异化', '提前确认客户预算', '方案讲解清晰化'],
    priority: '高',
  },
  {
    fromStage: '方案确认',
    toStage: '采购流程',
    dropCount: 20,
    dropRate: 29,
    reasons: ['采购流程推迟(50%)', '内部决策复杂(30%)', '预算审批问题(20%)'],
    actions: ['协助客户启动采购', '识别并影响决策人', '提前确认预算来源'],
    priority: '中',
  },
];

// 关键项目预警
const criticalProjectAlerts = [
  {
    id: 'P001',
    name: 'XX学校净化项目',
    customer: 'XX教育集团',
    industry: '教育',
    stage: '方案确认',
    amount: 350,
    overdue: 35,
    riskLevel: '严重',
    issues: ['超期35天，客户态度冷淡', '竞争对手已提交第二轮方案', '客户预算可能缩减'],
    probability: 20,
    suggestion: '立即安排高层拜访，了解真实情况，评估是否值得继续投入',
    action: '紧急拜访 | 竞品分析 | 预算确认',
    priority: '高',
  },
  {
    id: 'P002',
    name: 'XX医院净化系统',
    customer: 'XX医疗中心',
    industry: '医疗',
    stage: '采购流程',
    amount: 480,
    overdue: 28,
    riskLevel: '高',
    issues: ['采购流程停滞', '客户可能更换供应商', '技术参数被质疑'],
    probability: 50,
    suggestion: '技术人员上门沟通，解决技术疑虑，同时了解采购进展',
    action: '技术支持 | 采购跟进 | 竞品监控',
    priority: '高',
  },
  {
    id: 'P003',
    name: 'XX金融办公楼',
    customer: 'XX银行',
    industry: '金融',
    stage: '方案提交',
    amount: 520,
    overdue: 15,
    riskLevel: '中',
    issues: ['方案评审周期长', '客户内部存在反对声音'],
    probability: 70,
    suggestion: '保持适度跟进，等待方案评审结果，准备应对反对意见',
    action: '定期跟进 | 方案优化 | 关系维护',
    priority: '中',
  },
  {
    id: 'P004',
    name: 'XX企业园区项目',
    customer: 'XX科技公司',
    industry: '企业',
    stage: '合同流程',
    amount: 280,
    overdue: 10,
    riskLevel: '低',
    issues: ['合同条款细节协商中'],
    probability: 85,
    suggestion: '加快合同条款谈判，争取本周内完成签约',
    action: '合同谈判 | 流程加速 | 防范变卦',
    priority: '中',
  },
];

// 项目资源配置建议
const resourceAllocation = [
  {
    category: '重点投入项目',
    count: 35,
    amount: 7000,
    avgAmount: 200,
    reason: '高价值+低风险+即将成交',
    allocation: '100%资源覆盖，确保成功',
    expectedReturn: '预计成交率80%，收入5600万',
  },
  {
    category: '重点关注项目',
    count: 50,
    amount: 3000,
    avgAmount: 60,
    reason: '中价值+中风险，有潜力',
    allocation: '70%资源覆盖，定期跟进',
    expectedReturn: '预计成交率40%，收入1200万',
  },
  {
    category: '普通维护项目',
    count: 100,
    amount: 4000,
    avgAmount: 40,
    reason: '低价值+低风险，流程化跟进',
    allocation: '30%资源覆盖，标准化流程',
    expectedReturn: '预计成交率25%，收入1000万',
  },
  {
    category: '高风险清理项目',
    count: 28,
    amount: 2800,
    avgAmount: 100,
    reason: '高风险+超期，建议清理',
    allocation: '5%资源覆盖，评估后清理',
    expectedReturn: '预计成交率10%，收入280万，释放报备资源28个',
  },
];

// 整体行动建议
const overallActions = [
  {
    category: '紧急行动',
    icon: Zap,
    color: 'text-red-400 bg-red-500/10 border-red-500/30',
    items: [
      {
        title: '清理28个高风险项目',
        description: '高风险项目超期30天以上，成交概率仅20%，占用大量报备资源',
        impact: '可释放28个报备名额，用于新项目报备',
        deadline: '本周内完成评估和清理',
      },
      {
        title: '重点跟进4个关键预警项目',
        description: 'P001(学校)、P002(医院)等4个项目风险高但价值大，需立即处理',
        impact: '预计可挽回4个高价值项目，避免损失1500万',
        deadline: '立即行动',
      },
      {
        title: '优化漏斗转化率',
        description: '需求确认到方案提交流失率高达32%，需建立快速方案响应机制',
        impact: '预计可提升转化率至40%，多成交15个项目',
        deadline: '本月底前建立方案模板库',
      },
    ],
  },
  {
    category: '重点优化',
    icon: TrendingUp,
    color: 'text-green-400 bg-green-500/10 border-green-500/30',
    items: [
      {
        title: '聚焦35个重点投入项目',
        description: '高价值+低风险+即将成交的项目，应投入100%资源确保成功',
        impact: '预计成交率80%，收入5600万，占本月收入的60%',
        deadline: '持续跟进',
      },
      {
        title: '提升方案响应速度',
        description: '方案准备时间过长是主要流失原因，需建立标准化方案模板',
        impact: '缩短方案周期30%，提升客户满意度',
        deadline: '本季度完成方案模板库建设',
      },
      {
        title: '加强竞争对手分析',
        description: '竞品方案更优是方案确认阶段的主要流失原因，需建立竞品情报系统',
        impact: '提升方案竞争力，减少因竞品导致的流失',
        deadline: '持续进行',
      },
    ],
  },
  {
    category: '持续改进',
    icon: Lightbulb,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    items: [
      {
        title: '建立项目健康度评估体系',
        description: '定期评估项目风险、进展、成功概率，动态调整资源配置',
        impact: '提升资源利用效率，降低项目失败率',
        deadline: '下季度完成体系搭建',
      },
      {
        title: '优化客户需求调研流程',
        description: '需求不明确导致大量流失，需加强前期调研，使用标准化问卷',
        impact: '减少因需求不明确导致的流失，提升转化率',
        deadline: '本月启动',
      },
      {
        title: '加强采购流程协作',
        description: '采购流程复杂是常见问题，需主动协助客户梳理流程，提供支持',
        impact: '缩短采购周期，提升成交率',
        deadline: '持续进行',
      },
    ],
  },
];

// 辅助函数
const getRiskColor = (level: string) => {
  switch (level) {
    case '严重': return 'text-red-400 bg-red-500/20 border-red-500/40';
    case '高': return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
    case '中': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
    case '低': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40';
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

const getFunnelRiskColor = (risk: string) => {
  switch (risk) {
    case '高': return 'bg-red-500';
    case '中': return 'bg-yellow-500';
    case '低': return 'bg-green-500';
    default: return 'bg-cyan-500';
  }
};

export default function ProjectInsightsPanel({ timeRange = 'current', showTitle = false }: { timeRange?: TimeRange, showTitle?: boolean }) {
  return (
    <div className="space-y-4">
      {/* 标题（可选） */}
      {showTitle && (
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-50">项目智能分析与指导</h2>
        </div>
      )}

      {/* 整体行动建议 */}
      <div className="space-y-3">
        {overallActions.map((action, idx) => (
          <Card key={idx} className={cn(
            'backdrop-blur-xl border-2',
            action.color,
            'shadow-lg'
          )}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <action.icon className="h-5 w-5" />
                {action.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {action.items.map((item, itemIdx) => (
                <div key={itemIdx} className="bg-slate-900/50 rounded-lg p-3 border border-white/10">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-cyan-50 mb-1">{item.title}</div>
                      <div className="text-xs text-cyan-300/70 mb-2">{item.description}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs text-green-400 font-medium">💡 预期收益：{item.impact}</div>
                        <div className="text-xs text-cyan-300/70">⏰ {item.deadline}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 关键项目预警 */}
      <Card className="backdrop-blur-xl border-2 border-red-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-red-500/10">
        <CardHeader>
          <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            关键项目预警
          </CardTitle>
          <div className="text-xs text-cyan-300/70 mt-1">
            高风险但价值大的项目，需立即处理
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {criticalProjectAlerts.map((project, idx) => (
              <div key={idx} className={cn(
                'bg-slate-800/30 rounded-lg p-3 border',
                project.riskLevel === '严重' ? 'border-red-500/50' :
                project.riskLevel === '高' ? 'border-orange-500/50' :
                project.riskLevel === '中' ? 'border-yellow-500/50' :
                'border-cyan-500/50'
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {project.id}
                    </span>
                    <span className="font-semibold text-sm text-cyan-50">{project.name}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded border', getRiskColor(project.riskLevel))}>
                      {project.riskLevel}风险
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-cyan-300/70">金额:</span>
                    <span className="text-sm font-bold text-cyan-50">{project.amount}万</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div className="text-cyan-300/70">客户: <span className="text-cyan-50">{project.customer}</span></div>
                  <div className="text-cyan-300/70">行业: <span className="text-cyan-50">{project.industry}</span></div>
                  <div className="text-cyan-300/70">阶段: <span className="text-cyan-50">{project.stage}</span></div>
                </div>

                <div className="text-xs text-cyan-300/70 mb-2">
                  <span className="text-red-400 font-medium">⚠️ 问题：</span>
                  {project.issues.join('、')}
                </div>

                <div className="text-xs mb-2 p-2 bg-slate-900/50 rounded border border-white/5">
                  <span className="text-cyan-400 font-medium">💡 建议：</span>
                  <span className="text-cyan-300/70 ml-1">{project.suggestion}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-cyan-300/70">成功率:</span>
                    <span className={cn('font-bold ml-1', project.probability >= 70 ? 'text-green-400' : project.probability >= 40 ? 'text-yellow-400' : 'text-red-400')}>
                      {project.probability}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs px-2 py-0.5 rounded border', getPriorityColor(project.priority))}>
                      优先级: {project.priority}
                    </span>
                    <span className="text-xs text-cyan-300/70">{project.action}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 项目风险分析 */}
      <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            项目风险分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {projectRiskAnalysis.map((item, idx) => (
              <div key={idx} className={cn('rounded-lg p-3 border-2', item.color)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-cyan-50">{item.category}</span>
                  <span className="text-xs text-cyan-300/70">{item.percentage}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="text-cyan-300/70">数量: <span className="font-semibold text-cyan-50">{item.count}个</span></div>
                  <div className="text-cyan-300/70">金额: <span className="font-semibold text-cyan-50">{item.amount}万</span></div>
                </div>
                {item.issues.length > 0 && (
                  <div className="text-xs mb-2">
                    <span className="text-red-400 font-medium">⚠️ 问题：</span>
                    <span className="text-cyan-300/70 ml-1">{item.issues.join('、')}</span>
                  </div>
                )}
                {item.suggestions.length > 0 && (
                  <div className="text-xs mb-2">
                    <span className="text-cyan-400 font-medium">💡 建议：</span>
                    <span className="text-cyan-300/70 ml-1">{item.suggestions.join('、')}</span>
                  </div>
                )}
                <div className="text-xs text-green-400 font-medium p-1.5 bg-slate-900/50 rounded">
                  ✨ 预期收益：{item.impact}
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-cyan-300/70 p-3 bg-slate-900/50 rounded-lg border border-white/10">
            <span className="text-green-400 font-semibold">💡 策略建议：</span>
            <span className="ml-1">将资源从高风险项目（28个）向高价值项目（18个）转移，预计可将整体成交率从当前的12%提升至18-20%。</span>
          </div>
        </CardContent>
      </Card>

      {/* 项目漏斗分析与流失点 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 项目漏斗分析 */}
        <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
          <CardHeader>
            <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              项目漏斗分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {funnelAnalysis.map((stage, idx) => (
                <div key={idx} className="bg-slate-800/30 rounded-lg p-2.5 border border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', getFunnelRiskColor(stage.risk))}></div>
                      <span className="text-xs font-semibold text-cyan-50">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-cyan-300/70">{stage.count}个</span>
                      <span className={cn('text-xs font-bold', stage.conversion >= 50 ? 'text-green-400' : stage.conversion >= 30 ? 'text-yellow-400' : 'text-red-400')}>
                        {stage.conversion}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={cn(stage.issues === '无' ? 'text-green-400' : 'text-yellow-400')}>
                      {stage.issues === '无' ? '✅ 无问题' : `⚠️ ${stage.issues}`}
                    </span>
                    <span className="text-cyan-400">{stage.actions}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 漏斗流失分析 */}
        <Card className="backdrop-blur-xl border-2 border-orange-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-orange-500/10">
          <CardHeader>
            <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
              <XCircle className="h-4 w-4 text-orange-400" />
              漏斗流失分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {funnelDropAnalysis.map((drop, idx) => (
                <div key={idx} className="bg-slate-800/30 rounded-lg p-2.5 border border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-cyan-300/70">{drop.fromStage}</span>
                      <ArrowDownRight className="h-3 w-3 text-cyan-400" />
                      <span className="text-xs text-cyan-300/70">{drop.toStage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs font-bold', drop.dropRate >= 30 ? 'text-red-400' : drop.dropRate >= 20 ? 'text-yellow-400' : 'text-cyan-400')}>
                        -{drop.dropCount}个 ({drop.dropRate}%)
                      </span>
                    </div>
                  </div>
                  <div className="text-xs mb-1">
                    <span className="text-red-400 font-medium">原因：</span>
                    <span className="text-cyan-300/70 ml-1">{drop.reasons.join('、')}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-400">{drop.actions.join('、')}</span>
                    <span className={cn('px-1.5 py-0.5 rounded text-xs border', getPriorityColor(drop.priority))}>
                      {drop.priority}优先
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 项目资源配置建议 */}
      <Card className="backdrop-blur-xl border-2 border-green-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-green-500/10">
        <CardHeader>
          <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            项目资源配置建议
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resourceAllocation.map((item, idx) => (
              <div key={idx} className="bg-slate-800/30 rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-cyan-50">{item.category}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {item.allocation}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div className="text-cyan-300/70">数量: <span className="font-semibold text-cyan-50">{item.count}个</span></div>
                  <div className="text-cyan-300/70">金额: <span className="font-semibold text-cyan-50">{item.amount}万</span></div>
                  <div className="text-cyan-300/70">均额: <span className="font-semibold text-cyan-50">{item.avgAmount}万</span></div>
                </div>
                <div className="text-xs text-cyan-300/70 mb-2">
                  <span className="text-cyan-400 font-medium">📊 原因：</span>
                  <span className="ml-1">{item.reason}</span>
                </div>
                <div className="text-xs text-green-400 font-medium p-2 bg-slate-900/50 rounded">
                  ✨ 预期收益：{item.expectedReturn}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
