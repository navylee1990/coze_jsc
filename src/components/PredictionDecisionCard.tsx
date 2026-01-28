'use client';

import { useState } from 'react';
import { Target, Zap, Play, AlertTriangle, TrendingUp, TrendingDown, CheckCircle, ChevronRight, ArrowUpRight, ArrowDownRight, PlayCircle, Zap as Flash, Navigation, Radar } from 'lucide-react';
import { cn } from '@/lib/utils';

// 主题类型
type Theme = 'dark' | 'dashboard';

// CEO决策操作类型
interface DecisionAction {
  id: string;
  type: 'immediate' | 'followup' | 'optimize';
  title: string;
  description: string;
  impact: string;
  value: number; // 影响金额（正数=增加，负数=减少）
  priority: 'critical' | 'high' | 'medium';
  icon: 'zap' | 'target' | 'alert';
  status: 'pending' | 'inprogress' | 'completed';
  details: string[];
}

// 智能洞察
interface Insight {
  category: 'opportunity' | 'risk' | 'trend';
  title: string;
  description: string;
  value: number;
  change: number;
  icon: 'up' | 'down' | 'stable';
}

// 驾驶舱样式
const DASHBOARD_STYLES = {
  bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
  cardBg: 'bg-slate-900/80 backdrop-blur-sm',
  cardBorder: 'border-cyan-500/30',
  text: 'text-cyan-50',
  textMuted: 'text-cyan-300/70',
  textSecondary: 'text-cyan-200',
  neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
  neonGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.6)]',
  warningGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]',
  successGlow: 'shadow-[0_0_15px_rgba(74,222,128,0.6)]',
  glow: 'shadow-[0_0_15px_rgba(6,182,212,0.6)]',
};

// 默认数据
const defaultDecisions: DecisionAction[] = [
  {
    id: '1',
    type: 'immediate',
    title: '启动重点项目A加速',
    description: '北京协和医院项目已进入关键期，立即启动商务加速',
    impact: '+260万',
    value: 260,
    priority: 'critical',
    icon: 'zap',
    status: 'pending',
    details: ['商务谈判进入最后阶段', '预计7天内可签约', '竞争对手已报价320万']
  },
  {
    id: '2',
    type: 'immediate',
    title: '激活停滞项目B',
    description: '西安某学校项目停滞45天，需CEO介入激活',
    impact: '-120万',
    value: -120,
    priority: 'critical',
    icon: 'alert',
    status: 'pending',
    details: ['停滞原因：审批流程复杂', '需协调总部资源', '已联系决策人本周二开会']
  },
  {
    id: '3',
    type: 'followup',
    title: '跟进高概率商机C',
    description: '杭州阿里巴巴园区项目，成交概率85%',
    impact: '+380万',
    value: 380,
    priority: 'high',
    icon: 'target',
    status: 'pending',
    details: ['技术方案已通过', '商务条款待确认', '预计本月下旬签约']
  },
  {
    id: '4',
    type: 'optimize',
    title: '优化SOP执行策略',
    description: '陈明团队SOP合规率仅78%，影响5个项目预测',
    impact: '+95万',
    value: 95,
    priority: 'medium',
    icon: 'target',
    status: 'pending',
    details: ['4个项目被降权预测', '需提升合规率至85%', '提供专项培训支持']
  }
];

const defaultInsights: Insight[] = [
  {
    category: 'opportunity',
    title: '高质量商机池',
    description: '3个高概率项目，总金额1060万',
    value: 1060,
    change: 15,
    icon: 'up'
  },
  {
    category: 'risk',
    title: '重点项目风险',
    description: '2个停滞项目，影响-240万',
    value: -240,
    change: -12,
    icon: 'down'
  },
  {
    category: 'trend',
    title: '本月预测趋势',
    description: '预测达成率76%，趋势向好',
    value: 76,
    change: 5,
    icon: 'up'
  }
];

