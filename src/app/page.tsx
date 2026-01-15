'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Heart, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIInsight } from '@/components/ai-insight';

// 模拟数据（单位：万元）
const kpiData = {
  target: 5000,
  completed: 3456,
  // 未来预计完成 = 已完成 + 在跟进项目预计可完成
  futurePredicted: 4100,
  // 任务缺口 = 目标 - 未来预计完成
  taskGap: 900,
  currentHealthIndex: 76.5,
  gapTrend: -15.3,
  completedTrend: 12.5,
  predictedTrend: 8.2,
  healthTrend: -2.1,

  // 缺口分析相关数据
  // 在跟进项目总金额（不是全部能完成）
  followingProjectsTotal: 5600,
  // 在跟进项目预计可完成（转化率约20%）
  followingProjectsPredicted: 644, // 4100 - 3456 = 644
  // 还需新开拓 = 目标 - 已完成 - 在跟进预计
  needNewProjects: 900, // 5000 - 3456 - 644 = 900
  // 转化率
  conversionRate: 11.5, // 644 / 5600 * 100
};

// 不同时间维度的预测数据
const timeRangeData = {
  month: {
    target: 417, // 5000 / 12
    completed: 345,
    predicted: 400,
    gap: 17,
    canComplete: true,
    risk: 'low',
  },
  quarter: {
    target: 1250, // 5000 / 4
    completed: 1020,
    predicted: 1150,
    gap: 100,
    canComplete: true,
    risk: 'medium',
  },
  year: {
    target: 5000,
    completed: 3456,
    predicted: 4100,
    gap: 900,
    canComplete: false,
    risk: 'high',
  },
};

