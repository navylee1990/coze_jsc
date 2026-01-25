'use client';

import { useState, useMemo, useEffect } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Clock, ChevronRight, BarChart3, Play, ChevronLeft, X, TrendingDown, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PredictionDecisionCard from '@/components/PredictionDecisionCard';
import FutureSupportAdequacyPanel from '@/components/FutureSupportAdequacyPanel';
import RegionMatrix from '@/components/RegionMatrix';
import RiskIdentificationPanel from '@/components/RiskIdentificationPanel';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

// 页面标题
const PAGE_TITLE = '商用总经理驾驶舱';

// ========== 项目数据结构与延迟计算逻辑 ==========

// 项目接口定义
interface Project {
  id: string;
  name: string;
  amount: number; // 项目金额（万元）
  plannedDate: string; // 计划完成日期（YYYY-MM格式，如 "2026-01"）
  actualDate?: string; // 实际完成日期（YYYY-MM格式，为空表示未完成）
  status: 'in_progress' | 'completed' | 'cancelled' | 'pending';
  region: string; // 所属区域
  owner: string; // 负责人
}

// 示例项目数据（实际应从API获取）
const projectsData: Project[] = [
  // ========== 1月延迟项目（3个项目，总金额200万）==========
  { id: 'P001', name: '北京协和医院项目', amount: 70, plannedDate: '2026-01', actualDate: undefined, status: 'in_progress', region: '一区', owner: '李强' },
  { id: 'P002', name: '广州某企业办公楼项目', amount: 80, plannedDate: '2026-01', actualDate: undefined, status: 'in_progress', region: '二区', owner: '陈超' },
  { id: 'P003', name: '西安某学校项目', amount: 50, plannedDate: '2026-01', actualDate: undefined, status: 'in_progress', region: '华中', owner: '吴敏' },

  // ========== 1月已完成项目（9个项目，总金额800万）==========
  { id: 'P004', name: '天津某医院项目', amount: 90, plannedDate: '2026-01', actualDate: '2026-01', status: 'completed', region: '一区', owner: '王芳' },
  { id: 'P005', name: '湖北某学校项目', amount: 100, plannedDate: '2026-01', actualDate: '2026-01', status: 'completed', region: '华中', owner: '郑浩' },
  { id: 'P006', name: '河南某企业项目', amount: 80, plannedDate: '2026-01', actualDate: '2026-01', status: 'completed', region: '华中', owner: '孙丽' },
  { id: 'P007', name: '山西某办公楼项目', amount: 85, plannedDate: '2026-01', actualDate: '2026-01', status: 'completed', region: '华北', owner: '马龙' },
  { id: 'P008', name: '内蒙古某医院项目', amount: 75, plannedDate: '2026-01', actualDate: '2026-01', status: 'completed', region: '华北', owner: '林婷' },
  { id: 'P009', name: '湖南某企业项目', amount: 120, plannedDate: '2026-01', actualDate: '2026-01', status: 'completed', region: '华中', owner: '吴敏' },
  { id: 'P010', name: '广东某学校项目', amount: 90, plannedDate: '2026-01', actualDate: '2026-01', status: 'completed', region: '华南', owner: '徐婷婷' },
  { id: 'P011', name: '广西某办公楼项目', amount: 70, plannedDate: '2026-01', actualDate: '2026-01', status: 'completed', region: '华南', owner: '梁伟' },
  { id: 'P012', name: '海南某酒店项目', amount: 90, plannedDate: '2026-01', actualDate: '2026-01', status: 'completed', region: '华南', owner: '黄静' },

  // ========== 2月延迟项目（2个项目，总金额110万）==========
  { id: 'P013', name: '河北某医院项目', amount: 50, plannedDate: '2026-02', actualDate: undefined, status: 'in_progress', region: '一区', owner: '张伟' },
  { id: 'P014', name: '江苏某企业项目', amount: 60, plannedDate: '2026-02', actualDate: undefined, status: 'in_progress', region: '二区', owner: '陈静' },

  // ========== 2月进行中项目（未延迟）==========
  { id: 'P015', name: '福建某医院项目', amount: 65, plannedDate: '2026-02', actualDate: undefined, status: 'in_progress', region: '五区', owner: '赵雪' },

  // ========== 3月延迟项目（3个项目，总金额270万）==========
  { id: 'P016', name: '浙江某学校项目', amount: 110, plannedDate: '2026-03', actualDate: undefined, status: 'in_progress', region: '二区', owner: '杨帆' },
  { id: 'P017', name: '四川某企业项目', amount: 70, plannedDate: '2026-03', actualDate: undefined, status: 'in_progress', region: '西南', owner: '胡燕' },
  { id: 'P018', name: '云南某医院项目', amount: 90, plannedDate: '2026-03', actualDate: undefined, status: 'in_progress', region: '西南', owner: '杨洋' },

  // ========== 4-6月延迟项目（4个项目，总金额400万）==========
  { id: 'P019', name: '贵州某学校项目', amount: 80, plannedDate: '2026-04', actualDate: undefined, status: 'in_progress', region: '西南', owner: '赵峰' },
  { id: 'P020', name: '江西某企业项目', amount: 85, plannedDate: '2026-04', actualDate: undefined, status: 'in_progress', region: '五区', owner: '周杰' },
  { id: 'P021', name: '河北北部某医院项目', amount: 75, plannedDate: '2026-05', actualDate: undefined, status: 'in_progress', region: '华北', owner: '韩冰' },
  { id: 'P022', name: '北京某企业办公楼项目', amount: 160, plannedDate: '2026-06', actualDate: undefined, status: 'in_progress', region: '一区', owner: '李强' },
];

