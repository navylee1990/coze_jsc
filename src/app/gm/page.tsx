'use client';

import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Clock, ChevronRight, BarChart3, Play, ChevronLeft, X, Moon, Sun, TrendingDown, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PredictionDecisionCard from '@/components/PredictionDecisionCard';
import FutureSupportAdequacyPanel from '@/components/FutureSupportAdequacyPanel';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 页面标题
const PAGE_TITLE = '商用总经理驾驶舱';

// 主题类型
type Theme = 'dark' | 'light';

// 主题颜色映射 - 解决浅色模式对比度问题
const getThemeColors = (theme: Theme) => ({
  bg: theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50',
  text: theme === 'dark' ? 'text-white' : 'text-slate-900',
  textMuted: theme === 'dark' ? 'text-slate-600' : 'text-slate-600',
  textSecondary: theme === 'dark' ? 'text-slate-700' : 'text-slate-700',
  cardBg: theme === 'dark' ? 'bg-slate-900/50' : 'bg-white',
  cardBorder: theme === 'dark' ? 'border-slate-800' : 'border-slate-200',
  subCardBg: theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50',
  subCardBorder: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
});

// 核心预测总览数据
const forecastOverviewData = {
  currentMonth: {
    target: 1500,
    forecast: 1350,
    completed: 800
  },
  threeMonth: {
    target: 4500,
    forecast: 4200,
    completed: 2400
  },
  sixMonth: {
    target: 9000,
    forecast: 8500,
    completed: 4800
  }
};

// 风险面板数据
const riskData = {
  projectRisks: [
    { projectId: 3, projectName: '广州某企业办公楼项目', riskType: '30天无动作', impact: 405, owner: '王强', days: 32 },
    { projectId: 9, projectName: '西安某学校项目', riskType: '30天无动作', impact: 84, owner: '赵敏', days: 45 },
  ],
  personnelRisks: [
    { personId: 5, name: '陈明', riskType: 'SOP不达标', sopRate: 78, impact: -55, projectCount: 4 },
    { personId: 6, name: '赵敏', riskType: 'SOP不达标', sopRate: 72, impact: -68, projectCount: 3 },
  ]
};

// 预测趋势图数据
const forecastTrendData = [
  { month: '1月', target: 1500, forecast: 1350, completed: 800 },
  { month: '2月', target: 1500, forecast: 1480, completed: 0 },
  { month: '3月', target: 1500, forecast: 1370, completed: 0 },
  { month: '4月', target: 1500, forecast: 1420, completed: 0 },
  { month: '5月', target: 1500, forecast: 1380, completed: 0 },
  { month: '6月', target: 1500, forecast: 1450, completed: 0 },
];

