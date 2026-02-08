'use client';

import { Map, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 全国行业分布数据
const regionData = [
  { region: '华东', sales: 4200, target: 3800, percentage: 110.5 },
  { region: '华南', sales: 3800, target: 3600, percentage: 105.6 },
  { region: '华北', sales: 3500, target: 3200, percentage: 109.4 },
  { region: '华中', sales: 2900, target: 2800, percentage: 103.6 },
  { region: '西南', sales: 2400, target: 2500, percentage: 96.0 },
  { region: '西北', sales: 1800, target: 1900, percentage: 94.7 },
  { region: '东北', sales: 1500, target: 1600, percentage: 93.8 },
];

export default function NationalIndustryDistribution({ showTitle = false }: { showTitle?: boolean }) {
  return (
    <div className="h-full flex flex-col">
      {/* 标题（可选） */}
      {showTitle && (
        <div className="flex items-center gap-2 mb-4">
          <Map className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-cyan-50">全国行业分布</h2>
        </div>
      )}

      {/* 全国行业分布卡片 */}
      <Card className={cn(
        'backdrop-blur-xl border-2 flex-1 flex flex-col',
        'bg-slate-900/60 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
      )}>
        <CardHeader className="pb-4">
          <CardTitle className={cn('text-base font-semibold text-cyan-300/80', 'flex items-center gap-2')}>
            <Map className="h-4 w-4" />
            全国行业分布
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData} layout="vertical">
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0.9}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#475569" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(34,211,238,0.1)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis
                type="category"
                dataKey="region"
                tick={{ fill: 'rgba(34,211,238,0.7)', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(34,211,238,0.3)' }}
                tickLine={false}
                width={50}
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
                  if (name === '实际销售') return [<span style={{ color: '#22d3ee', fontWeight: 600 }}>{value}万</span>, name];
                  if (name === '目标') return [<span style={{ color: '#64748b', fontWeight: 600 }}>{value}万</span>, name];
                  return [value, name];
                }}
                labelFormatter={(label: string) => {
                  const item = regionData.find(d => d.region === label);
                  return (
                    <div className="font-semibold text-cyan-300 mb-1">
                      {label}区域 · 达成率: <span className={(item?.percentage ?? 0) >= 100 ? 'text-green-400' : 'text-yellow-400'}>{(item?.percentage ?? 0).toFixed(1)}%</span>
                    </div>
                  );
                }}
              />
              {/* 目标条 */}
              <Bar
                dataKey="target"
                name="目标"
                fill="url(#colorTarget)"
                radius={[0, 0, 0, 0]}
                barSize={24}
                animationDuration={1500}
              />
              {/* 实际销售条 */}
              <Bar
                dataKey="sales"
                name="实际销售"
                fill="url(#colorSales)"
                radius={[4, 4, 4, 4]}
                barSize={20}
                animationDuration={1800}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