/**
 * 计算延迟项目
 * 定义：原本计划在指定月份或之前完成，但实际未完成的项目
 * @param projects 项目列表
 * @param targetMonth 目标月份（YYYY-MM格式）
 * @returns 延迟项目的统计信息（数量和总金额）
 */
function calculateDelayedProjects(projects: Project[], targetMonth: string): { count: number; amount: number; projects: Project[] } {
  const delayedProjects = projects.filter(project => {
    // 1. 计划日期 <= 目标月份（应该已经完成）
    const isPlannedDue = project.plannedDate <= targetMonth;
    // 2. 实际未完成（actualDate为空或 > 目标月份）
    const isNotCompleted = !project.actualDate || project.actualDate > targetMonth;
    // 3. 项目未被取消
    const isNotCancelled = project.status !== 'cancelled';

    return isPlannedDue && isNotCompleted && isNotCancelled;
  });

  const totalAmount = delayedProjects.reduce((sum, p) => sum + p.amount, 0);

  return {
    count: delayedProjects.length,
    amount: totalAmount,
    projects: delayedProjects
  };
}

/**
 * 计算新开发项目需求
 * 定义：为弥补缺口，需要新开发的项目数量和金额
 * @param gapAmount 缺口金额
 * @param delayedAmount 延迟项目可补回的金额
 * @returns 新开发项目需求
 */
function calculateNewProjectsNeeded(gapAmount: number, delayedAmount: number): { count: number; amount: number } {
  const remainingGap = Math.max(0, gapAmount - delayedAmount);
  // 根据缺口规模动态调整平均项目金额
  // 小缺口（<500万）：平均80万
  // 中等缺口（500-1000万）：平均100万
  // 大缺口（>=1000万）：平均108万（调整以匹配10个项目=1080万，接近1180万）
  let averageProjectAmount = 80;
  if (remainingGap >= 500 && remainingGap < 1000) {
    averageProjectAmount = 100;
  } else if (remainingGap >= 1000) {
    averageProjectAmount = 108;
  }
  const count = Math.ceil(remainingGap / averageProjectAmount);
  const amount = count * averageProjectAmount;

  return { count, amount };
}

// 获取当前日期（2026年1月）
const CURRENT_DATE = new Date('2026-01-24');
const CURRENT_MONTH = '2026-01';
const CURRENT_QUARTER_START = '2026-01';
const CURRENT_QUARTER_END = '2026-03';
const CURRENT_YEAR_START = '2026-01';
const CURRENT_YEAR_END = '2026-06';

// 动态计算延迟项目
const currentMonthDelayed = calculateDelayedProjects(projectsData, CURRENT_MONTH);
const currentMonthGap = 1140 - 800; // 预测1140 - 已完成800 = 缺口340
const currentMonthNewNeeded = calculateNewProjectsNeeded(currentMonthGap, currentMonthDelayed.amount);

