'use client';

import { useState } from 'react';
import { Target, Zap, Play, AlertTriangle, TrendingUp, TrendingDown, CheckCircle, ChevronRight, ArrowUpRight, ArrowDownRight, PlayCircle, Zap as Flash, Navigation, Radar, Clock, DollarSign, Calendar, BarChart3, ArrowUp, ArrowDown, Gauge } from 'lucide-react';
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
  value: number;
  priority: 'critical' | 'high' | 'medium';
  icon: 'zap' | 'target' | 'alert';
  status: 'pending' | 'inprogress' | 'completed';
  details: string[];
  relatedRiskId?: string; // 关联到风险识别模块的某个项目
}

// 关键驱动因素
interface DriverFactor {
  name: string;
  current: number;
  target: number;
  change: number;
  icon: string;
  color: string;
  description: string;
}

// 时间紧迫度
interface TimePressure {
  remainingDays: number;
  completionRate: number;
  dailyTarget: number;
  onTrack: boolean;
}

// 预测vs实际
interface ForecastVsActual {
  forecast: number;
  actual: number;
  completed: number;
  gap: number;
  gapPercentage: number;
  trend: 'ahead' | 'behind' | 'ontrack';
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
    details: ['商务谈判进入最后阶段', '预计7天内可签约', '竞争对手已报价320万'],
    relatedRiskId: 'P001'
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
    details: ['停滞原因：审批流程复杂', '需协调总部资源', '已联系决策人本周二开会'],
    relatedRiskId: 'P003'
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

const defaultDrivers: DriverFactor[] = [
  {
    name: '高质量商机池',
    current: 1060,
    target: 1200,
    change: 15,
    icon: 'DollarSign',
    color: 'green',
    description: '3个高概率项目待转化'
  },
  {
    name: '在途项目价值',
    current: 850,
    target: 1000,
    change: 8,
    icon: 'Target',
    color: 'blue',
    description: '5个项目进行中，预计本月转化'
  },
  {
    name: '成交转化率',
    current: 85,
    target: 90,
    change: -3,
    icon: 'TrendingUp',
    color: 'yellow',
    description: '较上月下降3个百分点'
  },
  {
    name: 'SOP健康度',
    current: 82,
    target: 85,
    change: 2,
    icon: 'CheckCircle',
    color: 'green',
    description: '整体合规率提升至82%'
  }
];

const defaultTimePressure: TimePressure = {
  remainingDays: 7,
  completionRate: 76,
  dailyTarget: 95,
  onTrack: false
};

const defaultForecastVsActual: ForecastVsActual = {
  forecast: 1140,
  actual: 800,
  completed: 800,
  gap: -340,
  gapPercentage: -70,
  trend: 'behind'
};

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
  const [drivers] = useState<DriverFactor[]>(defaultDrivers);
  const [timePressure] = useState<TimePressure>(defaultTimePressure);
  const [forecastVsActual] = useState<ForecastVsActual>(defaultForecastVsActual);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<string | null>(null);

