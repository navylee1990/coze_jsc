'use client';

import { X, ArrowLeft, Activity, User, ChevronRight, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  data: any[];
  level: 'city' | 'salesperson';
  onBack?: () => void;
  onItemClick?: (item: any) => void;
}

// 驾驶舱样式
const DASHBOARD_STYLES = {
  bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
  text: 'text-cyan-50',
  textMuted: 'text-cyan-300/70',
  textSecondary: 'text-cyan-200',
  cardBg: 'bg-slate-900/60 backdrop-blur-sm',
  cardBorder: 'border-cyan-500/30',
  glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
  neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
};

// 获取排名图标
const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />;
    case 2:
      return <Medal className="w-5 h-5 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.8)]" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]" />;
    default:
      return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-cyan-400/70">{rank}</span>;
  }
};

// 获取趋势图标
const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.8)]" />;
    case 'stable':
      return <Minus className="w-4 h-4 text-cyan-400/70" />;
    default:
      return null;
  }
};

export default function DrillDownModal({
  isOpen,
  onClose,
  title,
  subtitle,
  data,
  level,
  onBack,
  onItemClick
}: DrillDownModalProps) {
  if (!isOpen) return null;

  // 计算合计
  const totals = data.reduce((acc, item) => ({
    target: acc.target + item.target,
    completed: acc.completed + item.completed,
    predicted: acc.predicted + item.predicted,
    pendingAmount: acc.pendingAmount + (item.pendingAmount || 0),
  }), { target: 0, completed: 0, predicted: 0, pendingAmount: 0 });

  // 渲染表头
  const renderTableHeader = () => (
    <div className="grid grid-cols-8 gap-3 px-4 py-2.5 text-xs font-bold border-b border-cyan-500/30 bg-slate-800/60">
      <div className="flex items-center justify-center gap-2 text-cyan-200">排名</div>
      <div className="text-cyan-200">{level === 'salesperson' ? '业务员' : '城市名称'}</div>
      <div className="text-right text-cyan-200">目标(万)</div>
      <div className="text-right text-cyan-200">预测(万)</div>
      <div className="text-right text-cyan-200">缺口(万)</div>
      <div className="text-center text-cyan-200">达成率</div>
      <div className="text-right text-cyan-200">在手项目(万)</div>
      <div className="w-4"></div>
    </div>
  );

  // 渲染行数据
  const renderTableRow = (item: any, rank: number) => {
    const gapClass = item.gap > 0 ? 'text-red-400' : 'text-green-400';
    const rowBgClass = rank % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/20';

    return (
      <div
        key={rank}
        className={cn(
          'grid grid-cols-8 gap-3 px-4 py-2 items-center border-b border-cyan-500/20 transition-all duration-200 cursor-pointer',
          rowBgClass,
          level === 'city' ? 'hover:bg-slate-800/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'hover:bg-slate-800/40'
        )}
        onClick={() => level === 'city' && onItemClick?.(item)}
      >
        {/* 排名 */}
        <div className="flex items-center justify-center">
          {getRankIcon(rank)}
        </div>

        {/* 名称 */}
        <div className="flex items-center gap-2">
          {level === 'salesperson' ? (
            <User className="w-3.5 h-3.5 text-cyan-400/60" />
          ) : (
            <Activity className="w-3.5 h-3.5 text-cyan-400/60" />
          )}
          <span className="font-medium text-sm text-cyan-200">{item.name}</span>
          {item.trend && (
            <span className="flex items-center">
              {getTrendIcon(item.trend)}
            </span>
          )}
        </div>

        {/* 目标 */}
        <div className="text-right font-medium text-sm text-cyan-200">
          {item.target.toLocaleString()}
        </div>

        {/* 预测 */}
        <div className="text-right font-medium text-sm text-cyan-200">
          {item.predicted.toLocaleString()}
        </div>

        {/* 缺口 */}
        <div className={cn('text-right font-medium text-sm', gapClass)}>
          {item.gap > 0 ? `${item.gap}` : `+${Math.abs(item.gap)}`}
        </div>

        {/* 达成率 */}
        <div className="flex items-center justify-center gap-2">
          <span className={cn('text-sm font-medium', item.rate >= 100 ? 'text-green-400' : item.rate >= 80 ? 'text-yellow-400' : 'text-red-400')}>
            {item.rate.toFixed(1)}%
          </span>
          <div className="w-12 h-1 rounded-full bg-slate-700/50 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                item.rate >= 100 ? 'bg-green-500' : item.rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(item.rate, 100)}%` }}
            />
          </div>
        </div>

        {/* 在手项目 */}
        <div className="text-right font-medium text-sm text-cyan-200">
          {(item.pendingAmount || 0).toLocaleString()}
        </div>

        {/* 钻取箭头 */}
        <div className="flex justify-center">
          {level === 'city' ? (
            <ChevronRight className="w-4 h-4 text-cyan-400/60" />
          ) : (
            <div className="w-4"></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className={`relative w-full max-w-6xl max-h-[90vh] ${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} border-2 rounded-2xl overflow-hidden ${DASHBOARD_STYLES.glow}`}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-slate-900/80">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className={`text-xl font-bold ${DASHBOARD_STYLES.neon} flex items-center gap-2`}>
                <Activity className="w-5 h-5" />
                {title}
              </h2>
              {subtitle && <p className={`text-sm ${DASHBOARD_STYLES.textMuted} mt-1`}>{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 合计数据栏 */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-cyan-500/10">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-cyan-500/20">
              <div className={`text-xs ${DASHBOARD_STYLES.textMuted} mb-1`}>目标</div>
              <div className="text-2xl font-bold text-cyan-300">{totals.target.toLocaleString()}</div>
              <div className="text-xs text-cyan-400/60 mt-1">万元</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-cyan-500/20">
              <div className={`text-xs ${DASHBOARD_STYLES.textMuted} mb-1`}>预测</div>
              <div className="text-2xl font-bold text-cyan-300">{totals.predicted.toLocaleString()}</div>
              <div className="text-xs text-cyan-400/60 mt-1">万元</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-cyan-500/20">
              <div className={`text-xs ${DASHBOARD_STYLES.textMuted} mb-1`}>在手项目</div>
              <div className="text-2xl font-bold text-cyan-300">{totals.pendingAmount.toLocaleString()}</div>
              <div className="text-xs text-cyan-400/60 mt-1">万元</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-cyan-500/20">
              <div className={`text-xs ${DASHBOARD_STYLES.textMuted} mb-1`}>总体达成率</div>
              <div className="text-2xl font-bold ${totals.predicted >= totals.target ? 'text-green-400' : 'text-red-400'}">
                {((totals.predicted / totals.target) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-cyan-400/60 mt-1">预测达成</div>
            </div>
          </div>
        </div>

        {/* 数据列表 */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          <div className="border-2 rounded-xl overflow-hidden border-cyan-500/30">
            {renderTableHeader()}
            {data.map((item, index) => renderTableRow(item, index + 1))}
          </div>
        </div>
      </div>
    </div>
  );
}
