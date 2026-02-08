'use client';

import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 月度财务指标数据（12个月）
const monthlyFinancialData = [
  { month: '1月', discountRate: 8.5, returnRate: 3.0 },
  { month: '2月', discountRate: 7.2, returnRate: 3.2 },
  { month: '3月', discountRate: 9.1, returnRate: 3.4 },
  { month: '4月', discountRate: 8.0, returnRate: 2.9 },
  { month: '5月', discountRate: 7.5, returnRate: 2.7 },
  { month: '6月', discountRate: 8.8, returnRate: 2.8 },
  { month: '7月', discountRate: 9.2, returnRate: 3.3 },
  { month: '8月', discountRate: 8.3, returnRate: 3.5 },
  { month: '9月', discountRate: 7.8, returnRate: 3.7 },
  { month: '10月', discountRate: 8.6, returnRate: 3.8 },
  { month: '11月', discountRate: 8.1, returnRate: 4.2 },
  { month: '12月', discountRate: 9.0, returnRate: 4.3 },
];

export default function DiscountReturnRateTrend({ showTitle = false }: { showTitle?: boolean }) {
  return (
    <div className="h-full flex flex-col">
      {/* 标题（可选） */}
      {showTitle && (
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-cyan-50">折扣折让率与退机率趋势</h2>
        </div>
      )}

      {/* 折扣折让率与退机率趋势合并图 */}
      <Card className={cn(
        'backdrop-blur-xl border-2 flex-1 flex flex-col',
        'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
      )}>
        <CardHeader>
          <CardTitle className={cn('text-base font-semibold text-cyan-300/80', 'flex items-center gap-2')}>
            <BarChart3 className="h-4 w-4" />
            折扣折让率与退机率趋势
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyFinancialData}>
              <defs>
                <linearGradient id="colorDiscount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(34,211,238,0.15)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                tickLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                interval={0}
              />
              <YAxis
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 11, fontWeight: 500 }}
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
                formatter={(value: number, name: string) => {
                  if (name === '折扣折让率') return [<span style={{ color: '#eab308', fontWeight: 600 }}>{value}%</span>, name];
                  if (name === '退机率') return [<span style={{ color: '#ef4444', fontWeight: 600 }}>{value}%</span>, name];
                  return [value, name];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#22d3ee', paddingTop: '8px' }}
              />
              {/* 折扣折让率 - 金色 */}
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
                    r={5}
                    fill="#eab308"
                    stroke="#a16207"
                    strokeWidth={2}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(234,179,8,0.6))' }}
                  />
                )}
                activeDot={(props: any) => (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={7}
                    fill="#eab308"
                    stroke="#a16207"
                    strokeWidth={2.5}
                    style={{ filter: 'drop-shadow(0 0 10px rgba(234,179,8,0.8))' }}
                  />
                )}
                animationDuration={1800}
              />
              {/* 退机率 - 红色 */}
              <Line
                type="monotone"
                dataKey="returnRate"
                name="退机率"
                stroke="#ef4444"
                strokeWidth={3}
                dot={(props: any) => (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={5}
                    fill="#ef4444"
                    stroke="#991b1b"
                    strokeWidth={2}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.6))' }}
                  />
                )}
                activeDot={(props: any) => (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={7}
                    fill="#ef4444"
                    stroke="#991b1b"
                    strokeWidth={2.5}
                    style={{ filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.8))' }}
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