const threeMonthDelayed = calculateDelayedProjects(projectsData, CURRENT_QUARTER_END);
const threeMonthGap = 3420 - 2400; // 预测3420 - 已完成2400 = 缺口1020
const threeMonthNewNeeded = calculateNewProjectsNeeded(threeMonthGap, threeMonthDelayed.amount);

const sixMonthDelayed = calculateDelayedProjects(projectsData, CURRENT_YEAR_END);
const sixMonthGap = 6840 - 4800; // 预测6840 - 已完成4800 = 缺口2040
const sixMonthNewNeeded = calculateNewProjectsNeeded(sixMonthGap, sixMonthDelayed.amount);

// ========== 核心预测总览数据（使用动态计算结果） ==========
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

// 核心预测总览数据（使用动态计算结果）
const forecastOverviewData = {
  currentMonth: {
    target: 1500,
    forecast: 1140, // 76%达成率: 1500 * 0.76 = 1140
    completed: 800,
    gapSolution: {
      delayedProjects: { count: currentMonthDelayed.count, amount: currentMonthDelayed.amount },
      newProjectsNeeded: { count: currentMonthNewNeeded.count, amount: currentMonthNewNeeded.amount }
    }
  },
  threeMonth: {
    target: 4500,
    forecast: 3420, // 76%达成率: 4500 * 0.76 = 3420
    completed: 2400,
    gapSolution: {
      delayedProjects: { count: threeMonthDelayed.count, amount: threeMonthDelayed.amount },
      newProjectsNeeded: { count: threeMonthNewNeeded.count, amount: threeMonthNewNeeded.amount }
    }
  },
  sixMonth: {
    target: 9000,
    forecast: 6840, // 76%达成率: 9000 * 0.76 = 6840
    completed: 4800,
    gapSolution: {
      delayedProjects: { count: sixMonthDelayed.count, amount: sixMonthDelayed.amount },
      newProjectsNeeded: { count: sixMonthNewNeeded.count, amount: sixMonthNewNeeded.amount }
    }
  }
};



