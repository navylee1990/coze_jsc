'use client';

import { useState, useEffect } from 'react';
import { Target, Clock, AlertTriangle, Zap, Gauge, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';

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
  { month: '2月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1550 },
  { month: '3月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1350 },
  { month: '4月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1100 },
  { month: '5月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1580 },
  { month: '6月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 950 },
  { month: '7月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1520 },
  { month: '8月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1280 },
  { month: '9月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1150 },
  { month: '10月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1560 },
  { month: '11月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1320 },
  { month: '12月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1050 },
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

    animateRate();
    animateNeedle();
    animateNumbers();
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

  // 月度趋势曲线图（使用recharts组件）
  const MonthlyTrendChart = () => {
    return (
      <div className="h-full flex flex-col">
        {/* 图例 */}
        <div className="flex items-center justify-center gap-5 mb-3 px-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-orange-400" style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'rgba(251,146,60,0.8)' }} />
            <span className="text-sm text-cyan-400/70 font-medium">业务目标</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-purple-400" style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'rgba(168,85,247,0.8)' }} />
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
        <div className="flex-1" style={{ minHeight: '252px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrendData}>
              {/* 定义渐变：预测完成曲线下方填充 */}
              <defs>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  {/* 财务目标以上（29.4%位置）：青色 */}
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                  <stop offset="29.4%" stopColor="#22d3ee" stopOpacity="0.15" />
                  {/* 财务目标以下（29.4%-100%）：红色 */}
                  <stop offset="29.4%" stopColor="rgba(239,68,68,0.3)" />
                  <stop offset="100%" stopColor="rgba(239,68,68,0.15)" />
                </linearGradient>
              </defs>

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
              {/* 预测完成区域填充 */}
              <Area
                type="monotone"
                dataKey="forecast"
                fill="url(#forecastGradient)"
                stroke="none"
                animationDuration={2000}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#22d3ee"
                strokeWidth={3.5}
                dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                name="预测完成"
                animationDuration={2000}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#22c55e"
                strokeWidth={3.5}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                name="已完成"
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
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
