'use client';

import { ArrowUp, ArrowRight, ArrowDown, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, ChevronRight, Clock } from 'lucide-react';

type Theme = 'dark' | 'light';

// 支撑段数据类型
interface SupportPeriod {
  period: string; // '0-30天' | '1-3月' | '3-6月'
  amount: number; // 支撑金额（万元）
  coverageRate: number; // 覆盖度（百分比）
  trend: 'up' | 'stable' | 'down'; // 趋势
  status: 'critical' | 'warning' | 'good' | 'excellent'; // 状态
  summary: string; // 一句话总结
}

// 缺口来源数据类型
interface GapSource {
  type: string; // 类型描述
  impact: number; // 影响金额（万元）
}

// 行动建议数据类型
interface ActionItem {
  priority: 'high' | 'medium' | 'low'; // 优先级
  icon: string; // emoji
  title: string; // 标题
  detail: string; // 详情
}

// 趋势数据点
interface TrendPoint {
  label: string;
  target: number;
  predicted: number;
}

// 组件Props
interface FutureSupportDecisionPanelProps {
  theme: Theme;
  // 核心数据
  futureTarget: number; // 未来目标（万元）
  futureSupport: number; // 当前未来支撑（万元）
  coverageRate: number; // 覆盖度（百分比）
  gap: number; // 缺口金额（万元）
  trendDirection: 'up' | 'stable' | 'down'; // 趋势方向
  // 支撑结构
  periods: SupportPeriod[]; // 三段支撑数据
  // 缺口诊断
  gapSources: GapSource[]; // 缺口来源
  improvedCoverageRate: number; // 解决后覆盖度
  remainingGap: number; // 解决后剩余缺口
  // 行动建议
  actions: ActionItem[]; // 行动建议
  // 趋势数据
  trendData: TrendPoint[]; // 微型趋势图数据
  // 回调
  onPeriodClick?: (period: string) => void;
  onGapClick?: () => void;
  onActionClick?: (action: ActionItem) => void;
}