// 预测趋势图数据
// 当前时间：2026-1-24，只有1月有实际已完成数据（800万）
// 2-12月还未发生，已完成为0
// 财务目标比业务目标小20%: 1500 * 0.8 = 1200
// 预测完成比财务目标低15%~30%: 1200 * (0.7~0.85) = 840~1020万
const forecastTrendData = [
  { month: '1月', businessTarget: 1500, financialTarget: 1200, completed: 800, forecast: 900 },
  { month: '2月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 950 },
  { month: '3月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 880 },
  { month: '4月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 920 },
  { month: '5月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 960 },
  { month: '6月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 910 },
  { month: '7月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 930 },
  { month: '8月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 890 },
  { month: '9月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 940 },
  { month: '10月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 970 },
  { month: '11月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 920 },
  { month: '12月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 880 },
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

// 城市维度数据（按区域分组）
const cityData: Record<string, any[]> = {
  '一区': [
    { name: '北京市', owner: '李强', target: 180, completed: 40, predicted: 60, gap: 120, rate: 33.3, trend: 'down', orderCount: 25, projectCount: 15, pendingAmount: 70 },
    { name: '天津市', owner: '王芳', target: 80, completed: 25, predicted: 50, gap: 30, rate: 62.5, trend: 'up', orderCount: 12, projectCount: 8, pendingAmount: 35 },
    { name: '河北省', owner: '张伟', target: 60, completed: 0, predicted: 0, gap: 60, rate: 0.0, trend: 'down', orderCount: 8, projectCount: 5, pendingAmount: 15 },
  ],
  '二区': [
    { name: '上海市', owner: '刘洋', target: 120, completed: 50, predicted: 55, gap: 65, rate: 45.8, trend: 'down', orderCount: 35, projectCount: 20, pendingAmount: 45 },
    { name: '江苏省', owner: '陈静', target: 70, completed: 30, predicted: 35, gap: 35, rate: 50.0, trend: 'down', orderCount: 28, projectCount: 14, pendingAmount: 30 },
    { name: '浙江省', owner: '杨帆', target: 42, completed: 20, predicted: 10, gap: 32, rate: 23.8, trend: 'down', orderCount: 22, projectCount: 8, pendingAmount: 10 },
  ],
  '五区': [
    { name: '广东省', owner: '黄磊', target: 150, completed: 70, predicted: 60, gap: 90, rate: 40.0, trend: 'down', orderCount: 38, projectCount: 18, pendingAmount: 55 },
    { name: '福建省', owner: '赵雪', target: 60, completed: 30, predicted: 28, gap: 32, rate: 46.7, trend: 'down', orderCount: 20, projectCount: 12, pendingAmount: 25 },
    { name: '江西省', owner: '周杰', target: 50, completed: 20, predicted: 12.4, gap: 37.6, rate: 24.8, trend: 'down', orderCount: 14, projectCount: 5, pendingAmount: 15 },
  ],
  '华中': [
    { name: '湖北省', owner: '吴敏', target: 80, completed: 80, predicted: 78, gap: 2, rate: 97.5, trend: 'up', orderCount: 56, projectCount: 32, pendingAmount: 80 },
    { name: '湖南省', owner: '郑浩', target: 45, completed: 45, predicted: 44, gap: 1, rate: 97.8, trend: 'up', orderCount: 32, projectCount: 18, pendingAmount: 45 },
    { name: '河南省', owner: '孙丽', target: 27, completed: 27, predicted: 28, gap: -1, rate: 103.7, trend: 'up', orderCount: 24, projectCount: 8, pendingAmount: 25 },
  ],
  '华北': [
    { name: '山西省', owner: '马龙', target: 85, completed: 65, predicted: 37, gap: 48, rate: 43.5, trend: 'down', orderCount: 32, projectCount: 16, pendingAmount: 40 },
    { name: '内蒙古', owner: '林婷', target: 45, completed: 30, predicted: 20, gap: 25, rate: 44.4, trend: 'down', orderCount: 18, projectCount: 10, pendingAmount: 25 },
    { name: '河北省北部', owner: '韩冰', target: 30, completed: 25, predicted: 12.1, gap: 17.9, rate: 40.3, trend: 'down', orderCount: 12, projectCount: 5, pendingAmount: 10 },
  ],
  '西南': [
    { name: '四川省', owner: '胡燕', target: 80, completed: 12, predicted: 7, gap: 73, rate: 8.8, trend: 'down', orderCount: 18, projectCount: 10, pendingAmount: 25 },
    { name: '云南省', owner: '杨洋', target: 30, completed: 6, predicted: 3, gap: 27, rate: 10.0, trend: 'down', orderCount: 6, projectCount: 3, pendingAmount: 8 },
    { name: '贵州省', owner: '赵峰', target: 18, completed: 2, predicted: 0.8, gap: 17.2, rate: 4.4, trend: 'down', orderCount: 4, projectCount: 2, pendingAmount: 2 },
  ],
  '华南': [
    { name: '广东省南部', owner: '徐婷婷', target: 100, completed: 60, predicted: 65, gap: 35, rate: 65.0, trend: 'down', orderCount: 40, projectCount: 22, pendingAmount: 52 },
    { name: '广西省', owner: '梁伟', target: 50, completed: 30, predicted: 32, gap: 18, rate: 64.0, trend: 'down', orderCount: 18, projectCount: 10, pendingAmount: 28 },
    { name: '海南省', owner: '黄静', target: 26, completed: 10, predicted: 13, gap: 13, rate: 50.0, trend: 'down', orderCount: 10, projectCount: 4, pendingAmount: 10 },
  ],
};

// 业务员维度数据（按城市分组）
const salespersonData: Record<string, any[]> = {
  '北京市': [
    { name: '李强', target: 180, completed: 40, predicted: 60, gap: 120, rate: 33.3, orderCount: 25, projectCount: 15, pendingAmount: 70 },
  ],
  '天津市': [
    { name: '王芳', target: 80, completed: 25, predicted: 50, gap: 30, rate: 62.5, orderCount: 12, projectCount: 8, pendingAmount: 35 },
  ],
  '河北省': [
    { name: '张伟', target: 60, completed: 0, predicted: 0, gap: 60, rate: 0.0, orderCount: 8, projectCount: 5, pendingAmount: 15 },
  ],
  '上海市': [
    { name: '刘洋', target: 120, completed: 50, predicted: 55, gap: 65, rate: 45.8, orderCount: 35, projectCount: 20, pendingAmount: 45 },
  ],
  '江苏省': [
    { name: '陈静', target: 70, completed: 30, predicted: 35, gap: 35, rate: 50.0, orderCount: 28, projectCount: 14, pendingAmount: 30 },
  ],
  '浙江省': [
    { name: '杨帆', target: 42, completed: 20, predicted: 10, gap: 32, rate: 23.8, orderCount: 22, projectCount: 8, pendingAmount: 10 },
  ],
  '广东省': [
    { name: '黄磊', target: 150, completed: 70, predicted: 60, gap: 90, rate: 40.0, orderCount: 38, projectCount: 18, pendingAmount: 55 },
  ],
  '福建省': [
    { name: '赵雪', target: 60, completed: 30, predicted: 28, gap: 32, rate: 46.7, orderCount: 20, projectCount: 12, pendingAmount: 25 },
  ],
  '江西省': [
    { name: '周杰', target: 50, completed: 20, predicted: 12.4, gap: 37.6, rate: 24.8, orderCount: 14, projectCount: 5, pendingAmount: 15 },
  ],
  '湖北省': [
    { name: '吴敏', target: 80, completed: 80, predicted: 78, gap: 2, rate: 97.5, orderCount: 56, projectCount: 32, pendingAmount: 80 },
  ],
  '湖南省': [
    { name: '郑浩', target: 45, completed: 45, predicted: 44, gap: 1, rate: 97.8, orderCount: 32, projectCount: 18, pendingAmount: 45 },
  ],
  '河南省': [
    { name: '孙丽', target: 27, completed: 27, predicted: 28, gap: -1, rate: 103.7, orderCount: 24, projectCount: 8, pendingAmount: 25 },
  ],
  '山西省': [
    { name: '马龙', target: 85, completed: 65, predicted: 37, gap: 48, rate: 43.5, orderCount: 32, projectCount: 16, pendingAmount: 40 },
  ],
  '内蒙古': [
    { name: '林婷', target: 45, completed: 30, predicted: 20, gap: 25, rate: 44.4, orderCount: 18, projectCount: 10, pendingAmount: 25 },
  ],
  '河北省北部': [
    { name: '韩冰', target: 30, completed: 25, predicted: 12.1, gap: 17.9, rate: 40.3, orderCount: 12, projectCount: 5, pendingAmount: 10 },
  ],
  '四川省': [
    { name: '胡燕', target: 80, completed: 12, predicted: 7, gap: 73, rate: 8.8, orderCount: 18, projectCount: 10, pendingAmount: 25 },
  ],
  '云南省': [
    { name: '杨洋', target: 30, completed: 6, predicted: 3, gap: 27, rate: 10.0, orderCount: 6, projectCount: 3, pendingAmount: 8 },
  ],
  '贵州省': [
    { name: '赵峰', target: 18, completed: 2, predicted: 0.8, gap: 17.2, rate: 4.4, orderCount: 4, projectCount: 2, pendingAmount: 2 },
  ],
  '广东省南部': [
    { name: '徐婷婷', target: 100, completed: 60, predicted: 65, gap: 35, rate: 65.0, orderCount: 40, projectCount: 22, pendingAmount: 52 },
  ],
  '广西省': [
    { name: '梁伟', target: 50, completed: 30, predicted: 32, gap: 18, rate: 64.0, orderCount: 18, projectCount: 10, pendingAmount: 28 },
  ],
  '海南省': [
    { name: '黄静', target: 26, completed: 10, predicted: 13, gap: 13, rate: 50.0, orderCount: 10, projectCount: 4, pendingAmount: 10 },
  ],
};

export default function GMDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'current' | 'quarter' | 'year'>('current');
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');

  // 默认时间范围为月度
  useEffect(() => {
    setTimeRange('month');
  }, []);

  // 获取当前时间范围的数据
  const getTimeRangeData = () => {
    if (selectedTimeRange === 'current') return forecastOverviewData.currentMonth;
    if (selectedTimeRange === 'quarter') return forecastOverviewData.threeMonth;
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
  const currentData = useMemo(() => {
    return regionData[timeRange as keyof typeof regionData] || [];
  }, [timeRange]);

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
        {/* 驾驶舱风格布局 - 紧凑对齐 */}
        <div className="grid grid-cols-12 gap-2">
          {/* 中央仪表区 */}
          <div className="col-span-7 space-y-2">
            {/* 核心预测决策卡片 - 固定高度 */}
            <div className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-5 ${DASHBOARD_STYLES.glow}`} style={{ height: '520px' }}>
              <div className="flex items-center justify-between mb-4">
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
                    onClick={() => setSelectedTimeRange('quarter')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTimeRange === 'quarter'
                        ? 'bg-cyan-500/30 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-800/50 border-cyan-400/20 text-cyan-400/70'
                    } border`}
                  >
                    本季度
                  </button>
                  <button
                    onClick={() => setSelectedTimeRange('year')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTimeRange === 'year'
                        ? 'bg-cyan-500/30 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-800/50 border-cyan-400/20 text-cyan-400/70'
                    } border`}
                  >
                    本年度
                  </button>
                </div>
              </div>

              {/* 核心数据展示 - 汽车仪表盘样式 */}
              <div className="grid grid-cols-3 gap-3 mb-4">
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
                        {/* 如何补缺口 */}
                        {getGap() > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                              <span className="text-cyan-400/60">需跟进延迟项目：</span>
                              <span className="text-orange-300 font-medium">
                                {getTimeRangeData().gapSolution?.delayedProjects.count || 0}个
                              </span>
                              <span className="text-orange-300">
                                {getTimeRangeData().gapSolution?.delayedProjects.amount || 0}万
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                              <span className="text-cyan-400/60">还需新开发项目：</span>
                              <span className="text-cyan-300 font-medium">
                                {getTimeRangeData().gapSolution?.newProjectsNeeded.count || 0}个
                              </span>
                              <span className="text-cyan-300">
                                {getTimeRangeData().gapSolution?.newProjectsNeeded.amount || 0}万
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 趋势图表 */}
              <div className="bg-slate-800/30 rounded-xl p-3 border border-cyan-400/10">
                <div className="mb-2">
                  <h4 className={`text-sm font-semibold ${DASHBOARD_STYLES.neon}`}>趋势分析</h4>
                </div>
                <div style={{ height: '230px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.1)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(6,182,212,0.7)', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(6,182,212,0.7)', fontSize: 12 }}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15,23,42,0.9)',
                          border: '1px solid rgba(6,182,212,0.3)',
                          borderRadius: '8px',
                          boxShadow: '0 0 20px rgba(6,182,212,0.2)',
                        }}
                        formatter={(value: number, name: string) => [`${value}万`, name]}
                        labelStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: '10px',
                          color: 'rgba(6,182,212,0.7)',
                          fontSize: '12px'
                        }}
                      />
                      {/* 业务目标 - 实线（无填充） */}
                      <Area
                        type="monotone"
                        dataKey="businessTarget"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="none"
                        name="业务目标"
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      {/* 财务目标 - 实线（无填充） */}
                      <Area
                        type="monotone"
                        dataKey="financialTarget"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fill="none"
                        name="财务目标"
                        dot={{ fill: '#8b5cf6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      {/* 已完成 - 面积填充 */}
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="#22c55e"
                        strokeWidth={3}
                        fill="rgba(34, 197, 94, 0.25)"
                        name="已完成"
                        dot={{ fill: '#22c55e', r: 5 }}
                        activeDot={{ r: 7, stroke: '#22c55e', strokeWidth: 2 }}
                      />
                      {/* 未来预测完成 - 面积填充（虚线边框） */}
                      <Area
                        type="monotone"
                        dataKey="forecast"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        strokeDasharray="8 4"
                        fill="rgba(34, 211, 238, 0.12)"
                        name="未来预测完成"
                        dot={{ fill: '#22d3ee', r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 未来支撑充分性面板 */}
            <FutureSupportAdequacyPanel theme="dashboard" />
          </div>

          {/* 右侧仪表区 */}
          <div className="col-span-5 space-y-2">
            {/* 区域达成情况 - 固定高度 */}
            <div className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-4 ${DASHBOARD_STYLES.glow}`} style={{ height: '520px' }}>
              <RegionMatrix
                data={currentData}
                title="区域达成"
                cityData={cityData}
                salespersonData={salespersonData}
                theme="dashboard"
              />
            </div>

            {/* 风险识别模块 - 自适应高度 */}
            <div className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-0 ${DASHBOARD_STYLES.glow}`}>
              <RiskIdentificationPanel theme="dashboard" />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