// 大区维度数据
const regionData = {
  month: [
    { name: '华东大区', target: 150, completed: 130, predicted: 145, gap: 5, rate: 96.7, trend: 'up' },
    { name: '华南大区', target: 120, completed: 95, predicted: 105, gap: 15, rate: 87.5, trend: 'down' },
    { name: '华北大区', target: 100, completed: 85, predicted: 92, gap: 8, rate: 92.0, trend: 'stable' },
    { name: '西南大区', target: 47, completed: 35, predicted: 58, gap: -11, rate: 123.4, trend: 'up' },
  ],
  quarter: [
    { name: '华东大区', target: 450, completed: 390, predicted: 425, gap: 25, rate: 94.4, trend: 'up' },
    { name: '华南大区', target: 360, completed: 285, predicted: 310, gap: 50, rate: 86.1, trend: 'down' },
    { name: '华北大区', target: 300, completed: 255, predicted: 275, gap: 25, rate: 91.7, trend: 'stable' },
    { name: '西南大区', target: 140, completed: 90, predicted: 140, gap: 0, rate: 100.0, trend: 'up' },
  ],
  year: [
    { name: '华东大区', target: 1800, completed: 1450, predicted: 1600, gap: 200, rate: 88.9, trend: 'up' },
    { name: '华南大区', target: 1440, completed: 1050, predicted: 1200, gap: 240, rate: 83.3, trend: 'down' },
    { name: '华北大区', target: 1200, completed: 950, predicted: 1050, gap: 150, rate: 87.5, trend: 'stable' },
    { name: '西南大区', target: 560, completed: 6, predicted: 250, gap: 310, rate: 44.6, trend: 'down' },
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
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

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
            <span className="text-sm font-medium">{kpiData.currentHealthIndex.toFixed(0)}</span>
          </div>
          {/* 风险等级图标 */}
          <div className="ml-4 flex items-center gap-1">
            <Shield className={`w-5 h-5 ${riskLevel === 'high' ? 'text-red-500' : riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
            <span className="text-sm font-medium">{riskLevel === 'high' ? '高风险' : riskLevel === 'medium' ? '中风险' : '低风险'}</span>
          </div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 目标 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Target className="w-3.5 h-3.5" />
                <span>目标</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">5,000</div>
              <div className="text-xs text-gray-400 mt-1">万元</div>
            </CardContent>
          </Card>

          {/* 已完成 */}
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-gray-500 mb-1">已完成</div>
              <div className="text-3xl font-bold text-green-600">3,456</div>
              <div className="text-xs text-gray-600 mt-1">万元</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUp className="w-3 h-3" />
                <span>12.5%</span>
              </div>
            </CardContent>
          </Card>

          {/* 未来预计完成 */}
          <Card className="border-2 border-dashed border-blue-300">
            <CardContent className="p-4">
              <div className="text-xs text-gray-500 mb-1">未来预计完成</div>
              <div className="text-3xl font-bold text-blue-600">4,100</div>
              <div className="text-xs text-gray-600 mt-1">万元</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUp className="w-3 h-3" />
                <span>8.2%</span>
              </div>
            </CardContent>
          </Card>

          {/* 任务缺口 */}
          <Card className={`${getGapColor().bg} border-2 ${getGapColor().border}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-gray-700 font-medium">任务缺口</div>
                <AlertTriangle className={`w-3 h-3 ${getGapColor().text}`} />
              </div>
              <div className={`text-3xl font-bold ${getGapColor().text}`}>900</div>
              <div className="text-xs text-gray-600 mt-1">万元</div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <ArrowDown className="w-3 h-3" />
                <span>18.0%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 目标达成分析 */}
        <div className="mt-4">
          <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                目标达成分析（{timeRange === 'month' ? '1月' : timeRange === 'quarter' ? 'Q1' : '2024年'}）
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 大区维度达成情况 */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-3">大区维度达成情况</div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">大区</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">目标</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">已完成</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">预计完成</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">缺口</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">达成率</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">趋势</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {regionData[timeRange as keyof typeof regionData].map((region, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm font-medium text-gray-900">{region.name}</td>
                          <td className="px-3 py-2 text-sm text-right text-gray-600">{region.target.toLocaleString()}万</td>
                          <td className="px-3 py-2 text-sm text-right text-gray-900">{region.completed.toLocaleString()}万</td>
                          <td className="px-3 py-2 text-sm text-right text-blue-600 font-medium">{region.predicted.toLocaleString()}万</td>
                          <td className={`px-3 py-2 text-sm text-right font-medium ${region.gap > 0 ? 'text-red-600' : region.gap === 0 ? 'text-gray-600' : 'text-green-600'}`}>
                            {region.gap > 0 ? `${region.gap}` : region.gap === 0 ? '0' : `+${Math.abs(region.gap)}`}
                          </td>
                          <td className="px-3 py-2 text-sm text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              region.rate >= 100 ? 'bg-green-100 text-green-800' :
                              region.rate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {region.rate.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-3 py-2 text-sm text-center">
                            {region.trend === 'up' ? (
                              <ArrowUp className="w-4 h-4 text-green-500 inline" />
                            ) : region.trend === 'down' ? (
                              <ArrowDown className="w-4 h-4 text-red-500 inline" />
                            ) : (
                              <div className="w-4 h-4 bg-gray-300 rounded-full inline" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 能否完成任务 */}
              <div className={`mb-4 p-3 rounded-lg border ${
                timeRangeData[timeRange as keyof typeof timeRangeData].canComplete
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {timeRangeData[timeRange as keyof typeof timeRangeData].canComplete ? (
                    <Target className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${timeRangeData[timeRange as keyof typeof timeRangeData].canComplete ? 'text-green-700' : 'text-red-700'}`}>
                    {timeRangeData[timeRange as keyof typeof timeRangeData].canComplete ? '预计可以完成任务' : '预计无法完成任务'}
                  </span>
                </div>
                <div className="text-xs text-gray-700">
                  {!timeRangeData[timeRange as keyof typeof timeRangeData].canComplete && (
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                      <div>
                        <span className="text-red-600 font-medium">任务缺口：</span>
                        当前预计完成{timeRangeData[timeRange as keyof typeof timeRangeData].predicted}万，缺口{timeRangeData[timeRange as keyof typeof timeRangeData].gap}万
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 风险识别 */}
              {!timeRangeData[timeRange as keyof typeof timeRangeData].canComplete && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-700">风险因素</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-700">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5"></div>
                      <div>
                        <span className="text-yellow-600 font-medium">转化率偏低：</span>
                        在跟进项目5,600万，预计仅完成644万（转化率11.5%）
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5"></div>
                      <div>
                        <span className="text-orange-600 font-medium">高风险项目多：</span>
                        127个项目存在风险，需优先跟进
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 下钻分析 */}
              <div className="grid grid-cols-3 gap-3">
                <button className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-left">
                  <div className="text-xs text-gray-500 mb-1">按业务员</div>
                  <div className="text-lg font-bold text-gray-900">12</div>
                  <div className="text-xs text-gray-500">业务员</div>
                  <div className="text-xs text-red-500 mt-1">3人未达标</div>
                </button>
                <button className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-left">
                  <div className="text-xs text-gray-500 mb-1">按经销商</div>
                  <div className="text-lg font-bold text-gray-900">8</div>
                  <div className="text-xs text-gray-500">经销商</div>
                  <div className="text-xs text-red-500 mt-1">2家未达标</div>
                </button>
                <button className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-left">
                  <div className="text-xs text-gray-500 mb-1">按项目</div>
                  <div className="text-lg font-bold text-gray-900">127</div>
                  <div className="text-xs text-gray-500">高风险项目</div>
                  <div className="text-xs text-orange-500 mt-1">需优先跟进</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 缺口分析与填补方案 - 横向展示 */}
        <div className="mt-4">
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                缺口填补路径（900万）
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 缺口填补路径 */}
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-xs text-gray-600 mb-1">即将签约项目</div>
                  <div className="text-2xl font-bold text-green-700">500</div>
                  <div className="text-xs text-gray-500 mt-1">万元</div>
                  <div className="text-xs text-green-600 mt-1">12个项目（转化率80%）</div>
                </div>
                <div className="text-xl text-gray-400">+</div>
                <div className="flex-1 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="text-xs text-gray-600 mb-1">高风险项目攻坚</div>
                  <div className="text-2xl font-bold text-blue-700">400</div>
                  <div className="text-xs text-gray-500 mt-1">万元</div>
                  <div className="text-xs text-blue-600 mt-1">127个项目（提升至30%）</div>
                </div>
                <div className="text-xl text-gray-400">=</div>
                <div className="flex-1 p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="text-xs text-gray-600 mb-1">填补缺口</div>
                  <div className="text-2xl font-bold text-purple-700">900</div>
                  <div className="text-xs text-gray-500 mt-1">万元</div>
                  <div className="text-xs text-purple-600 mt-1">达成5000万目标</div>
                </div>
              </div>

              {/* 关键洞察 */}
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <strong>关键洞察：</strong>
                    未来预计完成4,100万（含已完成3,456万），缺口900万。在跟进项目5,600万中，预计仅贡献644万（占11.5%），<span className="text-red-600 font-semibold">转化率严重偏低</span>。
                    建议优先跟进12个即将签约项目（约500万），再攻坚127个高风险项目（约400万）。
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 第二层：经营诊断 */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          经营诊断
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {/* 高风险项目数 */}
          <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                高风险项目数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-red-600">127</div>
                <div className="text-sm text-gray-500 mt-1">高风险项目</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">红色风险</span>
                  <span className="font-medium text-red-600">45个</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">黄色预警</span>
                  <span className="font-medium text-yellow-600">82个</span>
                </div>
              </div>
              <AIInsight
                chartType="risk"
                data={{ total: 127, red: 45, yellow: 82 }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 第三层：项目明细 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          项目明细
        </h2>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="highRisk">高风险项目清单</TabsTrigger>
            <TabsTrigger value="stagnant">停滞项目清单</TabsTrigger>
            <TabsTrigger value="keyProjects">重点项目清单</TabsTrigger>
          </TabsList>

          {/* 高风险项目清单 */}
          <TabsContent value="highRisk" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">项目名称</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">渠道/行业</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">等级</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">节点</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">金额</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">风险等级</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">业务员</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { name: '某某连锁餐饮总部', channel: '餐饮', level: 'A级', node: '商务谈判', amount: '120万', risk: 'red', sales: '张三' },
                      { name: '某某购物中心', channel: '零售', level: 'B级', node: '方案报价', amount: '85万', risk: 'red', sales: '李四' },
                      { name: '某某大酒店', channel: '酒店', level: 'VIP', node: '安装', amount: '200万', risk: 'yellow', sales: '王五' },
                      { name: '某某办公楼', channel: '办公楼', level: 'B级', node: '签约', amount: '65万', risk: 'yellow', sales: '赵六' },
                      { name: '某某连锁超市', channel: '零售', level: 'A级', node: '勘测', amount: '150万', risk: 'red', sales: '张三' },
                    ].map((project, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{project.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{project.channel}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge className={project.level === 'VIP' ? 'bg-blue-500' : project.level === 'A级' ? 'bg-green-500' : 'bg-gray-500'}>
                            {project.level}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{project.node}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{project.amount}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${project.risk === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                            <span className={project.risk === 'red' ? 'text-red-600' : 'text-yellow-600'}>
                              {project.risk === 'red' ? '高风险' : '中风险'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{project.sales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 停滞项目清单 */}
          <TabsContent value="stagnant" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">项目名称</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">渠道/行业</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">等级</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">节点</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">金额</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">停滞天数</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">业务员</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { name: '某某连锁餐饮总部', channel: '餐饮', level: 'A级', node: '商务谈判', amount: '120万', days: 45, sales: '张三' },
                      { name: '某某购物中心', channel: '零售', level: 'B级', node: '方案报价', amount: '85万', days: 32, sales: '李四' },
                      { name: '某某大酒店', channel: '酒店', level: 'VIP', node: '安装', amount: '200万', days: 28, sales: '王五' },
                      { name: '某某办公楼', channel: '办公楼', level: 'B级', node: '签约', amount: '65万', days: 25, sales: '赵六' },
                      { name: '某某连锁超市', channel: '零售', level: 'A级', node: '勘测', amount: '150万', days: 18, sales: '张三' },
                    ].map((project, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{project.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{project.channel}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge className={project.level === 'VIP' ? 'bg-blue-500' : project.level === 'A级' ? 'bg-green-500' : 'bg-gray-500'}>
                            {project.level}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{project.node}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{project.amount}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={project.days >= 30 ? 'text-red-600 font-bold' : 'text-yellow-600'}>
                            {project.days}天
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{project.sales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 重点项目清单 */}
          <TabsContent value="keyProjects" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">项目名称</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">渠道/行业</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">等级</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">节点</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">金额</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">健康度</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">业务员</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { name: '某某地标写字楼', channel: '办公楼', level: '地标', node: '验收', amount: '500万', health: 92, sales: '张三' },
                      { name: '某某国际酒店', channel: '酒店', level: '地标', node: '安装', amount: '450万', health: 88, sales: '李四' },
                      { name: '某某连锁餐饮总部', channel: '餐饮', level: 'VIP', node: '签约', amount: '300万', health: 85, sales: '王五' },
                      { name: '某某购物中心', channel: '零售', level: 'VIP', node: '商务谈判', amount: '280万', health: 80, sales: '赵六' },
                      { name: '某某大学校园', channel: '学校', level: 'A级', node: '方案报价', amount: '180万', health: 75, sales: '张三' },
                    ].map((project, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{project.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{project.channel}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge className={project.level === '地标' ? 'bg-purple-500' : project.level === 'VIP' ? 'bg-blue-500' : 'bg-green-500'}>
                            {project.level}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{project.node}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{project.amount}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${project.health >= 80 ? 'bg-green-500' : project.health >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                            <span className={project.health >= 80 ? 'text-green-600' : project.health >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                              {project.health}分
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{project.sales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
