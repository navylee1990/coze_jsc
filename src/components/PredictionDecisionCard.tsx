'use client';

import { useState, useEffect } from 'react';
import { Target, Clock, AlertTriangle, Zap, Gauge, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  timeRange?: 'current' | 'quarter' | 'year';
}

// 不同时间范围的数据
const TIME_RANGE_DATA = {
  current: {
    target: 2130,
    forecast: 1600,
    completed: 800,  // 1月完成
  },
  quarter: {
    target: 7690,  // 1-3月业务目标总和
    forecast: 5900,
    completed: 800, // 1月完成
  },
  year: {
    target: 35300,  // 1-12月业务目标总和
    forecast: 27000,
    completed: 800, // 1月完成
  },
};

// 月度趋势数据（固定显示12个月，不受时间范围影响）
const monthlyTrendData = [
  { month: '1月', businessTarget: 2130, financialTarget: 3008, completed: 800, forecast: 3139.9 },
  { month: '2月', businessTarget: 1380, financialTarget: 2005.3, completed: 150, forecast: 2305.3 },
  { month: '3月', businessTarget: 4180, financialTarget: 6015.9, completed: 0, forecast: 5815.9 },
  { month: '4月', businessTarget: 2421, financialTarget: 3509.3, completed: 0, forecast: 1100 },
  { month: '5月', businessTarget: 2844, financialTarget: 4010.6, completed: 0, forecast: 1580 },
  { month: '6月', businessTarget: 3690, financialTarget: 5013.3, completed: 0, forecast: 950 },
  { month: '7月', businessTarget: 2720, financialTarget: 4010.6, completed: 0, forecast: 1520 },
  { month: '8月', businessTarget: 3135, financialTarget: 4511.9, completed: 0, forecast: 1280 },
  { month: '9月', businessTarget: 3965, financialTarget: 5514.6, completed: 0, forecast: 1150 },
  { month: '10月', businessTarget: 2082, financialTarget: 3008, completed: 0, forecast: 1560 },
  { month: '11月', businessTarget: 2808, financialTarget: 4010.6, completed: 0, forecast: 1320 },
  { month: '12月', businessTarget: 3945, financialTarget: 5514.6, completed: 0, forecast: 1050 },
];