// 组件属性
interface PredictionDecisionCardProps {
  theme?: Theme;
  onDecisionExecute?: (decision: DecisionAction) => void;
}

export default function PredictionDecisionCard({
  theme = 'dashboard',
  onDecisionExecute
}: PredictionDecisionCardProps) {
  const [decisions] = useState<DecisionAction[]>(defaultDecisions);
  const [insights] = useState<Insight[]>(defaultInsights);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<string | null>(null);

  const handleExecute = async (decision: DecisionAction) => {
    setIsExecuting(decision.id);
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExecuting(null);
    onDecisionExecute?.(decision);
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          border: 'border-red-500/40',
          bg: 'bg-red-900/20',
          icon: 'text-red-400',
          glow: DASHBOARD_STYLES.warningGlow
        };
      case 'high':
        return {
          border: 'border-orange-500/40',
          bg: 'bg-orange-900/20',
          icon: 'text-orange-400',
          glow: 'shadow-[0_0_15px_rgba(251,146,60,0.6)]'
        };
      default:
        return {
          border: 'border-cyan-500/40',
          bg: 'bg-cyan-900/20',
          icon: 'text-cyan-400',
          glow: DASHBOARD_STYLES.neonGlow
        };
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'immediate':
        return { label: '立即执行', color: 'text-red-400', bg: 'bg-red-500/10' };
      case 'followup':
        return { label: '跟进关注', color: 'text-orange-400', bg: 'bg-orange-500/10' };
      default:
        return { label: '优化策略', color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 顶部智能洞察区 - 雷达扫描风格 */}
      <div className={cn(
        'relative rounded-xl p-4 overflow-hidden',
        DASHBOARD_STYLES.cardBg,
        DASHBOARD_STYLES.cardBorder
      )}>
        {/* 背景网格纹理 */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
        
        {/* 扫描线动画 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 animate-[scan_3s_linear_infinite]"
               style={{ height: '100%', transform: 'translateY(-100%)' }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Radar className={cn('w-5 h-5', DASHBOARD_STYLES.neon)} />
            <h3 className={cn('text-sm font-bold', DASHBOARD_STYLES.neon)}>智能驾驶决策洞察</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-lg p-3 border transition-all hover:scale-105',
                  DASHBOARD_STYLES.cardBorder,
                  'bg-slate-800/50'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
                    {insight.title}
                  </div>
                  {insight.icon === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  ) : insight.icon === 'down' ? (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <div className={cn('text-lg font-bold', insight.value >= 0 ? 'text-green-400' : 'text-red-400')}>
                  {insight.value >= 0 ? '+' : ''}{insight.value}万
                </div>
                <div className={cn('text-xs mt-1', DASHBOARD_STYLES.textMuted)}>
                  {insight.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CEO决策操作区 - 主驾驶面板 */}
      <div className={cn(
        'relative rounded-xl overflow-hidden',
        DASHBOARD_STYLES.cardBg,
        DASHBOARD_STYLES.cardBorder,
        DASHBOARD_STYLES.glow
      )}>
        {/* 背景网格纹理 */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }} />

        {/* 顶部装饰线条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

        <div className="relative z-10 p-4">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Navigation className={cn('w-5 h-5', DASHBOARD_STYLES.neon)} />
              <h3 className={cn('text-sm font-bold', DASHBOARD_STYLES.neon)}>
                CEO驾驶决策面板
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {decisions.filter(d => d.status === 'pending').length} 待执行
              </span>
            </div>
            <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
              总影响: <span className="text-cyan-400 font-bold">
                {decisions.reduce((sum, d) => sum + d.value, 0) >= 0 ? '+' : ''}
                {decisions.reduce((sum, d) => sum + d.value, 0)}万
              </span>
            </div>
          </div>

          {/* 决策卡片列表 */}
          <div className="space-y-3">
            {decisions.map((decision, index) => {
              const priorityStyles = getPriorityStyles(decision.priority);
              const typeStyles = getTypeStyles(decision.type);
              const isSelected = selectedDecision === decision.id;

              return (
                <div
                  key={decision.id}
                  className={cn(
                    'relative rounded-lg p-3 border transition-all cursor-pointer',
                    priorityStyles.border,
                    priorityStyles.bg,
                    isSelected ? 'scale-102 shadow-lg' : 'hover:scale-101',
                    priorityStyles.glow
                  )}
                  onClick={() => setSelectedDecision(isSelected ? null : decision.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* 左侧优先级指示条 */}
                  <div className={cn(
                    'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg',
                    decision.priority === 'critical' ? 'bg-red-500' :
                    decision.priority === 'high' ? 'bg-orange-500' : 'bg-cyan-500'
                  )} />

                  <div className="flex items-start gap-3 pl-3">
                    {/* 图标 */}
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      decision.icon === 'zap' ? 'bg-red-500/20' :
                      decision.icon === 'alert' ? 'bg-orange-500/20' : 'bg-cyan-500/20'
                    )}>
                      {decision.icon === 'zap' && <Zap className={cn('w-5 h-5', priorityStyles.icon)} />}
                      {decision.icon === 'alert' && <AlertTriangle className={cn('w-5 h-5', priorityStyles.icon)} />}
                      {decision.icon === 'target' && <Target className={cn('w-5 h-5', priorityStyles.icon)} />}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={cn('text-sm font-semibold', DASHBOARD_STYLES.textSecondary)}>
                          {decision.title}
                        </h4>
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium flex-shrink-0',
                          typeStyles.bg,
                          typeStyles.color
                        )}>
                          {typeStyles.label}
                        </span>
                      </div>
                      <p className={cn('text-xs mb-2', DASHBOARD_STYLES.textMuted)}>
                        {decision.description}
                      </p>

                      {/* 展开详情 */}
                      {isSelected && (
                        <div className="space-y-2 mt-3 pt-3 border-t border-cyan-500/20">
                          <div className="text-xs">
                            <div className={cn('font-medium mb-1', DASHBOARD_STYLES.textSecondary)}>关键信息：</div>
                            <ul className="space-y-1">
                              {decision.details.map((detail, idx) => (
                                <li key={idx} className={cn('flex items-center gap-2', DASHBOARD_STYLES.textMuted)}>
                                  <ChevronRight className="w-3 h-3 flex-shrink-0 text-cyan-400" />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* CEO操作按钮 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExecute(decision);
                            }}
                            disabled={isExecuting === decision.id}
                            className={cn(
                              'w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all',
                              isExecuting === decision.id
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400'
                            )}
                          >
                            {isExecuting === decision.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                执行中...
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-4 h-4" />
                                立即执行 - {decision.impact}
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* 未展开时的快速操作 */}
                      {!isSelected && (
                        <div className="flex items-center justify-between">
                          <div className={cn(
                            'text-xs font-bold',
                            decision.value >= 0 ? 'text-green-400' : 'text-red-400'
                          )}>
                            {decision.impact}
                          </div>
                          <ChevronRight className={cn(
                            'w-4 h-4 transition-transform',
                            isSelected ? 'rotate-90' : '',
                            DASHBOARD_STYLES.textMuted
                          )} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部快速操作栏 */}
          <div className="mt-4 pt-4 border-t border-cyan-500/20">
            <div className="grid grid-cols-3 gap-2">
              <button className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
                'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400',
                'shadow-[0_0_10px_rgba(239,68,68,0.4)]'
              )}>
                <Zap className="w-3.5 h-3.5" />
                一键激活关键项目
              </button>
              <button className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
                'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400',
                'shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              )}>
                <Navigation className="w-3.5 h-3.5" />
                查看所有待办
              </button>
              <button className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
                'bg-slate-800 text-cyan-400 border border-cyan-500/30 hover:bg-slate-700',
                'shadow-[0_0_10px_rgba(6,182,212,0.2)]'
              )}>
                <Flash className="w-3.5 h-3.5" />
                智能优化建议
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 样式定义 */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}
