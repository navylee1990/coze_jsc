'use client';

import { useState, useEffect } from 'react';
import { Target, Clock, AlertTriangle, Zap, Gauge, BarChart3, TrendingUp } from 'lucide-react';
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
    const height = 220;
    const paddingLeft = 40;
    const paddingRight = 40;
    const paddingBottom = 25;
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

      if (minDistance < 60 * (chartWidth / rect.width)) {
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
        <div className="flex items-center justify-end gap-5 mb-2 px-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            <span className="text-xs text-cyan-400/70">目标线</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-xs text-cyan-400/70">预测曲线</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-xs text-cyan-400/70">已完成</span>
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
                    x={paddingLeft - 8}
                    y={y + 4}
                    fill="rgba(34,211,238,0.5)"
                    fontSize="11"
                    textAnchor="end"
                    fontWeight="500"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* 目标线（橙色虚线） */}
            <line
              x1={paddingLeft}
              y1={getY(1500)}
              x2={chartWidth - paddingRight}
              y2={getY(1500)}
              stroke="rgba(251,146,60,0.6)"
              strokeWidth="2"
              strokeDasharray="6,4"
            />

            {/* 预测完成曲线 */}
            <path
              d={generateSmoothPath(
                monthlyTrendData.map(d => d.forecast),
                trendAnimations
              )}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.7))',
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
                    r={isHovered ? 7 : 4.5}
                    fill="#22d3ee"
                    stroke="#0e7490"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    style={{
                      filter: 'drop-shadow(0 0 5px rgba(34,211,238,0.8))',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </g>
              );
            })}

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
                        r="7"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                        style={{
                          filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.5))',
                          opacity: 0.5,
                        }}
                      />
                      {/* 内圈实心 */}
                      <circle
                        cx={x}
                        cy={y}
                        r="4.5"
                        fill="#22c55e"
                        stroke="#15803d"
                        strokeWidth="1.5"
                        style={{
                          filter: 'drop-shadow(0 0 6px rgba(74,222,128,1))',
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
                  x={getX(hoveredIndex) - 55}
                  y={getY(trendAnimations[hoveredIndex]) - 78}
                  width="110"
                  height="68"
                  rx="6"
                  fill="rgba(15,23,42,0.96)"
                  stroke="#22d3ee"
                  strokeWidth="1"
                  style={{
                    filter: 'drop-shadow(0 0 12px rgba(34,211,238,0.4))',
                  }}
                />
                <text
                  x={getX(hoveredIndex)}
                  y={getY(trendAnimations[hoveredIndex]) - 62}
                  fill="#22d3ee"
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {monthlyTrendData[hoveredIndex].month}
                </text>
                <text
                  x={getX(hoveredIndex)}
                  y={getY(trendAnimations[hoveredIndex]) - 44}
                  fill="#22d3ee"
                  fontSize="11"
                  textAnchor="middle"
                >
                  预测: {Math.round(trendAnimations[hoveredIndex])}万
                </text>
                {monthlyTrendData[hoveredIndex].completed > 0 && (
                  <text
                    x={getX(hoveredIndex)}
                    y={getY(trendAnimations[hoveredIndex]) - 28}
                    fill="#22c55e"
                    fontSize="11"
                    textAnchor="middle"
                  >
                    已完成: {monthlyTrendData[hoveredIndex].completed}万
                  </text>
                )}
                <text
                  x={getX(hoveredIndex)}
                  y={getY(trendAnimations[hoveredIndex]) - (monthlyTrendData[hoveredIndex].completed > 0 ? 12 : 28)}
                  fill="rgba(251,146,60,0.9)"
                  fontSize="11"
                  textAnchor="middle"
                >
                  目标: {monthlyTrendData[hoveredIndex].businessTarget}万
                </text>
              </g>
            )}
          </svg>

          {/* X轴月份标签 */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1" style={{ paddingLeft: `${paddingLeft}px`, paddingRight: `${paddingRight}px` }}>
            {monthlyTrendData.map((data, index) => (
              <div
                key={index}
                className="text-xs text-cyan-400/60 font-medium text-center"
              >
                {data.month}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      'p-5',
      theme === 'dashboard' && DASHBOARD_STYLES.bg
    )}>
      {/* 标题栏 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className={cn('w-5 h-5', DASHBOARD_STYLES.neon)} />
          <h2 className={cn('text-lg font-bold', DASHBOARD_STYLES.neon)}>
            核心预测决策
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-cyan-400/60">
          <Clock className="w-4 h-4" />
          <span>实时数据</span>
        </div>
      </div>

      {/* 驾驶舱布局 - 3列 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 左侧：两个仪表盘 */}
        <div className="flex flex-col justify-around gap-8">
          {/* 达成率（主仪表盘） */}
          <div className="flex flex-col items-center justify-center">
            <MainGauge
              value={animatedRate}
              maxValue={100}
              size={140}
            />
            <div className="mt-3 text-center">
              <div className="flex items-center justify-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-cyan-500/60">目标</span>
                  <span className="font-semibold text-orange-400">{target}万</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-cyan-500/60">预测</span>
                  <span className="font-semibold text-cyan-300">
                    {mounted ? Math.round(animatedForecast) : 0}万
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 时间紧迫度 */}
          <div className="flex flex-col items-center justify-center">
            <SmallGauge
              value={7}
              maxValue={30}
              label="剩余天数"
              unit="天"
              color="red"
              size={140}
            />
            <div className="mt-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
                <span className="text-xs text-red-400 font-semibold">紧迫事项</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-cyan-500/60">本月</span>
                  <span className="font-semibold text-red-400">处理当月未下单</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-cyan-500/60">本季度</span>
                  <span className="font-semibold text-orange-400">目标达成95%</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-cyan-500/60">本年度</span>
                  <span className="font-semibold text-yellow-400">追赶进度</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧两列：年度趋势图 */}
        <div className="col-span-2 flex flex-col">
          <MonthlyTrendChart />
        </div>
      </div>

      {/* 底部：驾驶舱科技装饰 */}
      <div className="mt-4 pt-3 border-t border-cyan-500/20">
        <div className="flex items-center justify-between text-xs text-cyan-500/40">
          <div className="flex items-center gap-2">
            <Gauge className="w-3 h-3" />
            <span>驾驶舱模式已激活</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span>系统正常</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>趋势实时</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>数据实时</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
