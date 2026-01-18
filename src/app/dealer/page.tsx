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

// 项目预警数据
const projectRiskData = [
  {
    id: 1,
    projectName: 'XX大学智慧饮水项目',
    customerName: 'XX大学',
    amount: 280,
    stage: '启动采购',
    reason: '采购流程停滞超30天，预算可能被削减',
    suggestion: '立即联系采购负责人了解最新情况，提供优惠方案，推进采购流程',
    level: 'red',
  },
  {
    id: 2,
    projectName: 'AA高铁站饮水设备',
    customerName: 'AA高铁站',
    amount: 380,
    stage: '项目报备',
    reason: '竞争对手已提交低价方案，价格优势不足',
    suggestion: '快速优化产品配置方案，强化服务优势，安排高层拜访',
    level: 'yellow',
  },
  {
    id: 3,
    projectName: 'YY市政府办公饮水项目',
    customerName: 'YY市政府',
    amount: 450,
    stage: '方案提交',
    reason: '决策周期长，方案评审进度缓慢',
    suggestion: '持续跟进评审进度，补充技术说明材料，安排专家答疑',
    level: 'yellow',
  },
  {
    id: 4,
    projectName: 'ZZ医院饮水系统项目',
    customerName: 'ZZ医院',
    amount: 320,
    stage: '初次拜访',
    reason: '关键决策人更换，需重新建立关系',
    suggestion: '快速了解新决策人背景和偏好，制定针对性拜访计划',
    level: 'blue',
  },
  {
    id: 5,
    projectName: 'BB工业园水处理项目',
    customerName: 'BB工业园',
    amount: 520,
    stage: '方案提交',
    reason: '技术方案存在不确定因素，需进一步确认',
    suggestion: '安排技术专家现场勘察，完善技术方案细节',
    level: 'blue',
  },
  {
    id: 6,
    projectName: 'CC中学饮水设备项目',
    customerName: 'CC中学',
    amount: 180,
    stage: '合同签署',
    reason: '合同条款存在争议，签署时间可能延迟',
    suggestion: '与法务部门协商，寻求折中方案，加快合同签署',
    level: 'blue',
  },
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
              目标达成
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
              {/* 细分市场标题 */}
              <div className="mb-1 flex items-center gap-4">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-green-600" />
                  细分市场业绩达成与项目储备
                </h2>
                <div className="flex items-center gap-4">
                  {/* 市场覆盖 */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">市场覆盖</span>
                    <span className="text-sm font-bold text-green-600">5个</span>
                  </div>
                  {/* 储备项目 */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Package className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">储备项目</span>
                    <span className="text-sm font-bold text-green-600">85个</span>
                  </div>
                </div>
              </div>
              <Card className="bg-white border border-gray-200 shadow-sm h-full">
                <CardContent className="p-2">
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
          {/* 月度趋势分析标题 */}
          <div className="mb-1 flex items-center gap-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-green-600" />
              月度趋势分析
            </h2>
            <div className="flex items-center gap-4">
              {/* 累计达成 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">累计达成</span>
                <span className="text-sm font-bold text-green-600">¥7,240万</span>
              </div>
              {/* 同比增长 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">同比增长</span>
                <span className="text-sm font-bold text-green-600">+18.5%</span>
              </div>
            </div>
          </div>
          <Card className="mb-1 bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-2">
              <div className="h-72 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData}>
                    <defs>
                      <linearGradient id="gradientTarget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradientActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradientCumulative" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f0f0f0" strokeOpacity={0.6} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                      axisLine={{ stroke: '#f0f0f0' }}
                      tickLine={{ stroke: '#f0f0f0' }}
                      dy={5}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}`}
                      dx={-8}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        padding: '12px 16px',
                        fontSize: '13px',
                      }}
                      formatter={(value: number, name: string) => {
                        const color = name === '月度目标' ? '#9ca3af' : name === '实际达成' ? '#16a34a' : '#0891b2';
                        return [<span style={{ color: color, fontWeight: 600 }}>{`${value.toLocaleString()}万元`}</span>, name];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '13px', paddingTop: '12px', fontWeight: 500 }}
                      iconType="circle"
                      height={36}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#9ca3af"
                      strokeWidth={2}
                      strokeDasharray="6 4"
                      name="月度目标"
                      dot={false}
                      opacity={0.6}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#16a34a"
                      strokeWidth={3}
                      name="实际达成"
                      dot={{ fill: '#16a34a', strokeWidth: 3, r: 5, fillOpacity: 1 }}
                      activeDot={{ r: 7, strokeWidth: 3, fill: '#16a34a' }}
                      fillOpacity={1}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#0891b2"
                      strokeWidth={3}
                      name="累计达成"
                      dot={{ fill: '#0891b2', strokeWidth: 3, r: 5, fillOpacity: 1 }}
                      activeDot={{ r: 7, strokeWidth: 3, fill: '#0891b2' }}
                      fillOpacity={1}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        <TabsContent value="risks">
          {/* 风险预警标题 */}
          <div className="mb-1 flex items-center gap-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              项目预警
            </h2>
            <div className="flex items-center gap-4">
              {/* 总项目数 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <FileText className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-700">预警项目</span>
                <span className="text-sm font-bold text-red-600">{projectRiskData.length}个</span>
              </div>
              {/* 涉及金额 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <DollarSign className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-700">涉及金额</span>
                <span className="text-sm font-bold text-red-600">¥{projectRiskData.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}万</span>
              </div>
            </div>
          </div>

          {/* 项目预警列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {projectRiskData.map((project) => (
              <Card
                key={project.id}
                className={`border-2 ${
                  project.level === 'red'
                    ? 'border-red-300 hover:border-red-400 hover:shadow-lg hover:shadow-red-100/50'
                    : project.level === 'yellow'
                    ? 'border-yellow-300 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-100/50'
                    : 'border-blue-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100/50'
                } transition-all duration-300`}
              >
                <CardContent className="p-3">
                  {/* 项目名称和预警级别 */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-1">{project.projectName}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">客户：</span>
                        <span className="text-xs font-medium text-gray-700">{project.customerName}</span>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        project.level === 'red'
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : project.level === 'yellow'
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                          : 'bg-blue-100 text-blue-700 border border-blue-300'
                      }`}
                    >
                      {project.level === 'red' ? '红色预警' : project.level === 'yellow' ? '黄色预警' : '蓝色预警'}
                    </div>
                  </div>

                  {/* 项目信息 */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">金额：</span>
                      <span className="text-xs font-bold text-gray-900">¥{project.amount}万</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">阶段：</span>
                      <span className="text-xs font-medium text-gray-900">{project.stage}</span>
                    </div>
                  </div>

                  {/* 预警原因 */}
                  <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-1.5">
                      <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                        project.level === 'red'
                          ? 'text-red-500'
                          : project.level === 'yellow'
                          ? 'text-yellow-500'
                          : 'text-blue-500'
                      }`} />
                      <div>
                        <span className="text-xs font-medium text-gray-700">预警原因：</span>
                        <p className="text-xs text-gray-600 mt-0.5">{project.reason}</p>
                      </div>
                    </div>
                  </div>

                  {/* 建议措施 */}
                  <div className="p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-green-600" />
                      <div>
                        <span className="text-xs font-medium text-gray-700">建议措施：</span>
                        <p className="text-xs text-gray-600 mt-0.5">{project.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
