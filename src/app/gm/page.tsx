'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
const PAGE_TITLE = '商净销售预测';

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
    forecast: 3510, // 78%达成率: 4500 * 0.78 = 3510
    completed: 2250, // 50%达成率: 4500 * 0.50 = 2250
    gapSolution: {
      delayedProjects: { count: threeMonthDelayed.count, amount: threeMonthDelayed.amount },
      newProjectsNeeded: { count: threeMonthNewNeeded.count, amount: threeMonthNewNeeded.amount }
    }
  },
  sixMonth: {
    target: 9000,
    forecast: 7380, // 82%达成率: 9000 * 0.82 = 7380
    completed: 5850, // 65%达成率: 9000 * 0.65 = 5850
    gapSolution: {
      delayedProjects: { count: sixMonthDelayed.count, amount: sixMonthDelayed.amount },
      newProjectsNeeded: { count: sixMonthNewNeeded.count, amount: sixMonthNewNeeded.amount }
    }
  }
};



// 预测趋势图数据
// 当前时间：2026-1-24，只有1月有实际已完成数据（800万）
// 2-12月还未发生，已完成为0
const forecastTrendData = [
  { month: '1月', businessTarget: 3008, financialTarget: 2130, completed: 3140, forecast: 3139.9 },
  { month: '2月', businessTarget: 2005.3, financialTarget: 1380, completed: 0, forecast: 2305.3 },
  { month: '3月', businessTarget: 6015.9, financialTarget: 4180, completed: 0, forecast: 5815.9 },
  { month: '4月', businessTarget: 3509.3, financialTarget: 2421, completed: 0, forecast: 0 },
  { month: '5月', businessTarget: 4010.6, financialTarget: 2844, completed: 0, forecast: 0 },
  { month: '6月', businessTarget: 5013.3, financialTarget: 3690, completed: 0, forecast: 0 },
  { month: '7月', businessTarget: 4010.6, financialTarget: 2720, completed: 0, forecast: 0 },
  { month: '8月', businessTarget: 4511.9, financialTarget: 3135, completed: 0, forecast: 0 },
  { month: '9月', businessTarget: 5514.6, financialTarget: 3965, completed: 0, forecast: 0 },
  { month: '10月', businessTarget: 3008, financialTarget: 2082, completed: 0, forecast: 0 },
  { month: '11月', businessTarget: 4010.6, financialTarget: 2808, completed: 0, forecast: 0 },
  { month: '12月', businessTarget: 5514.6, financialTarget: 3945, completed: 0, forecast: 0 },
];