// 大区维度数据
const regionData = {
  month: [
    { name: '一区', owner: '王泽', target: 320, completed: 65, predicted: 110, gap: 210, rate: 20.3, trend: 'down', orderCount: 45, projectCount: 28, pendingAmount: 120 },
    { name: '二区', owner: '陈超', target: 232, completed: 100, predicted: 100, gap: 132, rate: 43.1, trend: 'down', orderCount: 85, projectCount: 42, pendingAmount: 85 },
    { name: '五区', owner: '张大鹏', target: 260, completed: 120, predicted: 100.4, gap: 159.6, rate: 46.2, trend: 'down', orderCount: 72, projectCount: 35, pendingAmount: 95 },
    { name: '华中', owner: '刘邦军', target: 152, completed: 152, predicted: 150, gap: 2, rate: 100.0, trend: 'up', orderCount: 112, projectCount: 58, pendingAmount: 150 },
    { name: '华北', owner: '康帅', target: 160, completed: 120, predicted: 69.1, gap: 90.9, rate: 75.0, trend: 'down', orderCount: 62, projectCount: 31, pendingAmount: 75 },
    { name: '西南', owner: '钟莲', target: 128, completed: 20, predicted: 10.8, gap: 117.2, rate: 15.6, trend: 'down', orderCount: 28, projectCount: 15, pendingAmount: 35 },
    { name: '华南', owner: '徐婷婷', target: 176, completed: 100, predicted: 110, gap: 66, rate: 56.8, trend: 'down', orderCount: 68, projectCount: 36, pendingAmount: 90 },
  ],
  quarter: [
    { name: '一区', owner: '王泽', target: 960, completed: 195, predicted: 330, gap: 630, rate: 20.3, trend: 'down', orderCount: 135, projectCount: 84, pendingAmount: 360 },
    { name: '二区', owner: '陈超', target: 696, completed: 300, predicted: 300, gap: 396, rate: 43.1, trend: 'down', orderCount: 255, projectCount: 126, pendingAmount: 255 },
    { name: '五区', owner: '张大鹏', target: 780, completed: 360, predicted: 301.2, gap: 478.8, rate: 46.2, trend: 'down', orderCount: 216, projectCount: 105, pendingAmount: 285 },
    { name: '华中', owner: '刘邦军', target: 456, completed: 456, predicted: 450, gap: 6, rate: 100.0, trend: 'up', orderCount: 336, projectCount: 174, pendingAmount: 450 },
    { name: '华北', owner: '康帅', target: 480, completed: 360, predicted: 207.3, gap: 272.7, rate: 75.0, trend: 'down', orderCount: 186, projectCount: 93, pendingAmount: 225 },
    { name: '西南', owner: '钟莲', target: 384, completed: 60, predicted: 32.4, gap: 351.6, rate: 15.6, trend: 'down', orderCount: 84, projectCount: 45, pendingAmount: 105 },
    { name: '华南', owner: '徐婷婷', target: 528, completed: 300, predicted: 330, gap: 198, rate: 56.8, trend: 'down', orderCount: 204, projectCount: 108, pendingAmount: 270 },
  ],
  year: [
    { name: '一区', owner: '王泽', target: 3840, completed: 780, predicted: 1320, gap: 2520, rate: 20.3, trend: 'down', orderCount: 540, projectCount: 336, pendingAmount: 1440 },
    { name: '二区', owner: '陈超', target: 2784, completed: 1200, predicted: 1200, gap: 1584, rate: 43.1, trend: 'down', orderCount: 1020, projectCount: 504, pendingAmount: 1020 },
    { name: '五区', owner: '张大鹏', target: 3120, completed: 1440, predicted: 1204.8, gap: 1915.2, rate: 46.2, trend: 'down', orderCount: 864, projectCount: 420, pendingAmount: 1140 },
    { name: '华中', owner: '刘邦军', target: 1824, completed: 1824, predicted: 1800, gap: 24, rate: 100.0, trend: 'up', orderCount: 1344, projectCount: 696, pendingAmount: 1800 },
    { name: '华北', owner: '康帅', target: 1920, completed: 1440, predicted: 829.2, gap: 1090.8, rate: 75.0, trend: 'down', orderCount: 744, projectCount: 372, pendingAmount: 900 },
    { name: '西南', owner: '钟莲', target: 1536, completed: 240, predicted: 129.6, gap: 1406.4, rate: 15.6, trend: 'down', orderCount: 336, projectCount: 180, pendingAmount: 420 },
    { name: '华南', owner: '徐婷婷', target: 2112, completed: 1200, predicted: 1320, gap: 792, rate: 56.8, trend: 'down', orderCount: 816, projectCount: 432, pendingAmount: 1080 },
  ],
};

