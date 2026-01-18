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
  { name: '教育', target: 1500, achieved: 1280, achievementRate: 85.3, growthRate: 15.2, projectReserve: { count: 18, amount: 420 } },
  { name: '政企办公', target: 1200, achieved: 980, achievementRate: 81.7, growthRate: 12.8, projectReserve: { count: 15, amount: 350 } },
  { name: '公共交通', target: 900, achieved: 620, achievementRate: 68.9, growthRate: -2.5, projectReserve: { count: 12, amount: 280 } },
  { name: '医疗饮水', target: 800, achieved: 580, achievementRate: 72.5, growthRate: 5.3, projectReserve: { count: 10, amount: 230 } },
  { name: '水处理', target: 600, achieved: 340, achievementRate: 56.7, growthRate: -8.2, projectReserve: { count: 5, amount: 120 } },
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
      <header className="mb-1">
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
      <div className="mb-1 flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
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
        <TabsList className="w-full mb-1 h-10 bg-white border border-gray-200 rounded-xl shadow-sm p-1">
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
          <div className="mb-1 flex items-center gap-4">
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

          {/* 横向布局：KPI卡片 + 细分市场 */}
          <div className="flex flex-col xl:flex-row gap-1">
            {/* KPI卡片 */}
            <div className="xl:w-2/5">
              <div className="grid grid-cols-7 gap-1">
                {/* 目标金额 */}
                <Card className="bg-white border-2 border-green-200">
                  <CardContent className="p-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <Target className="w-2.5 h-2.5 text-green-500" />
                        <span>{timeRangeLabel}目标</span>
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-1 py-0.5 rounded">
                        {timeRange === 'month' ? '1月' : timeRange === 'quarter' ? 'Q1' : '2026'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-0.5">
                      <span className="text-2xl font-bold text-gray-900 leading-tight">{currentRangeData.target.toLocaleString()}</span>
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
                      <span className="text-2xl font-bold text-teal-600 leading-tight">{currentRangeData.shipped.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">万元</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-green-600 mt-0.5">
                      <ArrowUp className="w-2 h-2" />
                      <span>+126万</span>
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
                      <span className="text-2xl font-bold text-blue-600 leading-tight">{currentRangeData.achievementRate.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">%</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-orange-600 mt-0.5">
                      <TrendingDown className="w-2 h-2" />
                      <span>-{((100 - currentRangeData.achievementRate)).toFixed(1)}%</span>
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
                      <span className="text-2xl font-bold text-purple-600 leading-tight">{currentRangeData.terminalUserCount.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">个</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-green-600 mt-0.5">
                      <ArrowUp className="w-2 h-2" />
                      <span>+48个</span>
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
                      <span className="text-2xl font-bold text-green-600 leading-tight">{peerComparisonData.achievementRateRanking}</span>
                      <span className="text-xs text-gray-400">名</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-gray-500 mt-0.5">
                      <span>均68.5%</span>
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
                      <span className="text-2xl font-bold text-emerald-600 leading-tight">{peerComparisonData.customerCountRanking}</span>
                      <span className="text-xs text-gray-400">名</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-gray-500 mt-0.5">
                      <span>5120个</span>
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
                      <span className="text-2xl font-bold text-blue-600 leading-tight">{peerComparisonData.comprehensiveCompetitiveness.score}</span>
                      <span className="text-xs text-gray-400">分</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-gray-500 mt-0.5">
                      <span>#{peerComparisonData.comprehensiveCompetitiveness.rank}/7</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 细分市场业绩达成与项目储备 */}
            <div className="xl:w-3/5">
              <Card className="bg-white border border-gray-200 shadow-sm h-full">
                <CardHeader className="py-px px-3">
                  <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-green-600" />
                    细分市场业绩达成与项目储备
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-2 pt-0">
                  {/* 细分市场卡片 - 横向一行展示 */}
                  <div className="grid grid-cols-5 gap-1">
                    {marketSegmentData.map((segment, index) => (
                      <div
                        key={index}
                        className="p-2.5 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300"
                        style={{ backgroundColor: index % 2 === 0 ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)' : 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)' }}
                      >
                        {/* 市场名称 */}
                        <div className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-sm"></div>
                          {segment.name}
                        </div>

                        {/* 年度目标 */}
                        <div className="mb-1.5">
                          <div className="text-xs text-gray-500 mb-0.5">年度目标</div>
                          <div className="text-sm font-bold text-gray-900">
                            ¥{segment.target.toLocaleString()}万
                          </div>
                        </div>

                        {/* 已达成 */}
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 mb-0.5">已达成</div>
                          <div className="text-sm font-bold text-teal-700">
                            ¥{segment.achieved.toLocaleString()}万
                          </div>
                        </div>

                        {/* 达成率进度条 */}
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 mb-1">达成率</div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                segment.achievementRate >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                segment.achievementRate >= 60 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                                segment.achievementRate >= 40 ? 'bg-gradient-to-r from-orange-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-rose-500'
                              }`}
                              style={{ width: `${segment.achievementRate}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs font-bold ${
                              segment.achievementRate >= 80 ? 'text-green-600' :
                              segment.achievementRate >= 60 ? 'text-emerald-600' :
                              segment.achievementRate >= 40 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {segment.achievementRate.toFixed(1)}%
                            </span>
                            <span className={`text-xs font-medium ${
                              segment.achievementRate >= 80 ? 'text-green-500' :
                              segment.achievementRate >= 60 ? 'text-emerald-500' :
                              segment.achievementRate >= 40 ? 'text-orange-500' : 'text-red-500'
                            }`}>
                              {segment.achievementRate >= 80 ? '优秀' :
                               segment.achievementRate >= 60 ? '良好' :
                               segment.achievementRate >= 40 ? '一般' : '需努力'}
                            </span>
                          </div>
                        </div>

                        {/* 同比涨跌 */}
                        <div className="flex items-center gap-1 mb-2">
                          {segment.growthRate >= 0 ? (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
                              <ArrowUp className="w-3 h-3 text-green-600" />
                              <span className="text-xs font-bold text-green-700">
                                {Math.abs(segment.growthRate).toFixed(1)}%
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-red-100 rounded-full">
                              <ArrowDown className="w-3 h-3 text-red-600" />
                              <span className="text-xs font-bold text-red-700">
                                {Math.abs(segment.growthRate).toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 项目储备 */}
                        <div className="pt-1.5 border-t border-gray-300">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">项目储备</span>
                            <div className="text-right">
                              <span className="text-xs font-bold text-purple-600">{segment.projectReserve.count}个</span>
                              <span className="text-xs text-gray-400 mx-1">/</span>
                              <span className="text-xs font-bold text-blue-600">¥{segment.projectReserve.amount}万</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>


          {/* 月度趋势分析 */}
          <Card className="mb-1 bg-white border border-gray-200 shadow-sm">
            <CardHeader className="py-px px-3">
              <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                月度趋势分析
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-2 pt-0">
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
