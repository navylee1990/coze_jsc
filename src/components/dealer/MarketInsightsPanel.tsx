'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle, Globe, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 细分行业数据
const industryData = [
  { category: '教育', subcategories: ['幼教', 'K12', '高校含BOT'] },
  { category: '企业', subcategories: ['国央企', '外资', '民营', '水处理'] },
  { category: '金融', subcategories: [] },
  { category: '医疗', subcategories: [] },
  { category: '政府', subcategories: [] },
];

// 细分行业详细数据
const industryDetailData = [
  { industry: '幼教', totalTarget: 2000, ytdTarget: 500, ytdNewAmount: 480, ytdRate: 96, projectCount: 12, projectAmount: 800, totalRate: 40 },
  { industry: 'K12', totalTarget: 3000, ytdTarget: 750, ytdNewAmount: 720, ytdRate: 96, projectCount: 18, projectAmount: 1200, totalRate: 40 },
  { industry: '高校含BOT', totalTarget: 5000, ytdTarget: 1250, ytdNewAmount: 1100, ytdRate: 88, projectCount: 8, projectAmount: 2000, totalRate: 40 },
  { industry: '国央企', totalTarget: 4000, ytdTarget: 1000, ytdNewAmount: 900, ytdRate: 90, projectCount: 15, projectAmount: 1600, totalRate: 40 },
  { industry: '外资', totalTarget: 2500, ytdTarget: 625, ytdNewAmount: 620, ytdRate: 99, projectCount: 10, projectAmount: 1000, totalRate: 40 },
  { industry: '民营', totalTarget: 3500, ytdTarget: 875, ytdNewAmount: 700, ytdRate: 80, projectCount: 20, projectAmount: 1400, totalRate: 40 },
  { industry: '水处理', totalTarget: 1500, ytdTarget: 375, ytdNewAmount: 300, ytdRate: 80, projectCount: 6, projectAmount: 600, totalRate: 40 },
  { industry: '金融', totalTarget: 4500, ytdTarget: 1125, ytdNewAmount: 1125, ytdRate: 100, projectCount: 9, projectAmount: 1800, totalRate: 40 },
  { industry: '医疗', totalTarget: 3000, ytdTarget: 750, ytdNewAmount: 675, ytdRate: 90, projectCount: 12, projectAmount: 1200, totalRate: 40 },
  { industry: '政府', totalTarget: 5000, ytdTarget: 1250, ytdNewAmount: 1250, ytdRate: 100, projectCount: 10, projectAmount: 2000, totalRate: 40 },
];

// 颜色判断
const getRateColor = (rate: number) => {
  if (rate < 80) return 'text-red-400 bg-red-500/20 border-red-500/40';
  if (rate < 100) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
  return 'text-green-400 bg-green-500/20 border-green-500/40';
};

export default function MarketInsightsPanel() {
  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-cyan-400" />
        <h2 className="text-xl font-bold text-cyan-50">市场洞察及风险分析</h2>
      </div>

      {/* 细分行业进展 */}
      <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-50 font-bold">细分行业进展</CardTitle>
          <div className="flex gap-4 text-xs text-cyan-300/70 mt-2">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500/40 border-2 border-red-500"></span>
              &lt;80% 标红
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500/40 border-2 border-yellow-500"></span>
              80%-100% 标黄
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500/40 border-2 border-green-500"></span>
              ≥100% 标绿
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyan-500/30">
                  <th className="text-left py-2 px-3 text-cyan-300 font-semibold whitespace-nowrap">细分行业</th>
                  <th className="text-right py-2 px-3 text-cyan-300 font-semibold whitespace-nowrap">总目标(万)</th>
                  <th className="text-right py-2 px-3 text-cyan-300 font-semibold whitespace-nowrap">YTD目标(万)</th>
                  <th className="text-right py-2 px-3 text-cyan-300 font-semibold whitespace-nowrap">YTD新增金额(万)</th>
                  <th className="text-center py-2 px-3 text-cyan-300 font-semibold whitespace-nowrap">YTD完成率</th>
                  <th className="text-center py-2 px-3 text-cyan-300 font-semibold whitespace-nowrap">项目报备数量</th>
                  <th className="text-right py-2 px-3 text-cyan-300 font-semibold whitespace-nowrap">项目报备金额(万)</th>
                  <th className="text-center py-2 px-3 text-cyan-300 font-semibold whitespace-nowrap">总目标完成率</th>
                </tr>
              </thead>
              <tbody>
                {industryDetailData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors"
                  >
                    <td className="py-2 px-3 text-cyan-50 font-medium whitespace-nowrap">{item.industry}</td>
                    <td className="py-2 px-3 text-cyan-300 text-right whitespace-nowrap">{item.totalTarget.toLocaleString()}</td>
                    <td className="py-2 px-3 text-cyan-300 text-right whitespace-nowrap">{item.ytdTarget.toLocaleString()}</td>
                    <td className="py-2 px-3 text-cyan-300 text-right whitespace-nowrap">{item.ytdNewAmount.toLocaleString()}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className={cn(
                        'inline-block px-2 py-1 rounded text-xs font-bold',
                        getRateColor(item.ytdRate)
                      )}>
                        {item.ytdRate}%
                      </div>
                    </td>
                    <td className="py-2 px-3 text-cyan-300 text-center whitespace-nowrap">{item.projectCount}</td>
                    <td className="py-2 px-3 text-cyan-300 text-right whitespace-nowrap">{item.projectAmount.toLocaleString()}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className={cn(
                        'inline-block px-2 py-1 rounded text-xs font-bold',
                        getRateColor(item.totalRate)
                      )}>
                        {item.totalRate}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 全国行业分布和客户分级在线 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 全国行业分布 */}
        <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
          <CardHeader>
            <CardTitle className="text-lg text-cyan-50 font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-400" />
              全国行业分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { region: '华东', value: 35, color: 'bg-cyan-500' },
                { region: '华北', value: 25, color: 'bg-blue-500' },
                { region: '华南', value: 20, color: 'bg-green-500' },
                { region: '西南', value: 12, color: 'bg-yellow-500' },
                { region: '其他', value: 8, color: 'bg-purple-500' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-cyan-300">{item.region}</span>
                    <span className="text-cyan-50 font-semibold">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', item.color)}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 客户分级在线 */}
        <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
          <CardHeader>
            <CardTitle className="text-lg text-cyan-50 font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              客户分级在线
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { level: 'A级客户', count: 25, amount: 5000, color: 'text-green-400 border-green-500/40 bg-green-500/10' },
                { level: 'B级客户', count: 45, amount: 8000, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
                { level: 'C级客户', count: 80, amount: 4000, color: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10' },
                { level: 'D级客户', count: 60, amount: 1500, color: 'text-red-400 border-red-500/40 bg-red-500/10' },
              ].map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105',
                    item.color
                  )}
                >
                  <div className="text-sm font-semibold mb-1">{item.level}</div>
                  <div className="text-xs text-cyan-300/70 mb-2">
                    <span className="text-lg font-bold text-cyan-50">{item.count}</span> 家
                  </div>
                  <div className="text-xs text-cyan-300/70">
                    金额: <span className="text-sm font-bold text-cyan-50">{item.amount}</span> 万
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
