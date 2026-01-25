'use client';

import { AlertTriangle, Clock, TrendingDown, FileWarning, Target, Users, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// 驾驶舱样式
const DASHBOARD_STYLES = {
  bg: 'bg-slate-900/80',
  text: 'text-cyan-50',
  textMuted: 'text-cyan-300/70',
  textSecondary: 'text-cyan-200',
  cardBorder: 'border-cyan-500/30',
  neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
};

// 延迟项目时间分类
interface DelayedProjectCategory {
  period: string; // '本月', '未来1个月', '未来3个月', '未来半年'
  periodKey: 'current' | 'future1Month' | 'future3Months' | 'future6Months';
  count: number;
  amount: number; // 总金额
  gapFill: number; // 可填补缺口
  severity: 'high' | 'medium' | 'low';
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

// 默认延迟项目数据
const defaultDelayedProjects: DelayedProjectCategory[] = [
  {
    period: '本月',
    periodKey: 'current',
    count: 3,
    amount: 200,
    gapFill: 200,
    severity: 'high'
  },
  {
    period: '未来1个月',
    periodKey: 'future1Month',
    count: 5,
    amount: 280,
    gapFill: 280,
    severity: 'high'
  },
  {
    period: '未来3个月',
    periodKey: 'future3Months',
    count: 8,
    amount: 450,
    gapFill: 450,
    severity: 'medium'
  },
  {
    period: '未来半年',
    periodKey: 'future6Months',
    count: 12,
    amount: 680,
    gapFill: 680,
    severity: 'medium'
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
        {/* 延迟项目 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Clock className={cn('w-4 h-4 text-cyan-400')} />
            <h4 className={cn('text-sm font-semibold', DASHBOARD_STYLES.textSecondary)}>延迟项目</h4>
          </div>
          {delayedProjects.map((item, index) => (
            <div
              key={index}
              className={cn(
                'rounded-lg p-3 border transition-all duration-200',
                item.severity === 'high'
                  ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('font-medium text-sm', DASHBOARD_STYLES.textSecondary)}>{item.period}</span>
                    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', getSeverityStyles(item.severity))}>
                      {item.severity === 'high' ? '高风险' : '中风险'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>项目数量</div>
                      <div className={cn('text-lg font-bold', DASHBOARD_STYLES.textSecondary)}>{item.count}</div>
                    </div>
                    <div>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>总金额(万)</div>
                      <div className={cn('text-lg font-bold', DASHBOARD_STYLES.textSecondary)}>{item.amount}</div>
                    </div>
                    <div>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>可填补缺口(万)</div>
                      <div className={cn('text-lg font-bold text-green-400')}>+{item.gapFill}</div>
                    </div>
                  </div>
                </div>
              </div>
              <button className={cn(
                'w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300',
                'hover:bg-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              )}>
                <Zap className="w-4 h-4" />
                一键处理
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
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
