'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Heart, Shield, Clock, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AIInsight } from '@/components/ai-insight';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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

const riskLevel = kpiData.taskGap > 900 ? 'high' : kpiData.taskGap > 500 ? 'medium' : 'low';

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


export default function WaterPurifierDashboard() {
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 页面头部 */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">商用净水经营驾驶舱</h1>
            <p className="text-sm text-gray-500 mt-1">
              经销商老板视角 · {timeRange === 'month' ? '2024年1月' : timeRange === 'quarter' ? '2024年Q1' : '2024年'}
            </p>
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
      <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
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

      {/* 第一层：经营总览 */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          经营总览
          {/* 健康指数图标 */}
          <div className="ml-4 flex items-center gap-1">
            <Heart className={`w-5 h-5 ${getHealthColor(kpiData.currentHealthIndex) === 'green' ? 'text-green-500' : getHealthColor(kpiData.currentHealthIndex) === 'yellow' ? 'text-yellow-500' : 'text-red-500'}`} />
            <span className="text-sm font-medium">{kpiData.currentHealthIndex.toFixed(1)}</span>
          </div>
          {/* 风险等级图标 */}
          <div className="ml-4 flex items-center gap-1">
            <Shield className={`w-5 h-5 ${riskLevel === 'high' ? 'text-red-500' : riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
            <span className="text-sm font-medium">{riskLevel === 'high' ? '高风险' : riskLevel === 'medium' ? '中风险' : '低风险'}</span>
          </div>
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="overview">经营总览</TabsTrigger>
            <TabsTrigger value="distributors">经销商</TabsTrigger>
            <TabsTrigger value="projects">项目</TabsTrigger>
            <TabsTrigger value="salesmen">业务员</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 目标 */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Target className="w-3 h-3" />
                <span>目标</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">1,428</div>
              <div className="text-xs text-gray-400">万元</div>
            </CardContent>
          </Card>

          {/* 已完成 */}
          <Card>
            <CardContent className="p-3">
              <div className="text-xs text-gray-500">已完成</div>
              <div className="text-2xl font-bold text-green-600">677</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">万元</span>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <ArrowDown className="w-3 h-3" />
                  <span>-8.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 未来预计完成 */}
          <Card className="border-2 border-dashed border-blue-300">
            <CardContent className="p-3">
              <div className="text-xs text-gray-500">未来预计完成</div>
              <div className="text-2xl font-bold text-blue-600">650.3</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">万元</span>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <ArrowDown className="w-3 h-3" />
                  <span>-12.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 任务缺口 */}
          <Card className={`${getGapColor().bg} border-2 ${getGapColor().border}`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-700 font-medium">任务缺口</div>
                <AlertTriangle className={`w-3 h-3 ${getGapColor().text}`} />
              </div>
              <div className={`text-2xl font-bold ${getGapColor().text}`}>777.7</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">万元</span>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <ArrowDown className="w-3 h-3" />
                  <span>-54.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 目标达成分析 */}
        <div className="mt-4">
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="p-3">
              <div className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-blue-600" />
                目标达成分析（{timeRange === 'month' ? '1月' : timeRange === 'quarter' ? 'Q1' : '2024年'}）
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* 左侧：大区维度达成情况 + 风险识别 */}
                <div className="lg:col-span-2 space-y-3">
                  {/* 大区维度达成情况 */}
                  <div>
                    <div className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-indigo-600" />
                      大区维度达成情况
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">大区</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">责任人</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">目标</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">已完成</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">预计</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">缺口</th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">达成率</th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">趋势</th>
                          </tr>
                        </thead>
                        <tbody>
                          {regionData[timeRange as keyof typeof regionData].map((region, index) => (
                            <tr
                              key={index}
                              className="hover:bg-indigo-50/50 transition-colors border-b border-gray-100 last:border-0"
                            >
                              <td className="px-3 py-2 text-sm text-gray-700">{region.name}</td>
                              <td className="px-3 py-2 text-sm text-gray-700">{region.owner}</td>
                              <td className="px-3 py-2 text-sm text-right text-gray-700">{region.target.toLocaleString()}万</td>
                              <td className="px-3 py-2 text-sm text-right text-gray-700">{region.completed.toLocaleString()}万</td>
                              <td className="px-3 py-2 text-sm text-right text-gray-700">{region.predicted.toLocaleString()}万</td>
                              <td className={`px-3 py-2 text-sm text-right ${region.gap > 0 ? 'text-red-600' : region.gap === 0 ? 'text-gray-600' : 'text-green-600'}`}>
                                {region.gap > 0 ? `${region.gap}` : region.gap === 0 ? '0' : `+${Math.abs(region.gap)}`}
                              </td>
                              <td className="px-3 py-2 text-sm text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                                  region.rate >= 100 ? 'bg-green-100 text-green-700 ring-1 ring-green-200' :
                                  region.rate >= 80 ? 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200' :
                                  'bg-red-100 text-red-700 ring-1 ring-red-200'
                                }`}>
                                  {region.rate.toFixed(1)}%
                                </span>
                              </td>
                              <td className="px-3 py-2 text-sm text-center">
                                {region.trend === 'up' ? (
                                  <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 ring-1 ring-green-200">
                                    <ArrowUp className="w-3.5 h-3.5 text-green-600" />
                                  </div>
                                ) : region.trend === 'down' ? (
                                  <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 ring-1 ring-red-200">
                                    <ArrowDown className="w-3.5 h-3.5 text-red-600" />
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 ring-1 ring-gray-200">
                                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 风险识别 */}
                  {!timeRangeData[timeRange as keyof typeof timeRangeData].canComplete && (
                    <div className="px-3 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                        <span className="text-xs font-bold text-orange-800">风险因素</span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-700">
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5">1</span>
                          <span><span className="font-bold text-yellow-700">达成率偏低：</span>仅1个大区达标，平均47.4%</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5">2</span>
                          <span><span className="font-bold text-yellow-700">缺口巨大：</span>月度缺口777.7万，6个区域未达标</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 右侧：下钻分析 */}
                <div className="lg:col-span-1 space-y-2">
                  <button className="group w-full px-2.5 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 hover:border-indigo-400 hover:shadow-md transition-all text-left relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <div className="w-3.5 h-3.5 bg-indigo-100 rounded flex items-center justify-center">
                          <Activity className="w-2 h-2 text-indigo-600" />
                        </div>
                        <span className="font-semibold">按业务员</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-indigo-600">12</span>
                        <span className="text-xs text-gray-500">业务员</span>
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">
                        <AlertTriangle className="w-2 h-2" />
                        3人未达标
                      </div>
                    </div>
                  </button>
                  <button className="group w-full px-2.5 py-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 hover:border-green-400 hover:shadow-md transition-all text-left relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <div className="w-3.5 h-3.5 bg-green-100 rounded flex items-center justify-center">
                          <Target className="w-2 h-2 text-green-600" />
                        </div>
                        <span className="font-semibold">按经销商</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">8</span>
                        <span className="text-xs text-gray-500">经销商</span>
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">
                        <AlertTriangle className="w-2 h-2" />
                        2家未达标
                      </div>
                    </div>
                  </button>
                  <button className="group w-full px-2.5 py-2 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200 hover:border-orange-400 hover:shadow-md transition-all text-left relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <div className="w-3.5 h-3.5 bg-orange-100 rounded flex items-center justify-center">
                          <AlertTriangle className="w-2 h-2 text-orange-600" />
                        </div>
                        <span className="font-semibold">按项目</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">127</span>
                        <span className="text-xs text-gray-500">高风险项目</span>
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">
                        <Activity className="w-2 h-2" />
                        需优先跟进
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
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
                <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">业务员数据</p>
                <p className="text-sm mt-1">数据准备中...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

    </div>
  );
}
