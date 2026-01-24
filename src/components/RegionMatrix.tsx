'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, Activity, ArrowLeft, X } from 'lucide-react';

interface RegionMatrixProps {
  data: any[];
  title?: string;
  subtitle?: string;
  onRegionClick?: (region: string) => void;
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

export default function RegionMatrix({
  data,
  title = '区域达成',
  subtitle = '',
  onRegionClick,
  theme = 'dashboard'
}: RegionMatrixProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [drillDownLevel, setDrillDownLevel] = useState<'region' | 'city' | 'salesperson'>('region');

  // 根据主题获取样式
  const getStyles = () => {
    if (theme === 'dashboard') {
      return DASHBOARD_STYLES;
    }
    return DASHBOARD_STYLES;
  };

  const styles = getStyles();

  // 模拟下级数据
  const getCityData = (regionName: string) => {
    // 这里应该是实际的城市数据，暂时返回模拟数据
    const cityCount = Math.floor(Math.random() * 3) + 2;
    return Array.from({ length: cityCount }, (_, i) => ({
      name: `${regionName}-城市${i + 1}`,
      target: Math.floor(Math.random() * 500) + 100,
      completed: Math.floor(Math.random() * 400) + 50,
      predicted: Math.floor(Math.random() * 450) + 80,
      gap: Math.floor(Math.random() * 200) - 50,
      rate: Math.random() * 100,
      owner: `负责人${i + 1}`,
      pendingAmount: Math.floor(Math.random() * 100) + 20,
    }));
  };

  // 计算样式类
  const getCardClass = (item: any) => {
    const gapClass = item.gap > 0 ? 'border-red-500/30' : 'border-green-500/30';
    const glowClass = item.gap > 0
      ? 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
      : 'hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]';

    return `${styles.cardBg} ${styles.cardBorder} ${gapClass} ${glowClass} rounded-xl p-3 transition-all duration-300 cursor-pointer hover:border-cyan-400/60 hover:scale-105 ${styles.glow}`;
  };

  // 渲染区域卡片（3x3 矩阵）
  const renderRegionCards = () => (
    <div className="grid grid-cols-3 gap-3">
      {data.map((item, index) => (
        <div
          key={index}
          className={getCardClass(item)}
          onClick={() => {
            setSelectedRegion(item.name);
            onRegionClick?.(item.name);
          }}
        >
          {/* 区域名称 */}
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-cyan-200 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {item.name}
            </h4>
            <ChevronRight className="w-4 h-4 text-cyan-400/50" />
          </div>

          {/* 核心指标 */}
          <div className="space-y-1.5">
            {/* 目标 + 预测 */}
            <div className="flex justify-between text-xs">
              <span className="text-cyan-400/60">目标</span>
              <span className="text-cyan-300 font-semibold">{item.target.toLocaleString()}万</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-cyan-400/60">预测</span>
              <span className="text-cyan-300 font-semibold">{item.predicted.toLocaleString()}万</span>
            </div>

            {/* 缺口 - 大字号高亮 */}
            <div className="pt-1 border-t border-cyan-500/20">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400/60 text-xs">缺口</span>
                <span className={`text-base font-bold ${item.gap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {item.gap > 0 ? `${item.gap}` : `+${Math.abs(item.gap)}`}
                </span>
              </div>
            </div>

            {/* 达成率进度条 */}
            <div className="pt-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cyan-400/60">达成率</span>
                <span className={item.rate >= 100 ? 'text-green-400' : item.rate >= 80 ? 'text-yellow-400' : 'text-red-400'}>
                  {item.rate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    item.rate >= 100 ? 'bg-green-500' : item.rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(item.rate, 100)}%` }}
                />
              </div>
            </div>

            {/* 在手项目金额 */}
            <div className="flex justify-between text-xs pt-1">
              <span className="text-cyan-400/60">在手项目</span>
              <span className="text-cyan-300 font-semibold">{(item.pendingAmount || 0).toLocaleString()}万</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`${styles.bg} ${styles.text}`}>
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-sm font-bold ${styles.neon} flex items-center gap-2`}>
            <Activity className="w-4 h-4" />
            {title}
          </h3>
          {subtitle && <p className={`text-xs ${styles.textMuted} mt-1`}>{subtitle}</p>}
        </div>
      </div>

      {/* 区域矩阵卡片 */}
      {renderRegionCards()}
    </div>
  );
}
