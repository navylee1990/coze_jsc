'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, ArrowUpRight, ArrowDownRight, XCircle, AlertCircle } from 'lucide-react';

// 时间范围类型
type TimeRange = 'current' | 'quarter' | 'year';

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

// 辅助函数
const getFunnelRiskColor = (risk: string) => {
  switch (risk) {
    case '高': return 'bg-red-500';
    case '中': return 'bg-yellow-500';
    case '低': return 'bg-green-500';
    default: return 'bg-cyan-500';
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

export default function ProjectFunnelPanel({ timeRange = 'current' }: { timeRange?: TimeRange }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {/* 项目漏斗分析 */}
      <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            项目漏斗分析
          </CardTitle>
          <div className="text-xs text-cyan-300/70 mt-1">
            分析各阶段项目数量、转化率及风险点
          </div>
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

          {/* 漏斗总结 */}
          <div className="mt-4 bg-slate-800/50 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-cyan-300/70 space-y-1">
              <div className="text-cyan-400 font-semibold">📊 漏斗洞察：</div>
              <div>• 整体转化率：12%（初报备→签约）</div>
              <div>• 最大流失点：需求确认→方案提交（流失45个，32%）</div>
              <div>• 主要风险：需求不明确、方案周期长、竞品压力</div>
            </div>
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
          <div className="text-xs text-cyan-300/70 mt-1">
            识别流失原因，提出改进措施
          </div>
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

          {/* 流失总结 */}
          <div className="mt-4 bg-slate-800/50 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-cyan-300/70 space-y-1">
              <div className="text-orange-400 font-semibold">⚠️ 流失警示：</div>
              <div>• 总流失：220个项目（流失率88%）</div>
              <div>• 高优先级流失：110个项目（需求确认→方案确认）</div>
              <div>• 预计改进后可挽回：40-50个项目</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
