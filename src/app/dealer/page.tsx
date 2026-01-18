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

// 项目阶段数据（单位：万元）
const projectStageData = [
  { stage: '跟进中', amount: 1800, count: 45, color: 'blue', icon: 'search' },
  { stage: '已立项', amount: 1200, count: 28, color: 'indigo', icon: 'file' },
  { stage: '已签约', amount: 2400, count: 35, color: 'green', icon: 'check-circle' },
  { stage: '已交付', amount: 2100, count: 32, color: 'orange', icon: 'truck' },
];

const achievementRanking = [
  { rank: 1, name: '华东大区', target: 4500, completed: 2800, shipped: 2600, rate: 62.2, actual: 850, peerAvg: 720, projectCount: 32, trend: 'up' },
  { rank: 2, name: '华北大区', target: 3800, completed: 2100, shipped: 1950, rate: 55.3, actual: 680, peerAvg: 650, projectCount: 28, trend: 'up' },
  { rank: 3, name: '华南大区', target: 3200, completed: 1650, shipped: 1500, rate: 51.6, actual: 520, peerAvg: 500, projectCount: 25, trend: 'down' },
  { rank: 4, name: '华中大区', target: 2500, completed: 1200, shipped: 1100, rate: 48.0, actual: 480, peerAvg: 460, projectCount: 22, trend: 'up' },
  { rank: 5, name: '西南大区', target: 1000, completed: 500, shipped: 450, rate: 50.0, actual: 195, peerAvg: 185, projectCount: 18, trend: 'down' },
];

