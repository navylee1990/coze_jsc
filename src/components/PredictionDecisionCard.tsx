'use client';

import { useState, useEffect } from 'react';
import { Target, Clock, AlertTriangle, Zap, Gauge, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// 主题类型
type Theme = 'dark' | 'dashboard';

// 驾驶舱样式
const DASHBOARD_STYLES = {
  bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
  text: 'text-cyan-50',
  textMuted: 'text-cyan-300/70',
  neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
  warningNeon: 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]',
  successNeon: 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]',
};

// 组件属性
interface PredictionDecisionCardProps {
  theme?: Theme;
}

// 月度趋势数据
const monthlyTrendData = [
  { month: '1月', businessTarget: 1500, financialTarget: 1200, completed: 800, forecast: 900 },
  { month: '2月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 950 },
  { month: '3月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 880 },
  { month: '4月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1020 },
  { month: '5月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 980 },
  { month: '6月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1050 },
  { month: '7月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1100 },
  { month: '8月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1080 },
  { month: '9月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1030 },
  { month: '10月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 990 },
  { month: '11月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 960 },
  { month: '12月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 940 },
];

export default function PredictionDecisionCard({
  theme = 'dashboard',
}: PredictionDecisionCardProps) {
  // 核心数据
  const target = 1500;      // 目标（万元）
  const forecast = 1140;    // 预测（万元）
  const completed = 800;    // 已完成（万元）
  const achievementRate = 76; // 达成率 %

  // 动画状态
  const [animatedRate, setAnimatedRate] = useState(0);
  const [needleAngle, setNeedleAngle] = useState(-90);
  const [animatedForecast, setAnimatedForecast] = useState(0);
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [trendAnimations, setTrendAnimations] = useState<number[]>(new Array(12).fill(0));
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 启动动画
  useEffect(() => {
    setMounted(true);

    // 1. 达成率动画
    const rateDuration = 2000;
    const rateStartTime = Date.now();
    const animateRate = () => {
      const elapsed = Date.now() - rateStartTime;
      const progress = Math.min(elapsed / rateDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedRate(achievementRate * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateRate);
      }
    };

    // 2. 指针动画
    const needleDuration = 1500;
    const needleStartTime = Date.now();
    const targetAngle = (achievementRate / 100) * 180 - 90; // 0% = -90°, 100% = 90°
    const animateNeedle = () => {
      const elapsed = Date.now() - needleStartTime;
      const progress = Math.min(elapsed / needleDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setNeedleAngle(-90 + (targetAngle + 90) * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateNeedle);
      }
    };

    // 3. 数字滚动动画
    const duration = 1800;
    const startTime = Date.now();
    const animateNumbers = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedForecast(forecast * easeOut);
      setAnimatedCompleted(completed * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateNumbers);
      }
    };

    // 4. 趋势图动画
    const trendDuration = 2200;
    const trendStartTime = Date.now();
    const animateTrend = () => {
      const elapsed = Date.now() - trendStartTime;
      const progress = Math.min(elapsed / trendDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const newAnimations = monthlyTrendData.map((data, index) => {
        // 错开动画：每个柱子延迟一点
        const staggerProgress = Math.min(progress * (1 + index * 0.08), 1);
        return data.forecast * staggerProgress;
      });

      setTrendAnimations(newAnimations);

      if (progress < 1) {
        requestAnimationFrame(animateTrend);
      }
    };

    animateRate();
    animateNeedle();
    animateNumbers();
    animateTrend();
  }, []);

  // 主仪表盘组件
  const MainGauge = ({ value, maxValue, size = 200 }: { value: number; maxValue: number; size?: number }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    const angle = (percentage / 100) * 180 - 90;

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* 外圈发光效果 */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: percentage >= 90 ? 'radial-gradient(circle, rgba(74,222,128,0.2) 0%, transparent 70%)' :
                      percentage >= 70 ? 'radial-gradient(circle, rgba(250,204,21,0.2) 0%, transparent 70%)' :
                      'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)',
          }}
        />

        {/* 仪表盘SVG */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* 背景圆环 */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke="rgba(30,41,59,0.8)"
            strokeWidth="10"
          />

          {/* 刻度线 */}
          {[...Array(11)].map((_, i) => {
            const angle = (i * 18 - 90) * (Math.PI / 180);
            const innerR = 65;
            const outerR = 75;
            const x1 = 100 + innerR * Math.cos(angle);
            const y1 = 100 + innerR * Math.sin(angle);
            const x2 = 100 + outerR * Math.cos(angle);
            const y2 = 100 + outerR * Math.sin(angle);

            // 刻度颜色
            const tickPercentage = (i / 10) * 100;
            const strokeColor = tickPercentage >= 90 ? '#22c55e' :
                               tickPercentage >= 70 ? '#eab308' :
                               '#ef4444';

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* 进度弧线 */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke={percentage >= 90 ? '#22c55e' :
                    percentage >= 70 ? '#eab308' :
                    '#ef4444'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 4.71} 471`}
            strokeDashoffset={0}
            transform="rotate(-90 100 100)"
            style={{
              filter: percentage >= 90 ? 'drop-shadow(0 0 12px rgba(74,222,128,1))' :
                     percentage >= 70 ? 'drop-shadow(0 0 12px rgba(250,204,21,1))' :
                     'drop-shadow(0 0 12px rgba(239,68,68,1))',
              transition: 'stroke-dasharray 0.1s ease-out',
            }}
          />

          {/* 指针 */}
          <g transform={`translate(100, 100) rotate(${angle})`}>
            <polygon
              points="-3,0 0,-55 3,0"
              fill="#22d3ee"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(34,211,238,1))',
              }}
            />
            <circle
              cx="0"
              cy="0"
              r="6"
              fill="#22d3ee"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.9))',
              }}
            />
          </g>
        </svg>

        {/* 中心数值显示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-black mb-1"
               style={{
                 color: percentage >= 90 ? '#22c55e' :
                        percentage >= 70 ? '#eab308' :
                        '#ef4444',
                 textShadow: percentage >= 90 ? '0 0 20px rgba(74,222,128,1)' :
                            percentage >= 70 ? '0 0 20px rgba(250,204,21,1)' :
                            '0 0 20px rgba(239,68,68,1)',
               }}
          >
            {mounted ? Math.round(value) : 0}
          </div>
          <div className="text-xs font-semibold text-cyan-400/70">%</div>
          <div className="text-xs text-cyan-500/50 mt-1">达成率</div>
        </div>
      </div>
    );
  };

  // 小型仪表盘
  const SmallGauge = ({
    value,
    maxValue,
    label,
    unit = '万',
    color = 'cyan',
    size = 150
  }: {
    value: number;
    maxValue: number;
    label: string;
    unit?: string;
    color?: 'cyan' | 'red' | 'green' | 'yellow';
    size?: number;
  }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    const angle = (percentage / 100) * 180 - 90;

    const colorMap = {
      cyan: '#22d3ee',
      red: '#ef4444',
      green: '#22c55e',
      yellow: '#eab308',
    };

    const strokeColor = colorMap[color];

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* 背景圆环 */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="rgba(30,41,59,0.8)"
            strokeWidth="8"
          />

          {/* 进度弧线 */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 4.40} 440`}
            strokeDashoffset={0}
            transform="rotate(-90 100 100)"
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor})`,
              transition: 'stroke-dasharray 0.1s ease-out',
            }}
          />

          {/* 指针 */}
          <g transform={`translate(100, 100) rotate(${angle})`}>
            <polygon
              points="-2.5,0 0,-50 2.5,0"
              fill={strokeColor}
              style={{
                filter: `drop-shadow(0 0 6px ${strokeColor})`,
              }}
            />
            <circle cx="0" cy="0" r="5" fill={strokeColor} />
          </g>
        </svg>

        {/* 中心数值显示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-black"
               style={{
                 color: strokeColor,
                 textShadow: `0 0 15px ${strokeColor}`,
               }}
          >
            {mounted ? Math.round(value) : 0}
          </div>
          <div className="text-xs font-semibold text-cyan-400/60 mt-1">
            {unit}
          </div>
          <div className="text-xs text-cyan-500/50 mt-1">{label}</div>
        </div>
      </div>
    );
  };

  // 月度趋势曲线图（驾驶舱风格）
  const MonthlyTrendChart = () => {
    const maxValue = 1600;
    const height = 252;
    const paddingLeft = 50;
    const paddingRight = 50;
    const paddingBottom = 32;
    const chartWidth = 1000;
    const chartHeight = height - paddingBottom - 10;

    // 计算坐标
    const getX = (index: number) => paddingLeft + (index / (monthlyTrendData.length - 1)) * (chartWidth - paddingLeft - paddingRight);
    const getY = (value: number) => chartHeight - (value / maxValue) * chartHeight;

    // 生成平滑曲线
    const generateSmoothPath = (data: number[], animatedValues: number[]) => {
      if (data.length < 2) return '';

      const points = data.map((_, index) => ({
        x: getX(index),
        y: getY(animatedValues[index])
      }));

      let path = `M ${points[0].x} ${points[0].y}`;

      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const xc = (curr.x + next.x) / 2;
        const yc = (curr.y + next.y) / 2;
        path += ` Q ${curr.x} ${curr.y} ${xc} ${yc}`;
      }

      path += ` T ${points[points.length - 1].x} ${points[points.length - 1].y}`;

      return path;
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (chartWidth / rect.width);

      let minDistance = Infinity;
      let closestIndex = -1;

      monthlyTrendData.forEach((_, index) => {
        const pointX = getX(index);
        const distance = Math.abs(x - pointX);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      if (minDistance < 70 * (chartWidth / rect.width)) {
        setHoveredIndex(closestIndex);
      } else {
        setHoveredIndex(null);
      }
    };

    const handleMouseLeave = () => {
      setHoveredIndex(null);
    };

    return (
      <div className="h-full flex flex-col">
        {/* 图例 */}
        <div className="flex items-center justify-center gap-5 mb-3 px-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-orange-400" style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'rgba(251,146,60,0.8)' }} />
            <span className="text-sm text-cyan-400/70 font-medium">业务目标</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-yellow-400" style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'rgba(250,204,21,0.8)' }} />
            <span className="text-sm text-cyan-400/70 font-medium">财务目标</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-cyan-400" />
            <span className="text-sm text-cyan-400/70 font-medium">预测完成</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-400" />
            <span className="text-sm text-cyan-400/70 font-medium">已完成</span>
          </div>
        </div>

        {/* 曲线图容器 */}
        <div className="flex-1 relative" style={{ minHeight: `${height}px` }}>
          <svg
            viewBox={`0 0 ${chartWidth} ${height}`}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: hoveredIndex !== null ? 'crosshair' : 'default' }}
          >
            {/* 网格线（简化为3条） */}
            {[0, 800, 1600].map((value, index) => {
              const y = getY(value);
              return (
                <g key={index}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke={value === 800 ? 'rgba(34,211,238,0.15)' : 'rgba(34,211,238,0.08)'}
                    strokeWidth={value === 800 ? 1.5 : 1}
                  />
                  <text
                    x={paddingLeft - 12}
                    y={y + 5}
                    fill="rgba(34,211,238,0.7)"
                    fontSize="16"
                    textAnchor="end"
                    fontWeight="500"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* 业务目标曲线（橙色虚线） */}
            <path
              d={generateSmoothPath(
                monthlyTrendData.map(d => d.businessTarget),
                monthlyTrendData.map(d => d.businessTarget)
              )}
              fill="none"
              stroke="rgba(251,146,60,0.8)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8,6"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(251,146,60,0.5))',
              }}
            />

            {/* 财务目标曲线（黄色虚线） */}
            <path
              d={generateSmoothPath(
                monthlyTrendData.map(d => d.financialTarget),
                monthlyTrendData.map(d => d.financialTarget)
              )}
              fill="none"
              stroke="rgba(250,204,21,0.8)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8,6"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(250,204,21,0.5))',
              }}
            />

            {/* 预测完成曲线（青色实线） */}
            <path
              d={generateSmoothPath(
                monthlyTrendData.map(d => d.forecast),
                trendAnimations
              )}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.7))',
              }}
            />

            {/* 悬停指示线 */}
            {hoveredIndex !== null && (
              <line
                x1={getX(hoveredIndex)}
                y1={0}
                x2={getX(hoveredIndex)}
                y2={chartHeight}
                stroke="rgba(34,211,238,0.4)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            )}

            {/* 预测完成数据点 */}
            {monthlyTrendData.map((data, index) => {
              const x = getX(index);
              const y = getY(trendAnimations[index]);
              const isHovered = hoveredIndex === index;

              return (
                <g key={`forecast-${index}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 8 : 5.5}
                    fill="#22d3ee"
                    stroke="#0e7490"
                    strokeWidth={isHovered ? 3 : 2}
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.8))',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </g>
              );
            })}

            {/* 已完成曲线（绿色实线） */}
            <path
              d={generateSmoothPath(
                monthlyTrendData.map(d => d.completed),
                monthlyTrendData.map(d => d.completed)
              )}
              fill="none"
              stroke="#22c55e"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(74,222,128,0.7))',
              }}
            />

            {/* 已完成数据点（仅1月） */}
            {monthlyTrendData.filter(d => d.completed > 0).map((data, index) => {
              const originalIndex = monthlyTrendData.findIndex(d => d.month === data.month);
              const x = getX(originalIndex);
              const y = getY(data.completed);
              const isHovered = hoveredIndex === originalIndex;

              return (
                <g key={`completed-${index}`}>
                  {!isHovered && (
                    <>
                      {/* 外圈半透明 */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2.5"
                        style={{
                          filter: 'drop-shadow(0 0 8px rgba(74,222,128,0.5))',
                          opacity: 0.5,
                        }}
                      />
                      {/* 内圈实心 */}
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        fill="#22c55e"
                        stroke="#15803d"
                        strokeWidth="2"
                        style={{
                          filter: 'drop-shadow(0 0 8px rgba(74,222,128,1))',
                        }}
                      />
                    </>
                  )}
                </g>
              );
            })}

            {/* Tooltip */}
            {hoveredIndex !== null && (
              <g>
                <rect
                  x={getX(hoveredIndex) - 70}
                  y={Math.max(10, getY(trendAnimations[hoveredIndex]) - 110)}
                  width="140"
                  height="100"
                  rx="6"
                  fill="rgba(15,23,42,0.96)"
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(34,211,238,0.4))',
                  }}
                />
                <text
                  x={getX(hoveredIndex)}
                  y={Math.max(10, getY(trendAnimations[hoveredIndex]) - 90)}
                  fill="#22d3ee"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {monthlyTrendData[hoveredIndex].month}
                </text>
                <text
                  x={getX(hoveredIndex)}
                  y={Math.max(10, getY(trendAnimations[hoveredIndex]) - 65)}
                  fill="#22d3ee"
                  fontSize="14"
                  textAnchor="middle"
                >
                  预测: {Math.round(trendAnimations[hoveredIndex])}万
                </text>
                {monthlyTrendData[hoveredIndex].completed > 0 && (
                  <text
                    x={getX(hoveredIndex)}
                    y={Math.max(10, getY(trendAnimations[hoveredIndex]) - 43)}
                    fill="#22c55e"
                    fontSize="14"
                    textAnchor="middle"
                  >
                    已完成: {monthlyTrendData[hoveredIndex].completed}万
                  </text>
                )}
                <text
                  x={getX(hoveredIndex)}
                  y={Math.max(10, getY(trendAnimations[hoveredIndex]) - (monthlyTrendData[hoveredIndex].completed > 0 ? 21 : 43))}
                  fill="rgba(251,146,60,0.9)"
                  fontSize="14"
                  textAnchor="middle"
                >
                  业务目标: {monthlyTrendData[hoveredIndex].businessTarget}万
                </text>
                <text
                  x={getX(hoveredIndex)}
                  y={Math.max(10, getY(trendAnimations[hoveredIndex]) - (monthlyTrendData[hoveredIndex].completed > 0 ? 0 : 21))}
                  fill="rgba(250,204,21,0.9)"
                  fontSize="14"
                  textAnchor="middle"
                >
                  财务目标: {monthlyTrendData[hoveredIndex].financialTarget}万
                </text>
              </g>
            )}

            {/* X轴月份标签 */}
            {monthlyTrendData.map((data, index) => {
              const x = getX(index);
              return (
                <text
                  key={`x-axis-${index}`}
                  x={x}
                  y={height - 10}
                  fill="rgba(34,211,238,0.7)"
                  fontSize="16"
                  textAnchor="middle"
                  fontWeight="500"
                >
                  {data.month}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      'p-6',
      theme === 'dashboard' && DASHBOARD_STYLES.bg
    )}>
      {/* 标题栏 */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className={cn('w-6 h-6', DASHBOARD_STYLES.neon)} />
          <h2 className={cn('text-xl font-bold', DASHBOARD_STYLES.neon)}>
            核心预测决策
          </h2>
        </div>
        <div className="flex items-center gap-2 text-base text-cyan-400/60">
          <Clock className="w-4 h-4" />
          <span>实时数据</span>
        </div>
      </div>

      {/* 左右两个独立块布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* 左侧：仪表盘区块 - 30%宽度 */}
        <div className="lg:col-span-3 rounded-xl p-6 border border-cyan-500/20 bg-slate-900/50">
          <div className="flex flex-col items-center justify-center">
            <MainGauge
              value={animatedRate}
              maxValue={100}
              size={144}
            />
            <div className="mt-5 text-center">
              <div className="text-cyan-400/60 text-xs mb-3">本月达成率</div>
              <div className="flex items-center justify-center gap-4 text-sm whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-cyan-400/70 text-xs">目标</span>
                  <span className="font-semibold text-orange-400 text-sm">{target}万</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-cyan-400/70 text-xs">预测</span>
                  <span className="font-semibold text-cyan-300 text-sm">
                    {mounted ? Math.round(animatedForecast) : 0}万
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：趋势图区块 - 70%宽度 */}
        <div className="lg:col-span-7 rounded-xl p-4 border border-cyan-500/20 bg-slate-900/50">
          <MonthlyTrendChart />
        </div>
      </div>
    </div>
  );
}
