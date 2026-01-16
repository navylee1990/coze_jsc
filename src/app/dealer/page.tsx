'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Heart, Shield, Users, DollarSign, PieChart, Package, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// 模拟数据
const kpiData = {
  annualTarget: 15000,
  completedAmount: 8250,
  shippedAmount: 7500,
  achievementRate: 55.0,
  projectReserveCount: 85,
  projectReserveAmount: 3200,
  currentMonthActual: 825,
  peerAvgToMonth: 780,
  totalProjectCount: 142,
};

// 月度趋势数据
const monthlyTrendData = [
  { month: '1月', target: 1250, actual: 720, achievement: 57.6 },
  { month: '2月', target: 1250, actual: 650, achievement: 52.0 },
  { month: '3月', target: 1250, actual: 580, achievement: 46.4 },
  { month: '4月', target: 1250, actual: 690, achievement: 55.2 },
  { month: '5月', target: 1250, actual: 750, achievement: 60.0 },
  { month: '6月', target: 1250, actual: 820, achievement: 65.6 },
  { month: '7月', target: 1250, actual: 780, achievement: 62.4 },
  { month: '8月', target: 1250, actual: 860, achievement: 68.8 },
  { month: '9月', target: 1250, actual: 795, achievement: 63.6 },
  { month: '10月', target: 1250, actual: 840, achievement: 67.2 },
  { month: '11月', target: 1250, actual: 825, achievement: 66.0 },
  { month: '12月', target: 1250, actual: 825, achievement: 66.0 },
];

const achievementRanking = [
  { rank: 1, name: '华东大区', target: 4500, completed: 2800, shipped: 2600, rate: 62.2, actual: 850, peerAvg: 720, projectCount: 32, trend: 'up' },
  { rank: 2, name: '华北大区', target: 3800, completed: 2100, shipped: 1950, rate: 55.3, actual: 680, peerAvg: 650, projectCount: 28, trend: 'up' },
  { rank: 3, name: '华南大区', target: 3200, completed: 1650, shipped: 1500, rate: 51.6, actual: 520, peerAvg: 500, projectCount: 25, trend: 'down' },
  { rank: 4, name: '华中大区', target: 2500, completed: 1200, shipped: 1100, rate: 48.0, actual: 480, peerAvg: 460, projectCount: 22, trend: 'up' },
  { rank: 5, name: '西南大区', target: 1000, completed: 500, shipped: 450, rate: 50.0, actual: 195, peerAvg: 185, projectCount: 18, trend: 'down' },
];

export default function DealerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 页面头部 */}
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">经销商老板驾驶舱</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              刷新数据
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              导出报告
            </button>
          </div>
        </div>
      </header>

      {/* Tab页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-3 h-10 bg-white border border-gray-200 rounded-xl shadow-sm p-1">
          <TabsTrigger value="overview" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              年度目标达成
            </span>
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              区域分析
            </span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              项目储备
            </span>
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              风险预警
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* 经营总览标题 */}
          <div className="mb-4 flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              年度目标达成情况
            </h2>
            <div className="flex items-center gap-4">
              {/* 达成率 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Award className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">达成率</span>
                <span className="text-sm font-bold text-blue-600">{kpiData.achievementRate}%</span>
              </div>
              {/* 健康度 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Heart className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">健康度</span>
                <span className="text-sm font-bold text-green-600">良好</span>
              </div>
            </div>
          </div>

          {/* KPI卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {/* 年度目标金额 */}
            <Card className="bg-white border-2 border-indigo-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <Target className="w-3 h-3 text-indigo-500" />
                    <span>年度目标</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{kpiData.annualTarget.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">万元</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">2026年度</div>
              </CardContent>
            </Card>

            {/* 已完成金额 */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <DollarSign className="w-3 h-3 text-blue-500" />
                    <span>已完成</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-blue-600">{kpiData.completedAmount.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">万元</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>较上月+156万</span>
                </div>
              </CardContent>
            </Card>

            {/* 已提货金额 */}
            <Card className="bg-white border-2 border-green-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <Package className="w-3 h-3 text-green-500" />
                    <span>已提货</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-green-600">{kpiData.shippedAmount.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">万元</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <span className="text-xs">库存金额 {kpiData.completedAmount - kpiData.shippedAmount}万</span>
                </div>
              </CardContent>
            </Card>

            {/* 项目储备 */}
            <Card className="bg-white border-2 border-orange-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <Package className="w-3 h-3 text-orange-500" />
                    <span>项目储备</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-orange-600">{kpiData.projectReserveCount}</span>
                  <span className="text-sm text-gray-400">个</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-orange-600 mt-1">
                  <span className="text-xs font-medium">¥{kpiData.projectReserveAmount.toLocaleString()}万</span>
                </div>
              </CardContent>
            </Card>

            {/* 本月实际完成 */}
            <Card className="bg-white border-2 border-red-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <Activity className="w-3 h-3 text-red-500" />
                    <span>本月完成</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-red-600">{kpiData.currentMonthActual}</span>
                  <span className="text-sm text-gray-400">万元</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>超同规模{Math.round((kpiData.currentMonthActual - kpiData.peerAvgToMonth) / kpiData.peerAvgToMonth * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 月度趋势分析 */}
          <Card className="mt-3 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                月度趋势分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">月份</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-500">目标</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-500">实际完成</th>
                      <th className="px-3 py-2 text-center text-sm font-medium text-gray-500">达成率</th>
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">进度</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyTrendData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                        <td className="px-3 py-2.5 text-sm font-medium text-gray-900">{item.month}</td>
                        <td className="px-3 py-2.5 text-sm text-right text-gray-600">{item.target}</td>
                        <td className={`px-3 py-2.5 text-sm text-right font-medium ${item.actual >= item.target ? 'text-green-600' : 'text-red-600'}`}>
                          {item.actual}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            item.achievement >= 100 ? 'bg-green-100 text-green-700' :
                            item.achievement >= 80 ? 'bg-blue-100 text-blue-700' :
                            item.achievement >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.achievement.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.achievement >= 100 ? 'bg-green-500' :
                                item.achievement >= 80 ? 'bg-blue-500' :
                                item.achievement >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(item.achievement, 100)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">区域详细分析</p>
              <p className="text-sm mt-1">数据准备中...</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">项目储备分析</p>
              <p className="text-sm mt-1">数据准备中...</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="risks">
          <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">风险预警</p>
              <p className="text-sm mt-1">数据准备中...</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
