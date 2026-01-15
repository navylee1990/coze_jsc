'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Heart, Shield, Clock, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 模拟数据（单位：万元）
const kpiData = {
  target: 5000,
  completed: 3456,
  futurePredicted: 4100,
  taskGap: 900,
  currentHealthIndex: 76.5,
};

const timeRangeData = {
  month: {
    target: 417,
    completed: 345,
    predicted: 400,
    gap: 17,
    canComplete: true,
  },
  quarter: {
    target: 1250,
    completed: 1020,
    predicted: 1150,
    gap: 100,
    canComplete: true,
  },
  year: {
    target: 5000,
    completed: 3456,
    predicted: 4100,
    gap: 900,
    canComplete: false,
  },
};

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
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      {/* 页面头部 */}
      <header className="mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">商用净水经营驾驶舱</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              经销商老板视角 · {timeRange === 'month' ? '2024年1月' : timeRange === 'quarter' ? '2024年Q1' : '2024年'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
              刷新数据
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
              导出报告
            </button>
          </div>
        </div>
      </header>

      {/* 筛选器 */}
      <div className="mb-3 flex items-center gap-3 bg-white px-3 py-2 rounded border border-gray-200">
        <span className="text-xs font-medium text-gray-700">时间：</span>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="month">月度</option>
          <option value="quarter">季度</option>
          <option value="year">年度</option>
        </select>
        <span className="text-xs font-medium text-gray-700 ml-2">行业：</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">全部行业</option>
          <option value="catering">餐饮行业</option>
          <option value="retail">零售行业</option>
          <option value="hotel">酒店行业</option>
        </select>
      </div>

      {/* KPI卡片 */}
      <div className="mb-3 grid grid-cols-4 gap-2">
        <Card>
          <CardContent className="p-2.5">
            <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-0.5">
              <Target className="w-3 h-3" />
              <span>目标</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">5,000</div>
            <div className="text-[10px] text-gray-400 mt-0.5">万元</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5">
            <div className="text-[10px] text-gray-500 mb-0.5">已完成</div>
            <div className="text-2xl font-bold text-green-600">3,456</div>
            <div className="text-[10px] text-gray-600 mt-0.5">万元</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-dashed border-blue-300">
          <CardContent className="p-2.5">
            <div className="text-[10px] text-gray-500 mb-0.5">预计完成</div>
            <div className="text-2xl font-bold text-blue-600">4,100</div>
            <div className="text-[10px] text-gray-600 mt-0.5">万元</div>
          </CardContent>
        </Card>
        <Card className={`${getGapColor().bg} border-2 ${getGapColor().border}`}>
          <CardContent className="p-2.5">
            <div className="flex items-center justify-between mb-0.5">
              <div className="text-[10px] text-gray-700 font-medium">任务缺口</div>
              <AlertTriangle className={`w-3 h-3 ${getGapColor().text}`} />
            </div>
            <div className={`text-2xl font-bold ${getGapColor().text}`}>900</div>
            <div className="text-[10px] text-gray-600 mt-0.5">万元</div>
          </CardContent>
        </Card>
      </div>

      {/* 经营总览 */}
      <section className="mb-3">
        <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
          <Activity className="w-4 h-4" />
          经营总览
          <div className="ml-2 flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded">
            <Heart className={`w-3.5 h-3.5 ${getHealthColor(kpiData.currentHealthIndex) === 'green' ? 'text-green-500' : getHealthColor(kpiData.currentHealthIndex) === 'yellow' ? 'text-yellow-500' : 'text-red-500'}`} />
            <span className="text-xs font-medium">{kpiData.currentHealthIndex.toFixed(0)}</span>
          </div>
          <div className="ml-1 flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded">
            <Shield className={`w-3.5 h-3.5 ${riskLevel === 'high' ? 'text-red-500' : riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
            <span className="text-xs font-medium">{riskLevel === 'high' ? '高风险' : riskLevel === 'medium' ? '中风险' : '低风险'}</span>
          </div>
        </h2>
      </section>

      {/* 目标达成分析 */}
      <div className="mb-3">
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-sm flex items-center gap-1.5 text-gray-900">
              <Target className="w-4 h-4 text-blue-600" />
              目标达成分析（{timeRange === 'month' ? '1月' : timeRange === 'quarter' ? 'Q1' : '2024年'}）
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2">
            {/* 大区维度达成情况 */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                大区维度达成情况
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-gray-700">大区</th>
                      <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-gray-700">目标</th>
                      <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-gray-700">已完成</th>
                      <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-gray-700">预计完成</th>
                      <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-gray-700">缺口</th>
                      <th className="px-2 py-1.5 text-center text-[10px] font-semibold text-gray-700">达成率</th>
                      <th className="px-2 py-1.5 text-center text-[10px] font-semibold text-gray-700">趋势</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionData[timeRange as keyof typeof regionData].map((region, index) => (
                      <tr
                        key={index}
                        className="hover:bg-indigo-50/50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <td className="px-2 py-1.5 text-xs font-semibold text-gray-900">{region.name}</td>
                        <td className="px-2 py-1.5 text-xs text-right text-gray-600">{region.target.toLocaleString()}万</td>
                        <td className="px-2 py-1.5 text-xs text-right text-gray-900 font-medium">{region.completed.toLocaleString()}万</td>
                        <td className="px-2 py-1.5 text-xs text-right text-indigo-600 font-bold">{region.predicted.toLocaleString()}万</td>
                        <td className={`px-2 py-1.5 text-xs text-right font-bold ${region.gap > 0 ? 'text-red-600' : region.gap === 0 ? 'text-gray-600' : 'text-green-600'}`}>
                          {region.gap > 0 ? `${region.gap}` : region.gap === 0 ? '0' : `+${Math.abs(region.gap)}`}
                        </td>
                        <td className="px-2 py-1.5 text-xs text-center">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            region.rate >= 100 ? 'bg-green-100 text-green-700' :
                            region.rate >= 80 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {region.rate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-2 py-1.5 text-xs text-center">
                          {region.trend === 'up' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-green-600" />
                          ) : region.trend === 'down' ? (
                            <ArrowDown className="w-3.5 h-3.5 text-red-600" />
                          ) : (
                            <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto" />
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
              <div className="mb-2 p-2 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-xs font-bold text-orange-800">风险因素</span>
                </div>
                <div className="space-y-1 text-xs text-gray-700">
                  <div className="flex items-start gap-2 p-1.5 bg-white rounded border border-orange-200">
                    <span className="flex-shrink-0 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white">1</span>
                    <div><span className="font-bold text-yellow-700">转化率偏低：</span>在跟进项目5,600万，预计仅完成644万（转化率11.5%）</div>
                  </div>
                  <div className="flex items-start gap-2 p-1.5 bg-white rounded border border-orange-200">
                    <span className="flex-shrink-0 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white">2</span>
                    <div><span className="font-bold text-orange-700">高风险项目多：</span>127个项目存在风险，需优先跟进</div>
                  </div>
                </div>
              </div>
            )}

            {/* 下钻分析 */}
            <div className="grid grid-cols-3 gap-2">
              <button className="group p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-indigo-400 transition-all text-left">
                <div className="flex items-center gap-1 text-[10px] text-gray-600 mb-1">
                  <Activity className="w-3 h-3 text-indigo-600" />
                  <span className="font-semibold">按业务员</span>
                </div>
                <div className="text-xl font-bold text-indigo-600 mb-0.5">12</div>
                <div className="text-[10px] text-gray-500 mb-1">业务员</div>
                <div className="inline-flex items-center gap-0.5 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  3人未达标
                </div>
              </button>
              <button className="group p-2.5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:border-green-400 transition-all text-left">
                <div className="flex items-center gap-1 text-[10px] text-gray-600 mb-1">
                  <Target className="w-3 h-3 text-green-600" />
                  <span className="font-semibold">按经销商</span>
                </div>
                <div className="text-xl font-bold text-green-600 mb-0.5">8</div>
                <div className="text-[10px] text-gray-500 mb-1">经销商</div>
                <div className="inline-flex items-center gap-0.5 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  2家未达标
                </div>
              </button>
              <button className="group p-2.5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200 hover:border-orange-400 transition-all text-left">
                <div className="flex items-center gap-1 text-[10px] text-gray-600 mb-1">
                  <AlertTriangle className="w-3 h-3 text-orange-600" />
                  <span className="font-semibold">按项目</span>
                </div>
                <div className="text-xl font-bold text-orange-600 mb-0.5">127</div>
                <div className="text-[10px] text-gray-500 mb-1">高风险项目</div>
                <div className="inline-flex items-center gap-0.5 text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">
                  <Activity className="w-2.5 h-2.5" />
                  需优先跟进
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 经营诊断 */}
      <section className="mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4" />
          经营诊断
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {/* 临期项目/超期项目报警 */}
          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                临期项目/超期项目报警
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 py-2">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="p-2 bg-red-50 rounded border border-red-200">
                  <div className="text-xl font-bold text-red-600">23</div>
                  <div className="text-[10px] text-gray-600">超期项目</div>
                  <div className="text-[10px] text-red-600 mt-0.5">350万</div>
                </div>
                <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                  <div className="text-xl font-bold text-yellow-600">35</div>
                  <div className="text-[10px] text-gray-600">临期项目</div>
                  <div className="text-[10px] text-yellow-600 mt-0.5">420万</div>
                </div>
              </div>
              <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-500">项目名称</th>
                      <th className="px-2 py-1 text-right text-[10px] font-medium text-gray-500">金额</th>
                      <th className="px-2 py-1 text-center text-[10px] font-medium text-gray-500">状态</th>
                      <th className="px-2 py-1 text-right text-[10px] font-medium text-gray-500">天数</th>
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
                        <td className="px-2 py-1 text-xs font-medium text-gray-900">{project.name}</td>
                        <td className="px-2 py-1 text-xs text-right text-gray-600">{project.amount}</td>
                        <td className="px-2 py-1 text-xs text-center">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            project.status === 'expired' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status === 'expired' ? '已超期' : '即将到期'}
                          </span>
                        </td>
                        <td className={`px-2 py-1 text-xs text-right font-medium ${
                          project.days < 0 ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {project.days < 0 ? `逾期${Math.abs(project.days)}天` : `${project.days}天后`}
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
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-green-500" />
                关联项目储备分析
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 py-2">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-center p-1">
                  <div className="text-2xl font-bold text-green-600">45</div>
                  <div className="text-[10px] text-gray-600">已成交客户</div>
                </div>
                <div className="text-center p-1">
                  <div className="text-2xl font-bold text-teal-600">28</div>
                  <div className="text-[10px] text-gray-600">关联项目储备</div>
                  <div className="text-[10px] text-gray-400">关联率 62.2%</div>
                </div>
                <div className="text-center p-1">
                  <div className="text-2xl font-bold text-blue-600">1,250</div>
                  <div className="text-[10px] text-gray-600">预计潜在收入</div>
                  <div className="text-[10px] text-gray-400">万元</div>
                </div>
              </div>
              <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-500">客户名称</th>
                      <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-500">行业</th>
                      <th className="px-2 py-1 text-right text-[10px] font-medium text-gray-500">已成交</th>
                      <th className="px-2 py-1 text-right text-[10px] font-medium text-gray-500">项目数</th>
                      <th className="px-2 py-1 text-right text-[10px] font-medium text-gray-500">预计金额</th>
                      <th className="px-2 py-1 text-center text-[10px] font-medium text-gray-500">潜力</th>
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
                        <td className="px-2 py-1 text-xs font-medium text-gray-900">{customer.name}</td>
                        <td className="px-2 py-1 text-xs text-gray-600">{customer.industry}</td>
                        <td className="px-2 py-1 text-xs text-right text-gray-900">{customer.completed}万</td>
                        <td className="px-2 py-1 text-xs text-right text-blue-600 font-medium">{customer.projects}个</td>
                        <td className="px-2 py-1 text-xs text-right text-green-600 font-medium">{customer.potential}万</td>
                        <td className="px-2 py-1 text-xs text-center">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            customer.level === 'high' ? 'bg-red-100 text-red-800' :
                            customer.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {customer.level === 'high' ? '高' : customer.level === 'medium' ? '中' : '低'}
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
