'use client';

import { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus, AlertTriangle, CheckCircle2, Clock, TrendingDown, TrendingUp, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Theme = 'dark' | 'light';

// 支撑时间段数据类型
interface SupportPeriod {
  period: string; // '0-30天' | '1-3月' | '3-6月'
  amount: number; // 支撑金额（万元）
  coverageRate: number; // 覆盖度（百分比）
  status: 'critical' | 'warning' | 'good' | 'excellent'; // 状态
}

// 支撑缺失类型
interface SupportGap {
  type: string; // '项目延迟' | '储备新增不足' | '渠道贡献下滑'
  gap: number; // 缺口金额（万元）
}

// 行动建议类型
interface ActionItem {
  priority: 'high' | 'medium' | 'low'; // 优先级
  icon: string; // emoji
  title: string; // 建议标题
  detail: string; // 建议详情
  link?: string; // 链接
}

// 组件Props
interface FutureSupportSummaryPanelProps {
  theme: Theme;
  // 数据
  futureTarget: number; // 未来目标（万元）
  futureSupport: number; // 未来支撑（万元）
  trendDirection: 'down' | 'stable' | 'up'; // 趋势方向
  periods: SupportPeriod[]; // 三段支撑数据
  gaps: SupportGap[]; // 支撑缺失数据
  improvedCoverageRate: number; // 若全部问题解决后的覆盖度
  remainingGap: number; // 解决后剩余缺口
  actions: ActionItem[]; // 行动建议
  // 回调
  onPeriodClick?: (period: string) => void;
  onGapClick?: () => void;
  onActionClick?: (action: ActionItem) => void;
}

export default function FutureSupportSummaryPanel({
  theme,
  futureTarget,
  futureSupport,
  trendDirection,
  periods,
  gaps,
  improvedCoverageRate,
  remainingGap,
  actions,
  onPeriodClick,
  onGapClick,
  onActionClick
}: FutureSupportSummaryPanelProps) {
  // 计算覆盖度
  const coverageRate = ((futureSupport / futureTarget) * 100).toFixed(0);
  const coverageRateNum = parseFloat(coverageRate);
  const gapAmount = futureTarget - futureSupport;

  // 判断覆盖度状态
  const getCoverageStatus = () => {
    if (coverageRateNum < 50) return { color: 'text-red-600', bgColor: 'bg-red-50', label: '严重不足' };
    if (coverageRateNum < 70) return { color: 'text-orange-600', bgColor: 'bg-orange-50', label: '不足' };
    if (coverageRateNum < 90) return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', label: '基本达标' };
    return { color: 'text-green-600', bgColor: 'bg-green-50', label: '充足' };
  };

  const coverageStatus = getCoverageStatus();

  // 判断支撑段状态颜色
  const getPeriodColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'good': return 'bg-green-500';
      case 'excellent': return 'bg-green-400';
      default: return 'bg-slate-500';
    }
  };

  const getPeriodBgColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'good': return 'bg-green-50 border-green-200';
      case 'excellent': return 'bg-green-50 border-green-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getPeriodTextColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'good': return 'text-green-600';
      case 'excellent': return 'text-green-600';
      default: return 'text-slate-600';
    }
  };

  const getPeriodStatusText = (status: string) => {
    switch (status) {
      case 'critical': return '严重不足';
      case 'warning': return '不足';
      case 'good': return '稳定';
      case 'excellent': return '充足';
      default: return '未知';
    }
  };

  // 趋势图标
  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'stable': return <Minus className="w-4 h-4 text-slate-600" />;
    }
  };

  const getTrendText = () => {
    switch (trendDirection) {
      case 'up': return '提升中';
      case 'down': return '下降中';
      case 'stable': return '平稳';
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'} border rounded-xl p-5`}>
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-600'} rounded-lg flex items-center justify-center`}>
            <TrendingDown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-700">未来支撑够不够？</h3>
            <p className="text-xs text-slate-600">未来支撑充分性摘要</p>
          </div>
        </div>
        <Badge variant="outline" className={`${coverageStatus.bgColor} ${coverageStatus.color} border-transparent`}>
          {coverageStatus.label}
        </Badge>
      </div>

      {/* 主体布局：左右分区 */}
      <div className="grid grid-cols-12 gap-4">
        {/* 左侧：核心结论区（4列） */}
        <div className="col-span-4 space-y-3">
          <div className={`rounded-lg ${coverageStatus.bgColor} border ${theme === 'dark' ? 'border-slate-700' : 'border-opacity-20'} p-4`}>
            {/* 覆盖度大数字 */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${coverageStatus.color} mb-1`}>
                {coverageRate}%
              </div>
              <div className="text-sm text-slate-600 mb-2">支撑覆盖度</div>
              {/* 趋势指示 */}
              <div className="flex items-center justify-center gap-1 text-xs text-slate-600">
                {getTrendIcon()}
                <span>{getTrendText()}</span>
              </div>
            </div>
          </div>

          {/* 目标vs支撑 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">未来目标</span>
              <span className="text-sm font-semibold text-slate-700">{(futureTarget / 10000).toFixed(2)} 亿元</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">未来支撑</span>
              <span className="text-sm font-semibold text-slate-700">{(futureSupport / 10000).toFixed(2)} 亿元</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">缺口</span>
              <span className={`text-sm font-bold ${gapAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {gapAmount > 0 ? '-' : '+'}{(Math.abs(gapAmount) / 10000).toFixed(2)} 亿元
              </span>
            </div>
          </div>
        </div>

        {/* 中部：三段支撑结构（5列） */}
        <div className="col-span-5 space-y-3">
          <div className="text-sm font-semibold text-slate-700 mb-2">支撑结构</div>
          {periods.map((period, index) => (
            <div
              key={index}
              className={`rounded-lg ${getPeriodBgColor(period.status)} border cursor-pointer hover:shadow-md transition-all`}
              onClick={() => onPeriodClick?.(period.period)}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-xs font-semibold text-slate-700">{period.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${getPeriodBgColor(period.status)} ${getPeriodTextColor(period.status)} border-transparent text-xs px-2 py-0.5`}>
                      {getPeriodStatusText(period.status)}
                    </Badge>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-slate-700">{period.amount}万</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${getPeriodTextColor(period.status)}`}>
                      覆盖度 {period.coverageRate}%
                    </div>
                  </div>
                </div>
                {/* 覆盖度进度条 */}
                <div className="mt-2">
                  <div className={`h-1.5 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full ${getPeriodColor(period.status)} transition-all duration-500`}
                      style={{ width: `${Math.min(period.coverageRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：支撑缺失与诊断（3列） */}
        <div className="col-span-3 space-y-3">
          <div className="text-sm font-semibold text-slate-700 mb-2">支撑缺口来源</div>
          
          {/* 缺口列表 */}
          <div className="space-y-2">
            {gaps.map((gap, index) => (
              <div
                key={index}
                className={`flex items-center justify-between text-xs py-2 px-2 rounded ${theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'} transition-colors cursor-pointer`}
                onClick={onGapClick}
              >
                <span className="text-slate-600 truncate">{gap.type}</span>
                <span className="font-semibold text-red-600">-{gap.gap}万</span>
              </div>
            ))}
          </div>

          {/* 解决后总结 */}
          <div className={`mt-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-slate-600 leading-relaxed">
                若全部解决，覆盖度可提升至 <span className="font-semibold text-blue-600">{improvedCoverageRate}%</span>
                {remainingGap > 0 && `，仍缺约 ${remainingGap}万`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部：行动建议 */}
      <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="text-xs font-semibold text-slate-600 mb-2">行动建议</div>
        <div className="space-y-2">
          {actions.slice(0, 3).map((action, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 p-2 rounded-lg ${
                action.priority === 'high'
                  ? `${theme === 'dark' ? 'bg-red-900/10 border border-red-800/20' : 'bg-red-50 border border-red-200'}`
                  : action.priority === 'medium'
                  ? `${theme === 'dark' ? 'bg-yellow-900/10 border border-yellow-800/20' : 'bg-yellow-50 border border-yellow-200'}`
                  : `${theme === 'dark' ? 'bg-green-900/10 border border-green-800/20' : 'bg-green-50 border border-green-200'}`
              } cursor-pointer hover:shadow-sm transition-all`}
              onClick={() => onActionClick?.(action)}
            >
              <span className="text-sm flex-shrink-0">{action.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-700">{action.title}</div>
                <div className="text-xs text-slate-600 truncate">{action.detail}</div>
              </div>
              {action.link && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
