'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Heart, Shield, Users, DollarSign, PieChart, Package, Award, Sparkles, Lightbulb, TrendingDown, Search, FileText, CheckCircle, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// 模拟数据 - 不同时间维度
const timeRangeData = {
  month: {
    target: 1250,
    shipped: 650,
    achievementRate: 57.6,
    terminalUserCount: 428,
    projectReserveCount: 12,
    projectReserveAmount: 320,
    currentMonthActual: 720,
    peerAvgToMonth: 650,
  },
  quarter: {
    target: 3750,
    shipped: 1950,
    achievementRate: 57.6,
    terminalUserCount: 1256,
    projectReserveCount: 35,
    projectReserveAmount: 960,
    currentMonthActual: 825,
    peerAvgToMonth: 780,
  },
  year: {
    target: 15000,
    shipped: 7500,
    achievementRate: 55.0,
    terminalUserCount: 5120,
    projectReserveCount: 85,
    projectReserveAmount: 3200,
    currentMonthActual: 825,
    peerAvgToMonth: 780,
  },
};

// 同规模代理商对比数据
const peerComparisonData = {
  achievementRateRanking: 5,
  customerCountRanking: 5,
  comprehensiveCompetitiveness: {
    rank: 5,
    score: 82.5,
    indicators: {
      achievementRate: 55.0,
      customerSatisfaction: 88.5,
      marketShare: 12.3,
      growthRate: 18.5,
      innovation: 76.0,
    },
  },
};

// 细分市场业绩达成数据
const marketSegmentData = [
  { name: '餐饮行业', target: 3200, achieved: 1850, achievementRate: 57.8 },
  { name: '办公楼宇', target: 2800, achieved: 1680, achievementRate: 60.0 },
  { name: '医院医疗', target: 2200, achieved: 1150, achievementRate: 52.3 },
  { name: '学校教育', target: 1800, achieved: 980, achievementRate: 54.4 },
  { name: '酒店住宿', target: 1600, achieved: 890, achievementRate: 55.6 },
  { name: '其他行业', target: 3400, achieved: 1950, achievementRate: 57.4 },
];

// 项目储备数据
const projectReserveData = {
  totalTarget: 15000,
  totalAchieved: 7500,
  gap: 7500,
  reserveCount: 85,
  reserveAmount: 3200,
  reserveRate: 42.7,
  projects: [
    { name: 'XX酒店集团饮用水项目', stage: '方案阶段', amount: 380, probability: 80 },
    { name: 'XX医院净化设备采购', stage: '商务谈判', amount: 560, probability: 90 },
    { name: 'XX学校直饮水改造', stage: '招投标', amount: 420, probability: 70 },
    { name: 'XX办公楼直饮水系统', stage: '商务谈判', amount: 350, probability: 85 },
    { name: 'XX餐饮连锁净水方案', stage: '方案阶段', amount: 290, probability: 65 },
  ],
};

// 月度趋势分析数据
const monthlyTrendData = [
  { month: '1月', target: 1250, actual: 720, cumulative: 720 },
  { month: '2月', target: 1250, actual: 890, cumulative: 1610 },
  { month: '3月', target: 1250, actual: 850, cumulative: 2460 },
  { month: '4月', target: 1250, actual: 980, cumulative: 3440 },
  { month: '5月', target: 1250, actual: 920, cumulative: 4360 },
  { month: '6月', target: 1250, actual: 1050, cumulative: 5410 },
  { month: '7月', target: 1250, actual: 880, cumulative: 6290 },
  { month: '8月', target: 1250, actual: 950, cumulative: 7240 },
  { month: '9月', target: 1250, actual: 0, cumulative: 7240 },
  { month: '10月', target: 1250, actual: 0, cumulative: 7240 },
  { month: '11月', target: 1250, actual: 0, cumulative: 7240 },
  { month: '12月', target: 1250, actual: 0, cumulative: 7240 },
];


