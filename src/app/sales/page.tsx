'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Heart, Shield, Clock, Database, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AIInsight } from '@/components/ai-insight';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';

// 页面标题
const PAGE_TITLE = 'AO经营看板';

// 模拟数据（单位：万元）
const kpiData = {
  target: 1428,
  completed: 677,
  // 未来预计完成 = 已完成 + 在跟进项目预计可完成
  futurePredicted: 650.3,
  // 任务缺口 = 目标 - 未来预计完成
  taskGap: 777.7,
  currentHealthIndex: 47.4,
  gapTrend: -54.5,
  completedTrend: -8.3,
  predictedTrend: -12.2,
  healthTrend: -10.5,

  // 缺口分析相关数据
  // 在跟进项目总金额（不是全部能完成）
  followingProjectsTotal: 5600,
  // 在跟进项目预计可完成（转化率约20%）
  followingProjectsPredicted: -26.7, // 650.3 - 677 = -26.7
  // 还需新开拓 = 目标 - 已完成 - 在跟进预计
  needNewProjects: 777.7, // 1428 - 677 - (-26.7) = 777.7
  // 转化率
  conversionRate: 0.0, // -26.7 / 5600 * 100
};

// 不同时间维度的预测数据
const timeRangeData = {
  month: {
    target: 1428,
    completed: 677,
    predicted: 650.3,
    gap: 777.7,
    canComplete: false,
    risk: 'high',
  },
  quarter: {
    target: 4284,
    completed: 2031,
    predicted: 1950.9,
    gap: 2333.1,
    canComplete: false,
    risk: 'high',
  },
  year: {
    target: 17136,
    completed: 8124,
    predicted: 7803.6,
    gap: 9332.4,
    canComplete: false,
    risk: 'high',
  },
};

// 大区维度数据
const regionData = {
  month: [
    { name: '一区', owner: '王泽', target: 320, completed: 65, predicted: 110, gap: 210, rate: 20.3, trend: 'down' },
    { name: '二区', owner: '陈超', target: 232, completed: 100, predicted: 100, gap: 132, rate: 43.1, trend: 'down' },
    { name: '五区', owner: '张大鹏', target: 260, completed: 120, predicted: 100.4, gap: 159.6, rate: 46.2, trend: 'down' },
    { name: '华中', owner: '刘邦军', target: 152, completed: 152, predicted: 150, gap: 2, rate: 100.0, trend: 'up' },
    { name: '华北、西北', owner: '康帅', target: 160, completed: 120, predicted: 69.1, gap: 90.9, rate: 75.0, trend: 'down' },
    { name: '西南', owner: '钟莲', target: 128, completed: 20, predicted: 10.8, gap: 117.2, rate: 15.6, trend: 'down' },
    { name: '华南', owner: '徐婷婷', target: 176, completed: 100, predicted: 110, gap: 66, rate: 56.8, trend: 'down' },
  ],
  quarter: [
    { name: '一区', owner: '王泽', target: 960, completed: 195, predicted: 330, gap: 630, rate: 20.3, trend: 'down' },
    { name: '二区', owner: '陈超', target: 696, completed: 300, predicted: 300, gap: 396, rate: 43.1, trend: 'down' },
    { name: '五区', owner: '张大鹏', target: 780, completed: 360, predicted: 301.2, gap: 478.8, rate: 46.2, trend: 'down' },
    { name: '华中', owner: '刘邦军', target: 456, completed: 456, predicted: 450, gap: 6, rate: 100.0, trend: 'up' },
    { name: '华北、西北', owner: '康帅', target: 480, completed: 360, predicted: 207.3, gap: 272.7, rate: 75.0, trend: 'down' },
    { name: '西南', owner: '钟莲', target: 384, completed: 60, predicted: 32.4, gap: 351.6, rate: 15.6, trend: 'down' },
    { name: '华南', owner: '徐婷婷', target: 528, completed: 300, predicted: 330, gap: 198, rate: 56.8, trend: 'down' },
  ],
  year: [
    { name: '一区', owner: '王泽', target: 3840, completed: 780, predicted: 1320, gap: 2520, rate: 20.3, trend: 'down' },
    { name: '二区', owner: '陈超', target: 2784, completed: 1200, predicted: 1200, gap: 1584, rate: 43.1, trend: 'down' },
    { name: '五区', owner: '张大鹏', target: 3120, completed: 1440, predicted: 1204.8, gap: 1915.2, rate: 46.2, trend: 'down' },
    { name: '华中', owner: '刘邦军', target: 1824, completed: 1824, predicted: 1800, gap: 24, rate: 100.0, trend: 'up' },
    { name: '华北、西北', owner: '康帅', target: 1920, completed: 1440, predicted: 829.2, gap: 1090.8, rate: 75.0, trend: 'down' },
    { name: '西南', owner: '钟莲', target: 1536, completed: 240, predicted: 129.6, gap: 1406.4, rate: 15.6, trend: 'down' },
    { name: '华南', owner: '徐婷婷', target: 2112, completed: 1200, predicted: 1320, gap: 792, rate: 56.8, trend: 'down' },
  ],
};