export default function PredictionDecisionCard({
  theme = 'dashboard',
  timeRange = 'current',
}: PredictionDecisionCardProps) {
  // 根据时间范围获取数据
  const data = TIME_RANGE_DATA[timeRange];
  const target = data.target;
  const forecast = data.forecast;
  const completed = data.completed;
  const achievementRate = Math.round((forecast / target) * 100); // 预计达成率 %
  const actualAchievementRate = Math.round((completed / target) * 100); // 实际达成率 %
  const forecastGap = target - forecast; // 预计缺口（万元）

  // 动画状态
  const [animatedRate, setAnimatedRate] = useState(0);
  const [animatedActualRate, setAnimatedActualRate] = useState(0);
  const [animatedForecastGap, setAnimatedForecastGap] = useState(0);
  const [needleAngle, setNeedleAngle] = useState(-90);
  const [animatedForecast, setAnimatedForecast] = useState(0);
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 启动动画
  useEffect(() => {
    // 重置动画状态
    setAnimatedRate(0);
    setAnimatedActualRate(0);
    setAnimatedForecastGap(0);
    setAnimatedForecast(0);
    setAnimatedCompleted(0);
    setNeedleAngle(-90);

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

    // 1.1 实际达成率动画
    const actualRateStartTime = Date.now();
    const animateActualRate = () => {
      const elapsed = Date.now() - actualRateStartTime;
      const progress = Math.min(elapsed / rateDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedActualRate(actualAchievementRate * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateActualRate);
      }
    };

    // 1.2 预计缺口动画
    const gapStartTime = Date.now();
    const animateForecastGap = () => {
      const elapsed = Date.now() - gapStartTime;
      const progress = Math.min(elapsed / rateDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedForecastGap(forecastGap * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateForecastGap);
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

    animateRate();
    animateActualRate();
    animateForecastGap();
    animateNeedle();
    animateNumbers();
  }, [timeRange, target, forecast, completed, achievementRate, actualAchievementRate, forecastGap]);

  // 主仪表盘组件
  const MainGauge = ({
    actualValue,
    targetValue,
    showPercentage = true,
    size = 200
  }: {
    actualValue: number;
    targetValue: number;
    showPercentage?: boolean;
    size?: number;
  }) => {
    const percentage = Math.min((actualValue / targetValue) * 100, 100);
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
          {showPercentage ? (
            <>
              <div className="text-2xl font-black mb-1"
                   style={{
                     color: percentage >= 90 ? '#22c55e' :
                            percentage >= 70 ? '#eab308' :
                            '#ef4444',
                     textShadow: percentage >= 90 ? '0 0 15px rgba(74,222,128,0.8)' :
                                percentage >= 70 ? '0 0 15px rgba(250,204,21,0.8)' :
                                '0 0 15px rgba(239,68,68,0.8)',
                   }}
              >
                {mounted ? Math.round(actualValue) : 0}
              </div>
              <div className="text-xs font-semibold text-cyan-400/70">%</div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-lg font-black mb-0.5"
                   style={{
                     color: percentage >= 90 ? '#22c55e' :
                            percentage >= 70 ? '#eab308' :
                            '#ef4444',
                     textShadow: percentage >= 90 ? '0 0 18px rgba(74,222,128,0.8)' :
                                percentage >= 70 ? '0 0 18px rgba(250,204,21,0.8)' :
                                '0 0 18px rgba(239,68,68,0.8)',
                   }}
              >
                {mounted ? Math.round(actualValue) : 0}
              </div>
              <div className="text-sm text-cyan-400/60">/ {targetValue}</div>
            </div>
          )}
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

  // 月度趋势曲线图（使用recharts组件）
  const MonthlyTrendChart = () => {
    return (
      <div className="h-full flex flex-col justify-end">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 图例 */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 mb-2 sm:mb-3 px-1 flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-0.5 sm:w-4 bg-orange-400" style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'rgba(251,146,60,0.8)' }} />
            <span className="text-[10px] sm:text-xs md:text-sm text-cyan-400/70 font-medium">业务目标</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-0.5 sm:w-4 bg-purple-400" style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'rgba(168,85,247,0.8)' }} />
            <span className="text-[10px] sm:text-xs md:text-sm text-cyan-400/70 font-medium">财务目标</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-0.5 sm:w-4 bg-cyan-400" />
            <span className="text-[10px] sm:text-xs md:text-sm text-cyan-400/70 font-medium">预测完成</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-0.5 sm:w-4 bg-green-400" />
            <span className="text-[10px] sm:text-xs md:text-sm text-cyan-400/70 font-medium">已完成</span>
          </div>
        </div>

        {/* 曲线图容器 */}
        <div className="flex-1" style={{ minHeight: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrendData} margin={{ right: 20 }}>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(34,211,238,0.1)"
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 14, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(34,211,238,0.2)' }}
                tickLine={{ stroke: 'rgba(34,211,238,0.2)' }}
                interval={0}
              />
              <YAxis 
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 14, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
                domain={[0, 1700]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.96)',
                  border: '1px solid #22d3ee',
                  borderRadius: '8px',
                  boxShadow: '0 0 15px rgba(34,211,238,0.4)',
                  padding: '12px 16px',
                  fontSize: '14px',
                }}
                formatter={(value: number, name: string) => {
                  if (name === '业务目标') return [<span style={{ color: '#fb923c', fontWeight: 600 }}>{value}万</span>, name];
                  if (name === '财务目标') return [<span style={{ color: '#a855f7', fontWeight: 600 }}>{value}万</span>, name];
                  if (name === '预测完成') return [<span style={{ color: '#22d3ee', fontWeight: 600 }}>{value}万</span>, name];
                  if (name === '已完成') return [<span style={{ color: '#22c55e', fontWeight: 600 }}>{value}万</span>, name];
                  return [value, name];
                }}
              />
              <Line
                type="monotone"
                dataKey="businessTarget"
                stroke="#fb923c"
                strokeWidth={3}
                strokeDasharray="8 6"
                dot={false}
                activeDot={false}
                name="业务目标"
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="financialTarget"
                stroke="#a855f7"
                strokeWidth={3}
                strokeDasharray="8 6"
                dot={false}
                activeDot={false}
                name="财务目标"
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#22d3ee"
                strokeWidth={3.5}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isBelowTarget = payload.forecast < 1200;
                  
                  if (isBelowTarget) {
                    // 风险点：更大、更醒目的红色
                    return (
                      <g>
                        {/* 外层光晕 */}
                        <circle
                          key="forecast-outer"
                          cx={cx}
                          cy={cy}
                          r={12}
                          fill="rgba(239,68,68,0.2)"
                          style={{
                            filter: 'drop-shadow(0 0 15px rgba(239,68,68,0.9))',
                          }}
                        />
                        {/* 内层光晕 */}
                        <circle
                          key="forecast-inner"
                          cx={cx}
                          cy={cy}
                          r={8}
                          fill="rgba(239,68,68,0.4)"
                          style={{
                            filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.8))',
                          }}
                        />
                        {/* 核心圆 */}
                        <circle
                          key="forecast-core"
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill="#ef4444"
                          stroke="#7f1d1d"
                          strokeWidth={2.5}
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(239,68,68,1))',
                          }}
                        />
                      </g>
                    );
                  }
                  
                  // 正常点：青色
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="#22d3ee"
                      stroke="#0e7490"
                      strokeWidth={2}
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.6))',
                      }}
                    />
                  );
                }}
                activeDot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isBelowTarget = payload.forecast < 1200;
                  
                  if (isBelowTarget) {
                    // 风险点悬停：超大、超醒目
                    return (
                      <g>
                        {/* 外层光晕 */}
                        <circle
                          key="forecast-outer-active"
                          cx={cx}
                          cy={cy}
                          r={18}
                          fill="rgba(239,68,68,0.3)"
                          style={{
                            filter: 'drop-shadow(0 0 25px rgba(239,68,68,1))',
                          }}
                        />
                        {/* 内层光晕 */}
                        <circle
                          key="forecast-inner-active"
                          cx={cx}
                          cy={cy}
                          r={12}
                          fill="rgba(239,68,68,0.5)"
                          style={{
                            filter: 'drop-shadow(0 0 18px rgba(239,68,68,0.9))',
                          }}
                        />
                        {/* 核心圆 */}
                        <circle
                          key="forecast-core-active"
                          cx={cx}
                          cy={cy}
                          r={8}
                          fill="#ef4444"
                          stroke="#7f1d1d"
                          strokeWidth={3}
                          style={{
                            filter: 'drop-shadow(0 0 12px rgba(239,68,68,1))',
                          }}
                        />
                      </g>
                    );
                  }
                  
                  // 正常点悬停
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={7}
                      fill="#22d3ee"
                      stroke="#0e7490"
                      strokeWidth={3}
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.8))',
                      }}
                    />
                  );
                }}
                name="预测完成"
                animationDuration={2000}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#22c55e"
                strokeWidth={3.5}
                dot={(props: any) => {
                  const { payload } = props;
                  // 不显示值为0的点，返回不可见的圆
                  if (!payload || payload.completed === 0) {
                    return <circle cx={props.cx} cy={props.cy} r={0} fill="transparent" />;
                  }
                  
                  const isBelowTarget = payload.completed < 1200;
                  
                  if (isBelowTarget) {
                    // 风险点：更大、更醒目的红色
                    return (
                      <g>
                        {/* 外层光晕 */}
                        <circle
                          key="completed-outer"
                          cx={props.cx}
                          cy={props.cy}
                          r={12}
                          fill="rgba(239,68,68,0.2)"
                          style={{
                            filter: 'drop-shadow(0 0 15px rgba(239,68,68,0.9))',
                          }}
                        />
                        {/* 内层光晕 */}
                        <circle
                          key="completed-inner"
                          cx={props.cx}
                          cy={props.cy}
                          r={8}
                          fill="rgba(239,68,68,0.4)"
                          style={{
                            filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.8))',
                          }}
                        />
                        {/* 核心圆 */}
                        <circle
                          key="completed-core"
                          cx={props.cx}
                          cy={props.cy}
                          r={5}
                          fill="#ef4444"
                          stroke="#7f1d1d"
                          strokeWidth={2.5}
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(239,68,68,1))',
                          }}
                        />
                      </g>
                    );
                  }
                  
                  // 正常点：绿色
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={5}
                      fill="#22c55e"
                      stroke="#15803d"
                      strokeWidth={2}
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.6))',
                      }}
                    />
                  );
                }}
                activeDot={(props: any) => {
                  const { payload } = props;
                  // 不显示值为0的点，返回不可见的圆
                  if (!payload || payload.completed === 0) {
                    return <circle cx={props.cx} cy={props.cy} r={0} fill="transparent" />;
                  }
                  
                  const isBelowTarget = payload.completed < 1200;
                  
                  if (isBelowTarget) {
                    // 风险点悬停：超大、超醒目
                    return (
                      <g>
                        {/* 外层光晕 */}
                        <circle
                          key="completed-outer-active"
                          cx={props.cx}
                          cy={props.cy}
                          r={18}
                          fill="rgba(239,68,68,0.3)"
                          style={{
                            filter: 'drop-shadow(0 0 25px rgba(239,68,68,1))',
                          }}
                        />
                        {/* 内层光晕 */}
                        <circle
                          key="completed-inner-active"
                          cx={props.cx}
                          cy={props.cy}
                          r={12}
                          fill="rgba(239,68,68,0.5)"
                          style={{
                            filter: 'drop-shadow(0 0 18px rgba(239,68,68,0.9))',
                          }}
                        />
                        {/* 核心圆 */}
                        <circle
                          key="completed-core-active"
                          cx={props.cx}
                          cy={props.cy}
                          r={8}
                          fill="#ef4444"
                          stroke="#7f1d1d"
                          strokeWidth={3}
                          style={{
                            filter: 'drop-shadow(0 0 12px rgba(239,68,68,1))',
                          }}
                        />
                      </g>
                    );
                  }
                  
                  // 正常点悬停
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={7}
                      fill="#22c55e"
                      stroke="#15803d"
                      strokeWidth={3}
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(74,222,128,0.8))',
                      }}
                    />
                  );
                }}
                name="已完成"
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
    );
  };

  return (
    <div className={cn(
      'p-2 sm:p-3 md:p-4',
      theme === 'dashboard' && DASHBOARD_STYLES.bg
    )}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px' }}
    >
      {/* 标题栏 */}
      <div className="mb-2 sm:mb-3 flex items-center flex-shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <TrendingUp className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4', DASHBOARD_STYLES.neon)} />
          <h2 className={cn('text-sm sm:text-base md:text-lg font-bold', DASHBOARD_STYLES.neon)}>
            核心预测
          </h2>
        </div>
      </div>

      {/* 左右两个独立块布局 */}
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 items-stretch flex-1 overflow-hidden">
        {/* 左侧：仪表盘区块 - 30%宽度 */}
        <div className="lg:w-[30%] rounded-xl p-1.5 sm:p-2 border border-cyan-500/20 bg-slate-900/50 flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 h-full">
            {/* 实际达成率仪表盘 */}
            <div className="text-center flex-shrink-0">
              <MainGauge
                actualValue={animatedCompleted}
                targetValue={target}
                showPercentage={false}
                size={80}
              />
              <div className="mt-1">
                <div className="text-xs sm:text-sm font-semibold text-green-400">实际达成率</div>
                <div className="text-xs sm:text-sm md:text-base font-black" style={{ color: '#22c55e', textShadow: '0 0 10px rgba(74,222,128,0.8)' }}>
                  {mounted ? Math.round((completed / target) * 100) : 0}%
                </div>
              </div>
            </div>

            {/* 预计达成率仪表盘 */}
            <div className="text-center flex-shrink-0">
              <MainGauge
                actualValue={animatedForecast}
                targetValue={target}
                showPercentage={false}
                size={80}
              />
              <div className="mt-1">
                <div className="text-xs sm:text-sm font-semibold text-cyan-300">预计达成率</div>
                <div className="text-sm sm:text-lg font-black" style={{ color: '#22d3ee', textShadow: '0 0 10px rgba(34,211,238,0.8)' }}>
                  {mounted ? Math.round((forecast / target) * 100) : 0}%
                </div>
              </div>
            </div>

            {/* 预计缺口卡片 */}
            <div className="mx-auto w-4/5 sm:w-3/5 max-w-[200px] bg-gradient-to-br from-red-500/20 to-red-900/10 rounded-xl p-2 sm:p-2.5 border border-red-500/40 shadow-lg shadow-red-500/20">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-xs sm:text-sm font-semibold text-red-300/90">预计缺口</div>
                </div>
                <div className="text-lg sm:text-xl font-black text-red-400" style={{ textShadow: '0 0 12px rgba(248,113,113,0.8)' }}>
                  {mounted ? Math.round(animatedForecastGap) : 0}
                  <span className="text-[10px] sm:text-xs font-semibold ml-1 text-red-300/80">万</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：趋势图区块 - 70%宽度 */}
        <div className="lg:w-[70%] rounded-xl p-1.5 sm:p-2 border border-cyan-500/20 bg-slate-900/50 h-full flex flex-col min-h-0">
          <MonthlyTrendChart />
        </div>
      </div>
    </div>
  );
}
