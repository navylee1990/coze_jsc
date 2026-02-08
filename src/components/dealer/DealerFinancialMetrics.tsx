'use client';

import { useState, useMemo, useEffect } from 'react';
import { Target, Clock, AlertTriangle, Zap, Gauge, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

// 主题样式
const DASHBOARD_STYLES = {
  bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
  text: 'text-cyan-50',
  textMuted: 'text-cyan-300/70',
  textSecondary: 'text-cyan-200',
  neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
  warningNeon: 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]',
  successNeon: 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]',
};

// 时间范围类型
type TimeRange = 'current' | 'quarter' | 'year';

// 时间范围数据
const TIME_RANGE_DATA = {
  current: {
    target: 1200,
    completed: 960,
    forecast: 1050,
  },
  quarter: {
    target: 3600,
    completed: 2880,
    forecast: 3150,
  },
  year: {
    target: 14400,
    completed: 11520,
    forecast: 12600,
  },
};

// 月度趋势数据
const monthlyTrendData = [
  { month: '1月', target: 1200, completed: 960, forecast: 1050 },
  { month: '2月', target: 1200, completed: 1100, forecast: 1150 },
  { month: '3月', target: 1200, completed: 820, forecast: 1000 },
  { month: '4月', target: 1200, completed: 0, forecast: 1100 },
  { month: '5月', target: 1200, completed: 0, forecast: 1180 },
  { month: '6月', target: 1200, completed: 0, forecast: 1250 },
  { month: '7月', target: 1200, completed: 0, forecast: 0 },
  { month: '8月', target: 1200, completed: 0, forecast: 0 },
  { month: '9月', target: 1200, completed: 0, forecast: 0 },
  { month: '10月', target: 1200, completed: 0, forecast: 0 },
  { month: '11月', target: 1200, completed: 0, forecast: 0 },
  { month: '12月', target: 1200, completed: 0, forecast: 0 },
];

// 折扣折让率数据
const discountData = [
  { month: '1月', discountRate: 8.5 },
  { month: '2月', discountRate: 7.2 },
  { month: '3月', discountRate: 9.1 },
  { month: '4月', discountRate: 8.0 },
  { month: '5月', discountRate: 7.5 },
  { month: '6月', discountRate: 8.8 },
  { month: '7月', discountRate: 9.2 },
  { month: '8月', discountRate: 8.3 },
  { month: '9月', discountRate: 7.8 },
  { month: '10月', discountRate: 8.6 },
  { month: '11月', discountRate: 8.1 },
  { month: '12月', discountRate: 9.0 },
];

// 4个季度滚动退机率
const returnRateData = [
  { quarter: 'Q1', rate: 3.2 },
  { quarter: 'Q2', rate: 2.8 },
  { quarter: 'Q3', rate: 3.5 },
  { quarter: 'Q4', rate: 4.1 },
];

// 主仪表盘组件
const MainGauge = ({
  actualValue,
  targetValue,
  showPercentage = true,
  size = 180,
  label = ''
}: {
  actualValue: number;
  targetValue: number;
  showPercentage?: boolean;
  size?: number;
  label?: string;
}) => {
  const percentage = Math.min((actualValue / targetValue) * 100, 100);
  const angle = (percentage / 100) * 180 - 90;

  return (
    <div className="relative flex flex-col items-center justify-center">
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
              <div className="text-3xl font-black mb-1"
                   style={{
                     color: percentage >= 90 ? '#22c55e' :
                            percentage >= 70 ? '#eab308' :
                            '#ef4444',
                     textShadow: percentage >= 90 ? '0 0 15px rgba(74,222,128,0.8)' :
                                percentage >= 70 ? '0 0 15px rgba(250,204,21,0.8)' :
                                '0 0 15px rgba(239,68,68,0.8)',
                   }}
              >
                {Math.round(actualValue)}
              </div>
              <div className="text-xs font-semibold text-cyan-400/70">%</div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-xl font-black mb-0.5 text-cyan-50"
                   style={{
                     textShadow: '0 0 15px rgba(6,182,212,0.5)',
                   }}
              >
                {Math.round(actualValue)}
              </div>
              <div className="text-xs text-cyan-400/60">万</div>
            </div>
          )}
        </div>
      </div>
      {label && (
        <div className="mt-2 text-sm font-medium text-cyan-300/80">{label}</div>
      )}
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
  size = 140
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
    <div className="relative flex flex-col items-center justify-center">
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
          <div className="text-2xl font-black text-cyan-50"
               style={{
                 textShadow: '0 0 12px rgba(6,182,212,0.5)',
               }}
          >
            {Math.round(value)}
          </div>
          <div className="text-xs text-cyan-400/60">{unit}</div>
        </div>
      </div>
      <div className="mt-2 text-xs font-medium text-cyan-300/80">{label}</div>
    </div>
  );
};