// 大区维度数据
const regionData = {
  current: [
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

  // 设置viewport meta标签，允许缩放以适应不同屏幕
  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0');
    }
  }, []);

  // 页面初始化动画 state


  // 获取当前时间范围的数据
  const currentData = useMemo(() => {
    return regionData[selectedTimeRange as keyof typeof regionData] || [];
  }, [selectedTimeRange]);

  return (
    <div className={`${DASHBOARD_STYLES.bg} ${DASHBOARD_STYLES.text} min-h-screen flex flex-col w-full overflow-hidden`}>
      {/* 顶部导航栏 */}
      <header
        className={cn(
          `${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} border-b backdrop-blur-sm flex-shrink-0 ${DASHBOARD_STYLES.glow}`,
          'transition-all duration-500',
          'opacity-100 translate-y-0'
        )}
      >
        <div className="max-w-[1920px] min-w-[1280px] mx-auto px-6 py-4">
          <div className="grid grid-cols-3 items-center">
            {/* 左侧：返回箭头 + 标题 + 登录人 */}
            <div className="flex items-center gap-4">
              <Link href="/" className={`${DASHBOARD_STYLES.textMuted} hover:text-white transition-colors`}>
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${DASHBOARD_STYLES.neon}`}>{PAGE_TITLE}</h1>
                <p className={`text-xs sm:text-sm ${DASHBOARD_STYLES.textSecondary}`}>预测驱动 · 数据赋能 · 精准决策</p>
              </div>
              <Badge
                variant="outline"
                className="text-xs sm:text-sm bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
              >
                张晖，您好
              </Badge>
            </div>

            {/* 中间：时间维度选择器居中 */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 bg-slate-800/50 border border-cyan-500/30 rounded-lg p-1">
                <button
                  onClick={() => setSelectedTimeRange('current')}
                  className={cn(
                    'px-2 sm:px-3 py-1 text-sm font-medium rounded-md transition-all',
                    selectedTimeRange === 'current'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                      : 'text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10'
                  )}
                >
                  本月
                </button>
                <button
                  onClick={() => setSelectedTimeRange('quarter')}
                  className={cn(
                    'px-2 sm:px-3 py-1 text-sm font-medium rounded-md transition-all',
                    selectedTimeRange === 'quarter'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                      : 'text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10'
                  )}
                >
                  本季度
                </button>
                <button
                  onClick={() => setSelectedTimeRange('year')}
                  className={cn(
                    'px-2 sm:px-3 py-1 text-sm font-medium rounded-md transition-all',
                    selectedTimeRange === 'year'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                      : 'text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10'
                  )}
                >
                  本年度
                </button>
              </div>
            </div>

            {/* 右侧：空占位 */}
            <div className="flex items-center justify-end">
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区 - 自适应流式布局 */}
      <main className="flex-1 flex flex-col w-full px-2 sm:px-4 md:px-6 lg:px-8 py-1 sm:py-2 lg:py-3">
        {/* 驾驶舱风格布局 - 响应式网格 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-1 sm:gap-2 md:gap-3 lg:gap-4 flex-1">

          {/* 核心预测决策卡片 - 使用新的汽车驾驶舱风格组件 */}
          <div className={cn(
            'col-span-1 xl:col-span-7',
            'transition-all duration-500',
            'opacity-100 translate-y-0',
            'flex flex-col min-h-0'
          )}>
            <div className={cn(
              `${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-0 ${DASHBOARD_STYLES.glow}`,
              'flex-1 min-h-0 flex flex-col'
            )}>
              <PredictionDecisionCard theme="dashboard" timeRange={selectedTimeRange} />
            </div>
          </div>

          {/* 风险识别模块 - 自适应高度 */}
          <div className={cn(
            'col-span-1 xl:col-span-5',
            'transition-all duration-500 delay-100',
            'opacity-100 translate-y-0',
            'flex flex-col min-h-0'
          )}>
            <div className={cn(
              'bg-slate-900/60 backdrop-blur-sm rounded-xl p-0',
              'border-2 border-red-500/40',
              'shadow-[0_0_40px_rgba(239,68,68,0.4)]',
              'hover:shadow-[0_0_50px_rgba(239,68,68,0.5)]',
              'transition-shadow duration-300',
              'flex-1 min-h-0 flex flex-col'
            )}>
              <RiskIdentificationPanel theme="dashboard" timeRange={selectedTimeRange} />
            </div>
          </div>

          {/* 区域达成情况 - 铺满整行 */}
          <div className={cn(
            'col-span-1 lg:col-span-12',
            'transition-all duration-500',
            'opacity-100 translate-y-0',
            'flex flex-col min-h-0'
          )}>
            <div className={cn(
              `${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-0 ${DASHBOARD_STYLES.glow}`,
              'flex-1 min-h-0 flex flex-col'
            )}>
              <RegionMatrix
                data={currentData}
                title="区域达成"
                cityData={cityData}
                salespersonData={salespersonData}
                theme="dashboard"
                timeRange={selectedTimeRange}
              />
            </div>
          </div>

          {/* 未来支撑充分性面板 - 已隐藏 */}
          {/* <div className={cn(
            'col-span-1 lg:col-span-12',
            'transition-all duration-500',
            'opacity-100 translate-y-0',
            'flex flex-col min-h-0'
          )}>
            <div className="flex-1 min-h-0 flex flex-col">
              <FutureSupportAdequacyPanel theme="dashboard" timeRange={selectedTimeRange} />
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}
