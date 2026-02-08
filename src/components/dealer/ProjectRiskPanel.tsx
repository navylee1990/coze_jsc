'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, Shield } from 'lucide-react';

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

export default function ProjectRiskPanel({ timeRange = 'current' }: { timeRange?: TimeRange }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
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
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
            {criticalProjectAlerts.map((project, idx) => (
              <div key={idx} className={cn(
                'bg-slate-800/30 rounded-lg p-2.5 border',
                project.riskLevel === '严重' ? 'border-red-500/50' :
                project.riskLevel === '高' ? 'border-orange-500/50' :
                project.riskLevel === '中' ? 'border-yellow-500/50' :
                'border-cyan-500/50'
              )}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {project.id}
                    </span>
                    <span className="font-semibold text-xs text-cyan-50">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs px-2 py-0.5 rounded border', getRiskColor(project.riskLevel))}>
                      {project.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-xs mb-1.5">
                  <div className="text-cyan-300/70">客户: <span className="text-cyan-50">{project.customer}</span></div>
                  <div className="text-cyan-300/70">行业: <span className="text-cyan-50">{project.industry}</span></div>
                  <div className="text-cyan-300/70">金额: <span className="text-cyan-50 font-bold">{project.amount}万</span></div>
                </div>

                <div className="text-xs mb-1.5">
                  <span className="text-red-400 font-medium">⚠️ </span>
                  <span className="text-cyan-300/70">{project.issues.join('、')}</span>
                </div>

                <div className="text-xs text-green-400 font-medium p-1.5 bg-slate-900/50 rounded mb-1.5">
                  💡 {project.suggestion}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-cyan-300/70">成功率:</span>
                    <span className={cn('font-bold ml-1', project.probability >= 70 ? 'text-green-400' : project.probability >= 40 ? 'text-yellow-400' : 'text-red-400')}>
                      {project.probability}%
                    </span>
                  </div>
                  <span className="text-xs text-cyan-300/70">{project.action}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 预警总结 */}
          <div className="mt-3 bg-slate-800/50 rounded-lg p-3 border border-red-500/30">
            <div className="text-xs text-cyan-300/70 space-y-1">
              <div className="text-red-400 font-semibold">🚨 预警统计：</div>
              <div>• 预警项目：4个，总金额1630万</div>
              <div>• 严重风险：1个（成功率20%）</div>
              <div>• 高风险：1个（成功率50%）</div>
              <div>• 建议立即处理：P001、P002</div>
            </div>
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
          <div className="text-xs text-cyan-300/70 mt-1">
            按风险等级分类项目，识别高风险业务
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {projectRiskAnalysis.map((item, idx) => (
              <div key={idx} className={cn('rounded-lg p-2.5 border-2', item.color)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-cyan-50">{item.category}</span>
                  <span className="text-xs text-cyan-300/70">{item.percentage}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="text-cyan-300/70">数量: <span className="font-semibold text-cyan-50">{item.count}个</span></div>
                  <div className="text-cyan-300/70">金额: <span className="font-semibold text-cyan-50">{item.amount}万</span></div>
                </div>
                {item.issues.length > 0 && (
                  <div className="text-xs mb-2">
                    <span className="text-red-400 font-medium">⚠️ </span>
                    <span className="text-cyan-300/70">{item.issues.join('、')}</span>
                  </div>
                )}
                {item.suggestions.length > 0 && (
                  <div className="text-xs mb-2">
                    <span className="text-cyan-400 font-medium">💡 </span>
                    <span className="text-cyan-300/70">{item.suggestions.join('、')}</span>
                  </div>
                )}
                <div className="text-xs text-green-400 font-medium p-1.5 bg-slate-900/50 rounded">
                  ✨ {item.impact}
                </div>
              </div>
            ))}
          </div>

          {/* 风险总结 */}
          <div className="mt-3 bg-slate-800/50 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-cyan-300/70 space-y-1">
              <div className="text-cyan-400 font-semibold">💡 风险应对：</div>
              <div>• 高风险+高价值：重点关注，集中资源</div>
              <div>• 低风险+高价值：优先推进，确保成交</div>
              <div>• 高风险+低价值：评估后清理，释放资源</div>
              <div>• 建议将资源从高风险向高价值转移，提升整体成交率</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