// 月度趋势数据
const monthlyTrendData = {
  all: [
    { month: '1月', target: 1428, completed: 677, predicted: 1000, plan: 1350 },
    { month: '2月', target: 1350, completed: 720, predicted: 1050, plan: 1280 },
    { month: '3月', target: 1480, completed: 850, predicted: 1200, plan: 1400 },
    { month: '4月', target: 1520, completed: 890, predicted: 1250, plan: 1440 },
    { month: '5月', target: 1460, completed: 820, predicted: 1100, plan: 1380 },
    { month: '6月', target: 1500, completed: 880, predicted: 1150, plan: 1420 },
    { month: '7月', target: 1450, completed: 860, predicted: 1100, plan: 1370 },
    { month: '8月', target: 1490, completed: 840, predicted: 1080, plan: 1410 },
    { month: '9月', target: 1470, completed: 870, predicted: 1120, plan: 1390 },
    { month: '10月', target: 1510, completed: 900, predicted: 1180, plan: 1430 },
    { month: '11月', target: 1480, completed: 880, predicted: 1150, plan: 1400 },
    { month: '12月', target: 1460, completed: 850, predicted: 1100, plan: 1380 },
  ],
  '一区': [
    { month: '1月', target: 320, completed: 65, predicted: 175, plan: 300 },
    { month: '2月', target: 300, completed: 70, predicted: 185, plan: 280 },
    { month: '3月', target: 330, completed: 85, predicted: 205, plan: 310 },
    { month: '4月', target: 340, completed: 90, predicted: 215, plan: 320 },
    { month: '5月', target: 320, completed: 82, predicted: 200, plan: 300 },
    { month: '6月', target: 330, completed: 88, predicted: 210, plan: 310 },
    { month: '7月', target: 325, completed: 86, predicted: 206, plan: 305 },
    { month: '8月', target: 335, completed: 84, predicted: 208, plan: 315 },
    { month: '9月', target: 328, completed: 87, predicted: 207, plan: 308 },
    { month: '10月', target: 340, completed: 90, predicted: 216, plan: 320 },
    { month: '11月', target: 330, completed: 88, predicted: 211, plan: 310 },
    { month: '12月', target: 325, completed: 85, predicted: 206, plan: 305 },
  ],
  '二区': [
    { month: '1月', target: 232, completed: 100, predicted: 200, plan: 218 },
    { month: '2月', target: 220, completed: 110, predicted: 215, plan: 206 },
    { month: '3月', target: 240, completed: 130, predicted: 245, plan: 225 },
    { month: '4月', target: 245, completed: 140, predicted: 265, plan: 230 },
    { month: '5月', target: 235, completed: 125, predicted: 243, plan: 220 },
    { month: '6月', target: 240, completed: 135, predicted: 257, plan: 225 },
    { month: '7月', target: 238, completed: 132, predicted: 252, plan: 223 },
    { month: '8月', target: 242, completed: 128, predicted: 252, plan: 227 },
    { month: '9月', target: 240, completed: 130, predicted: 253, plan: 225 },
    { month: '10月', target: 248, completed: 135, predicted: 261, plan: 233 },
    { month: '11月', target: 242, completed: 132, predicted: 256, plan: 227 },
    { month: '12月', target: 238, completed: 128, predicted: 250, plan: 223 },
  ],
  '五区': [
    { month: '1月', target: 260, completed: 120, predicted: 220.4, plan: 245 },
    { month: '2月', target: 250, completed: 130, predicted: 240, plan: 235 },
    { month: '3月', target: 270, completed: 150, predicted: 280, plan: 253 },
    { month: '4月', target: 280, completed: 160, predicted: 300, plan: 262 },
    { month: '5月', target: 265, completed: 145, predicted: 277, plan: 248 },
    { month: '6月', target: 275, completed: 155, predicted: 293, plan: 257 },
    { month: '7月', target: 270, completed: 152, predicted: 287, plan: 253 },
    { month: '8月', target: 278, completed: 148, predicted: 288, plan: 260 },
    { month: '9月', target: 272, completed: 150, predicted: 287, plan: 255 },
    { month: '10月', target: 285, completed: 158, predicted: 302, plan: 267 },
    { month: '11月', target: 278, completed: 155, predicted: 296, plan: 260 },
    { month: '12月', target: 272, completed: 150, predicted: 288, plan: 255 },
  ],
  '华中': [
    { month: '1月', target: 152, completed: 152, predicted: 152, plan: 145 },
    { month: '2月', target: 145, completed: 155, predicted: 155, plan: 138 },
    { month: '3月', target: 158, completed: 160, predicted: 160, plan: 150 },
    { month: '4月', target: 162, completed: 165, predicted: 165, plan: 154 },
    { month: '5月', target: 155, completed: 158, predicted: 158, plan: 147 },
    { month: '6月', target: 160, completed: 162, predicted: 162, plan: 152 },
    { month: '7月', target: 158, completed: 160, predicted: 160, plan: 150 },
    { month: '8月', target: 162, completed: 158, predicted: 158, plan: 154 },
    { month: '9月', target: 160, completed: 161, predicted: 161, plan: 152 },
    { month: '10月', target: 165, completed: 163, predicted: 163, plan: 157 },
    { month: '11月', target: 162, completed: 160, predicted: 160, plan: 154 },
    { month: '12月', target: 158, completed: 155, predicted: 155, plan: 150 },
  ],
  '华北': [
    { month: '1月', target: 160, completed: 120, predicted: 189.1, plan: 152 },
    { month: '2月', target: 155, completed: 128, predicted: 200, plan: 147 },
    { month: '3月', target: 165, completed: 135, predicted: 213, plan: 157 },
    { month: '4月', target: 170, completed: 140, predicted: 222, plan: 161 },
    { month: '5月', target: 162, completed: 132, predicted: 208, plan: 154 },
    { month: '6月', target: 168, completed: 138, predicted: 218, plan: 160 },
    { month: '7月', target: 165, completed: 136, predicted: 214, plan: 157 },
    { month: '8月', target: 170, completed: 134, predicted: 216, plan: 161 },
    { month: '9月', target: 166, completed: 137, predicted: 217, plan: 158 },
    { month: '10月', target: 172, completed: 142, predicted: 226, plan: 163 },
    { month: '11月', target: 168, completed: 138, predicted: 219, plan: 160 },
    { month: '12月', target: 164, completed: 135, predicted: 214, plan: 156 },
  ],
  '西南': [
    { month: '1月', target: 128, completed: 20, predicted: 30.8, plan: 122 },
    { month: '2月', target: 125, completed: 22, predicted: 34, plan: 119 },
    { month: '3月', target: 135, completed: 25, predicted: 39, plan: 128 },
    { month: '4月', target: 140, completed: 28, predicted: 44, plan: 133 },
    { month: '5月', target: 130, completed: 24, predicted: 37, plan: 123 },
    { month: '6月', target: 135, completed: 26, predicted: 41, plan: 128 },
    { month: '7月', target: 132, completed: 25, predicted: 39, plan: 125 },
    { month: '8月', target: 138, completed: 24, predicted: 40, plan: 131 },
    { month: '9月', target: 134, completed: 25, predicted: 40, plan: 127 },
    { month: '10月', target: 142, completed: 27, predicted: 44, plan: 135 },
    { month: '11月', target: 136, completed: 26, predicted: 41, plan: 129 },
    { month: '12月', target: 132, completed: 24, predicted: 38, plan: 125 },
  ],
  '华南': [
    { month: '1月', target: 176, completed: 100, predicted: 210, plan: 167 },
    { month: '2月', target: 170, completed: 105, predicted: 220, plan: 161 },
    { month: '3月', target: 182, completed: 115, predicted: 240, plan: 173 },
    { month: '4月', target: 188, completed: 120, predicted: 250, plan: 179 },
    { month: '5月', target: 178, completed: 112, predicted: 234, plan: 169 },
    { month: '6月', target: 185, completed: 118, predicted: 246, plan: 176 },
    { month: '7月', target: 180, completed: 116, predicted: 242, plan: 171 },
    { month: '8月', target: 187, completed: 114, predicted: 244, plan: 178 },
    { month: '9月', target: 182, completed: 117, predicted: 245, plan: 173 },
    { month: '10月', target: 192, completed: 122, predicted: 256, plan: 182 },
    { month: '11月', target: 185, completed: 118, predicted: 248, plan: 176 },
    { month: '12月', target: 178, completed: 114, predicted: 240, plan: 169 },
  ],
};