export default function FutureSupportDecisionPanel({
  theme,
  futureTarget,
  futureSupport,
  coverageRate,
  gap,
  trendDirection,
  periods,
  gapSources,
  improvedCoverageRate,
  remainingGap,
  actions,
  trendData,
  onPeriodClick,
  onGapClick,
  onActionClick
}: FutureSupportDecisionPanelProps) {
  // 判断覆盖度状态
  const getCoverageStatus = () => {
    if (coverageRate < 50) return { color: '#ef4444', textColor: 'text-red-600', bgColor: 'bg-red-50', label: '严重不足' };
    if (coverageRate < 70) return { color: '#f97316', textColor: 'text-orange-600', bgColor: 'bg-orange-50', label: '不足' };
    if (coverageRate < 90) return { color: '#eab308', textColor: 'text-yellow-600', bgColor: 'bg-yellow-50', label: '基本达标' };
    return { color: '#22c55e', textColor: 'text-green-600', bgColor: 'bg-green-50', label: '充足' };
  };

  const coverageStatus = getCoverageStatus();

  // 趋势图标
  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up': return <ArrowUp className="w-3.5 h-3.5 text-green-600" />;
      case 'down': return <ArrowDown className="w-3.5 h-3.5 text-red-600" />;
      case 'stable': return <ArrowRight className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  // 支撑段状态灯颜色
  const getPeriodStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f97316';
      case 'good': return '#22c55e';
      case 'excellent': return '#16a34a';
      default: return '#64748b';
    }
  };

  const getPeriodBgColor = (status: string) => {
    switch (status) {
      case 'critical': return 'rgba(239, 68, 68, 0.08)';
      case 'warning': return 'rgba(249, 115, 22, 0.08)';
      case 'good': return 'rgba(34, 197, 94, 0.08)';
      case 'excellent': return 'rgba(22, 163, 74, 0.08)';
      default: return 'rgba(100, 116, 139, 0.08)';
    }
  };

  const getPeriodTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-3 h-3 text-green-600" />;
      case 'down': return <ArrowDown className="w-3 h-3 text-red-600" />;
      case 'stable': return <ArrowRight className="w-3 h-3 text-slate-600" />;
    }
  };

  // 行动优先级样式
  const getActionPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          borderLeftColor: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.05)'
        };
      case 'medium':
        return {
          borderLeftColor: '#f97316',
          bgColor: 'rgba(249, 115, 22, 0.05)'
        };
      case 'low':
        return {
          borderLeftColor: '#22c55e',
          bgColor: 'rgba(34, 197, 94, 0.05)'
        };
      default:
        return {
          borderLeftColor: '#64748b',
          bgColor: 'rgba(100, 116, 139, 0.05)'
        };
    }
  };

  // 计算微型趋势图的最大值
  const maxTrendValue = Math.max(
    ...trendData.map(p => Math.max(p.target, p.predicted))
  );

  return (
    <div
      className={`${theme === 'dark' ? 'bg-slate-900/40' : 'bg-gradient-to-r from-slate-50 to-white'} ${theme === 'dark' ? 'border-slate-800' : 'border-slate-300'} border rounded-xl p-5`}
      style={{ minHeight: '240px' }}
    >
      {/* 顶部标题栏 - 极简 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded flex items-center justify-center`} style={{ backgroundColor: coverageStatus.color }}>
            <TrendingDown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700">未来支撑够不够？</h3>
            <p className="text-xs text-slate-600">决策面板 · {new Date().toLocaleDateString('zh-CN', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded text-xs font-semibold ${coverageStatus.bgColor} ${coverageStatus.textColor}`}>
          {coverageStatus.label}
        </div>
      </div>

      {/* 主布局：左中右三列 */}
      <div className="grid grid-cols-12 gap-4">
        {/* 左侧：目标与趋势（4列） */}
        <div className="col-span-4 flex flex-col justify-between">
          {/* 核心数字区 */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* 未来目标 */}
            <div className="text-center">
              <div className="text-xs text-slate-600 mb-1">未来目标</div>
              <div className="text-lg font-bold text-slate-700">{(futureTarget / 10000).toFixed(2)}亿</div>
            </div>
            {/* 当前支撑 */}
            <div className="text-center">
              <div className="text-xs text-slate-600 mb-1">当前支撑</div>
              <div className="text-lg font-bold text-slate-700">{(futureSupport / 10000).toFixed(2)}亿</div>
            </div>
            {/* 覆盖度 - 大数字 */}
            <div className={`text-center p-2 rounded-lg ${coverageStatus.bgColor} border border-opacity-20`} style={{ borderColor: coverageStatus.color }}>
              <div className="text-xs text-slate-600 mb-1">覆盖度</div>
              <div className="text-2xl font-bold" style={{ color: coverageStatus.color }}>{coverageRate}%</div>
            </div>
            {/* 缺口 */}
            <div className={`text-center p-2 rounded-lg ${gap > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border border-opacity-20`}>
              <div className="text-xs text-slate-600 mb-1">缺口</div>
              <div className={`text-lg font-bold ${gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {gap > 0 ? '-' : '+'}{(Math.abs(gap) / 10000).toFixed(2)}亿
              </div>
            </div>
          </div>

          {/* 趋势指示 */}
          <div className={`flex items-center justify-center gap-1 p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
            {getTrendIcon()}
            <span className="text-xs font-semibold text-slate-600">
              {trendDirection === 'up' ? '趋势提升中' : trendDirection === 'down' ? '趋势下降中' : '趋势平稳'}
            </span>
          </div>

          {/* 微型趋势图 - 极小（高度20px） */}
          <div className={`mt-3 p-2 rounded ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
            <div className="relative h-5">
              {/* 网格线 */}
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="w-full h-px bg-slate-200 opacity-30"></div>
                <div className="w-full h-px bg-slate-200 opacity-30"></div>
              </div>

              {/* 趋势线 - 目标线（虚线） */}
              <svg className="absolute inset-0 w-full h-full" overflow="visible">
                <polyline
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                  opacity="0.5"
                  points={trendData.map((point, index) => {
                    const x = (index / (trendData.length - 1)) * 100;
                    const y = 100 - (point.target / maxTrendValue) * 80 - 10;
                    return `${x}%,${y}%`;
                  }).join(' ')}
                />
              </svg>

              {/* 趋势线 - 预测线（实线） */}
              <svg className="absolute inset-0 w-full h-full" overflow="visible">
                <polyline
                  fill="none"
                  stroke={coverageStatus.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={trendData.map((point, index) => {
                    const x = (index / (trendData.length - 1)) * 100;
                    const y = 100 - (point.predicted / maxTrendValue) * 80 - 10;
                    return `${x}%,${y}%`;
                  }).join(' ')}
                />
              </svg>
            </div>

            {/* 时间标签 */}
            <div className="flex justify-between mt-1">
              {trendData.map((point, index) => (
                <div key={index} className="text-xs text-slate-600 font-medium">
                  {point.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 中间：未来支撑结构（4列） */}
        <div className="col-span-4 space-y-2.5">
          <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            支撑结构
          </div>

          {periods.map((period, index) => (
            <div
              key={index}
              className={`p-2.5 rounded-lg cursor-pointer hover:shadow-md transition-all`}
              style={{
                backgroundColor: getPeriodBgColor(period.status),
                border: `1px solid ${getPeriodStatusColor(period.status)}20`,
                borderLeft: `3px solid ${getPeriodStatusColor(period.status)}`
              }}
              onClick={() => onPeriodClick?.(period.period)}
            >
              {/* 标题行 */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">{period.period}</span>
                  {/* 状态灯 */}
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getPeriodStatusColor(period.status) }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  {getPeriodTrendIcon(period.trend)}
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
              </div>

              {/* 核心数据 */}
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-bold text-slate-700">{period.amount}万</div>
                <div
                  className="text-xs font-semibold"
                  style={{ color: getPeriodStatusColor(period.status) }}
                >
                  覆盖度 {period.coverageRate}%
                </div>
              </div>

              {/* 状态总结 */}
              <div className="text-xs text-slate-600">
                {period.summary}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：缺口诊断与行动建议（4列） */}
        <div className="col-span-4 flex flex-col">
          {/* 缺口诊断 */}
          <div className="mb-3">
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              缺口诊断
            </div>

            <div className="space-y-1.5">
              {gapSources.map((source, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-3 py-1.5 rounded cursor-pointer transition-colors ${theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderLeft: '2px solid #ef4444' }}
                  onClick={onGapClick}
                >
                  <span className="text-xs text-slate-600">{source.type}</span>
                  <span className="text-xs font-semibold text-red-600">-{source.impact}万</span>
                </div>
              ))}
            </div>

            {/* 模拟补全效果 */}
            <div
              className={`mt-2 px-3 py-2 rounded cursor-pointer transition-colors ${theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', borderLeft: '2px solid #3b82f6' }}
              onClick={onGapClick}
            >
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-600 leading-relaxed">
                  若全部解决，覆盖度可提升至 <span className="font-semibold text-blue-600">{improvedCoverageRate}%</span>
                  {remainingGap > 0 && `，仍缺约 ${remainingGap}万`}
                </span>
              </div>
            </div>
          </div>

          {/* 行动建议 */}
          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
              行动建议
            </div>

            <div className="space-y-1.5">
              {actions.slice(0, 3).map((action, index) => {
                const priorityStyle = getActionPriorityStyle(action.priority);
                return (
                  <div
                    key={index}
                    className={`px-3 py-1.5 rounded cursor-pointer hover:shadow-sm transition-all`}
                    style={{
                      backgroundColor: priorityStyle.bgColor,
                      borderLeft: `3px solid ${priorityStyle.borderLeftColor}`
                    }}
                    onClick={() => onActionClick?.(action)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm flex-shrink-0">{action.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-700 truncate">{action.title}</div>
                        <div className="text-xs text-slate-600 truncate">{action.detail}</div>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
