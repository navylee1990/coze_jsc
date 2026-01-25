'use client';

import { AlertTriangle, Clock, TrendingDown, FileWarning, Target, Users, Zap, ChevronRight, Gauge, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// 驾驶舱样式
const DASHBOARD_STYLES = {
  bg: 'bg-slate-900/80',
  text: 'text-cyan-50',
  textMuted: 'text-cyan-300/70',
  textSecondary: 'text-cyan-200',
  cardBorder: 'border-cyan-500/30',
  neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
  neonGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.6)]',
  warningGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]',
};

// 延迟项目时间分类
interface DelayedProjectCategory {
  period: string;
  periodKey: 'current' | 'future1Month' | 'future3Months' | 'future6Months';
  count: number;
  amount: number;
  gapFill: number;
  severity: 'high' | 'medium' | 'low';
  percent?: number; // 仪表盘进度百分比
}

// 人效数据
interface EfficiencyData {
  zeroProjectCurrentMonth: {
    count: number;
    severity: 'high' | 'medium' | 'low';
  };
  zeroProject3Months: {
    count: number;
    severity: 'high' | 'medium' | 'low';
  };
}

// 其他风险类型
interface OtherRiskItem {
  type: 'specialPrice' | 'reserveInsufficient' | 'scaleInsufficient';
  title: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

// 组件属性
interface RiskIdentificationPanelProps {
  delayedProjects?: DelayedProjectCategory[];
  efficiencyData?: EfficiencyData;
  otherRisks?: OtherRiskItem[];
  theme?: 'dashboard' | 'light' | 'dark';
}

// 默认延迟项目数据（添加仪表盘进度百分比）
const defaultDelayedProjects: DelayedProjectCategory[] = [
  {
    period: '本月',
    periodKey: 'current',
    count: 3,
    amount: 200,
    gapFill: 200,
    severity: 'high',
    percent: 85
  },
  {
    period: '未来1月',
    periodKey: 'future1Month',
    count: 5,
    amount: 280,
    gapFill: 280,
    severity: 'high',
    percent: 75
  },
  {
    period: '未来3月',
    periodKey: 'future3Months',
    count: 8,
    amount: 450,
    gapFill: 450,
    severity: 'medium',
    percent: 55
  },
  {
    period: '未来半年',
    periodKey: 'future6Months',
    count: 12,
    amount: 680,
    gapFill: 680,
    severity: 'medium',
    percent: 40
  }
];

// 默认人效数据
const defaultEfficiencyData: EfficiencyData = {
  zeroProjectCurrentMonth: {
    count: 15,
    severity: 'high'
  },
  zeroProject3Months: {
    count: 8,
    severity: 'medium'
  }
};

// 默认其他风险数据
const defaultOtherRisks: OtherRiskItem[] = [
  {
    type: 'specialPrice',
    title: '特价申请异常',
    count: 3,
    severity: 'medium',
    description: '特价申请超期或异常'
  },
  {
    type: 'reserveInsufficient',
    title: '区域储备不足',
    count: 4,
    severity: 'high',
    description: '多区域3-6月储备不足'
  },
  {
    type: 'scaleInsufficient',
    title: '签约规模不足',
    count: 3,
    severity: 'medium',
    description: '区域签约规模不足以支撑年度目标'
  }
];

// 仪表盘组件
function DashboardGauge({ percent, severity, amount, label }: { percent: number; severity: 'high' | 'medium' | 'low'; amount: number; label: string }) {
  const getColorClass = () => {
    if (percent >= 70) return 'stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]';
    if (percent >= 50) return 'stroke-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]';
    return 'stroke-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]';
  };

  const strokeDasharray = `${percent * 2.5} 250`; // 半圆周长约250
  const rotation = 90; // 从右侧开始

  return (
    <div className="relative flex flex-col items-center">
      {/* 半圆仪表盘 */}
      <div className="relative w-28 h-16 mb-2">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          {/* 背景弧线 */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(6,182,212,0.2)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* 进度弧线 */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            className={getColorClass()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            transform={`rotate(${rotation} 50 50)`}
          />
        </svg>
        {/* 仪表盘中心显示 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <div className={cn('text-lg font-bold', DASHBOARD_STYLES.textSecondary)}>{amount}</div>
          <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>万</div>
        </div>
      </div>
      <div className={cn('text-sm font-medium', DASHBOARD_STYLES.textSecondary)}>{label}</div>
    </div>
  );
}

export default function RiskIdentificationPanel({
  delayedProjects = defaultDelayedProjects,
  efficiencyData = defaultEfficiencyData,
  otherRisks = defaultOtherRisks,
  theme = 'dashboard'
}: RiskIdentificationPanelProps) {
  // 获取严重程度样式
  const getSeverityStyles = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/30 text-red-300 border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
      case 'medium':
        return 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/30 text-green-300 border-green-500/50';
    }
  };

  // 获取风险图标
  const getRiskIcon = (type: 'specialPrice' | 'reserveInsufficient' | 'scaleInsufficient') => {
    switch (type) {
      case 'specialPrice':
        return <FileWarning className="w-4 h-4" />;
      case 'reserveInsufficient':
        return <TrendingDown className="w-4 h-4" />;
      case 'scaleInsufficient':
        return <Target className="w-4 h-4" />;
    }
  };

  // 计算高风险数量
  const highRiskCount = [
    ...delayedProjects.filter(p => p.severity === 'high'),
    ...otherRisks.filter(r => r.severity === 'high')
  ].length;

  return (
    <div
      className={cn(
        'w-full rounded-lg overflow-hidden transition-all duration-300',
        theme === 'dashboard'
          ? `${DASHBOARD_STYLES.bg} ${DASHBOARD_STYLES.cardBorder} shadow-[0_0_25px_rgba(6,182,212,0.3)]`
          : theme === 'dark'
          ? 'bg-slate-800 border border-slate-700'
          : 'bg-white border border-slate-200'
      )}
    >
      {/* 标题栏 */}
      <div
        className={cn(
          'px-4 py-3 border-b flex items-center justify-between',
          theme === 'dashboard' ? `${DASHBOARD_STYLES.cardBorder} bg-slate-900/50` : 'border-slate-200 bg-white'
        )}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className={cn('w-5 h-5', theme === 'dashboard' ? 'text-cyan-400' : 'text-slate-700')} />
          <h3 className={cn('font-bold text-lg', theme === 'dashboard' ? DASHBOARD_STYLES.textSecondary : 'text-slate-900')}>
            风险识别
          </h3>
        </div>
        {highRiskCount > 0 && (
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium animate-pulse',
              theme === 'dashboard' ? 'bg-red-500/30 text-red-300 border border-red-500/40' : 'bg-red-100 text-red-700'
            )}
          >
            <AlertTriangle className="w-3 h-3" />
            {highRiskCount} 项高风险
          </div>
        )}
      </div>

      {/* 风险列表 */}
      <div className="p-3 space-y-3">
        {/* 延迟项目 - 仪表盘风格 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className={cn('w-5 h-5 text-cyan-400')} />
            <h4 className={cn('text-base font-semibold', DASHBOARD_STYLES.textSecondary)}>延迟项目仪表盘</h4>
          </div>

          {/* 仪表盘卡片网格 */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            {delayedProjects.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-lg p-3 border-2 transition-all duration-200',
                  item.severity === 'high'
                    ? 'bg-slate-900/60 border-red-500/40 hover:bg-red-500/10 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                    : 'bg-slate-900/60 border-yellow-500/40 hover:bg-yellow-500/10 hover:border-yellow-500/60'
                )}
              >
                <DashboardGauge
                  percent={item.percent || 50}
                  severity={item.severity}
                  amount={item.amount}
                  label={item.period}
                />

                {/* 底部信息 */}
                <div className="mt-3 pt-2 border-t border-cyan-500/20">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={cn(DASHBOARD_STYLES.textMuted)}>项目数</span>
                    <span className={cn('font-bold', DASHBOARD_STYLES.textSecondary)}>{item.count}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={cn(DASHBOARD_STYLES.textMuted)}>可填补缺口</span>
                    <span className={cn('font-bold text-green-400')}>+{item.gapFill}万</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 统计总览 */}
          <div className={cn('p-3 rounded-lg border', DASHBOARD_STYLES.cardBorder)}>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>延迟项目总数</div>
                <div className={cn('text-xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                  {delayedProjects.reduce((sum, p) => sum + p.count, 0)}
                </div>
              </div>
              <div>
                <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>延迟总金额</div>
                <div className={cn('text-xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                  {delayedProjects.reduce((sum, p) => sum + p.amount, 0)}
                  <span className="text-sm">万</span>
                </div>
              </div>
              <div>
                <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>可填补总缺口</div>
                <div className={cn('text-xl font-bold text-green-400')}>
                  +{delayedProjects.reduce((sum, p) => sum + p.gapFill, 0)}
                  <span className="text-sm">万</span>
                </div>
              </div>
              <div>
                <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>高风险占比</div>
                <div className={cn('text-xl font-bold text-red-400')}>
                  {Math.round((delayedProjects.filter(p => p.severity === 'high').length / delayedProjects.length) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn('border-t', DASHBOARD_STYLES.cardBorder)}></div>

        {/* 人效模块 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Users className={cn('w-4 h-4 text-cyan-400')} />
            <h4 className={cn('text-sm font-semibold', DASHBOARD_STYLES.textSecondary)}>人效分析</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                'rounded-lg p-3 border',
                efficiencyData.zeroProjectCurrentMonth.severity === 'high'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-yellow-500/10 border-yellow-500/30'
              )}
            >
              <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>本月0项目人员</div>
              <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                {efficiencyData.zeroProjectCurrentMonth.count}
                <span className="text-sm font-normal ml-1">人</span>
              </div>
            </div>
            <div
              className={cn(
                'rounded-lg p-3 border',
                efficiencyData.zeroProject3Months.severity === 'high'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-yellow-500/10 border-yellow-500/30'
              )}
            >
              <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>近3月0项目人员</div>
              <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                {efficiencyData.zeroProject3Months.count}
                <span className="text-sm font-normal ml-1">人</span>
              </div>
            </div>
          </div>
        </div>

        <div className={cn('border-t', DASHBOARD_STYLES.cardBorder)}></div>

        {/* 其他风险 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={cn('w-4 h-4 text-cyan-400')} />
            <h4 className={cn('text-sm font-semibold', DASHBOARD_STYLES.textSecondary)}>其他风险</h4>
          </div>
          {otherRisks.map((risk, index) => (
            <div
              key={index}
              className={cn(
                'rounded-lg p-3 border transition-all duration-200 flex items-center gap-3',
                risk.severity === 'high'
                  ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : risk.severity === 'medium'
                  ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                  : 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
              )}
            >
              <div className={cn(
                'p-2 rounded-lg',
                risk.severity === 'high' ? 'bg-red-500/20' : risk.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
              )}>
                {getRiskIcon(risk.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('font-medium text-sm', DASHBOARD_STYLES.textSecondary)}>{risk.title}</span>
                  <span className={cn('px-2 py-0.5 rounded text-xs font-medium', getSeverityStyles(risk.severity))}>
                    {risk.severity === 'high' ? '高风险' : risk.severity === 'medium' ? '中风险' : '低风险'}
                  </span>
                </div>
                <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{risk.description}</div>
              </div>
              <div className={cn('text-xl font-bold', DASHBOARD_STYLES.textSecondary)}>{risk.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