// 同规模代理商对比数据
const peerComparisonData = {
  achievementRateRanking: [
    { rank: 1, dealerName: '杭州商用净水', achievementRate: 68.5, targetAmount: 15000, actualAmount: 10275 },
    { rank: 2, dealerName: '上海净泉科技', achievementRate: 64.2, targetAmount: 12000, actualAmount: 7704 },
    { rank: 3, dealerName: '南京净源设备', achievementRate: 61.8, targetAmount: 13500, actualAmount: 8343 },
    { rank: 4, dealerName: '苏州清泉实业', achievementRate: 58.5, targetAmount: 11000, actualAmount: 6435 },
    { rank: 5, dealerName: '无锡净水宝', achievementRate: 55.0, targetAmount: 15000, actualAmount: 8250 },
    { rank: 6, dealerName: '常州净康科技', achievementRate: 52.3, targetAmount: 13000, actualAmount: 6799 },
    { rank: 7, dealerName: '宁波净水达人', achievementRate: 49.8, targetAmount: 14500, actualAmount: 7221 },
  ],
  customerCountRanking: [
    { rank: 1, dealerName: '杭州商用净水', customerCount: 5200, newCustomers: 328, growthRate: 6.7 },
    { rank: 2, dealerName: '上海净泉科技', customerCount: 4800, newCustomers: 285, growthRate: 6.3 },
    { rank: 3, dealerName: '南京净源设备', customerCount: 4500, newCustomers: 256, growthRate: 6.0 },
    { rank: 4, dealerName: '苏州清泉实业', customerCount: 4200, newCustomers: 238, growthRate: 6.0 },
    { rank: 5, dealerName: '无锡净水宝', customerCount: 5120, newCustomers: 298, growthRate: 6.2 },
    { rank: 6, dealerName: '常州净康科技', customerCount: 3800, newCustomers: 198, growthRate: 5.5 },
    { rank: 7, dealerName: '宁波净水达人', customerCount: 4100, newCustomers: 228, growthRate: 5.9 },
  ],
  comprehensiveCompetitiveness: {
    myDealer: {
      rank: 5,
      name: '无锡净水宝',
      score: 82.5,
      indicators: {
        achievementRate: 55.0,
        customerSatisfaction: 88.5,
        marketShare: 12.3,
        growthRate: 18.5,
        innovation: 76.0,
      },
    },
    top3: [
      { rank: 1, name: '杭州商用净水', score: 92.8, highlight: '达成率冠军' },
      { rank: 2, name: '上海净泉科技', score: 89.5, highlight: '客户满意度最高' },
      { rank: 3, name: '南京净源设备', score: 86.2, highlight: '市场份额领先' },
    ],
  },
};

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
          </div>

          {/* 同规模代理商对比模块 */}
          <div className="mt-3">
            <Card className="border-2 border-green-200">
              <CardHeader className="py-2 px-3 pb-0">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-green-500" />
                  同规模代理商对比
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* 达成率排名 */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs font-medium text-gray-700">达成率排名</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-green-600">
                        {peerComparisonData.comprehensiveCompetitiveness.myDealer.rank}
                      </span>
                      <span className="text-xs text-gray-600">名</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-600">达成率</span>
                      <span className="text-sm font-bold text-green-600">
                        {peerComparisonData.comprehensiveCompetitiveness.myDealer.indicators.achievementRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      同行平均 68.5%
                    </div>
                  </div>

                  {/* 客户数量排名 */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs font-medium text-gray-700">客户数量排名</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-green-600">
                        {peerComparisonData.comprehensiveCompetitiveness.myDealer.rank}
                      </span>
                      <span className="text-xs text-gray-600">名</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-600">客户数</span>
                      <span className="text-sm font-bold text-green-600">
                        {peerComparisonData.customerCountRanking.find(d => d.dealerName === peerComparisonData.comprehensiveCompetitiveness.myDealer.name)?.customerCount.toLocaleString() || '5120'}
                      </span>
                      <span className="text-xs text-gray-600">个</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      新增 +298 | 增长率 6.2%
                    </div>
                  </div>

                  {/* 综合竞争力 */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-2 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-medium text-gray-700">综合竞争力</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-600">
                        {peerComparisonData.comprehensiveCompetitiveness.myDealer.score}
                      </span>
                      <span className="text-xs text-gray-600">分</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-600">排名</span>
                      <span className="text-sm font-bold text-blue-600">
                        {peerComparisonData.comprehensiveCompetitiveness.myDealer.rank}
                      </span>
                      <span className="text-xs text-gray-600">/ 7</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      满意度 88.5% | 增长 18.5%
                    </div>
                  </div>

                  {/* 市场份额 */}
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-2 border border-amber-200">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-xs font-medium text-gray-700">市场份额</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-amber-600">
                        {peerComparisonData.comprehensiveCompetitiveness.myDealer.indicators.marketShare}
                      </span>
                      <span className="text-xs text-gray-600">%</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-600">同比增长</span>
                      <span className="text-sm font-bold text-green-600">
                        +{peerComparisonData.comprehensiveCompetitiveness.myDealer.indicators.growthRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      TOP 1: 18.2%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 左右两列布局：月度趋势分析 + 项目阶段统计 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
            {/* 月度趋势分析模块 - 左侧 */}
            <div className="lg:col-span-1 h-full">
            <Card className="border-2 border-green-200 h-full flex flex-col">
              <CardHeader className="py-2 px-3 pb-0">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  月度趋势分析
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3 flex-1">
                <div className="space-y-2">
                  {/* AI智能洞察 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3.5 border border-green-100">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          AI智能洞察
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                            <Sparkles className="w-2.5 h-2.5" />
                            自动分析
                          </span>
                        </h3>
                        <div className="space-y-1.5">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 leading-relaxed">
                              整体呈现<span className="font-semibold text-green-600">上升趋势</span>，从年初46.4%提升至66.0%，<span className="font-semibold">8月表现最佳</span>（达成率68.8%）
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Activity className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 leading-relaxed">
                              Q2-Q3稳定向好，连续7个月达成率超60%，<span className="font-semibold text-orange-600">Q1需关注</span>（3个月均未达标）
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Target className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 leading-relaxed">
                              建议：加强Q1前期项目储备，目标将年均达成率提升至<span className="font-semibold text-green-600">70%以上</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 折线图 */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        达成率趋势折线图
                      </h4>
                      <span className="text-xs text-gray-500">年度平均：{(monthlyTrendData.reduce((sum, item) => sum + item.achievement, 0) / monthlyTrendData.length).toFixed(1)}%</span>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#6B7280' }}
                        />
                        <YAxis
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#6B7280' }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value: number) => [`${value.toFixed(1)}%`, '达成率']}
                          labelFormatter={(label) => `${label}达成率`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            fontSize: '12px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="achievement"
                          stroke="#22C55E"
                          strokeWidth={2}
                          dot={{ fill: '#22C55E', strokeWidth: 2, r: 3 }}
                          activeDot={{ fill: '#22C55E', strokeWidth: 2, r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey={(item) => 100}
                          stroke="#E5E7EB"
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-2 flex items-center justify-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-0.5 bg-green-500"></span>
                        实际达成率
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-0.5 bg-gray-300 border-dashed" style={{ borderStyle: 'dashed' }}></span>
                        目标线100%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 项目阶段统计模块 - 右侧 */}
          <div className="lg:col-span-1 h-full">
            <Card className="border-2 border-green-200 h-full flex flex-col">
              <CardHeader className="py-2 px-3 pb-0">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-green-500" />
                  项目阶段统计
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3 flex-1">
                <div className="space-y-1.5">
                  {projectStageData.map((item, index) => {
                    const totalAmount = projectStageData.reduce((sum, p) => sum + p.amount, 0);
                    const percentage = (item.amount / totalAmount * 100);
                    const colorMap: any = {
                      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', bar: 'bg-blue-500', icon: Search },
                      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', bar: 'bg-indigo-500', icon: FileText },
                      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', bar: 'bg-green-500', icon: CheckCircle },
                      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', bar: 'bg-orange-500', icon: Truck },
                      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', bar: 'bg-purple-500', icon: DollarSign },
                    };
                    const colors = colorMap[item.color as keyof typeof colorMap];
                    const IconComponent = colors.icon;

                    return (
                      <div key={index} className={`${colors.bg} rounded-lg p-2.5 border ${colors.border}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-7 h-7 ${colors.bg.replace('50', '100')} rounded-lg flex items-center justify-center`}>
                              <IconComponent className="w-3.5 h-3.5 ${colors.text}" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{item.stage}</span>
                          </div>
                          <span className={`text-base font-bold ${colors.text}`}>{item.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors.bar} rounded-full transition-all`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500">
                          项目数量：<span className="font-medium text-gray-700">{item.count}个</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">项目总金额</span>
                    <span className="font-bold text-gray-900">
                      {projectStageData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}万元
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-0.5">
                    <span className="text-gray-500">项目总数</span>
                    <span className="font-bold text-gray-900">
                      {projectStageData.reduce((sum, item) => sum + item.count, 0)}个
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
