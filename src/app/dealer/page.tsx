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