  const handleExecute = async (decision: DecisionAction) => {
    setIsExecuting(decision.id);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExecuting(null);
    onDecisionExecute?.(decision);
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { border: 'border-red-500/40', bg: 'bg-red-900/20', icon: 'text-red-400' };
      case 'high':
        return { border: 'border-orange-500/40', bg: 'bg-orange-900/20', icon: 'text-orange-400' };
      default:
        return { border: 'border-cyan-500/40', bg: 'bg-cyan-900/20', icon: 'text-cyan-400' };
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'immediate': return { label: '立即执行', color: 'text-red-400', bg: 'bg-red-500/10' };
      case 'followup': return { label: '跟进关注', color: 'text-orange-400', bg: 'bg-orange-500/10' };
      default: return { label: '优化策略', color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ============ 第1层：仪表板总览 ============ */}
      <div className={cn('grid grid-cols-3 gap-3')}>
        {/* 预测vs实际对比 */}
        <div className={cn(
          'relative rounded-xl p-3 overflow-hidden',
          DASHBOARD_STYLES.cardBg,
          DASHBOARD_STYLES.cardBorder
        )}>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px)',
            backgroundSize: '10px 10px'
          }} />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart3 className={cn('w-4 h-4', DASHBOARD_STYLES.neon)} />
              <span className={cn('text-xs font-medium', DASHBOARD_STYLES.textMuted)}>预测 vs 实际</span>
            </div>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-2xl font-bold text-cyan-300">{forecastVsActual.completed}</span>
              <span className={cn('text-sm mb-1', forecastVsActual.gap < 0 ? 'text-red-400' : 'text-green-400')}>
                / {forecastVsActual.forecast}
              </span>
            </div>
            <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
              差距 <span className={cn('font-bold', forecastVsActual.gap < 0 ? 'text-red-400' : 'text-green-400')}>
                {forecastVsActual.gap >= 0 ? '+' : ''}{forecastVsActual.gap}万
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={cn('h-full transition-all', timePressure.completionRate >= 80 ? 'bg-green-500' : 'bg-yellow-500')}
                style={{ width: `${timePressure.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* 时间紧迫度 */}
        <div className={cn(
          'relative rounded-xl p-3 overflow-hidden',
          DASHBOARD_STYLES.cardBg,
          DASHBOARD_STYLES.cardBorder,
          !timePressure.onTrack && DASHBOARD_STYLES.warningGlow
        )}>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px)',
            backgroundSize: '10px 10px'
          }} />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className={cn('w-4 h-4', timePressure.onTrack ? 'text-cyan-400' : 'text-red-400')} />
              <span className={cn('text-xs font-medium', DASHBOARD_STYLES.textMuted)}>本月紧迫度</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl font-bold text-cyan-300">{timePressure.remainingDays}</span>
              <span className={cn('text-sm', DASHBOARD_STYLES.textMuted)}>天剩余</span>
            </div>
            <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
              日均需 <span className={cn('font-bold', timePressure.onTrack ? 'text-green-400' : 'text-red-400')}>
                {timePressure.dailyTarget}万
              </span>
            </div>
            {!timePressure.onTrack && (
              <div className="mt-2 flex items-center gap-1 text-xs text-red-400">
                <AlertTriangle className="w-3 h-3" />
                <span>进度滞后</span>
              </div>
            )}
          </div>
        </div>

        {/* 关键驱动 */}
        <div className={cn(
          'relative rounded-xl p-3 overflow-hidden',
          DASHBOARD_STYLES.cardBg,
          DASHBOARD_STYLES.cardBorder
        )}>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px)',
            backgroundSize: '10px 10px'
          }} />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <Gauge className={cn('w-4 h-4', DASHBOARD_STYLES.neon)} />
              <span className={cn('text-xs font-medium', DASHBOARD_STYLES.textMuted)}>关键驱动</span>
            </div>
            <div className="space-y-1.5">
              {drivers.slice(0, 2).map((driver, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{driver.name}</span>
                  <span className={cn('text-xs font-medium', driver.change >= 0 ? 'text-green-400' : 'text-red-400')}>
                    {driver.change >= 0 ? '+' : ''}{driver.change}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ 第2层：CEO决策面板 ============ */}
      <div className={cn(
        'relative rounded-xl overflow-hidden',
        DASHBOARD_STYLES.cardBg,
        DASHBOARD_STYLES.cardBorder,
        DASHBOARD_STYLES.glow
      )}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

        <div className="relative z-10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Navigation className={cn('w-5 h-5', DASHBOARD_STYLES.neon)} />
              <h3 className={cn('text-sm font-bold', DASHBOARD_STYLES.neon)}>
                CEO驾驶决策
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {decisions.filter(d => d.status === 'pending').length} 待执行
              </span>
            </div>
            <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
              潜在影响: <span className="text-cyan-400 font-bold">
                {decisions.reduce((sum, d) => sum + d.value, 0) >= 0 ? '+' : ''}
                {decisions.reduce((sum, d) => sum + d.value, 0)}万
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {decisions.map((decision, index) => {
              const priorityStyles = getPriorityStyles(decision.priority);
              const typeStyles = getTypeStyles(decision.type);
              const isSelected = selectedDecision === decision.id;

              return (
                <div
                  key={decision.id}
                  className={cn(
                    'relative rounded-lg p-2.5 border transition-all cursor-pointer',
                    priorityStyles.border,
                    priorityStyles.bg,
                    isSelected ? 'scale-102 shadow-lg' : 'hover:scale-101'
                  )}
                  onClick={() => setSelectedDecision(isSelected ? null : decision.id)}
                >
                  <div className={cn(
                    'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg',
                    decision.priority === 'critical' ? 'bg-red-500' :
                    decision.priority === 'high' ? 'bg-orange-500' : 'bg-cyan-500'
                  )} />

                  <div className="flex items-start gap-2.5 pl-3">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      decision.icon === 'zap' ? 'bg-red-500/20' :
                      decision.icon === 'alert' ? 'bg-orange-500/20' : 'bg-cyan-500/20'
                    )}>
                      {decision.icon === 'zap' && <Zap className={cn('w-4 h-4', priorityStyles.icon)} />}
                      {decision.icon === 'alert' && <AlertTriangle className={cn('w-4 h-4', priorityStyles.icon)} />}
                      {decision.icon === 'target' && <Target className={cn('w-4 h-4', priorityStyles.icon)} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <h4 className={cn('text-xs font-semibold', DASHBOARD_STYLES.textSecondary)}>
                          {decision.title}
                        </h4>
                        <span className={cn('px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0', typeStyles.bg, typeStyles.color)}>
                          {typeStyles.label}
                        </span>
                      </div>
                      <p className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>
                        {decision.description}
                      </p>

                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-cyan-500/20">
                          <ul className="space-y-1 mb-2">
                            {decision.details.map((detail, idx) => (
                              <li key={idx} className={cn('flex items-center gap-1.5 text-xs', DASHBOARD_STYLES.textMuted)}>
                                <ChevronRight className="w-3 h-3 flex-shrink-0 text-cyan-400" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                          {decision.relatedRiskId && (
                            <div className="mb-2 flex items-center gap-1.5 text-xs text-orange-400">
                              <AlertTriangle className="w-3 h-3" />
                              <span>关联风险识别模块的项目</span>
                            </div>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleExecute(decision); }}
                            disabled={isExecuting === decision.id}
                            className={cn(
                              'w-full px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
                              isExecuting === decision.id
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400'
                            )}
                          >
                            {isExecuting === decision.id ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                执行中...
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-3.5 h-3.5" />
                                立即执行 - {decision.impact}
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {!isSelected && (
                        <div className="flex items-center justify-between">
                          <span className={cn('text-xs font-bold', decision.value >= 0 ? 'text-green-400' : 'text-red-400')}>
                            {decision.impact}
                          </span>
                          <ChevronRight className={cn('w-3.5 h-3.5 transition-transform', isSelected ? 'rotate-90' : '', DASHBOARD_STYLES.textMuted)} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-cyan-500/20">
            <div className="grid grid-cols-3 gap-2">
              <button className={cn(
                'px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1 transition-all',
                'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400',
                'shadow-[0_0_10px_rgba(239,68,68,0.4)]'
              )}>
                <Zap className="w-3 h-3" />
                一键激活
              </button>
              <button className={cn(
                'px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1 transition-all',
                'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400',
                'shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              )}>
                <Navigation className="w-3 h-3" />
                查看待办
              </button>
              <button className={cn(
                'px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1 transition-all',
                'bg-slate-800 text-cyan-400 border border-cyan-500/30 hover:bg-slate-700'
              )}>
                <Flash className="w-3 h-3" />
                智能建议
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ 第3层：风险关联提示 ============ */}
      <div className={cn(
        'relative rounded-xl p-3 overflow-hidden',
        DASHBOARD_STYLES.cardBg,
        DASHBOARD_STYLES.cardBorder
      )}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px)',
          backgroundSize: '10px 10px'
        }} />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className={cn('text-xs font-medium', DASHBOARD_STYLES.textMuted)}>
              当前有 <span className="text-orange-400 font-bold">8个</span> 项目本月未下单
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-400 font-medium">-390万风险</span>
            <span className={cn('text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 cursor-pointer hover:bg-cyan-500/30')}>
              查看详情 →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
