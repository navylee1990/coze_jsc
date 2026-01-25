'use client';

import { useState, useMemo } from 'react';
import { Activity, ArrowLeft, TrendingUp, TrendingDown, Minus, Crown, Medal, Award, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegionMatrixProps {
  data: any[];
  title?: string;
  subtitle?: string;
  cityData?: Record<string, any[]>;
  salespersonData?: Record<string, any[]>;
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
  cityData = {},
  salespersonData = {},
  theme = 'dashboard'
}: RegionMatrixProps) {
  const [drillDownLevel, setDrillDownLevel] = useState<'region' | 'city' | 'salesperson'>('region');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // 获取当前层级的数据
  const currentData = useMemo(() => {
    let result: any[] = [];

    if (drillDownLevel === 'region') {
      result = data;
    } else if (drillDownLevel === 'city' && selectedRegion) {
      result = cityData[selectedRegion] || [];
    } else if (drillDownLevel === 'salesperson' && selectedCity) {
      result = salespersonData[selectedCity] || [];
    }

    // 按达成率降序排序
    return result.sort((a, b) => b.rate - a.rate);
  }, [drillDownLevel, selectedRegion, selectedCity, data, cityData, salespersonData]);

  // 获取面包屑
  const getBreadcrumbs = () => {
    const crumbs = [{ level: 'region', label: '区域' }];
    if (drillDownLevel === 'city' || drillDownLevel === 'salesperson') {
      crumbs.push({ level: 'city', label: selectedRegion });
    }
    if (drillDownLevel === 'salesperson') {
      crumbs.push({ level: 'salesperson', label: selectedCity });
    }
    return crumbs;
  };

  // 处理行点击
  const handleRowClick = (item: any) => {
    if (drillDownLevel === 'region') {
      // 区域 → 城市
      setSelectedRegion(item.name);
      setDrillDownLevel('city');
    } else if (drillDownLevel === 'city') {
      // 城市 → 业务员
      setSelectedCity(item.name);
      setDrillDownLevel('salesperson');
    }
  };

  // 处理面包屑点击
  const handleBreadcrumbClick = (level: 'region' | 'city' | 'salesperson') => {
    if (level === 'region') {
      setSelectedRegion('');
      setSelectedCity('');
      setDrillDownLevel('region');
    } else if (level === 'city') {
      setSelectedCity('');
      setDrillDownLevel('city');
    }
  };

  // 渲染表头
  const renderTableHeader = () => {
    const nameLabel = drillDownLevel === 'salesperson' ? '业务员' : drillDownLevel === 'city' ? '城市名称' : '区域名称';

    return (
      <div className={cn(
        'grid grid-cols-7 gap-3 px-4 py-2.5 text-xs font-bold border-b',
        theme === 'dashboard' ? 'bg-slate-800/60 border-cyan-500/30' : 'bg-slate-100 border-slate-200'
      )}>
        <div className={cn('flex items-center justify-center gap-2', DASHBOARD_STYLES.textSecondary)}>排名</div>
        <div className={cn(DASHBOARD_STYLES.textSecondary)}>{nameLabel}</div>
        <div className={cn('text-right', DASHBOARD_STYLES.textSecondary)}>目标(万)</div>
        <div className={cn('text-right', DASHBOARD_STYLES.textSecondary)}>预测(万)</div>
        <div className={cn('text-right', DASHBOARD_STYLES.textSecondary)}>缺口(万)</div>
        <div className={cn('text-center', DASHBOARD_STYLES.textSecondary)}>达成率</div>
        <div className={cn('text-right', DASHBOARD_STYLES.textSecondary)}>在手项目(万)</div>
      </div>
    );
  };

  // 渲染行数据
  const renderTableRow = (item: any, rank: number) => {
    const gapClass = item.gap > 0 ? 'text-red-400' : 'text-green-400';
    const rowBgClass = rank % 2 === 0
      ? (theme === 'dashboard' ? 'bg-slate-900/40' : 'bg-slate-50')
      : (theme === 'dashboard' ? 'bg-slate-900/20' : 'bg-white');
    const canDrillDown = drillDownLevel !== 'salesperson';

    return (
      <div
        key={rank}
        className={cn(
          'grid grid-cols-7 gap-3 px-4 py-2 items-center border-b transition-all duration-200',
          rowBgClass,
          canDrillDown && theme === 'dashboard' ? 'border-cyan-500/20 hover:bg-slate-800/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer' : 'border-cyan-500/20',
          canDrillDown && theme !== 'dashboard' ? 'border-slate-200 hover:bg-slate-100 cursor-pointer' : ''
        )}
        onClick={() => canDrillDown && handleRowClick(item)}
      >
        {/* 排名 */}
        <div className="flex items-center justify-center">
          {getRankIcon(rank)}
        </div>

        {/* 名称 */}
        <div className="flex items-center gap-2">
          {drillDownLevel === 'salesperson' ? (
            <User className="w-3.5 h-3.5 text-cyan-400/60" />
          ) : (
            <Activity className="w-3.5 h-3.5 text-cyan-400/60" />
          )}
          <span className={cn('font-medium text-sm', DASHBOARD_STYLES.textSecondary)}>{item.name}</span>
          {item.trend && (
            <span className="flex items-center">
              {getTrendIcon(item.trend)}
            </span>
          )}
        </div>

        {/* 目标 */}
        <div className={cn('text-right font-medium text-sm', DASHBOARD_STYLES.textSecondary)}>
          {item.target.toLocaleString()}
        </div>

        {/* 预测 */}
        <div className={cn('text-right font-medium text-sm', DASHBOARD_STYLES.textSecondary)}>
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
                item.rate >= 100 ? 'bg-green-500' : item.rate >= 80 ? 'bg-yellow-500' : 'text-red-500'
              }`}
              style={{ width: `${Math.min(item.rate, 100)}%` }}
            />
          </div>
        </div>

        {/* 在手项目 */}
        <div className={cn('text-right font-medium text-sm', DASHBOARD_STYLES.textSecondary)}>
          {(item.pendingAmount || 0).toLocaleString()}
        </div>
      </div>
    );
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className={cn('w-full', DASHBOARD_STYLES.bg, DASHBOARD_STYLES.text)}>
      {/* 标题和面包屑 */}
      <div className="flex items-center justify-between mb-3 px-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {drillDownLevel !== 'region' && (
              <button
                onClick={() => handleBreadcrumbClick('region')}
                className="p-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className={cn('text-sm font-bold flex items-center gap-2 whitespace-nowrap', DASHBOARD_STYLES.neon)}>
              <Activity className="w-4 h-4 flex-shrink-0" />
              {title}
            </h3>
            {subtitle && drillDownLevel === 'region' && (
              <span className={cn('text-xs whitespace-nowrap', DASHBOARD_STYLES.textMuted)}>({subtitle})</span>
            )}
          </div>
          {/* 面包屑导航 - 固定高度保持一致 */}
          <div className="flex items-center gap-2 text-xs" style={{ minHeight: '20px' }}>
            {breadcrumbs.length > 1 && breadcrumbs.map((crumb, index) => (
              <div key={crumb.level} className="flex items-center gap-2">
                {index > 0 && <span className="text-cyan-500/50 flex-shrink-0">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className={cn('font-semibold', DASHBOARD_STYLES.textSecondary)}>{crumb.label}</span>
                ) : (
                  <button
                    onClick={() => handleBreadcrumbClick(crumb.level as 'region' | 'city' | 'salesperson')}
                    className={cn('hover:text-cyan-300 transition-colors', DASHBOARD_STYLES.textMuted)}
                  >
                    {crumb.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 排名列表 */}
      <div className={cn(
        'border-2 rounded-xl overflow-hidden',
        theme === 'dashboard' ? DASHBOARD_STYLES.cardBorder : 'border-slate-200'
      )}>
        {renderTableHeader()}
        <div className="overflow-y-auto" style={{ minHeight: '400px', maxHeight: '400px', scrollbarGutter: 'stable' }}>
          {currentData.map((item, index) => renderTableRow(item, index + 1))}
        </div>
      </div>
    </div>
  );
}
