'use client';

import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

export default function DealerFinancialMetrics({ showTitle = false }: { showTitle?: boolean }) {
  return (
    <div className="space-y-6">
      {/* 标题（可选） */}
      {showTitle && (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-cyan-50">月度销售趋势</h2>
        </div>
      )}

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
          <ResponsiveContainer width="100%" height={400}>
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
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 13, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                tickLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                interval={0}
              />
              <YAxis
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 13, fontWeight: 500 }}
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
                wrapperStyle={{ fontSize: '13px', color: '#22d3ee', paddingTop: '10px' }}
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