export default function DealerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');

  // 获取当前时间范围的数据
  const currentRangeData = timeRangeData[timeRange as keyof typeof timeRangeData];
  const timeRangeLabel = timeRange === 'month' ? '月度' : timeRange === 'quarter' ? '季度' : '年度';

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
              <h1 className="text-2xl font-bold text-gray-900">经销商经营看板</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              刷新数据
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
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
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="month">月度</option>
          <option value="quarter">季度</option>
          <option value="year">年度</option>
        </select>
      </div>

      {/* Tab页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-3 h-10 bg-white border border-gray-200 rounded-xl shadow-sm p-1">
          <TabsTrigger value="overview" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              年度目标达成
            </span>
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              风险预警
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* 经营总览标题 */}
          <div className="mb-3 flex items-center gap-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              {timeRangeLabel}目标达成情况
            </h2>
            <div className="flex items-center gap-4">
              {/* 达成率 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Award className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">达成率</span>
                <span className="text-sm font-bold text-green-600">{currentRangeData.achievementRate.toFixed(1)}%</span>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
            {/* 目标金额 */}
            <Card className="bg-white border-2 border-green-200">
              <CardContent className="p-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Target className="w-2.5 h-2.5 text-green-500" />
                    <span>{timeRangeLabel}目标</span>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    {timeRange === 'month' ? '1月' : timeRange === 'quarter' ? 'Q1' : '2026'}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-3xl font-bold text-gray-900 leading-tight">{currentRangeData.target.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">万元</span>
                </div>
              </CardContent>
            </Card>

            {/* 已提货金额 */}
            <Card className="bg-white border-2 border-teal-200">
              <CardContent className="p-1">
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <Truck className="w-2.5 h-2.5 text-teal-500" />
                  <span>已提货</span>
                </div>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-3xl font-bold text-teal-600 leading-tight">{currentRangeData.shipped.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">万元</span>
                </div>
                <div className="flex items-center gap-0.5 text-xs text-green-600 mt-0.5">
                  <ArrowUp className="w-2 h-2" />
                  <span>较上月+126万</span>
                </div>
              </CardContent>
            </Card>

            {/* 达成率 */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-1">
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <Award className="w-2.5 h-2.5 text-blue-500" />
                  <span>达成率</span>
                </div>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-3xl font-bold text-blue-600 leading-tight">{currentRangeData.achievementRate.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">%</span>
                </div>
                <div className="flex items-center gap-0.5 text-xs text-orange-600 mt-0.5">
                  <TrendingDown className="w-2 h-2" />
                  <span>未达标 {((100 - currentRangeData.achievementRate)).toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            {/* 终端用户数量 */}
            <Card className="bg-white border-2 border-purple-200">
              <CardContent className="p-1">
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <Users className="w-2.5 h-2.5 text-purple-500" />
                  <span>终端用户数</span>
                </div>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-3xl font-bold text-purple-600 leading-tight">{currentRangeData.terminalUserCount.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">个</span>
                </div>
                <div className="flex items-center gap-0.5 text-xs text-green-600 mt-0.5">
                  <ArrowUp className="w-2 h-2" />
                  <span>较上月+48个</span>
                </div>
              </CardContent>
            </Card>

            {/* 达成率排名 */}
            <Card className="bg-white border-2 border-green-200">
              <CardContent className="p-1">
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <Award className="w-2.5 h-2.5 text-green-500" />
                  <span>达成率排名</span>
                </div>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-3xl font-bold text-green-600 leading-tight">{peerComparisonData.achievementRateRanking}</span>
                  <span className="text-xs text-gray-400">名</span>
                </div>
                <div className="flex items-center gap-0.5 text-xs text-gray-500 mt-0.5">
                  <span>同行平均 68.5%</span>
                </div>
              </CardContent>
            </Card>

            {/* 客户数量排名 */}
            <Card className="bg-white border-2 border-emerald-200">
              <CardContent className="p-1">
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <Users className="w-2.5 h-2.5 text-emerald-500" />
                  <span>客户数量排名</span>
                </div>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-3xl font-bold text-emerald-600 leading-tight">{peerComparisonData.customerCountRanking}</span>
                  <span className="text-xs text-gray-400">名</span>
                </div>
                <div className="flex items-center gap-0.5 text-xs text-gray-500 mt-0.5">
                  <span>客户数 5120个</span>
                </div>
              </CardContent>
            </Card>

            {/* 综合竞争力 */}
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-1">
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                  <span>综合竞争力</span>
                </div>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-3xl font-bold text-blue-600 leading-tight">{peerComparisonData.comprehensiveCompetitiveness.score}</span>
                  <span className="text-xs text-gray-400">分</span>
                </div>
                <div className="flex items-center gap-0.5 text-xs text-gray-500 mt-0.5">
                  <span>排名 {peerComparisonData.comprehensiveCompetitiveness.rank}/7</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 细分市场业绩达成与项目储备 */}
          <Card className="mb-3 bg-white border border-gray-200 shadow-sm">
            <CardHeader className="py-2.5 px-3">
              <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-green-600" />
                细分市场业绩达成与项目储备
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* 左侧：细分市场业绩达成 */}
                <div className="border border-gray-200 rounded-lg p-2">
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <PieChart className="w-3.5 h-3.5 text-green-600" />
                    细分市场业绩达成
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-1.5 px-1.5 text-left font-medium text-gray-600">市场名称</th>
                          <th className="py-1.5 px-1.5 text-right font-medium text-gray-600">目标</th>
                          <th className="py-1.5 px-1.5 text-right font-medium text-gray-600">已达成</th>
                          <th className="py-1.5 px-1.5 text-right font-medium text-gray-600">达成率</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketSegmentData.map((segment, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-1.5 px-1.5 font-medium text-gray-900">{segment.name}</td>
                            <td className="py-1.5 px-1.5 text-right text-gray-600">{segment.target.toLocaleString()}</td>
                            <td className="py-1.5 px-1.5 text-right text-gray-600">{segment.achieved.toLocaleString()}</td>
                            <td className="py-1.5 px-1.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      segment.achievementRate >= 80 ? 'bg-green-500' :
                                      segment.achievementRate >= 60 ? 'bg-emerald-500' :
                                      segment.achievementRate >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${segment.achievementRate}%` }}
                                  />
                                </div>
                                <span className={`font-medium ${
                                  segment.achievementRate >= 80 ? 'text-green-600' :
                                  segment.achievementRate >= 60 ? 'text-emerald-600' :
                                  segment.achievementRate >= 40 ? 'text-orange-600' : 'text-red-600'
                                }`}>
                                  {segment.achievementRate.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 font-semibold">
                        <tr>
                          <td className="py-1.5 px-1.5 text-gray-900">合计</td>
                          <td className="py-1.5 px-1.5 text-right text-gray-900">{projectReserveData.totalTarget.toLocaleString()}</td>
                          <td className="py-1.5 px-1.5 text-right text-gray-900">{projectReserveData.totalAchieved.toLocaleString()}</td>
                          <td className="py-1.5 px-1.5 text-right text-green-600">
                            {((projectReserveData.totalAchieved / projectReserveData.totalTarget) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* 右侧：项目储备分析 */}
                <div className="border border-gray-200 rounded-lg p-2">
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-green-600" />
                    项目储备分析
                  </h3>

                  {/* 储备概览 */}
                  <div className="grid grid-cols-2 gap-2 mb-2.5">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2 border border-green-100">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-gray-600">年度缺口</span>
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                      </div>
                      <div className="text-xl font-bold text-gray-900">{projectReserveData.gap.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">万元</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-2 border border-blue-100">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-gray-600">储备项目</span>
                        <FileText className="w-3 h-3 text-blue-500" />
                      </div>
                      <div className="text-xl font-bold text-gray-900">{projectReserveData.reserveCount}</div>
                      <div className="text-xs text-gray-500">个</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-2 border border-purple-100">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-gray-600">储备金额</span>
                        <DollarSign className="w-3 h-3 text-purple-500" />
                      </div>
                      <div className="text-xl font-bold text-gray-900">{projectReserveData.reserveAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">万元</div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-lg p-2 border border-teal-100">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-gray-600">储备率</span>
                        <TrendingUp className="w-3 h-3 text-teal-500" />
                      </div>
                      <div className="text-xl font-bold text-gray-900">{projectReserveData.reserveRate.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">%</div>
                    </div>
                  </div>

                  {/* 储备项目列表 */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-gray-600">重点储备项目（TOP5）</div>
                    {projectReserveData.projects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center justify-center w-4 h-4 bg-green-100 rounded-full text-xs font-bold text-green-700">
                              {index + 1}
                            </div>
                            <span className="text-xs font-medium text-gray-900 truncate">{project.name}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">{project.stage}</span>
                            <span className="text-xs font-medium text-green-600">{project.amount}万元</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 ml-1.5">
                          <div className="w-10 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                project.probability >= 80 ? 'bg-green-500' :
                                project.probability >= 60 ? 'bg-emerald-500' :
                                'bg-orange-500'
                              }`}
                              style={{ width: `${project.probability}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700 w-8 text-right">
                            {project.probability}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI 洞察 */}
              <div className="mt-3 p-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-blue-900 mb-1">AI 智能洞察</div>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      当前项目储备率为{projectReserveData.reserveRate.toFixed(1)}%，距离完成年度目标还存在{projectReserveData.gap.toLocaleString()}万元缺口。
                      细分市场中，{marketSegmentData.find(m => m.achievementRate === Math.max(...marketSegmentData.map(s => s.achievementRate)))?.name}表现最佳（达成率{Math.max(...marketSegmentData.map(s => s.achievementRate)).toFixed(1)}%），
                      而{marketSegmentData.find(m => m.achievementRate === Math.min(...marketSegmentData.map(s => s.achievementRate)))?.name}需加强（达成率{Math.min(...marketSegmentData.map(s => s.achievementRate)).toFixed(1)}%）。
                      建议重点关注{projectReserveData.projects[0].name}和{projectReserveData.projects[1].name}这两个高概率项目，
                      加快推进{projectReserveData.projects[0].stage}和{projectReserveData.projects[1].stage}，
                      预计可带来{projectReserveData.projects[0].amount + projectReserveData.projects[1].amount}万元业绩。
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 月度趋势分析 */}
          <Card className="mb-3 bg-white border border-gray-200 shadow-sm">
            <CardHeader className="py-2.5 px-3">
              <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                月度趋势分析
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-64 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()}万元`, '']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#9ca3af"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="月度目标"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#16a34a"
                      strokeWidth={2.5}
                      name="实际达成"
                      dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#0891b2"
                      strokeWidth={2.5}
                      name="累计达成"
                      dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* AI 智能洞察 */}
              <div className="p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-green-900 mb-1">AI 智能洞察</div>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      今年1-8月累计达成{monthlyTrendData[7].cumulative}万元，完成年度目标的{((monthlyTrendData[7].cumulative / projectReserveData.totalTarget) * 100).toFixed(1)}%。
                      6月表现最佳（{monthlyTrendData[5].actual}万元），超出月度目标{((monthlyTrendData[5].actual / monthlyTrendData[5].target - 1) * 100).toFixed(1)}%。
                      按当前进度，预计全年可达成{Math.round(projectReserveData.totalAchieved / 8 * 12)}万元，完成率约{((projectReserveData.totalAchieved / 8 * 12) / projectReserveData.totalTarget * 100).toFixed(1)}%。
                      建议在9-12月重点推进高概率储备项目，力争达成{projectReserveData.totalTarget}万元年度目标。
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