export default function GMDashboard() {
  const [theme, setTheme] = useState<Theme>('light');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'current' | 'threeMonth' | 'sixMonth'>('current');
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [trendRegion, setTrendRegion] = useState('all');

  // 主题颜色类 - 解决浅色模式对比度问题
  const textMuted = theme === 'dark' ? 'text-slate-600' : 'text-slate-600';
  const textSecondary = theme === 'dark' ? 'text-slate-700' : 'text-slate-700';
  const cardBg = theme === 'dark' ? 'bg-slate-900/50' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-slate-800' : 'border-slate-200';
  const subCardBg = theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50';
  const subCardBorder = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';

  // 获取当前时间范围的数据
  const getTimeRangeData = () => {
    if (selectedTimeRange === 'current') return forecastOverviewData.currentMonth;
    if (selectedTimeRange === 'threeMonth') return forecastOverviewData.threeMonth;
    return forecastOverviewData.sixMonth;
  };

  // 计算达成率
  const getAchievementRate = () => {
    const data = getTimeRangeData();
    return ((data.forecast / data.target) * 100).toFixed(1);
  };

  // 计算缺口
  const getGap = () => {
    const data = getTimeRangeData();
    return data.target - data.forecast;
  };

  // 获取当前时间范围的数据
  const currentData = regionData[timeRange as keyof typeof regionData] || [];

  // 计算合计数据
  const totals = currentData.reduce((acc, item) => ({
    target: acc.target + item.target,
    completed: acc.completed + item.completed,
    predicted: acc.predicted + item.predicted,
    pendingAmount: acc.pendingAmount + (item.pendingAmount || 0),
  }), { target: 0, completed: 0, predicted: 0, pendingAmount: 0 });

  const totalTarget = totals.target;
  const totalCompleted = totals.completed;
  const totalPredicted = totals.predicted;
  const totalGap = totalTarget - totalPredicted;
  const totalPendingAmount = totals.pendingAmount;

  // 切换主题
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'} min-h-screen`}>
      {/* 顶部导航栏 */}
      <header className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border-b backdrop-blur-sm sticky top-0 z-50`}>
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className={`${theme === 'dark' ? 'text-slate-600 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{PAGE_TITLE}</h1>
                <p className={`text-sm ${textSecondary}`}>预测驱动 · 数据赋能 · 精准决策</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant={getGap() < 0 ? 'default' : 'destructive'} className="text-sm px-4 py-1.5">
                {getGap() < 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    预计超额完成 {Math.abs(getGap()).toFixed(0)}万
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 mr-1" />
                    目标缺口 {getGap().toFixed(0)}万
                  </>
                )}
              </Badge>

              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Badge variant="outline" className="text-sm">
                张晖
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="max-w-[1920px] mx-auto p-6">
          <div className="space-y-6">
            {/* 核心预测决策卡片 - 新设计 */}
            <PredictionDecisionCard
              theme={theme}
              data={{
                target: getTimeRangeData().target,
                forecast: getTimeRangeData().forecast,
                completed: getTimeRangeData().completed,
                achievementRate: parseFloat(getAchievementRate()),
                gap: getGap(),
                trendDirection: getGap() < 0 ? 'up' : getGap() === 0 ? 'stable' : 'down',
                trendData: forecastTrendData
              }}
              onSupportFactorHover={(factor) => {
                console.log('支撑因子悬停:', factor);
              }}
              onRiskFactorHover={(risk) => {
                console.log('风险因子悬停:', risk);
              }}
            />

            {/* 未来支撑充分性面板 - Future Support Adequacy Panel */}
            <FutureSupportAdequacyPanel theme={theme} />

            {/* 时间范围选择器 */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">时间范围：</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="month">月度</option>
                <option value="quarter">季度</option>
                <option value="year">年度</option>
              </select>
            </div>

            {/* 区域达成情况 */}
            <Card className={`${cardBg} ${cardBorder}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  区域达成情况
                  <span className="text-sm font-normal text-slate-600">
                    ({timeRange === 'month' ? `${selectedMonth}月` : timeRange === 'quarter' ? selectedQuarter : '2026年'})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 合计信息 */}
                <div className="flex items-center gap-3 text-xs mb-4">
                  <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold">合计</span>
                    <span className="w-px h-3 bg-slate-300"></span>
                    <span className="text-slate-600">目标 <span className="font-bold text-slate-900">{totalTarget.toLocaleString()}</span>万元</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">已完成 <span className="font-bold text-slate-900">{totalCompleted.toLocaleString()}</span>万元</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">预测 <span className="font-bold text-slate-900">{totalPredicted.toLocaleString()}</span>万元</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">缺口 <span className={`font-bold ${totalGap > 0 ? 'text-red-600' : totalGap < 0 ? 'text-green-600' : 'text-slate-900'}`}>{totalGap.toLocaleString()}</span>万元</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">在手 <span className="font-bold text-slate-900">{totalPendingAmount.toLocaleString()}</span>万元</span>
                  </div>
                </div>

                {/* 区域表格 */}
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ tableLayout: 'fixed' }}>
                    <colgroup>
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '11%' }} />
                      <col style={{ width: '11%' }} />
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '11%' }} />
                      <col style={{ width: '15%' }} />
                      <col style={{ width: '11%' }} />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-2 py-2 text-center text-sm font-medium text-slate-500">大区</th>
                        <th className="px-2 py-2 text-center text-sm font-medium text-slate-500">责任人</th>
                        <th className="px-2 py-2 text-center text-sm font-medium text-slate-500">目标</th>
                        <th className="px-2 py-2 text-center text-sm font-medium text-slate-500">已完成</th>
                        <th className="px-2 py-2 text-center text-sm font-medium text-slate-500 whitespace-nowrap">预测金额</th>
                        <th className="px-2 py-2 text-center text-sm font-medium text-slate-500 whitespace-nowrap">缺口</th>
                        <th className="px-2 py-2 text-center text-sm font-medium text-slate-500 whitespace-nowrap">预测达成率</th>
                        <th className="px-2 py-2 text-center text-sm font-medium text-slate-500 whitespace-nowrap">在手项目</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-slate-50">
                          <td className="px-2 py-2.5 text-center">
                            <span className="text-sm font-medium text-slate-900">{item.name}</span>
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <span className="text-sm text-slate-600 truncate">{item.owner}</span>
                          </td>
                          <td className="px-2 py-2.5 text-sm text-center text-slate-600">{item.target.toLocaleString()}</td>
                          <td className="px-2 py-2.5 text-sm text-center text-slate-600">{item.completed.toLocaleString()}</td>
                          <td className="px-2 py-2.5 text-sm text-center text-slate-600">{item.predicted.toLocaleString()}</td>
                          <td className={`px-2 py-2.5 text-sm text-center font-semibold ${item.gap > 0 ? 'text-red-500' : item.gap === 0 ? 'text-slate-600' : 'text-green-500'}`}>
                            {item.gap > 0 ? `${item.gap}` : item.gap === 0 ? '0' : `+${Math.abs(item.gap)}`}
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100">
                              <span className={`text-sm font-bold ${
                                item.rate >= 100 ? 'text-green-600' : item.rate >= 80 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {item.rate.toFixed(1)}%
                              </span>
                              <div className="w-8 h-1.5 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    item.rate >= 100 ? 'bg-green-500' : item.rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(item.rate, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2.5 text-sm text-center text-slate-600">
                            {item.pendingAmount?.toLocaleString() || '0'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 月度趋势分析 */}
            <Card className={`${cardBg} ${cardBorder}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    月度趋势分析
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">地区筛选：</span>
                    <select
                      value={trendRegion}
                      onChange={(e) => setTrendRegion(e.target.value)}
                      className="px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="all">全部地区</option>
                      <option value="一区">一区</option>
                      <option value="二区">二区</option>
                      <option value="五区">五区</option>
                      <option value="华中">华中</option>
                      <option value="华北">华北</option>
                      <option value="西南">西南</option>
                      <option value="华南">华南</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyTrendData[trendRegion as keyof typeof monthlyTrendData] || monthlyTrendData.all}>
                        <defs>
                          <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 11 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 11 }}
                          tickFormatter={(value) => `${value}万`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                          formatter={(value: number, name: string) => [`${value}万`, name]}
                          labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                        />
                        <Legend
                          verticalAlign="top"
                          height={30}
                          iconType="circle"
                          formatter={(value) => {
                            const colorMap: { [key: string]: string } = {
                              '业务目标': '#3B82F6',
                              '财务目标': '#8B5CF6',
                              '已完成': '#10B981',
                              '预测完成': '#F59E0B',
                            };
                            return <span style={{ color: '#374151', fontSize: 13 }}>{value}</span>;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="target"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          fillOpacity={0}
                          name="业务目标"
                        />
                        <Area
                          type="monotone"
                          dataKey="plan"
                          stroke="#8B5CF6"
                          strokeWidth={2.5}
                          fillOpacity={0}
                          name="财务目标"
                        />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke="#10B981"
                          strokeWidth={2}
                          fill="url(#colorCompleted)"
                          name="已完成"
                        />
                        <Area
                          type="monotone"
                          dataKey="predicted"
                          stroke="#F59E0B"
                          strokeWidth={2.5}
                          fill="url(#colorPredicted)"
                          name="预测完成"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 风险预警面板 */}
            <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    风险预警
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 项目风险 */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="font-semibold text-sm">项目风险（30天无动作）</span>
                      </div>
                      <div className="space-y-2">
                        {riskData.projectRisks.map((risk) => (
                          <div
                            key={risk.projectId}
                            className={`${theme === 'dark' ? 'bg-red-950/20 border-red-500/30' : 'bg-red-50 border-red-200'} border rounded p-2 text-xs`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{risk.projectName}</span>
                              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                                影响-{risk.impact}万
                              </Badge>
                            </div>
                            <div className="text-slate-700">
                              责任人: {risk.owner} · {risk.days}天无动作
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* 人员风险 */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-sm">人员风险（SOP不达标）</span>
                      </div>
                      <div className="space-y-2">
                        {riskData.personnelRisks.map((risk) => (
                          <div
                            key={risk.personId}
                            className={`${theme === 'dark' ? 'bg-orange-950/20 border-orange-500/30' : 'bg-orange-50 border-orange-200'} border rounded p-2 text-xs`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{risk.name}</span>
                              <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">
                                SOP合规率 {risk.sopRate}%
                              </Badge>
                            </div>
                            <div className="text-slate-700">
                              影响预测-{Math.abs(risk.impact)}万 · 管辖{risk.projectCount}个项目
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
      </main>
    </div>
  );
}
