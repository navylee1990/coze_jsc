'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Heart, Shield, Users, DollarSign, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';

// 模拟数据
const kpiData = {
  totalRevenue: 8520,
  totalProfit: 1680,
  profitRate: 19.7,
  cashFlow: 2450,
  newCustomers: 28,
  activeCustomers: 156,
  lostCustomers: 5,
  avgOrderValue: 54.6,
};

const regionPerformance = [
  { name: '华东大区', revenue: 2850, profit: 580, rate: 20.4, trend: 'up' },
  { name: '华北大区', revenue: 1920, profit: 360, rate: 18.8, trend: 'down' },
  { name: '华南大区', revenue: 1650, profit: 310, rate: 18.8, trend: 'up' },
  { name: '华中大区', revenue: 1250, profit: 260, rate: 20.8, trend: 'up' },
  { name: '西南大区', revenue: 850, profit: 170, rate: 20.0, trend: 'down' },
];

const riskWarnings = [
  { type: '客户风险', count: 3, severity: 'high', description: '3个客户回款逾期超过60天' },
  { type: '项目风险', count: 12, severity: 'medium', description: '12个项目进度滞后' },
  { type: '库存风险', count: 1, severity: 'low', description: '部分型号库存周转过慢' },
];

const customerDistribution = [
  { type: '新客户（3个月内）', count: 28, percentage: 17.9 },
  { type: '活跃客户（6个月内）', count: 98, percentage: 62.8 },
  { type: '沉睡客户（6个月以上）', count: 30, percentage: 19.3 },
];

export default function DealerDashboard() {
  const [timeRange, setTimeRange] = useState('month');
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

      {/* 筛选器 */}
      <div className="mb-3 flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">时间范围：</span>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="month">本月</option>
          <option value="quarter">本季度</option>
          <option value="year">本年度</option>
        </select>
      </div>

      {/* Tab页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-3 h-10 bg-white border border-gray-200 rounded-xl shadow-sm p-1">
          <TabsTrigger value="overview" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              经营总览
            </span>
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              区域分析
            </span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              客户分析
            </span>
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              风险预警
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* 经营总览标题 */}
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-4">
              {/* 经营健康度 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-700">健康度</span>
                <span className="text-sm font-bold text-red-600">良好</span>
              </div>
              {/* 风险等级 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Shield className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">风险</span>
                <span className="text-sm font-bold text-yellow-600">中风险</span>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              经营总览
            </h2>
          </div>

          {/* KPI卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {/* 总营收 */}
            <Card className="bg-white border-2 border-purple-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <DollarSign className="w-3 h-3 text-purple-500" />
                    <span>总营收</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">8,520</span>
                  <span className="text-sm text-gray-400">万元</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>+12.5%</span>
                </div>
              </CardContent>
            </Card>

            {/* 净利润 */}
            <Card className="bg-white border-2 border-green-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <Target className="w-3 h-3 text-green-500" />
                    <span>净利润</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">1,680</span>
                  <span className="text-sm text-gray-400">万元</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>+8.3%</span>
                </div>
              </CardContent>
            </Card>

            {/* 利润率 */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <PieChart className="w-3 h-3 text-blue-500" />
                    <span>利润率</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">19.7</span>
                  <span className="text-sm text-gray-400">%</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-yellow-600 mt-1">
                  <ArrowDown className="w-3 h-3" />
                  <span>-0.5%</span>
                </div>
              </CardContent>
            </Card>

            {/* 现金流 */}
            <Card className="bg-white border-2 border-yellow-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <DollarSign className="w-3 h-3 text-yellow-500" />
                    <span>现金流</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">2,450</span>
                  <span className="text-sm text-gray-400">万元</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>+15.2%</span>
                </div>
              </CardContent>
            </Card>

            {/* 客户总数 */}
            <Card className="bg-white border-2 border-pink-200">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <Users className="w-3 h-3 text-pink-500" />
                    <span>客户总数</span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">156</span>
                  <span className="text-sm text-gray-400">家</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>+28</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 大区业绩排行 */}
          <Card className="mt-3 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                大区业绩排行
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">排名</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">大区</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">营收</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">利润</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">利润率</th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">趋势</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionPerformance.map((region, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-400 text-white' :
                            index === 1 ? 'bg-gray-300 text-white' :
                            index === 2 ? 'bg-orange-300 text-white' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{region.name}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">{region.revenue.toLocaleString()}万</td>
                        <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{region.profit.toLocaleString()}万</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">{region.rate}%</td>
                        <td className="px-4 py-3 text-center">
                          {region.trend === 'up' ? (
                            <ArrowUp className="w-4 h-4 text-green-500 inline" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-500 inline" />
                          )}
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

        <TabsContent value="customers">
          <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-500" />
                客户分布分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {customerDistribution.map((item, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                    <div className="text-4xl font-bold text-purple-600">{item.count}</div>
                    <div className="text-sm text-gray-600 mt-2">{item.type}</div>
                    <div className="text-xs text-gray-400 mt-1">{item.percentage}%</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-sm text-gray-700 mb-3">客户经营建议：</div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div className="text-gray-600">
                      <span className="font-medium text-gray-900">新客户：</span>加强跟进，提升成交率，目标转化率提升至25%
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div className="text-gray-600">
                      <span className="font-medium text-gray-900">活跃客户：</span>定期回访，挖掘二次需求，提升客单价
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div className="text-gray-600">
                      <span className="font-medium text-gray-900">沉睡客户：</span>制定激活计划，通过促销活动唤醒
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                风险预警
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskWarnings.map((risk, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${
                    risk.severity === 'high' ? 'bg-red-50 border-red-300' :
                    risk.severity === 'medium' ? 'bg-yellow-50 border-yellow-300' :
                    'bg-green-50 border-green-300'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          risk.severity === 'high' ? 'bg-red-100' :
                          risk.severity === 'medium' ? 'bg-yellow-100' :
                          'bg-green-100'
                        }`}>
                          <Shield className={`w-5 h-5 ${
                            risk.severity === 'high' ? 'text-red-600' :
                            risk.severity === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{risk.type}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              risk.severity === 'high' ? 'bg-red-600 text-white' :
                              risk.severity === 'medium' ? 'bg-yellow-600 text-white' :
                              'bg-green-600 text-white'
                            }`}>
                              {risk.count}项
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                        </div>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        查看 →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