export default function DealerFinancialMetrics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('current');
  const [mounted, setMounted] = useState(false);

  // 动画状态
  const [animatedTarget, setAnimatedTarget] = useState(0);
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [animatedForecast, setAnimatedForecast] = useState(0);

  useEffect(() => {
    setMounted(true);

    // 动画效果
    const data = TIME_RANGE_DATA[timeRange];
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedTarget(data.target * easeOut);
      setAnimatedCompleted(data.completed * easeOut);
      setAnimatedForecast(data.forecast * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [timeRange]);

  const data = TIME_RANGE_DATA[timeRange];
  const completionRate = Math.round((data.completed / data.target) * 100);
  const forecastRate = Math.round((data.forecast / data.target) * 100);
  const gap = data.target - data.forecast;

  // 颜色判断
  const getRateColor = (rate: number) => {
    if (rate < 80) return 'text-red-400';
    if (rate < 100) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRateBgColor = (rate: number) => {
    if (rate < 80) return 'bg-red-500/20 border-red-500/40';
    if (rate < 100) return 'bg-yellow-500/20 border-yellow-500/40';
    return 'bg-green-500/20 border-green-500/40';
  };

  return (
    <div className="space-y-6">
      {/* 标题和时间范围选择 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-50">财务指标（签约目标）</h2>
        </div>
        <div className="flex gap-2">
          {(['current', 'quarter', 'year'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                timeRange === range
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-800/50 text-cyan-300/70 hover:bg-slate-700/50'
              )}
            >
              {range === 'current' ? '本月' : range === 'quarter' ? '季度' : '年度'}
            </button>
          ))}
        </div>
      </div>

      {/* 仪表盘区域 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-items-center">
        {/* 本月目标 */}
        <SmallGauge
          value={data.target}
          maxValue={data.target * 1.2}
          label={timeRange === 'current' ? '本月目标' : timeRange === 'quarter' ? '季度目标' : '年度目标'}
          unit="万"
          color="cyan"
          size={140}
        />

        {/* 已完成 */}
        <SmallGauge
          value={data.completed}
          maxValue={data.target}
          label="已完成"
          unit="万"
          color="green"
          size={140}
        />

        {/* 预计完成 */}
        <SmallGauge
          value={data.forecast}
          maxValue={data.target * 1.2}
          label="预计完成"
          unit="万"
          color="cyan"
          size={140}
        />

        {/* 缺口 */}
        <SmallGauge
          value={Math.abs(gap)}
          maxValue={data.target}
          label={gap < 0 ? '超额' : '缺口'}
          unit="万"
          color={gap < 0 ? 'green' : 'red'}
          size={140}
        />
      </div>

      {/* 达成率仪表盘 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-items-center">
        {/* 完成率 */}
        <div className="flex flex-col items-center">
          <MainGauge
            actualValue={completionRate}
            targetValue={100}
            showPercentage={true}
            size={180}
            label="完成率"
          />
        </div>

        {/* 预计完成率 */}
        <div className="flex flex-col items-center">
          <MainGauge
            actualValue={forecastRate}
            targetValue={100}
            showPercentage={true}
            size={180}
            label="预计完成率"
          />
        </div>
      </div>

      {/* 月度趋势图 */}
      <Card className={cn(
        'backdrop-blur-xl border-2',
        'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
      )}>
        <CardHeader>
          <CardTitle className={cn('text-base font-semibold text-cyan-300/80', 'flex items-center gap-2')}>
            <TrendingUp className="h-4 w-4" />
            月度销售趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrendData}>
              <defs>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(34,211,238,0.15)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                tickLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                interval={0}
              />
              <YAxis
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
                domain={[0, 1500]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.96)',
                  border: '1px solid #22d3ee',
                  borderRadius: '8px',
                  boxShadow: '0 0 15px rgba(34,211,238,0.4)',
                  padding: '12px 16px',
                  fontSize: '13px',
                }}
                formatter={(value: number, name: string) => {
                  if (name === '目标') return [<span style={{ color: '#64748b', fontWeight: 600 }}>{value}万</span>, name];
                  if (name === '已完成') return [<span style={{ color: '#22c55e', fontWeight: 600 }}>{value}万</span>, name];
                  if (name === '预计') return [<span style={{ color: '#22d3ee', fontWeight: 600 }}>{value}万</span>, name];
                  return [value, name];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#22d3ee' }}
              />
              {/* 目标线 - 虚线 */}
              <Line
                type="monotone"
                dataKey="target"
                name="目标"
                stroke="#64748b"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                dot={false}
                activeDot={false}
                animationDuration={1500}
              />
              {/* 已完成线 - 绿色 */}
              <Line
                type="monotone"
                dataKey="completed"
                name="已完成"
                stroke="#22c55e"
                strokeWidth={3}
                dot={(props: any) => {
                  const { payload } = props;
                  if (!payload || payload.completed === 0) {
                    return <circle cx={props.cx} cy={props.cy} r={0} fill="transparent" />;
                  }

                  const isBelowTarget = payload.completed < payload.target;

                  if (isBelowTarget) {
                    return (
                      <g>
                        <circle cx={props.cx} cy={props.cy} r={10} fill="rgba(239,68,68,0.2)" style={{ filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.9))' }} />
                        <circle cx={props.cx} cy={props.cy} r={6} fill="rgba(239,68,68,0.4)" style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.8))' }} />
                        <circle cx={props.cx} cy={props.cy} r={4} fill="#ef4444" stroke="#7f1d1d" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,1))' }} />
                      </g>
                    );
                  }

                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill="#22c55e"
                      stroke="#15803d"
                      strokeWidth={2}
                      style={{ filter: 'drop-shadow(0 0 5px rgba(74,222,128,0.6))' }}
                    />
                  );
                }}
                activeDot={(props: any) => {
                  const { payload } = props;
                  if (!payload || payload.completed === 0) {
                    return <circle cx={props.cx} cy={props.cy} r={0} fill="transparent" />;
                  }

                  const isBelowTarget = payload.completed < payload.target;

                  if (isBelowTarget) {
                    return (
                      <g>
                        <circle cx={props.cx} cy={props.cy} r={14} fill="rgba(239,68,68,0.25)" style={{ filter: 'drop-shadow(0 0 20px rgba(239,68,68,1))' }} />
                        <circle cx={props.cx} cy={props.cy} r={9} fill="rgba(239,68,68,0.5)" style={{ filter: 'drop-shadow(0 0 14px rgba(239,68,68,0.9))' }} />
                        <circle cx={props.cx} cy={props.cy} r={6} fill="#ef4444" stroke="#7f1d1d" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 0 10px rgba(239,68,68,1))' }} />
                      </g>
                    );
                  }

                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={6}
                      fill="#22c55e"
                      stroke="#15803d"
                      strokeWidth={2.5}
                      style={{ filter: 'drop-shadow(0 0 8px rgba(74,222,128,0.8))' }}
                    />
                  );
                }}
                animationDuration={1800}
              />
              {/* 预计线 - 青色 */}
              <Line
                type="monotone"
                dataKey="forecast"
                name="预计"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={(props: any) => {
                  const { payload } = props;
                  if (!payload || payload.forecast === 0) {
                    return <circle cx={props.cx} cy={props.cy} r={0} fill="transparent" />;
                  }

                  const isBelowTarget = payload.forecast < payload.target;

                  if (isBelowTarget) {
                    return (
                      <g>
                        <circle cx={props.cx} cy={props.cy} r={10} fill="rgba(239,68,68,0.2)" style={{ filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.9))' }} />
                        <circle cx={props.cx} cy={props.cy} r={6} fill="rgba(239,68,68,0.4)" style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.8))' }} />
                        <circle cx={props.cx} cy={props.cy} r={4} fill="#ef4444" stroke="#7f1d1d" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,1))' }} />
                      </g>
                    );
                  }

                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill="#22d3ee"
                      stroke="#0e7490"
                      strokeWidth={2}
                      style={{ filter: 'drop-shadow(0 0 5px rgba(34,211,238,0.6))' }}
                    />
                  );
                }}
                activeDot={(props: any) => {
                  const { payload } = props;
                  if (!payload || payload.forecast === 0) {
                    return <circle cx={props.cx} cy={props.cy} r={0} fill="transparent" />;
                  }

                  const isBelowTarget = payload.forecast < payload.target;

                  if (isBelowTarget) {
                    return (
                      <g>
                        <circle cx={props.cx} cy={props.cy} r={14} fill="rgba(239,68,68,0.25)" style={{ filter: 'drop-shadow(0 0 20px rgba(239,68,68,1))' }} />
                        <circle cx={props.cx} cy={props.cy} r={9} fill="rgba(239,68,68,0.5)" style={{ filter: 'drop-shadow(0 0 14px rgba(239,68,68,0.9))' }} />
                        <circle cx={props.cx} cy={props.cy} r={6} fill="#ef4444" stroke="#7f1d1d" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 0 10px rgba(239,68,68,1))' }} />
                      </g>
                    );
                  }

                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={6}
                      fill="#22d3ee"
                      stroke="#0e7490"
                      strokeWidth={2.5}
                      style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.8))' }}
                    />
                  );
                }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 折扣折让率图 */}
      <Card className={cn(
        'backdrop-blur-xl border-2',
        'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
      )}>
        <CardHeader>
          <CardTitle className={cn('text-base font-semibold text-cyan-300/80', 'flex items-center gap-2')}>
            <BarChart3 className="h-4 w-4" />
            折扣折让率趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={discountData}>
              <defs>
                <linearGradient id="colorDiscount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(34,211,238,0.15)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                tickLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                interval={0}
              />
              <YAxis
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 12]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.96)',
                  border: '1px solid #eab308',
                  borderRadius: '8px',
                  boxShadow: '0 0 15px rgba(234,179,8,0.4)',
                  padding: '12px 16px',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [<span style={{ color: '#eab308', fontWeight: 600 }}>{value}%</span>, '折扣折让率']}
              />
              <Line
                type="monotone"
                dataKey="discountRate"
                name="折扣折让率"
                stroke="#eab308"
                strokeWidth={3}
                dot={(props: any) => (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill="#eab308"
                    stroke="#a16207"
                    strokeWidth={2}
                    style={{ filter: 'drop-shadow(0 0 5px rgba(234,179,8,0.6))' }}
                  />
                )}
                activeDot={(props: any) => (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={6}
                    fill="#eab308"
                    stroke="#a16207"
                    strokeWidth={2.5}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(234,179,8,0.8))' }}
                  />
                )}
                animationDuration={1800}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 退机率图 */}
      <Card className={cn(
        'backdrop-blur-xl border-2',
        'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
      )}>
        <CardHeader>
          <CardTitle className={cn('text-base font-semibold text-cyan-300/80', 'flex items-center gap-2')}>
            <AlertTriangle className="h-4 w-4" />
            4个季度滚动退机率
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={returnRateData}>
              <defs>
                <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(34,211,238,0.15)" />
              <XAxis
                dataKey="quarter"
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                tickLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                interval={0}
              />
              <YAxis
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 6]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.96)',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  boxShadow: '0 0 15px rgba(239,68,68,0.4)',
                  padding: '12px 16px',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [<span style={{ color: '#ef4444', fontWeight: 600 }}>{value}%</span>, '退机率']}
              />
              <Line
                type="monotone"
                dataKey="rate"
                name="退机率"
                stroke="#ef4444"
                strokeWidth={3}
                dot={(props: any) => (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill="#ef4444"
                    stroke="#991b1b"
                    strokeWidth={2}
                    style={{ filter: 'drop-shadow(0 0 5px rgba(239,68,68,0.6))' }}
                  />
                )}
                activeDot={(props: any) => (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={6}
                    fill="#ef4444"
                    stroke="#991b1b"
                    strokeWidth={2.5}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.8))' }}
                  />
                )}
                animationDuration={1800}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
