'use client';

import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Clock, ChevronRight, BarChart3, Play, ChevronLeft, X, TrendingDown, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PredictionDecisionCard from '@/components/PredictionDecisionCard';
import FutureSupportAdequacyPanel from '@/components/FutureSupportAdequacyPanel';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from '@/lib/utils';

// 页面标题
const PAGE_TITLE = '商用总经理驾驶舱';

// 驾驶舱样式常量
const DASHBOARD_STYLES = {
  bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
  text: 'text-cyan-50',
  textMuted: 'text-cyan-300/70',
  textSecondary: 'text-cyan-200',
  cardBg: 'bg-slate-900/60 backdrop-blur-sm',
  cardBorder: 'border-cyan-500/30',
  subCardBg: 'bg-slate-800/40 backdrop-blur-sm',
  subCardBorder: 'border-cyan-400/20',
  glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
  neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
};

// 核心预测总览数据
const forecastOverviewData = {
  currentMonth: {
    target: 1500,
    forecast: 1140, // 76%达成率: 1500 * 0.76 = 1140
    completed: 800
  },
  threeMonth: {
    target: 4500,
    forecast: 3420, // 76%达成率: 4500 * 0.76 = 3420
    completed: 2400
  },
  sixMonth: {
    target: 9000,
    forecast: 6840, // 76%达成率: 9000 * 0.76 = 6840
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
// 业务目标通常略高于财务目标（约高5-8%），用于内部激励
// completed: 实际完成值（过去月份有值，未来月份为0）
// forecast: 预测完成值（所有月份都有值）
const forecastTrendData = [
  { month: '1月', monthIndex: 1, businessTarget: 1580, financialTarget: 1500, completed: 800, forecast: 1140 },
  { month: '2月', monthIndex: 2, businessTarget: 1580, financialTarget: 1500, completed: 850, forecast: 1180 },
  { month: '3月', monthIndex: 3, businessTarget: 1580, financialTarget: 1500, completed: 900, forecast: 1120 },
  { month: '4月', monthIndex: 4, businessTarget: 1580, financialTarget: 1500, completed: 0, forecast: 1160 },
  { month: '5月', monthIndex: 5, businessTarget: 1580, financialTarget: 1500, completed: 0, forecast: 1140 },
  { month: '6月', monthIndex: 6, businessTarget: 1580, financialTarget: 1500, completed: 0, forecast: 1200 },
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
  const [selectedTimeRange, setSelectedTimeRange] = useState<'current' | 'threeMonth' | 'sixMonth'>('current');
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [trendRegion, setTrendRegion] = useState('all');

  // 当前月份（实际应用中应从数据库或系统时间获取）
  const currentMonth = 3; // 假设当前是3月，1-3月为实绩，4-6月为预测

  // 判断某个月是否为已完成（实绩）
  const isCompleted = (monthIndex: number) => monthIndex <= currentMonth;

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

  return (
    <div className={`${DASHBOARD_STYLES.bg} ${DASHBOARD_STYLES.text} min-h-screen`}>
      {/* 顶部导航栏 */}
      <header className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} border-b backdrop-blur-sm sticky top-0 z-50 ${DASHBOARD_STYLES.glow}`}>
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className={`${DASHBOARD_STYLES.textMuted} hover:text-white transition-colors`}>
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className={`text-2xl font-bold ${DASHBOARD_STYLES.neon}`}>{PAGE_TITLE}</h1>
                <p className={`text-sm ${DASHBOARD_STYLES.textSecondary}`}>预测驱动 · 数据赋能 · 精准决策</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant={getGap() < 0 ? 'default' : 'destructive'}
                className="text-sm px-4 py-1.5 bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
              >
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

              <Badge
                variant="outline"
                className="text-sm bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
              >
                张晖
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区 - 仪表盘布局 */}
      <main className="max-w-[1920px] mx-auto p-6">
        {/* 驾驶舱风格布局 */}
        <div className="grid grid-cols-12 gap-4">
          {/* 左侧仪表区 */}
          <div className="col-span-3 space-y-4">
            {/* 时间范围选择器 - 仪表盘风格 */}
            <div className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-4 ${DASHBOARD_STYLES.glow}`}>
              <h3 className={`text-sm font-semibold mb-3 ${DASHBOARD_STYLES.neon}`}>时间范围</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === 'month'
                      ? 'bg-cyan-500/30 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800/50 border-cyan-400/20 text-cyan-400/70 hover:bg-cyan-500/20'
                  } border`}
                >
                  月度
                </button>
                <button
                  onClick={() => setTimeRange('quarter')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === 'quarter'
                      ? 'bg-cyan-500/30 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800/50 border-cyan-400/20 text-cyan-400/70 hover:bg-cyan-500/20'
                  } border`}
                >
                  季度
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === 'year'
                      ? 'bg-cyan-500/30 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800/50 border-cyan-400/20 text-cyan-400/70 hover:bg-cyan-500/20'
                  } border`}
                >
                  年度
                </button>
              </div>
            </div>

            {/* 风险预警 - 警告灯风格 */}
            <div className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-4 ${DASHBOARD_STYLES.glow}`}>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${DASHBOARD_STYLES.neon}`}>
                <AlertTriangle className="w-4 h-4 text-red-400" />
                风险预警
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                  <span className="text-xs text-red-300">高风险项目</span>
                  <span className="text-lg font-bold text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">
                    2
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <span className="text-xs text-orange-300">风险人员</span>
                  <span className="text-lg font-bold text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]">
                    2
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <span className="text-xs text-yellow-300">关注事项</span>
                  <span className="text-lg font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
                    5
                  </span>
                </div>
              </div>
            </div>

            {/* 核心指标速览 */}
            <div className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-4 ${DASHBOARD_STYLES.glow}`}>
              <h3 className={`text-sm font-semibold mb-3 ${DASHBOARD_STYLES.neon}`}>核心指标</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyan-400/70">目标</span>
                  <span className="text-lg font-bold text-cyan-300">{getTimeRangeData().target.toLocaleString()}万</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyan-400/70">预测</span>
                  <span className="text-lg font-bold text-cyan-300">{getTimeRangeData().forecast.toLocaleString()}万</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyan-400/70">已完成</span>
                  <span className="text-lg font-bold text-cyan-300">{getTimeRangeData().completed.toLocaleString()}万</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyan-400/70">达成率</span>
                  <span className={`text-lg font-bold ${parseFloat(getAchievementRate()) >= 100 ? 'text-green-400' : 'text-red-400'}`}>
                    {getAchievementRate()}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 中央仪表区 */}
          <div className="col-span-6 space-y-4">
            {/* 核心预测决策卡片 - 占据大部分空间 */}
            <div className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-6 ${DASHBOARD_STYLES.glow}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-bold ${DASHBOARD_STYLES.neon} flex items-center gap-2`}>
                  <Target className="w-5 h-5" />
                  核心预测决策
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTimeRange('current')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTimeRange === 'current'
                        ? 'bg-cyan-500/30 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-800/50 border-cyan-400/20 text-cyan-400/70'
                    } border`}
                  >
                    本月
                  </button>
                  <button
                    onClick={() => setSelectedTimeRange('threeMonth')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTimeRange === 'threeMonth'
                        ? 'bg-cyan-500/30 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-800/50 border-cyan-400/20 text-cyan-400/70'
                    } border`}
                  >
                    3个月
                  </button>
                  <button
                    onClick={() => setSelectedTimeRange('sixMonth')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTimeRange === 'sixMonth'
                        ? 'bg-cyan-500/30 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-800/50 border-cyan-400/20 text-cyan-400/70'
                    } border`}
                  >
                    6个月
                  </button>
                </div>
              </div>

              {/* 核心数据展示 - 汽车仪表盘样式 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* 仪表盘1 - 目标 */}
                <div className="relative">
                  <div
                    className="rounded-xl border-2 p-3 transition-all duration-300 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-cyan-500/40"
                    style={{
                      boxShadow: '0 0 25px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.08)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* 仪表盘圆形 */}
                      <div className="relative flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* 背景圆 */}
                          <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="6"
                          />
                          {/* 刻度线 */}
                          {[...Array(12)].map((_, i) => {
                            const angle = (i * 30 - 90) * (Math.PI / 180)
                            const innerR = 28
                            const outerR = 35
                            const x1 = 50 + innerR * Math.cos(angle)
                            const y1 = 50 + innerR * Math.sin(angle)
                            const x2 = 50 + outerR * Math.cos(angle)
                            const y2 = 50 + outerR * Math.sin(angle)
                            return (
                              <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#334155"
                                strokeWidth="1"
                              />
                            )
                          })}
                          {/* 进度弧线 - 目标始终100% */}
                          <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray="220"
                            strokeDashoffset="0"
                            style={{
                              filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.8))'
                            }}
                          />
                          {/* 指针 */}
                          <g transform={`translate(50, 50)`}>
                            <line
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="-28"
                              stroke="#f97316"
                              strokeWidth="2"
                              style={{
                                transform: `rotate(135deg)`,
                                transformOrigin: '0 0',
                                filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.8))'
                              }}
                            />
                            <circle cx="0" cy="0" r="3" fill="#22d3ee" />
                          </g>
                        </svg>
                        {/* 中心数值 */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-bold text-cyan-400" style={{ textShadow: '0 0 8px rgba(34, 211, 238, 0.8)' }}>
                            100%
                          </span>
                        </div>
                      </div>
                      {/* 右侧数值 */}
                      <div className="flex-1">
                        <div className="text-xs text-cyan-400/70 mb-1">目标</div>
                        <div className="text-xl font-bold text-orange-400" style={{ textShadow: '0 0 6px rgba(251, 146, 60, 0.6)' }}>
                          {getTimeRangeData().target.toLocaleString()}
                          <span className="text-xs text-cyan-400/50 ml-1">万</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 仪表盘2 - 预测完成 */}
                <div className="relative">
                  {/* 警告角标 - 根据达成率显示颜色 */}
                  {parseFloat(getAchievementRate()) < 100 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="relative">
                        <div className={`absolute inset-0 ${parseFloat(getAchievementRate()) >= 80 ? 'bg-yellow-500' : 'bg-red-500'} rounded-full blur-sm animate-pulse`}></div>
                        <div className={`relative ${parseFloat(getAchievementRate()) >= 80 ? 'bg-yellow-500' : 'bg-red-500'} rounded-full p-1 shadow-lg`}>
                          <AlertTriangle className={`w-4 h-4 ${parseFloat(getAchievementRate()) >= 80 ? 'text-yellow-900' : 'text-red-900'}`} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className="rounded-xl border-2 p-3 transition-all duration-300 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-cyan-500/40"
                    style={{
                      boxShadow: '0 0 25px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.08)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* 仪表盘圆形 */}
                      <div className="relative flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* 背景圆 */}
                          <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="6"
                          />
                          {/* 刻度线 */}
                          {[...Array(12)].map((_, i) => {
                            const angle = (i * 30 - 90) * (Math.PI / 180)
                            const innerR = 28
                            const outerR = 35
                            const x1 = 50 + innerR * Math.cos(angle)
                            const y1 = 50 + innerR * Math.sin(angle)
                            const x2 = 50 + outerR * Math.cos(angle)
                            const y2 = 50 + outerR * Math.sin(angle)
                            return (
                              <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#334155"
                                strokeWidth="1"
                              />
                            )
                          })}
                          {/* 进度弧线 */}
                          <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray="220"
                            strokeDashoffset={220 - (220 * Math.min(parseFloat(getAchievementRate()), 100) / 100)}
                            style={{
                              filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))',
                              transition: 'stroke-dashoffset 0.5s ease-out'
                            }}
                          />
                          {/* 指针 */}
                          <g transform={`translate(50, 50)`}>
                            <line
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="-28"
                              stroke="#22d3ee"
                              strokeWidth="2.5"
                              style={{
                                transform: `rotate(${(Math.min(parseFloat(getAchievementRate()), 100) / 100) * 180 - 90}deg)`,
                                transformOrigin: '0 0',
                                filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 1))'
                              }}
                            />
                            <circle cx="0" cy="0" r="4" fill="#22d3ee" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.8))' }} />
                          </g>
                        </svg>
                        {/* 中心数值 */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={cn(
                            'text-lg font-bold',
                            parseFloat(getAchievementRate()) >= 90 ? 'text-green-400' : parseFloat(getAchievementRate()) >= 70 ? 'text-yellow-400' : 'text-red-400'
                          )} style={{ textShadow: `0 0 8px ${parseFloat(getAchievementRate()) >= 90 ? 'rgba(74, 222, 128, 0.8)' : parseFloat(getAchievementRate()) >= 70 ? 'rgba(250, 204, 21, 0.8)' : 'rgba(248, 113, 113, 0.8)'}` }}>
                            {getAchievementRate()}%
                          </span>
                        </div>
                      </div>
                      {/* 右侧数值 */}
                      <div className="flex-1">
                        <div className="text-xs text-cyan-400/70 mb-1">预测完成</div>
                        <div className={cn(
                          'text-xl font-bold',
                          getTimeRangeData().forecast >= getTimeRangeData().target ? 'text-green-400' : 'text-yellow-400'
                        )} style={{ textShadow: getTimeRangeData().forecast >= getTimeRangeData().target ? '0 0 6px rgba(74, 222, 128, 0.6)' : '0 0 6px rgba(250, 204, 21, 0.6)' }}>
                          {getTimeRangeData().forecast.toLocaleString()}
                          <span className="text-xs text-cyan-400/50 ml-1">万</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 仪表盘3 - 缺口 */}
                <div className="relative">
                  {/* 警告角标 - 根据缺口比例显示颜色 */}
                  {getGap() > 0 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="relative">
                        <div className={`absolute inset-0 ${(getGap() / getTimeRangeData().target) * 100 <= 20 ? 'bg-yellow-500' : 'bg-red-500'} rounded-full blur-sm animate-pulse`}></div>
                        <div className={`relative ${(getGap() / getTimeRangeData().target) * 100 <= 20 ? 'bg-yellow-500' : 'bg-red-500'} rounded-full p-1 shadow-lg`}>
                          <AlertTriangle className={`w-4 h-4 ${(getGap() / getTimeRangeData().target) * 100 <= 20 ? 'text-yellow-900' : 'text-red-900'}`} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      'rounded-xl border-2 p-3 transition-all duration-300',
                      getGap() <= 0
                        ? 'bg-gradient-to-br from-green-900/20 to-slate-900/90 border-green-500/40'
                        : 'bg-gradient-to-br from-red-900/20 to-slate-900/90 border-red-500/40'
                    )}
                    style={{
                      boxShadow: getGap() <= 0
                        ? '0 0 25px rgba(74, 222, 128, 0.3), inset 0 0 20px rgba(74, 222, 128, 0.08)'
                        : '0 0 25px rgba(248, 113, 113, 0.3), inset 0 0 20px rgba(248, 113, 113, 0.08)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* 仪表盘圆形 */}
                      <div className="relative flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* 背景圆 */}
                          <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="6"
                          />
                          {/* 刻度线 */}
                          {[...Array(12)].map((_, i) => {
                            const angle = (i * 30 - 90) * (Math.PI / 180)
                            const innerR = 28
                            const outerR = 35
                            const x1 = 50 + innerR * Math.cos(angle)
                            const y1 = 50 + innerR * Math.sin(angle)
                            const x2 = 50 + outerR * Math.cos(angle)
                          const y2 = 50 + outerR * Math.sin(angle)
                          return (
                              <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#334155"
                                strokeWidth="1"
                              />
                            )
                          })}
                          {/* 进度弧线 */}
                          <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke={getGap() <= 0 ? '#4ade80' : '#f87171'}
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray="220"
                            strokeDashoffset={getGap() <= 0 ? '0' : '220'}
                            style={{
                              filter: getGap() <= 0 ? 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.8))' : 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.8))',
                              transition: 'stroke-dashoffset 0.5s ease-out'
                            }}
                          />
                          {/* 指针 */}
                          <g transform={`translate(50, 50)`}>
                            <line
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="-28"
                              stroke={getGap() <= 0 ? '#4ade80' : '#f87171'}
                              strokeWidth="2.5"
                              style={{
                                transform: getGap() <= 0 ? `rotate(135deg)` : `rotate(-135deg)`,
                                transformOrigin: '0 0',
                                filter: getGap() <= 0 ? 'drop-shadow(0 0 6px rgba(74, 222, 128, 1))' : 'drop-shadow(0 0 6px rgba(248, 113, 113, 1))'
                              }}
                            />
                            <circle
                              cx="0"
                              cy="0"
                              r="4"
                              fill={getGap() <= 0 ? '#4ade80' : '#f87171'}
                              style={{ filter: getGap() <= 0 ? 'drop-shadow(0 0 4px rgba(74, 222, 128, 0.8))' : 'drop-shadow(0 0 4px rgba(248, 113, 113, 0.8))' }}
                            />
                          </g>
                        </svg>
                        {/* 中心数值 */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          {getGap() <= 0 ? (
                            <span className="text-sm font-bold text-green-400 flex items-center gap-1" style={{ textShadow: '0 0 8px rgba(74, 222, 128, 0.8)' }}>
                              <ArrowUp className="w-3 h-3" />
                              超额
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-red-400 flex items-center gap-1" style={{ textShadow: '0 0 8px rgba(248, 113, 113, 0.8)' }}>
                              <ArrowDown className="w-3 h-3" />
                              缺口
                            </span>
                          )}
                        </div>
                      </div>
                      {/* 右侧数值 */}
                      <div className="flex-1">
                        <div className="text-xs text-cyan-400/70 mb-1">{getGap() <= 0 ? '超额' : '缺口'}</div>
                        <div className={cn(
                          'text-xl font-bold',
                          getGap() <= 0 ? 'text-green-400' : 'text-red-400'
                        )} style={{ textShadow: getGap() <= 0 ? '0 0 6px rgba(74, 222, 128, 0.6)' : '0 0 6px rgba(248, 113, 113, 0.6)' }}>
                          {getGap() <= 0 ? '+' : ''}{getGap().toFixed(0)}
                          <span className="text-xs text-cyan-400/50 ml-1">万</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 趋势图表 */}
              <div className="bg-slate-800/30 rounded-xl p-4 border border-cyan-400/10">
                {/* 缺口统计 */}
                {/* 图例说明 - 更明显、更详细 */}
                <div className="mb-3 px-2 py-2 rounded-lg bg-slate-800/40 border border-cyan-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-cyan-400">趋势图例</span>
                    <span className="text-xs text-cyan-300/60">1-{currentMonth}月实绩 · {currentMonth + 1}-6月预测</span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* 实绩图例 */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <div className="w-6 h-0.5 bg-green-500 rounded-full"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                      </div>
                      <span className="text-xs text-cyan-300/80">实绩</span>
                    </div>
                    {/* 预测图例 */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <div className="w-6 h-0.5 bg-cyan-400 rounded-full" style={{ background: 'repeating-linear-gradient(90deg, #22d3ee 0, #22d3ee 8px, transparent 8px, transparent 13px)' }}></div>
                        <div className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-sky-500"></div>
                      </div>
                      <span className="text-xs text-cyan-300/80">预测</span>
                    </div>
                    {/* 缺口区域图例 */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <div className="w-6 h-3 bg-red-500/60 rounded-sm"></div>
                      </div>
                      <span className="text-xs text-cyan-300/80">缺口区域</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-cyan-500/10 text-xs text-cyan-300/50">
                    💡 红色区域 = 目标与预测的差距，红色越高表示缺口越大
                  </div>
                </div>

                <div style={{ height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastTrendData}>
                      <defs>
                        {/* 缺口区域填充 - 红色渐变，增强可见性 */}
                        <linearGradient id="colorGap" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.6}/>
                          <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3}/>
                        </linearGradient>
                        {/* 预测区域填充 - 青色渐变 */}
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4}/>
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.1}/>
                        </linearGradient>
                        {/* 已完成区域填充 */}
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.1)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(6,182,212,0.7)', fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(6,182,212,0.7)', fontSize: 11 }}
                        tickFormatter={(value) => `${value}万`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15,23,42,0.95)',
                          border: '1px solid rgba(6,182,212,0.3)',
                          borderRadius: '8px',
                          boxShadow: '0 0 20px rgba(6,182,212,0.3)',
                        }}
                        formatter={(value: number, name: string, props: any) => {
                          const monthIndex = props.payload?.monthIndex;
                          const isPast = isCompleted(monthIndex);
                          const gap = props.payload?.businessTarget - props.payload?.forecast;
                          const suffix = name === '预计完成' && !isPast ? `(缺口: ${gap.toFixed(0)}万)` : '';
                          return [`${value}万`, name, suffix];
                        }}
                        labelStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '8px' }}
                        iconType="line"
                      />

                      {/* 分界线 - 实绩和预测的分界 */}
                      <ReferenceLine
                        x={`${currentMonth}.5`}
                        stroke="#22d3ee"
                        strokeWidth={1.5}
                        strokeDasharray="6 4"
                        opacity={0.5}
                        label={{ value: '当前', position: 'topLeft', fill: '#22d3ee', fontSize: 10, fontWeight: 'bold' }}
                      />

                      {/* 目标区域填充 - 红色，表示业务目标范围 */}
                      <Area
                        type="monotone"
                        dataKey="businessTarget"
                        stroke="none"
                        fill="url(#colorGap)"
                        name="目标区域"
                      />

                      {/* 预测区域填充 - 青色，表示预测完成范围 */}
                      <Area
                        type="monotone"
                        dataKey="forecast"
                        stroke="none"
                        fill="url(#colorForecast)"
                        name="预测区域"
                      />

                      {/* 业务目标线 - 蓝色 */}
                      <Line
                        type="monotone"
                        dataKey="businessTarget"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#3b82f6' }}
                        name="业务目标"
                      />

                      {/* 财务目标线 - 紫色 */}
                      <Line
                        type="monotone"
                        dataKey="financialTarget"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 2, fill: '#8b5cf6' }}
                        name="财务目标"
                        opacity={0.7}
                      />

                      {/* 实绩线 - 绿色，粗线，只在当前及之前月份显示 */}
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="#22c55e"
                        strokeWidth={3.5}
                        fill="url(#colorCompleted)"
                        name="已完成"
                        activeDot={{ r: 6, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }}
                        dot={(props: any) => {
                          const monthIndex = props.payload?.monthIndex;
                          if (isCompleted(monthIndex) && props.payload.completed > 0) {
                            return <circle r={5} fill="#22c55e" strokeWidth={2.5} stroke="#fff" />;
                          }
                          return <circle r={0} />;
                        }}
                      />

                      {/* 预测线 - 青色虚线，只在之后月份显示 */}
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        strokeDasharray="8 5"
                        dot={(props: any) => {
                          const monthIndex = props.payload?.monthIndex;
                          const isPast = isCompleted(monthIndex);
                          // 过去月份不显示点，未来月份显示
                          if (isPast) {
                            return <circle r={0} />;
                          }
                          return <circle r={5} fill="#22d3ee" strokeWidth={2} stroke="#0ea5e9" />;
                        }}
                        name="预计完成"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 未来支撑充分性面板 */}
            <FutureSupportAdequacyPanel theme="dashboard" />
          </div>

          {/* 右侧仪表区 */}
          <div className="col-span-3 space-y-4">
            {/* 区域达成情况 */}
            <div className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-4 ${DASHBOARD_STYLES.glow}`}>
              <h3 className={`text-sm font-semibold mb-3 ${DASHBOARD_STYLES.neon} flex items-center gap-2`}>
                <Activity className="w-4 h-4" />
                区域达成
                <span className="text-xs font-normal text-cyan-400/70">
                  ({timeRange === 'month' ? `${selectedMonth}月` : timeRange === 'quarter' ? selectedQuarter : '2026年'})
                </span>
              </h3>

              {/* 合计 */}
              <div className="mb-3 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-cyan-400/70">目标：</span>
                    <span className="text-cyan-300 font-semibold ml-1">{totalTarget.toLocaleString()}万</span>
                  </div>
                  <div>
                    <span className="text-cyan-400/70">预测：</span>
                    <span className="text-cyan-300 font-semibold ml-1">{totalPredicted.toLocaleString()}万</span>
                  </div>
                </div>
              </div>

              {/* 区域列表 */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {currentData.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="p-2 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-cyan-500/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-cyan-200">{item.name}</span>
                      <span className={`text-xs font-semibold ${item.gap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {item.gap > 0 ? `${item.gap}` : `+${Math.abs(item.gap)}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-cyan-400/50">{item.owner}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400/70">{item.rate.toFixed(1)}%</span>
                        <div className="w-12 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full ${
                              item.rate >= 100 ? 'bg-green-500' : item.rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(item.rate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 月度趋势 */}
            <div className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-4 ${DASHBOARD_STYLES.glow}`}>
              <h3 className={`text-sm font-semibold mb-3 ${DASHBOARD_STYLES.neon} flex items-center gap-2`}>
                <BarChart3 className="w-4 h-4" />
                月度趋势
              </h3>
              <div className="mb-2">
                <select
                  value={trendRegion}
                  onChange={(e) => setTrendRegion(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-cyan-500/30 rounded-md bg-slate-800/50 text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
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
              <div className="bg-slate-800/30 rounded-lg p-2 border border-cyan-400/10">
                <div style={{ height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData[trendRegion as keyof typeof monthlyTrendData] || monthlyTrendData.all}>
                      <defs>
                        <linearGradient id="colorPred2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.1)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(6,182,212,0.7)', fontSize: 9 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(6,182,212,0.7)', fontSize: 9 }}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15,23,42,0.9)',
                          border: '1px solid rgba(6,182,212,0.3)',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`${value}万`, '预测']}
                      />
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        fill="url(#colorPred2)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