// 城市维度数据
const cityData = {
  month: {
    '一区': [
      { name: '北京', owner: '王泽', target: 180, completed: 35, predicted: 65, gap: 115, rate: 19.4 },
      { name: '天津', owner: '王泽', target: 140, completed: 30, predicted: 45, gap: 95, rate: 21.4 },
    ],
    '二区': [
      { name: '上海', owner: '陈超', target: 132, completed: 55, predicted: 55, gap: 77, rate: 41.7 },
      { name: '苏州', owner: '陈超', target: 100, completed: 45, predicted: 45, gap: 55, rate: 45.0 },
    ],
    '五区': [
      { name: '广州', owner: '张大鹏', target: 150, completed: 70, predicted: 58, gap: 92, rate: 46.7 },
      { name: '深圳', owner: '张大鹏', target: 110, completed: 50, predicted: 42.4, gap: 67.6, rate: 45.5 },
    ],
    '华中': [
      { name: '武汉', owner: '刘邦军', target: 80, completed: 80, predicted: 78, gap: 2, rate: 100.0 },
      { name: '长沙', owner: '刘邦军', target: 72, completed: 72, predicted: 72, gap: 0, rate: 100.0 },
    ],
    '华北、西北': [
      { name: '石家庄', owner: '康帅', target: 90, completed: 65, predicted: 38, gap: 52, rate: 72.2 },
      { name: '太原', owner: '康帅', target: 70, completed: 55, predicted: 31.1, gap: 38.9, rate: 78.6 },
    ],
    '西南': [
      { name: '成都', owner: '钟莲', target: 75, completed: 12, predicted: 6.3, gap: 68.7, rate: 16.0 },
      { name: '重庆', owner: '钟莲', target: 53, completed: 8, predicted: 4.5, gap: 48.5, rate: 15.1 },
    ],
    '华南': [
      { name: '南宁', owner: '徐婷婷', target: 96, completed: 55, predicted: 60, gap: 36, rate: 57.3 },
      { name: '昆明', owner: '徐婷婷', target: 80, completed: 45, predicted: 50, gap: 30, rate: 56.3 },
    ],
  },
  quarter: {
    '一区': [
      { name: '北京', owner: '王泽', target: 540, completed: 105, predicted: 195, gap: 345, rate: 19.4 },
      { name: '天津', owner: '王泽', target: 420, completed: 90, predicted: 135, gap: 285, rate: 21.4 },
    ],
    '二区': [
      { name: '上海', owner: '陈超', target: 396, completed: 165, predicted: 165, gap: 231, rate: 41.7 },
      { name: '苏州', owner: '陈超', target: 300, completed: 135, predicted: 135, gap: 165, rate: 45.0 },
    ],
    '五区': [
      { name: '广州', owner: '张大鹏', target: 450, completed: 210, predicted: 174, gap: 276, rate: 46.7 },
      { name: '深圳', owner: '张大鹏', target: 330, completed: 150, predicted: 127.2, gap: 202.8, rate: 45.5 },
    ],
    '华中': [
      { name: '武汉', owner: '刘邦军', target: 240, completed: 240, predicted: 234, gap: 6, rate: 100.0 },
      { name: '长沙', owner: '刘邦军', target: 216, completed: 216, predicted: 216, gap: 0, rate: 100.0 },
    ],
    '华北、西北': [
      { name: '石家庄', owner: '康帅', target: 270, completed: 195, predicted: 114, gap: 156, rate: 72.2 },
      { name: '太原', owner: '康帅', target: 210, completed: 165, predicted: 93.3, gap: 116.7, rate: 78.6 },
    ],
    '西南': [
      { name: '成都', owner: '钟莲', target: 225, completed: 36, predicted: 18.9, gap: 206.1, rate: 16.0 },
      { name: '重庆', owner: '钟莲', target: 159, completed: 24, predicted: 13.5, gap: 145.5, rate: 15.1 },
    ],
    '华南': [
      { name: '南宁', owner: '徐婷婷', target: 288, completed: 165, predicted: 180, gap: 108, rate: 57.3 },
      { name: '昆明', owner: '徐婷婷', target: 240, completed: 135, predicted: 150, gap: 90, rate: 56.3 },
    ],
  },
  year: {
    '一区': [
      { name: '北京', owner: '王泽', target: 2160, completed: 420, predicted: 780, gap: 1380, rate: 19.4 },
      { name: '天津', owner: '王泽', target: 1680, completed: 360, predicted: 540, gap: 1140, rate: 21.4 },
    ],
    '二区': [
      { name: '上海', owner: '陈超', target: 1584, completed: 660, predicted: 660, gap: 924, rate: 41.7 },
      { name: '苏州', owner: '陈超', target: 1200, completed: 540, predicted: 540, gap: 660, rate: 45.0 },
    ],
    '五区': [
      { name: '广州', owner: '张大鹏', target: 1800, completed: 840, predicted: 696, gap: 1104, rate: 46.7 },
      { name: '深圳', owner: '张大鹏', target: 1320, completed: 600, predicted: 508.8, gap: 811.2, rate: 45.5 },
    ],
    '华中': [
      { name: '武汉', owner: '刘邦军', target: 960, completed: 960, predicted: 936, gap: 24, rate: 100.0 },
      { name: '长沙', owner: '刘邦军', target: 864, completed: 864, predicted: 864, gap: 0, rate: 100.0 },
    ],
    '华北、西北': [
      { name: '石家庄', owner: '康帅', target: 1080, completed: 780, predicted: 456, gap: 624, rate: 72.2 },
      { name: '太原', owner: '康帅', target: 840, completed: 660, predicted: 373.2, gap: 466.8, rate: 78.6 },
    ],
    '西南': [
      { name: '成都', owner: '钟莲', target: 900, completed: 144, predicted: 75.6, gap: 824.4, rate: 16.0 },
      { name: '重庆', owner: '钟莲', target: 636, completed: 96, predicted: 54, gap: 582, rate: 15.1 },
    ],
    '华南': [
      { name: '南宁', owner: '徐婷婷', target: 1152, completed: 660, predicted: 720, gap: 432, rate: 57.3 },
      { name: '昆明', owner: '徐婷婷', target: 960, completed: 540, predicted: 600, gap: 360, rate: 56.3 },
    ],
  },
};

