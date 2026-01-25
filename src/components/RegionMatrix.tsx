'use client';

import { useState, useMemo } from 'react';
import { Activity, ArrowLeft, TrendingUp, TrendingDown, Minus, Crown, Medal, Award, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegionMatrixProps {
  data: any[];
  title?: string;
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
  cityData = {},
  salespersonData = {},
  theme = 'dashboard'
}: RegionMatrixProps) {
  const [drillDownLevel, setDrillDownLevel] = useState<'region' | 'city' | 'salesperson'>('region');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  // 每页显示的行数
  const itemsPerPage = 6;

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

  // 判断是否需要分页（第一层不分页）
  const shouldPaginate = drillDownLevel !== 'region';

  // 计算总页数（只在需要分页时计算）
  const totalPages = shouldPaginate ? Math.ceil(currentData.length / itemsPerPage) : 1;

  // 重置页码（当切换层级时）
  const resetPage = () => {
    setCurrentPage(1);
  };

  // 处理层级切换，重置页码
  const handleDrillDownChange = (item: any) => {
    resetPage();
    if (drillDownLevel === 'region') {
      setSelectedRegion(item.name);
      setDrillDownLevel('city');
    } else if (drillDownLevel === 'city') {
      setSelectedCity(item.name);
      setDrillDownLevel('salesperson');
    }
  };

  const handleBreadcrumbClick = (level: 'region' | 'city' | 'salesperson') => {
    resetPage();
    if (level === 'region') {
      setSelectedRegion('');
      setSelectedCity('');
      setDrillDownLevel('region');
    } else if (level === 'city') {
      setSelectedCity('');
      setDrillDownLevel('city');
    }
  };

  // 获取要显示的数据（第一层显示全部，其他层显示当前页）
  const displayData = useMemo(() => {
    if (!shouldPaginate) {
      return currentData;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return currentData.slice(startIndex, endIndex);
  }, [currentData, currentPage, itemsPerPage, shouldPaginate]);

  // 获取面包屑
  const getBreadcrumbs = () => {
    const crumbs = [{ level: 'region', label: '区域' }];

    if (drillDownLevel === 'city') {
      crumbs.push({ level: 'city', label: selectedRegion });
    } else if (drillDownLevel === 'salesperson') {
      crumbs.push({ level: 'city', label: selectedRegion });
      crumbs.push({ level: 'salesperson', label: selectedCity });
    }

    return crumbs;
  };

  // 渲染表头 - 固定高度
  const renderTableHeader = () => {
    const nameLabel = drillDownLevel === 'salesperson' ? '业务员' : drillDownLevel === 'city' ? '城市名称' : '区域名称';

    return (
      <div className={cn(
        'h-10 grid grid-cols-7 gap-3 px-4 text-xs font-bold border-b flex items-center',
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

  // 渲染行数据 - 固定高度
  const renderTableRow = (item: any, rank: number, onDrillDown?: (item: any) => void) => {
    const gapClass = item.gap > 0 ? 'text-red-400' : 'text-green-400';
    const rowBgClass = rank % 2 === 0
      ? (theme === 'dashboard' ? 'bg-slate-900/40' : 'bg-slate-50')
      : (theme === 'dashboard' ? 'bg-slate-900/20' : 'bg-white');
    const canDrillDown = drillDownLevel !== 'salesperson' && onDrillDown;

    return (
      <div
        key={`${item.name}-${rank}`}
        className={cn(
          'h-10 grid grid-cols-7 gap-3 px-4 items-center border-b transition-all duration-200',
          rowBgClass,
          canDrillDown && theme === 'dashboard' ? 'border-cyan-500/20 hover:bg-slate-800/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer' : 'border-cyan-500/20',
          canDrillDown && theme !== 'dashboard' ? 'border-slate-200 hover:bg-slate-100 cursor-pointer' : ''
        )}
        onClick={() => canDrillDown && onDrillDown!(item)}
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
    <div className={cn('w-full h-[364px]', DASHBOARD_STYLES.bg, DASHBOARD_STYLES.text)}>
      {/* 标题栏 - 固定高度 */}
      <div
        className={cn(
          'h-14 px-4 border-b flex items-center',
          theme === 'dashboard' ? `${DASHBOARD_STYLES.cardBorder} bg-slate-900/50` : 'border-slate-200 bg-white'
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 h-full">
            {/* 返回按钮 - 占位确保高度一致 */}
            <div className="w-8 h-full flex items-center justify-center flex-shrink-0">
              {drillDownLevel !== 'region' && (
                <button
                  onClick={() => handleBreadcrumbClick('region')}
                  className="p-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>
            {/* 标题和面包屑 */}
            <h3 className={cn('font-bold text-lg flex items-center gap-2 whitespace-nowrap overflow-hidden', theme === 'dashboard' ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]' : 'text-slate-900')}>
              <Activity className={cn('w-5 h-5 flex-shrink-0', theme === 'dashboard' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-green-600')} />
              <span className="truncate">{title}</span>
              <span className="flex items-center gap-1 text-xs truncate">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.level} className="flex items-center gap-1">
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
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* 排名列表 */}
      <div className={cn(
        'border-2 rounded-xl overflow-hidden',
        theme === 'dashboard' ? DASHBOARD_STYLES.cardBorder : 'border-slate-200'
      )}>
        {renderTableHeader()}
        <div className="flex flex-col">
          {displayData.map((item, index) => {
            // 计算排名：第一层从1开始，分页层根据页码计算
            const rank = shouldPaginate
              ? (currentPage - 1) * itemsPerPage + index + 1
              : index + 1;
            return renderTableRow(item, rank, handleDrillDownChange);
          })}
          {/* 分页控件或信息栏 - 固定高度 */}
          <div className="h-12 flex items-center justify-between px-4 border-t border-cyan-500/20 bg-slate-900/30">
            <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
              共 {currentData.length} 条记录
            </div>
            {shouldPaginate && totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    'p-1 rounded-lg border transition-colors',
                    currentPage === 1
                      ? 'border-slate-700/30 text-slate-600 cursor-not-allowed'
                      : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50'
                  )}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'w-7 h-7 rounded-lg text-xs font-medium transition-all',
                        currentPage === page
                          ? 'bg-cyan-500 text-white shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                          : 'text-cyan-400/70 hover:bg-cyan-500/20'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'p-1 rounded-lg border transition-colors',
                    currentPage === totalPages
                      ? 'border-slate-700/30 text-slate-600 cursor-not-allowed'
                      : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50'
                  )}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
