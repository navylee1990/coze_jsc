'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Heart, Shield, Users, DollarSign, PieChart, Package, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
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
            <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">
              导出报告
            </button>
          </div>
        </div>
      </header>

      {/* Tab页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-3 h-10 bg-white border border-gray-200 rounded-xl shadow-sm p-1">
          <TabsTrigger value="overview" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              年度目标达成
            </span>
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              区域分析
            </span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              项目储备
            </span>
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
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
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-700">达成率</span>
                <span className="text-sm font-bold text-purple-600">{kpiData.achievementRate}%</span>
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
            <Card className="bg-white border-2 border-purple-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <Target className="w-3 h-3 text-purple-500" />
                    <span>年度目标</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{kpiData.annualTarget.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">万元</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">2024年度</div>
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
            <Card className="bg-white border-2 border-pink-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <Activity className="w-3 h-3 text-pink-500" />
                    <span>本月完成</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-pink-600">{kpiData.currentMonthActual}</span>
                  <span className="text-sm text-gray-400">万元</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>超同规模{Math.round((kpiData.currentMonthActual - kpiData.peerAvgToMonth) / kpiData.peerAvgToMonth * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 达成率排名 */}
          <Card className="mt-3 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                达成率排名
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">排名</th>
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">大区</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-500">年度目标</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-500">已完成</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-500">已提货</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-500">达成率</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-500">实际完成</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-500">同规模均值</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-500">项目个数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievementRanking.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                        <td className="px-3 py-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-400 text-white' :
                            index === 1 ? 'bg-gray-300 text-white' :
                            index === 2 ? 'bg-orange-300 text-white' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {item.rank}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-3 py-3 text-sm text-right text-gray-600">{item.target.toLocaleString()}</td>
                        <td className="px-3 py-3 text-sm text-right text-blue-600 font-medium">{item.completed.toLocaleString()}</td>
                        <td className="px-3 py-3 text-sm text-right text-green-600">{item.shipped.toLocaleString()}</td>
                        <td className="px-3 py-3 text-sm text-right">
                          <span className={`font-bold ${item.rate >= 60 ? 'text-green-600' : item.rate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {item.rate}%
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-right text-gray-600">{item.actual}</td>
                        <td className="px-3 py-3 text-sm text-right text-gray-400">{item.peerAvg}</td>
                        <td className="px-3 py-3 text-sm text-right text-purple-600 font-medium">{item.projectCount}</td>
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
