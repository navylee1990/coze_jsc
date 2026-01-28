'use client';

import { useState, useEffect } from 'react';
import { 
  Target, Zap, Play, AlertTriangle, TrendingUp, TrendingDown, 
  CheckCircle, ChevronRight, ArrowUpRight, ArrowDownRight, 
  PlayCircle, Zap as Flash, Navigation, Radar, Gauge,
  Droplet, Battery, Activity, Flame, Shield, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  }
];

// 圆形仪表盘组件
function CircularGauge({ 
  value, 
  max, 
  label, 
  unit = '%',
  color = 'cyan',
  size = 120 
}: { 
  value: number; 
  max: number; 
  label: string;
  unit?: string;
  color?: 'cyan' | 'red' | 'orange' | 'green';
  size?: number;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  const colorMap = {
    cyan: '#22d3ee',
    red: '#ef4444',
    orange: '#f97316',
    green: '#22c55e'
  };
  
  const strokeColor = colorMap[color];

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 100 100" className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="6"
        />
        {/* 刻度线 */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const innerR = 28;
          const outerR = radius;
          const x1 = Number((50 + innerR * Math.cos(angle)).toFixed(3));
          const y1 = Number((50 + innerR * Math.sin(angle)).toFixed(3));
          const x2 = Number((50 + outerR * Math.cos(angle)).toFixed(3));
          const y2 = Number((50 + outerR * Math.sin(angle)).toFixed(3));
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#334155"
              strokeWidth="1"
            />
          );
        })}
        {/* 进度圆 */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ 
            filter: `drop-shadow(0 0 6px ${strokeColor}80)`,
            transition: 'stroke-dashoffset 1s ease-out'
          }}
        />
      </svg>
      {/* 中心数值 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="text-2xl font-bold" 
          style={{ 
            color: strokeColor, 
            textShadow: `0 0 10px ${strokeColor}80`
          }}
        >
          {value.toFixed(0)}
        </span>
        <span className="text-xs" style={{ color: strokeColor }}>{unit}</span>
      </div>
      <span className="text-xs mt-2 text-cyan-400/70">{label}</span>
    </div>
  );
}

// 油量表式进度条
function FuelGauge({ 
  value, 
  max, 
  label 
}: { 
  value: number; 
  max: number; 
  label: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const bars = 10;
  const activeBars = Math.ceil((percentage / 100) * bars);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Droplet className="w-4 h-4 text-cyan-400" />
        <span className="text-xs text-cyan-400/70">{label}</span>
      </div>
      <div className="flex gap-1">
        {[...Array(bars)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-3 rounded-sm transition-all',
              i < activeBars
                ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                : 'bg-slate-800'
            )}
          />
        ))}
      </div>
      <div className="text-right">
        <span className="text-lg font-bold text-cyan-300">
          {value.toFixed(0)}
        </span>
        <span className="text-xs text-cyan-400/70"> / {max} 万</span>
      </div>
    </div>
  );
}

// 警告灯组件
function WarningLights({ 
  risks 
}: { 
  risks: Array<{ type: 'critical' | 'high' | 'medium'; count: number }> 
}) {
  return (
    <div className="flex items-center gap-2">
      {risks.map((risk, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-lg',
            'bg-slate-900/80 border',
            risk.type === 'critical' ? 'border-red-500/50' :
            risk.type === 'high' ? 'border-orange-500/50' : 'border-yellow-500/50'
          )}
          style={{
            boxShadow: risk.type === 'critical' ? '0 0 10px rgba(239,68,68,0.6)' :
                     risk.type === 'high' ? '0 0 10px rgba(251,146,60,0.6)' : ''
          }}
        >
          <AlertTriangle 
            className={cn(
              'w-4 h-4 animate-pulse',
              risk.type === 'critical' ? 'text-red-400' :
              risk.type === 'high' ? 'text-orange-400' : 'text-yellow-400'
            )} 
          />
          <span className="text-xs font-bold text-white">{risk.count}</span>
        </div>
      ))}
    </div>
  );
}

// 预测路径图
function PredictionPath({ 
  current, 
  target,
  path 
}: { 
  current: number; 
  target: number;
  path: Array<{ month: string; value: number }>;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Navigation className="w-4 h-4 text-cyan-400" />
        <span className="text-xs text-cyan-400/70">预测路径</span>
      </div>
      <div className="relative h-16 flex items-end gap-1">
        {/* 目标线 */}
        <div 
          className="absolute top-0 left-0 right-0 border-t border-dashed border-red-500/50 flex items-center"
          style={{ top: `${100 - (target / 2000) * 100}%` }}
        >
          <span className="text-xs text-red-400 ml-1">{target}万</span>
        </div>
        
        {/* 路径柱状图 */}
        {path.map((point, index) => {
          const height = (point.value / 2000) * 100;
          return (
            <div
              key={index}
              className={cn(
                'flex-1 rounded-t transition-all',
                point.value >= target ? 'bg-green-500/80' : 'bg-cyan-500/80'
              )}
              style={{ 
                height: `${height}%`,
                boxShadow: point.value >= target 
                  ? '0 0 10px rgba(74,222,128,0.6)' 
                  : '0 0 10px rgba(34,211,238,0.6)'
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-cyan-400/50">
        {path.map((point, index) => (
          <span key={index}>{point.month}</span>
        ))}
      </div>
    </div>
  );
}

// 组件属性
interface PredictionDecisionCardProps {
  theme?: 'dark' | 'dashboard';
  onDecisionExecute?: (decision: DecisionAction) => void;
}

export default function PredictionDecisionCard({
  theme = 'dashboard',
  onDecisionExecute
}: PredictionDecisionCardProps) {
  const [decisions] = useState<DecisionAction[]>(defaultDecisions);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<string | null>(null);

  // 动画数值
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedAchievement, setAnimatedAchievement] = useState(0);

  useEffect(() => {
    // 数值滚动动画
    const targetValue = 1140;
    const targetAchievement = 76;
    
    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedValue(Math.floor(targetValue * easeOut));
      setAnimatedAchievement(targetAchievement * easeOut);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, []);

  const handleExecute = async (decision: DecisionAction) => {
    setIsExecuting(decision.id);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExecuting(null);
    onDecisionExecute?.(decision);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 顶部主仪表盘区 - 速度表样式 */}
      <div className={cn(
        'relative rounded-xl p-4 overflow-hidden',
        DASHBOARD_STYLES.cardBg,
        DASHBOARD_STYLES.cardBorder,
        DASHBOARD_STYLES.glow
      )}>
        {/* 背景网格 */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gauge className={cn('w-5 h-5', DASHBOARD_STYLES.neon)} />
              <h3 className={cn('text-sm font-bold', DASHBOARD_STYLES.neon)}>核心指标仪表盘</h3>
            </div>
            {/* 警告灯系统 */}
            <WarningLights 
              risks={[
                { type: 'critical', count: 2 },
                { type: 'high', count: 1 }
              ]} 
            />
          </div>

          {/* 仪表盘布局 */}
          <div className="grid grid-cols-4 gap-4">
            {/* 主仪表盘 - 达成率 */}
            <div className="col-span-2 flex justify-center">
              <CircularGauge 
                value={animatedAchievement} 
                max={100} 
                label="目标达成率"
                unit="%"
                color={animatedAchievement >= 80 ? 'green' : animatedAchievement >= 60 ? 'orange' : 'red'}
                size={140}
              />
            </div>
            
            {/* 预测完成仪表盘 */}
            <div className="flex justify-center">
              <CircularGauge 
                value={animatedValue} 
                max={1500} 
                label="预测完成"
                unit="万"
                color="cyan"
                size={110}
              />
            </div>
            
            {/* 油量表 - 目标进度 */}
            <div className="flex flex-col justify-center">
              <FuelGauge 
                value={animatedValue} 
                max={1500} 
                label="目标完成进度"
              />
            </div>
          </div>

          {/* 预测路径图 */}
          <div className="mt-4 pt-4 border-t border-cyan-500/20">
            <PredictionPath
              current={animatedValue}
              target={1500}
              path={[
                { month: '1月', value: 1140 },
                { month: '2月', value: 1320 },
                { month: '3月', value: 1450 },
                { month: 'Q1', value: 1420 }
              ]}
            />
          </div>
        </div>
      </div>

      {/* CEO决策操作区 */}
      <div className={cn(
        'relative rounded-xl overflow-hidden',
        DASHBOARD_STYLES.cardBg,
        DASHBOARD_STYLES.cardBorder
      )}>
        {/* 背景网格 */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }} />

        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

        <div className="relative z-10 p-4">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className={cn('w-5 h-5', DASHBOARD_STYLES.neon)} />
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

          {/* 决策卡片 */}
          <div className="space-y-3">
            {decisions.map((decision) => {
              const isSelected = selectedDecision === decision.id;
              const priorityStyles = decision.priority === 'critical' ? 
                DASHBOARD_STYLES.warningGlow : 
                'shadow-[0_0_10px_rgba(251,146,60,0.4)]';

              return (
                <div
                  key={decision.id}
                  className={cn(
                    'relative rounded-lg p-3 border transition-all cursor-pointer',
                    decision.priority === 'critical' ? 'border-red-500/40 bg-red-900/20' :
                    decision.priority === 'high' ? 'border-orange-500/40 bg-orange-900/20' :
                    'border-cyan-500/40 bg-cyan-900/20',
                    isSelected ? 'scale-102 shadow-lg' : 'hover:scale-101',
                    priorityStyles
                  )}
                  onClick={() => setSelectedDecision(isSelected ? null : decision.id)}
                >
                  {/* 左侧优先级条 */}
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
                      {decision.icon === 'zap' && <Zap className="w-5 h-5 text-red-400" />}
                      {decision.icon === 'alert' && <AlertTriangle className="w-5 h-5 text-orange-400" />}
                      {decision.icon === 'target' && <Target className="w-5 h-5 text-cyan-400" />}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={cn('text-sm font-semibold', DASHBOARD_STYLES.textSecondary)}>
                          {decision.title}
                        </h4>
                        <span className={cn(
                          'text-xs font-bold',
                          decision.value >= 0 ? 'text-green-400' : 'text-red-400'
                        )}>
                          {decision.impact}
                        </span>
                      </div>
                      <p className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
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

                          {/* 执行按钮 */}
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
                                立即执行
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