const riskLevel = kpiData.currentHealthIndex < 60 || kpiData.taskGap > 900 ? 'high' : kpiData.taskGap > 500 ? 'medium' : 'low';

const getGapColor = () => {
  if (riskLevel === 'high') return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-600' };
  if (riskLevel === 'medium') return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-600' };
  return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-600' };
};

const getHealthColor = (value: number) => {
  if (value >= 80) return 'green';
  if (value >= 60) return 'yellow';
  return 'red';
};


export default function SalesDashboard() {
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [viewLevel, setViewLevel] = useState<'region' | 'city'>('region');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
    setViewLevel('city');
  };

  const handleBack = () => {
    setViewLevel('region');
    setSelectedRegion('');
  };

  const currentData = viewLevel === 'city'
    ? (cityData[timeRange as keyof typeof cityData] as any)[selectedRegion] || []
    : regionData[timeRange as keyof typeof regionData];

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
              <h1 className="text-2xl font-bold text-gray-900">AO经营看板</h1>
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

      {/* 筛选器 */}
      <div className="mb-3 flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">时间范围：</span>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="month">月度</option>
          <option value="quarter">季度</option>
          <option value="year">年度</option>
        </select>
        <span className="text-sm font-medium text-gray-700 ml-4">行业筛选：</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部行业</option>
          <option value="catering">餐饮行业</option>
          <option value="retail">零售行业</option>
          <option value="hotel">酒店行业</option>
        </select>
      </div>

      {/* Tab页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-3 h-10 bg-white border border-gray-200 rounded-xl shadow-sm p-1">
          <TabsTrigger value="overview" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              经营总览
            </span>
          </TabsTrigger>
          <TabsTrigger value="distributors" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              经销商
            </span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              项目
            </span>
          </TabsTrigger>
          <TabsTrigger value="salesmen" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              业务员
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* 经营总览标题 */}
          <div className="mb-4 flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              经营总览
            </h2>
            <div className="flex items-center gap-4">
              {/* 健康指数 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Heart className={`w-4 h-4 ${getHealthColor(kpiData.currentHealthIndex) === 'green' ? 'text-green-500' : getHealthColor(kpiData.currentHealthIndex) === 'yellow' ? 'text-yellow-500' : 'text-red-500'}`} />
                <span className="text-sm text-gray-700">健康值</span>
                <span className={`text-sm font-bold ${getHealthColor(kpiData.currentHealthIndex) === 'green' ? 'text-green-600' : getHealthColor(kpiData.currentHealthIndex) === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {kpiData.currentHealthIndex.toFixed(1)}
                </span>
              </div>
              {/* 风险等级 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Shield className={`w-4 h-4 ${riskLevel === 'high' ? 'text-red-500' : riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                <span className="text-sm text-gray-700">风险</span>
                <span className={`text-sm font-bold ${riskLevel === 'high' ? 'text-red-600' : riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {riskLevel === 'high' ? '高风险' : riskLevel === 'medium' ? '中风险' : '低风险'}
                </span>
              </div>
            </div>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {/* 目标 */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                  <Target className="w-3 h-3 text-blue-500" />
                  <span>目标</span>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">1,428</span>
                <span className="text-sm text-gray-400">万元</span>
              </div>
            </CardContent>
          </Card>

          {/* 已完成 */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-2.5">
              <div className="text-sm font-medium text-gray-500">已完成</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">677</span>
                <span className="text-sm text-gray-400">万元</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <ArrowDown className="w-3 h-3" />
                <span>-8.3%</span>
              </div>
            </CardContent>
          </Card>

          {/* 未来预计完成 */}
          <Card className="bg-white border border-blue-300 border-dashed">
            <CardContent className="p-2.5">
              <div className="text-sm font-medium text-gray-500">未来预计完成</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-blue-600">650.3</span>
                <span className="text-sm text-gray-400">万元</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <ArrowDown className="w-3 h-3" />
                <span>-12.2%</span>
              </div>
            </CardContent>
          </Card>

          {/* 任务缺口 */}
          <Card className="bg-white border-2 border-red-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">任务缺口</div>
                <AlertTriangle className="w-3 h-3 text-red-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-red-600">777.7</span>
                <span className="text-sm text-gray-400">万元</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <ArrowDown className="w-3 h-3" />
                <span>-54.5%</span>
              </div>
            </CardContent>
          </Card>

          {/* 项目储备 */}
          <Card className="bg-white border-2 border-purple-300">
            <CardContent className="p-2.5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">项目储备</div>
                <Database className="w-3 h-3 text-purple-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-purple-600">1,200</span>
                <span className="text-sm text-gray-400">万元</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-red-600 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  <span>储备不足</span>
                </div>
                <span className="text-sm text-gray-500">缺口¥1,200万</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 区域达成情况 */}
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* 左侧：表格 */}
          <Card className="lg:col-span-2 border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-3">
              {/* 标题 */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  {viewLevel === 'city' && (
                    <>
                      <button
                        onClick={handleBack}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 mr-1"
                      >
                        ← 返回大区
                      </button>
                      <span className="text-gray-400 mx-1">/</span>
                    </>
                  )}
                  <span className="text-sm font-bold text-gray-900">
                    {viewLevel === 'city' ? `${selectedRegion}` : '区域达成情况'}
                  </span>
                  {viewLevel === 'region' && (
                    <span className="text-sm font-bold text-gray-900 ml-1">({timeRange === 'month' ? '1月' : timeRange === 'quarter' ? 'Q1' : '2026年'})</span>
                  )}
                </div>
              </div>

              {/* 大区维度表格 */}
              <div className="bg-white rounded-lg border-0 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">
                        {viewLevel === 'city' ? '城市' : '大区'}
                        {viewLevel === 'region' && (
                          <span className="ml-1 text-xs text-blue-500 font-normal">（点击查看）</span>
                        )}
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-500">责任人</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">目标</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">已完成</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">预计</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">缺口</th>
                      <th className="px-2 py-2 text-center text-sm font-medium text-gray-500">达成率</th>
                      <th className="px-1 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item: any, index: number) => (
                      <tr
                        key={index}
                        onClick={() => viewLevel === 'region' ? handleRegionClick(item.name) : undefined}
                        className={`group border-b border-gray-50 last:border-0 ${viewLevel === 'region' ? 'cursor-pointer hover:bg-blue-50 hover:border-l-4 hover:border-l-blue-500' : ''}`}
                      >
                        <td className="px-3 py-2.5 text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          <div className="flex items-center gap-2">
                            {viewLevel === 'region' && (
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                            )}
                            {item.name}
                          </div>
                        </td>
                        <td className="px-2 py-2.5 text-sm text-gray-500">{item.owner}</td>
                        <td className="px-2 py-2.5 text-sm text-right text-gray-600">{item.target.toLocaleString()}</td>
                        <td className="px-2 py-2.5 text-sm text-right text-gray-600">{item.completed.toLocaleString()}</td>
                        <td className="px-2 py-2.5 text-sm text-right text-gray-600">{item.predicted.toLocaleString()}</td>
                        <td className={`px-2 py-2.5 text-sm text-right font-semibold ${item.gap > 0 ? 'text-red-500' : item.gap === 0 ? 'text-gray-600' : 'text-green-500'}`}>
                          {item.gap > 0 ? `${item.gap}` : item.gap === 0 ? '0' : `+${Math.abs(item.gap)}`}
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
                            <span className={`text-sm font-bold ${
                              item.rate >= 100 ? 'text-green-600' : item.rate >= 80 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {item.rate.toFixed(1)}%
                            </span>
                            <div className="w-8 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  item.rate >= 100 ? 'bg-green-500' : item.rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(item.rate, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-1 py-2.5">
                          {viewLevel === 'region' && (
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 右侧：下钻分析 */}
          <Card className="lg:col-span-1 border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-gray-900">下钻分析</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setActiveTab('salesmen')}
                  className="group p-2.5 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">按业务员</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-indigo-600">12</span>
                    <span className="text-sm text-gray-500">业务员</span>
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    3人未达标
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('distributors')}
                  className="group p-2.5 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">按经销商</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-green-600">8</span>
                    <span className="text-sm text-gray-500">经销商</span>
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    2家未达标
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="group p-2.5 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">按项目</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-orange-600">127</span>
                    <span className="text-sm text-gray-500">高风险项目</span>
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-sm bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    <Activity className="w-2.5 h-2.5" />
                    需优先跟进
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="distributors">
            <div className="flex items-center justify-center py-20 text-gray-400">
              <div className="text-center">
                <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">经销商数据</p>
                <p className="text-sm mt-1">数据准备中...</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 临期项目/超期项目报警 */}
              <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    临期项目/超期项目报警
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-600">23</div>
                      <div className="text-xs text-gray-600 mt-1">超期项目（已逾期）</div>
                      <div className="text-xs text-red-600 mt-2">总金额 350万</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-3xl font-bold text-yellow-600">35</div>
                      <div className="text-xs text-gray-600 mt-1">临期项目（30天内）</div>
                      <div className="text-xs text-yellow-600 mt-2">总金额 420万</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">项目名称</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">金额</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">状态</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">到期/逾期天数</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          { name: '某某连锁餐饮总部', amount: '120万', status: 'expired', days: -15 },
                          { name: '某某购物中心', amount: '85万', status: 'expired', days: -8 },
                          { name: '某某大酒店', amount: '200万', status: 'urgent', days: 5 },
                          { name: '某某办公楼', amount: '65万', status: 'urgent', days: 12 },
                          { name: '某某连锁超市', amount: '50万', status: 'urgent', days: 18 },
                        ].map((project, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm font-medium text-gray-900">{project.name}</td>
                            <td className="px-3 py-2 text-sm text-right text-gray-600">{project.amount}</td>
                            <td className="px-3 py-2 text-sm text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                project.status === 'expired' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {project.status === 'expired' ? '已超期' : '即将到期'}
                              </span>
                            </td>
                            <td className={`px-3 py-2 text-sm text-right font-medium ${
                              project.days < 0 ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {project.days < 0 ? `逾期${Math.abs(project.days)}天` : `${project.days}天后到期`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* 关联项目储备分析 */}
              <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-teal-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-500" />
                    关联项目储备分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600">45</div>
                      <div className="text-xs text-gray-600 mt-1">已成交客户</div>
                      <div className="text-xs text-gray-400">总客户数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-teal-600">28</div>
                      <div className="text-xs text-gray-600 mt-1">关联项目储备</div>
                      <div className="text-xs text-gray-400">关联率 62.2%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600">1,250</div>
                      <div className="text-xs text-gray-600 mt-1">预计潜在收入</div>
                      <div className="text-xs text-gray-400">万元</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">客户名称</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">行业</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">已成交金额</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">关联项目数</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">预计金额</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">潜力等级</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          { name: '某某餐饮连锁', industry: '餐饮', completed: 450, projects: 5, potential: 300, level: 'high' },
                          { name: '某某购物中心', industry: '零售', completed: 320, projects: 3, potential: 180, level: 'high' },
                          { name: '某某酒店集团', industry: '酒店', completed: 280, projects: 4, potential: 250, level: 'high' },
                          { name: '某某连锁超市', industry: '零售', completed: 210, projects: 2, potential: 120, level: 'medium' },
                          { name: '某某办公楼宇', industry: '办公', completed: 180, projects: 1, potential: 80, level: 'low' },
                        ].map((customer, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm font-medium text-gray-900">{customer.name}</td>
                            <td className="px-3 py-2 text-sm text-gray-600">{customer.industry}</td>
                            <td className="px-3 py-2 text-sm text-right text-gray-900">{customer.completed}万</td>
                            <td className="px-3 py-2 text-sm text-right text-blue-600 font-medium">{customer.projects}个</td>
                            <td className="px-3 py-2 text-sm text-right text-green-600 font-medium">{customer.potential}万</td>
                            <td className="px-3 py-2 text-sm text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                customer.level === 'high' ? 'bg-red-100 text-red-800' :
                                customer.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {customer.level === 'high' ? '高潜力' : customer.level === 'medium' ? '中潜力' : '低潜力'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="salesmen">
            <div className="flex items-center justify-center py-20 text-gray-400">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">业务员数据</p>
                <p className="text-sm mt-1">数据准备中...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
