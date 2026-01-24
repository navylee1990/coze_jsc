'use client';

import { Activity, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegionMatrixProps {
  data: any[];
  title?: string;
  subtitle?: string;
  theme?: 'dashboard' | 'dark' | 'light';
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

export default function RegionMatrix({
  data,
  title = '区域达成',
  subtitle = '',
  theme = 'dashboard'
}: RegionMatrixProps) {
  // 根据主题获取样式
  const getStyles = () => {
    if (theme === 'dashboard') {
      return DASHBOARD_STYLES;
    }
    return DASHBOARD_STYLES;
  };

  const styles = getStyles();

  // 渲染表头
  const renderTableHeader = () => (
    <div className={cn(
      'grid grid-cols-7 gap-3 px-4 py-2.5 text-xs font-bold border-b',
      theme === 'dashboard' ? 'bg-slate-800/60 border-cyan-500/30' : 'bg-slate-100 border-slate-200'
    )}>
      <div className={cn('flex items-center justify-center gap-2', styles.textSecondary)}>排名</div>
      <div className={cn(styles.textSecondary)}>区域名称</div>
      <div className={cn('text-right', styles.textSecondary)}>目标(万)</div>
      <div className={cn('text-right', styles.textSecondary)}>预测(万)</div>
      <div className={cn('text-right', styles.textSecondary)}>缺口(万)</div>
      <div className={cn('text-center', styles.textSecondary)}>达成率</div>
      <div className={cn('text-right', styles.textSecondary)}>在手项目(万)</div>
    </div>
  );

  // 渲染行数据
  const renderTableRow = (item: any, rank: number) => {
    const gapClass = item.gap > 0 ? 'text-red-400' : 'text-green-400';
    const rowBgClass = rank % 2 === 0
      ? (theme === 'dashboard' ? 'bg-slate-900/40' : 'bg-slate-50')
      : (theme === 'dashboard' ? 'bg-slate-900/20' : 'bg-white');

    return (
      <div
        key={rank}
        className={cn(
          'grid grid-cols-7 gap-3 px-4 py-2 items-center border-b transition-all duration-200',
          rowBgClass,
          theme === 'dashboard' ? 'border-cyan-500/20 hover:bg-slate-800/60' : 'border-slate-200 hover:bg-slate-100'
        )}
      >
        {/* 排名 */}
        <div className="flex items-center justify-center">
          {getRankIcon(rank)}
        </div>

        {/* 区域名称 */}
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400/60" />
          <span className={cn('font-medium text-sm', styles.textSecondary)}>{item.name}</span>
          {item.trend && (
            <span className="flex items-center">
              {getTrendIcon(item.trend)}
            </span>
          )}
        </div>

        {/* 目标 */}
        <div className={cn('text-right font-medium text-sm', styles.textSecondary)}>
          {item.target.toLocaleString()}
        </div>

        {/* 预测 */}
        <div className={cn('text-right font-medium text-sm', styles.textSecondary)}>
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
        <div className={cn('text-right font-medium text-sm', styles.textSecondary)}>
          {(item.pendingAmount || 0).toLocaleString()}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('w-full', styles.bg, styles.text)}>
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div>
          <h3 className={cn('text-sm font-bold flex items-center gap-2', styles.neon)}>
            <Activity className="w-4 h-4" />
            {title}
          </h3>
          {subtitle && <p className={cn('text-xs mt-1', styles.textMuted)}>{subtitle}</p>}
        </div>
      </div>

      {/* 排名列表 */}
      <div className={cn(
        'border-2 rounded-xl overflow-hidden',
        theme === 'dashboard' ? styles.cardBorder : 'border-slate-200'
      )}>
        {renderTableHeader()}
        {data.map((item, index) => renderTableRow(item, index + 1))}
      </div>
    </div>
  );
}
