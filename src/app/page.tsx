'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Heart, Shield, Clock, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
    { name: '华东大区', owner: '张伟', target: 150, completed: 130, predicted: 145, gap: 5, rate: 96.7, trend: 'up' },
    { name: '华南大区', owner: '李强', target: 120, completed: 95, predicted: 105, gap: 15, rate: 87.5, trend: 'down' },
    { name: '华北大区', owner: '王明', target: 100, completed: 85, predicted: 92, gap: 8, rate: 92.0, trend: 'stable' },
    { name: '西南大区', owner: '刘洋', target: 47, completed: 35, predicted: 58, gap: -11, rate: 123.4, trend: 'up' },
  ],
  quarter: [
    { name: '华东大区', owner: '张伟', target: 450, completed: 390, predicted: 425, gap: 25, rate: 94.4, trend: 'up' },
    { name: '华南大区', owner: '李强', target: 360, completed: 285, predicted: 310, gap: 50, rate: 86.1, trend: 'down' },
    { name: '华北大区', owner: '王明', target: 300, completed: 255, predicted: 275, gap: 25, rate: 91.7, trend: 'stable' },
    { name: '西南大区', owner: '刘洋', target: 140, completed: 90, predicted: 140, gap: 0, rate: 100.0, trend: 'up' },
  ],
  year: [
    { name: '华东大区', owner: '张伟', target: 1800, completed: 1450, predicted: 1600, gap: 200, rate: 88.9, trend: 'up' },
    { name: '华南大区', owner: '李强', target: 1440, completed: 1050, predicted: 1200, gap: 240, rate: 83.3, trend: 'down' },
    { name: '华北大区', owner: '王明', target: 1200, completed: 950, predicted: 1050, gap: 150, rate: 87.5, trend: 'stable' },
    { name: '西南大区', owner: '刘洋', target: 560, completed: 6, predicted: 250, gap: 310, rate: 44.6, trend: 'down' },
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
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                <Target className="w-5 h-5 text-blue-600" />
                目标达成分析（{timeRange === 'month' ? '1月' : timeRange === 'quarter' ? 'Q1' : '2024年'}）
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左侧：大区维度达成情况 */}
                <div className="lg:col-span-2">
                  <div className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    大区维度达成情况
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">大区</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">责任人</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">目标</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">已完成</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">预计完成</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">缺口</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">达成率</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">趋势</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regionData[timeRange as keyof typeof regionData].map((region, index) => (
                          <tr
                            key={index}
                            className="hover:bg-indigo-50/50 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{region.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{region.owner}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">{region.target.toLocaleString()}万</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">{region.completed.toLocaleString()}万</td>
                            <td className="px-4 py-3 text-sm text-right text-indigo-600 font-bold">{region.predicted.toLocaleString()}万</td>
                            <td className={`px-4 py-3 text-sm text-right font-bold ${region.gap > 0 ? 'text-red-600' : region.gap === 0 ? 'text-gray-600' : 'text-green-600'}`}>
                              {region.gap > 0 ? `${region.gap}` : region.gap === 0 ? '0' : `+${Math.abs(region.gap)}`}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                                region.rate >= 100 ? 'bg-green-100 text-green-700 ring-2 ring-green-200' :
                                region.rate >= 80 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' :
                                'bg-red-100 text-red-700 ring-2 ring-red-200'
                              }`}>
                                {region.rate.toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              {region.trend === 'up' ? (
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 ring-2 ring-green-200">
                                  <ArrowUp className="w-4 h-4 text-green-600" />
                                </div>
                              ) : region.trend === 'down' ? (
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 ring-2 ring-red-200">
                                  <ArrowDown className="w-4 h-4 text-red-600" />
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 ring-2 ring-gray-200">
                                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 右侧：风险识别 + 下钻分析 */}
                <div className="lg:col-span-1 space-y-4">
                  {/* 风险识别 */}
                  {!timeRangeData[timeRange as keyof typeof timeRangeData].canComplete && (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-orange-100 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="text-sm font-bold text-orange-800">风险因素</span>
                      </div>
                      <div className="space-y-2.5 text-sm text-gray-700">
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200 shadow-sm">
                          <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs font-bold text-white">1</span>
                          </div>
                          <div>
                            <span className="font-bold text-yellow-700">转化率偏低：</span>
                            在跟进项目5,600万，预计仅完成644万（转化率11.5%）
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200 shadow-sm">
                          <div className="flex-shrink-0 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs font-bold text-white">2</span>
                          </div>
                          <div>
                            <span className="font-bold text-orange-700">高风险项目多：</span>
                            127个项目存在风险，需优先跟进
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 下钻分析 */}
                  <div className="space-y-2">
                    <button className="group w-full p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-indigo-400 hover:shadow-lg transition-all text-left relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1.5">
                          <div className="w-5 h-5 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Activity className="w-3 h-3 text-indigo-600" />
                          </div>
                          <span className="font-semibold">按业务员</span>
                        </div>
                        <div className="text-2xl font-bold text-indigo-600 mb-1">12</div>
                        <div className="text-xs text-gray-500 mb-1.5">业务员</div>
                        <div className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          3人未达标
                        </div>
                      </div>
                    </button>
                    <button className="group w-full p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all text-left relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1.5">
                          <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                            <Target className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="font-semibold">按经销商</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600 mb-1">8</div>
                        <div className="text-xs text-gray-500 mb-1.5">经销商</div>
                        <div className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          2家未达标
                        </div>
                      </div>
                    </button>
                    <button className="group w-full p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all text-left relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1.5">
                          <div className="w-5 h-5 bg-orange-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-3 h-3 text-orange-600" />
                          </div>
                          <span className="font-semibold">按项目</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600 mb-1">127</div>
                        <div className="text-xs text-gray-500 mb-1.5">高风险项目</div>
                        <div className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                          <Activity className="w-3 h-3" />
                          需优先跟进
                        </div>
                      </div>
                    </button>
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
      </section>

    </div>
  );
}
