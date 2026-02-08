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
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'bg-slate-800/50 text-cyan-300/70 hover:bg-slate-700/50'
              )}
            >
              {range === 'current' ? '本月' : range === 'quarter' ? '季度' : '年度'}
            </button>
          ))}
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 本月目标 */}
        <Card className={cn(
          'backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105',
          'bg-gradient-to-br from-slate-900/90 to-slate-950/90',
          'border-cyan-500/30 shadow-lg shadow-cyan-500/10'
        )}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-cyan-300/80 font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              {timeRange === 'current' ? '本月目标' : timeRange === 'quarter' ? '季度目标' : '年度目标'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-cyan-50" style={{
              textShadow: '0 0 20px rgba(6,182,212,0.5)'
            }}>
              {mounted ? Math.round(animatedTarget) : 0}
              <span className="text-lg font-semibold text-cyan-400/70 ml-1">万</span>
            </div>
          </CardContent>
        </Card>

        {/* 已完成 */}
        <Card className={cn(
          'backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105',
          'bg-gradient-to-br from-slate-900/90 to-slate-950/90',
          'border-green-500/30 shadow-lg shadow-green-500/10'
        )}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-300/80 font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              已完成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-400" style={{
              textShadow: '0 0 20px rgba(74,222,128,0.5)'
            }}>
              {mounted ? Math.round(animatedCompleted) : 0}
              <span className="text-lg font-semibold text-green-400/70 ml-1">万</span>
            </div>
          </CardContent>
        </Card>

        {/* 完成率 */}
        <Card className={cn(
          'backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105',
          'bg-gradient-to-br from-slate-900/90 to-slate-950/90',
          getRateBgColor(completionRate)
        )}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-cyan-300/80 font-medium flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              完成率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn('text-3xl font-black', getRateColor(completionRate))} style={{
              textShadow: `0 0 20px ${completionRate < 80 ? 'rgba(239,68,68,0.5)' : completionRate < 100 ? 'rgba(250,204,21,0.5)' : 'rgba(74,222,128,0.5)'}`
            }}>
              {mounted ? completionRate : 0}
              <span className="text-lg font-semibold ml-1">%</span>
            </div>
          </CardContent>
        </Card>

        {/* 预计完成 */}
        <Card className={cn(
          'backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105',
          'bg-gradient-to-br from-slate-900/90 to-slate-950/90',
          'border-cyan-500/30 shadow-lg shadow-cyan-500/10'
        )}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-cyan-300/80 font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              预计完成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-cyan-50" style={{
              textShadow: '0 0 20px rgba(6,182,212,0.5)'
            }}>
              {mounted ? Math.round(animatedForecast) : 0}
              <span className="text-lg font-semibold text-cyan-400/70 ml-1">万</span>
            </div>
          </CardContent>
        </Card>

        {/* 预计完成率 */}
        <Card className={cn(
          'backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105',
          'bg-gradient-to-br from-slate-900/90 to-slate-950/90',
          getRateBgColor(forecastRate)
        )}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-cyan-300/80 font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              预计完成率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn('text-3xl font-black', getRateColor(forecastRate))} style={{
              textShadow: `0 0 20px ${forecastRate < 80 ? 'rgba(239,68,68,0.5)' : forecastRate < 100 ? 'rgba(250,204,21,0.5)' : 'rgba(74,222,128,0.5)'}`
            }}>
              {mounted ? forecastRate : 0}
              <span className="text-lg font-semibold ml-1">%</span>
            </div>
          </CardContent>
        </Card>

        {/* 缺口 */}
        <Card className={cn(
          'backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105',
          'bg-gradient-to-br from-slate-900/90 to-slate-950/90',
          gap < 0 ? 'border-green-500/30 shadow-lg shadow-green-500/10' : 'border-red-500/30 shadow-lg shadow-red-500/10'
        )}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-cyan-300/80 font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {gap < 0 ? '超额完成' : '缺口'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn('text-3xl font-black', gap < 0 ? 'text-green-400' : 'text-red-400')} style={{
              textShadow: `0 0 20px ${gap < 0 ? 'rgba(74,222,128,0.5)' : 'rgba(239,68,68,0.5)'}`
            }}>
              {mounted ? Math.round(Math.abs(gap)) : 0}
              <span className="text-lg font-semibold ml-1">万</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 趋势图 */}
      <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-50 font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            业绩趋势图
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,0.1)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15,23,42,0.96)',
                    border: '1px solid #22d3ee',
                    borderRadius: '8px',
                    boxShadow: '0 0 15px rgba(34,211,238,0.4)',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="target" stroke="#fb923c" fillOpacity={1} fill="url(#colorTarget)" name="目标" />
                <Area type="monotone" dataKey="completed" stroke="#22c55e" fillOpacity={1} fill="url(#colorCompleted)" name="已完成" />
                <Area type="monotone" dataKey="forecast" stroke="#22d3ee" fillOpacity={1} fill="url(#colorForecast)" name="预计完成" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 折扣折让率和退机率 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 折扣折让率 */}
        <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
          <CardHeader>
            <CardTitle className="text-lg text-cyan-50 font-bold">折扣折让率趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={discountData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,0.1)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15,23,42,0.96)',
                      border: '1px solid #22d3ee',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, '折扣折让率']}
                  />
                  <Line
                    type="monotone"
                    dataKey="discountRate"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 4个季度滚动退机率 */}
        <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
          <CardHeader>
            <CardTitle className="text-lg text-cyan-50 font-bold">4个季度滚动退机率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={returnRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,0.1)" />
                  <XAxis dataKey="quarter" tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15,23,42,0.96)',
                      border: '1px solid #22d3ee',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, '退机率']}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
