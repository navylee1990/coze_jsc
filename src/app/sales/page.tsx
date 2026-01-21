'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Clock, Database, ChevronRight, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AIInsight } from '@/components/ai-insight';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// 页面标题
const PAGE_TITLE = 'AO经营看板';

// 业务员数据
const salesmenKPI = {
  totalPerformance: 1428,  // 总业绩（万元）
  totalCount: 12,          // 业务员数量
  qualifiedCount: 4,       // 达标人数
  newProjects: 23,         // 新增项目数
};

// 业务员排名数据
const salesmenRanking = [
  { rank: 1, name: '张伟', region: '一区', target: 180, completed: 195, rate: 108.3, visits: 45, newProjects: 5, status: 'excellent' },
  { rank: 2, name: '李娜', region: '华中', target: 160, completed: 168, rate: 105.0, visits: 42, newProjects: 4, status: 'excellent' },
  { rank: 3, name: '王强', region: '二区', target: 150, completed: 150, rate: 100.0, visits: 38, newProjects: 3, status: 'good' },
  { rank: 4, name: '刘芳', region: '华南', target: 145, completed: 148, rate: 102.1, visits: 35, newProjects: 4, status: 'good' },
  { rank: 5, name: '陈明', region: '五区', target: 140, completed: 136, rate: 97.1, visits: 40, newProjects: 3, status: 'warning' },
  { rank: 6, name: '杨洋', region: '华北、西北', target: 135, completed: 128, rate: 94.8, visits: 32, newProjects: 2, status: 'warning' },
  { rank: 7, name: '赵敏', region: '西南', target: 130, completed: 115, rate: 88.5, visits: 28, newProjects: 1, status: 'danger' },
  { rank: 8, name: '孙磊', region: '一区', target: 125, completed: 110, rate: 88.0, visits: 30, newProjects: 1, status: 'danger' },
  { rank: 9, name: '周婷', region: '二区', target: 120, completed: 105, rate: 87.5, visits: 25, newProjects: 0, status: 'danger' },
  { rank: 10, name: '吴刚', region: '华中', target: 118, completed: 98, rate: 83.1, visits: 22, newProjects: 0, status: 'danger' },
  { rank: 11, name: '郑平', region: '华南', target: 115, completed: 92, rate: 80.0, visits: 20, newProjects: 0, status: 'danger' },
  { rank: 12, name: '黄海', region: '西南', target: 110, completed: 85, rate: 77.3, visits: 18, newProjects: 0, status: 'danger' },
];

// 模拟数据（单位：万元）
const kpiData = {
  target: 1428,
  completed: 677,
  // 预测完成 = 已完成 + 在跟进项目预计可完成（最终预计完成总额）
  futurePredicted: 1327.3,
  // 任务缺口 = 目标 - 预测完成
  taskGap: 100.7,
  currentHealthIndex: 47.4,
  gapTrend: -54.5,
  completedTrend: -8.3,
  predictedTrend: 5.2,
  healthTrend: -10.5,

  // 缺口分析相关数据
  // 在跟进项目总金额（不是全部能完成）
  followingProjectsTotal: 5600,
  // 在跟进项目预计额外可完成（转化率约20%）
  followingProjectsPredicted: 650.3, // 额外预测金额
  // 还需新开拓 = 目标 - 预测完成
  needNewProjects: 100.7, // 1428 - 1327.3 = 100.7
  // 转化率
  conversionRate: 11.6, // 650.3 / 5600 * 100
};

// 租赁KPI数据
const leaseKPI = {
  orders: 28, // 在手订单数
  ordersAmount: 850, // 在手订单金额（万元）
};

// 续租KPI数据
const renewalKPI = {
  orders: 45, // 在手订单数
  ordersAmount: 680, // 在手订单金额（万元）
};

// 不同时间维度的预测数据 - 新增买断
// predicted: 预测完成总额（包含已完成的部分）
const timeRangeData = {
  month: {
    target: 1428,
    completed: 677,
    predicted: 1000, // 预测完成率 70.0% -> 高风险
    gap: 428,
    canComplete: false,
    // 在手项目金额
    pendingAmount: 850,
    pendingRate: 85.0,
  },
  quarter: {
    target: 4284,
    completed: 2031,
    predicted: 3000, // 预测完成率 70.0% -> 高风险
    gap: 1284,
    canComplete: false,
    // 在手项目金额
    pendingAmount: 2550,
    pendingRate: 85.0,
  },
  year: {
    target: 17136,
    completed: 8124,
    predicted: 12000, // 预测完成率 70.0% -> 高风险
    gap: 5136,
    canComplete: false,
    // 在手项目金额
    pendingAmount: 10200,
    pendingRate: 85.0,
  },
};

// 不同时间维度的预测数据 - 新增租赁
const leaseTimeRangeData = {
  month: {
    target: 856,
    completed: 412,
    predicted: 770, // 预测完成率 90.0% -> 中风险
    gap: 86,
    canComplete: false,
    // 在手项目金额
    pendingAmount: 520,
    pendingRate: 67.5,
  },
  quarter: {
    target: 2568,
    completed: 1236,
    predicted: 2310, // 预测完成率 90.0% -> 中风险
    gap: 258,
    canComplete: false,
    // 在手项目金额
    pendingAmount: 1560,
    pendingRate: 67.5,
  },
  year: {
    target: 10272,
    completed: 4944,
    predicted: 9240, // 预测完成率 90.0% -> 中风险
    gap: 1032,
    canComplete: false,
    // 在手项目金额
    pendingAmount: 6240,
    pendingRate: 67.5,
  },
};

// 不同时间维度的预测数据 - 续租
const renewalTimeRangeData = {
  month: {
    target: 680,
    completed: 520,
    predicted: 714, // 预测完成率 105.0% -> 低风险
    gap: -34,
    canComplete: true,
    // 在手项目金额
    pendingAmount: 600,
    pendingRate: 84.0,
  },
  quarter: {
    target: 2040,
    completed: 1560,
    predicted: 2142, // 预测完成率 105.0% -> 低风险
    gap: -102,
    canComplete: true,
    // 在手项目金额
    pendingAmount: 1800,
    pendingRate: 84.0,
  },
  year: {
    target: 8160,
    completed: 6240,
    predicted: 8568, // 预测完成率 105.0% -> 低风险
    gap: -408,
    canComplete: true,
    // 在手项目金额
    pendingAmount: 7200,
    pendingRate: 84.0,
  },
};

// 大区维度数据
const regionData = {
  month: [
    { name: '一区', owner: '王泽', target: 320, completed: 65, predicted: 110, gap: 210, rate: 20.3, trend: 'down', orderCount: 45, projectCount: 28 },
    { name: '二区', owner: '陈超', target: 232, completed: 100, predicted: 100, gap: 132, rate: 43.1, trend: 'down', orderCount: 85, projectCount: 42 },
    { name: '五区', owner: '张大鹏', target: 260, completed: 120, predicted: 100.4, gap: 159.6, rate: 46.2, trend: 'down', orderCount: 72, projectCount: 35 },
    { name: '华中', owner: '刘邦军', target: 152, completed: 152, predicted: 150, gap: 2, rate: 100.0, trend: 'up', orderCount: 112, projectCount: 58 },
    { name: '华北、西北', owner: '康帅', target: 160, completed: 120, predicted: 69.1, gap: 90.9, rate: 75.0, trend: 'down', orderCount: 62, projectCount: 31 },
    { name: '西南', owner: '钟莲', target: 128, completed: 20, predicted: 10.8, gap: 117.2, rate: 15.6, trend: 'down', orderCount: 28, projectCount: 15 },
    { name: '华南', owner: '徐婷婷', target: 176, completed: 100, predicted: 110, gap: 66, rate: 56.8, trend: 'down', orderCount: 68, projectCount: 36 },
  ],
  quarter: [
    { name: '一区', owner: '王泽', target: 960, completed: 195, predicted: 330, gap: 630, rate: 20.3, trend: 'down', orderCount: 135, projectCount: 84 },
    { name: '二区', owner: '陈超', target: 696, completed: 300, predicted: 300, gap: 396, rate: 43.1, trend: 'down', orderCount: 255, projectCount: 126 },
    { name: '五区', owner: '张大鹏', target: 780, completed: 360, predicted: 301.2, gap: 478.8, rate: 46.2, trend: 'down', orderCount: 216, projectCount: 105 },
    { name: '华中', owner: '刘邦军', target: 456, completed: 456, predicted: 450, gap: 6, rate: 100.0, trend: 'up', orderCount: 336, projectCount: 174 },
    { name: '华北、西北', owner: '康帅', target: 480, completed: 360, predicted: 207.3, gap: 272.7, rate: 75.0, trend: 'down', orderCount: 186, projectCount: 93 },
    { name: '西南', owner: '钟莲', target: 384, completed: 60, predicted: 32.4, gap: 351.6, rate: 15.6, trend: 'down', orderCount: 84, projectCount: 45 },
    { name: '华南', owner: '徐婷婷', target: 528, completed: 300, predicted: 330, gap: 198, rate: 56.8, trend: 'down', orderCount: 204, projectCount: 108 },
  ],
  year: [
    { name: '一区', owner: '王泽', target: 3840, completed: 780, predicted: 1320, gap: 2520, rate: 20.3, trend: 'down', orderCount: 540, projectCount: 336 },
    { name: '二区', owner: '陈超', target: 2784, completed: 1200, predicted: 1200, gap: 1584, rate: 43.1, trend: 'down', orderCount: 1020, projectCount: 504 },
    { name: '五区', owner: '张大鹏', target: 3120, completed: 1440, predicted: 1204.8, gap: 1915.2, rate: 46.2, trend: 'down', orderCount: 864, projectCount: 420 },
    { name: '华中', owner: '刘邦军', target: 1824, completed: 1824, predicted: 1800, gap: 24, rate: 100.0, trend: 'up', orderCount: 1344, projectCount: 696 },
    { name: '华北、西北', owner: '康帅', target: 1920, completed: 1440, predicted: 829.2, gap: 1090.8, rate: 75.0, trend: 'down', orderCount: 744, projectCount: 372 },
    { name: '西南', owner: '钟莲', target: 1536, completed: 240, predicted: 129.6, gap: 1406.4, rate: 15.6, trend: 'down', orderCount: 336, projectCount: 180 },
    { name: '华南', owner: '徐婷婷', target: 2112, completed: 1200, predicted: 1320, gap: 792, rate: 56.8, trend: 'down', orderCount: 816, projectCount: 432 },
  ],
};

// 城市维度数据
const cityData = {
  month: {
    '一区': [
      { name: '北京', owner: '王泽', target: 180, completed: 35, predicted: 65, gap: 115, rate: 19.4, orderCount: 28, projectCount: 18 },
      { name: '天津', owner: '王泽', target: 140, completed: 30, predicted: 45, gap: 95, rate: 21.4, orderCount: 17, projectCount: 10 },
    ],
    '二区': [
      { name: '上海', owner: '陈超', target: 132, completed: 55, predicted: 55, gap: 77, rate: 41.7, orderCount: 52, projectCount: 26 },
      { name: '苏州', owner: '陈超', target: 100, completed: 45, predicted: 45, gap: 55, rate: 45.0, orderCount: 33, projectCount: 16 },
    ],
    '五区': [
      { name: '广州', owner: '张大鹏', target: 150, completed: 70, predicted: 58, gap: 92, rate: 46.7, orderCount: 42, projectCount: 21 },
      { name: '深圳', owner: '张大鹏', target: 110, completed: 50, predicted: 42.4, gap: 67.6, rate: 45.5, orderCount: 30, projectCount: 14 },
    ],
    '华中': [
      { name: '武汉', owner: '刘邦军', target: 80, completed: 80, predicted: 78, gap: 2, rate: 100.0, orderCount: 68, projectCount: 35 },
      { name: '长沙', owner: '刘邦军', target: 72, completed: 72, predicted: 72, gap: 0, rate: 100.0, orderCount: 44, projectCount: 23 },
    ],
    '华北、西北': [
      { name: '石家庄', owner: '康帅', target: 90, completed: 65, predicted: 38, gap: 52, rate: 72.2, orderCount: 36, projectCount: 18 },
      { name: '太原', owner: '康帅', target: 70, completed: 55, predicted: 31.1, gap: 38.9, rate: 78.6, orderCount: 26, projectCount: 13 },
    ],
    '西南': [
      { name: '成都', owner: '钟莲', target: 75, completed: 12, predicted: 6.3, gap: 68.7, rate: 16.0, orderCount: 15, projectCount: 8 },
      { name: '重庆', owner: '钟莲', target: 53, completed: 8, predicted: 4.5, gap: 48.5, rate: 15.1, orderCount: 13, projectCount: 7 },
    ],
    '华南': [
      { name: '南宁', owner: '徐婷婷', target: 96, completed: 55, predicted: 60, gap: 36, rate: 57.3, orderCount: 38, projectCount: 20 },
      { name: '昆明', owner: '徐婷婷', target: 80, completed: 45, predicted: 50, gap: 30, rate: 56.3, orderCount: 30, projectCount: 16 },
    ],
  },
  quarter: {
    '一区': [
      { name: '北京', owner: '王泽', target: 540, completed: 105, predicted: 195, gap: 345, rate: 19.4, orderCount: 84, projectCount: 54 },
      { name: '天津', owner: '王泽', target: 420, completed: 90, predicted: 135, gap: 285, rate: 21.4, orderCount: 51, projectCount: 30 },
    ],
    '二区': [
      { name: '上海', owner: '陈超', target: 396, completed: 165, predicted: 165, gap: 231, rate: 41.7, orderCount: 156, projectCount: 78 },
      { name: '苏州', owner: '陈超', target: 300, completed: 135, predicted: 135, gap: 165, rate: 45.0, orderCount: 99, projectCount: 48 },
    ],
    '五区': [
      { name: '广州', owner: '张大鹏', target: 450, completed: 210, predicted: 174, gap: 276, rate: 46.7, orderCount: 126, projectCount: 63 },
      { name: '深圳', owner: '张大鹏', target: 330, completed: 150, predicted: 127.2, gap: 202.8, rate: 45.5, orderCount: 90, projectCount: 42 },
    ],
    '华中': [
      { name: '武汉', owner: '刘邦军', target: 240, completed: 240, predicted: 234, gap: 6, rate: 100.0, orderCount: 204, projectCount: 105 },
      { name: '长沙', owner: '刘邦军', target: 216, completed: 216, predicted: 216, gap: 0, rate: 100.0, orderCount: 132, projectCount: 69 },
    ],
    '华北、西北': [
      { name: '石家庄', owner: '康帅', target: 270, completed: 195, predicted: 114, gap: 156, rate: 72.2, orderCount: 108, projectCount: 54 },
      { name: '太原', owner: '康帅', target: 210, completed: 165, predicted: 93.3, gap: 116.7, rate: 78.6, orderCount: 78, projectCount: 39 },
    ],
    '西南': [
      { name: '成都', owner: '钟莲', target: 225, completed: 36, predicted: 18.9, gap: 206.1, rate: 16.0, orderCount: 45, projectCount: 24 },
      { name: '重庆', owner: '钟莲', target: 159, completed: 24, predicted: 13.5, gap: 145.5, rate: 15.1, orderCount: 39, projectCount: 21 },
    ],
    '华南': [
      { name: '南宁', owner: '徐婷婷', target: 288, completed: 165, predicted: 180, gap: 108, rate: 57.3, orderCount: 114, projectCount: 60 },
      { name: '昆明', owner: '徐婷婷', target: 240, completed: 135, predicted: 150, gap: 90, rate: 56.3, orderCount: 90, projectCount: 48 },
    ],
  },
  year: {
    '一区': [
      { name: '北京', owner: '王泽', target: 2160, completed: 420, predicted: 780, gap: 1380, rate: 19.4, orderCount: 336, projectCount: 216 },
      { name: '天津', owner: '王泽', target: 1680, completed: 360, predicted: 540, gap: 1140, rate: 21.4, orderCount: 204, projectCount: 120 },
    ],
    '二区': [
      { name: '上海', owner: '陈超', target: 1584, completed: 660, predicted: 660, gap: 924, rate: 41.7, orderCount: 624, projectCount: 312 },
      { name: '苏州', owner: '陈超', target: 1200, completed: 540, predicted: 540, gap: 660, rate: 45.0, orderCount: 396, projectCount: 192 },
    ],
    '五区': [
      { name: '广州', owner: '张大鹏', target: 1800, completed: 840, predicted: 696, gap: 1104, rate: 46.7, orderCount: 504, projectCount: 252 },
      { name: '深圳', owner: '张大鹏', target: 1320, completed: 600, predicted: 508.8, gap: 811.2, rate: 45.5, orderCount: 360, projectCount: 168 },
    ],
    '华中': [
      { name: '武汉', owner: '刘邦军', target: 960, completed: 960, predicted: 936, gap: 24, rate: 100.0, orderCount: 816, projectCount: 420 },
      { name: '长沙', owner: '刘邦军', target: 864, completed: 864, predicted: 864, gap: 0, rate: 100.0, orderCount: 528, projectCount: 276 },
    ],
    '华北、西北': [
      { name: '石家庄', owner: '康帅', target: 1080, completed: 780, predicted: 456, gap: 624, rate: 72.2, orderCount: 432, projectCount: 216 },
      { name: '太原', owner: '康帅', target: 840, completed: 660, predicted: 373.2, gap: 466.8, rate: 78.6, orderCount: 312, projectCount: 156 },
    ],
    '西南': [
      { name: '成都', owner: '钟莲', target: 900, completed: 144, predicted: 75.6, gap: 824.4, rate: 16.0, orderCount: 180, projectCount: 96 },
      { name: '重庆', owner: '钟莲', target: 636, completed: 96, predicted: 54, gap: 582, rate: 15.1, orderCount: 156, projectCount: 84 },
    ],
    '华南': [
      { name: '南宁', owner: '徐婷婷', target: 1152, completed: 660, predicted: 720, gap: 432, rate: 57.3, orderCount: 456, projectCount: 240 },
      { name: '昆明', owner: '徐婷婷', target: 960, completed: 540, predicted: 600, gap: 360, rate: 56.3, orderCount: 360, projectCount: 192 },
    ],
  },
};

// 经销商达成率排名数据
const dealerAchievementRanking = [
  { rank: 1, name: '杭州商用净水', target: 15000, completed: 10275, rate: 68.5, region: '一区', status: 'good', scale: '300万以上', yearOnYear: 12.5, ytd: 10275 },
  { rank: 2, name: '上海净泉科技', target: 12000, completed: 7704, rate: 64.2, region: '二区', status: 'good', scale: '150~300万', yearOnYear: 8.3, ytd: 7704 },
  { rank: 3, name: '南京雪濠洋环保科技有限公司', target: 13500, completed: 8343, rate: 61.8, region: '华中', status: 'good', scale: '300万以上', yearOnYear: -2.1, ytd: 8343 },
  { rank: 4, name: '苏州清泉实业', target: 11000, completed: 6435, rate: 58.5, region: '二区', status: 'warning', scale: '90~150万', yearOnYear: 5.6, ytd: 6435 },
  { rank: 5, name: '无锡净水宝', target: 15000, completed: 8250, rate: 55.0, region: '华中', status: 'warning', scale: '300万以上', yearOnYear: -8.7, ytd: 8250 },
  { rank: 6, name: '常州净康科技', target: 13000, completed: 6799, rate: 52.3, region: '五区', status: 'warning', scale: '150~300万', yearOnYear: 3.2, ytd: 6799 },
  { rank: 7, name: '宁波净水达人', target: 14500, completed: 7221, rate: 49.8, region: '华南', status: 'danger', scale: '150~300万', yearOnYear: -15.3, ytd: 7221 },
  { rank: 8, name: '合肥净源环保', target: 12000, completed: 5880, rate: 49.0, region: '华中', status: 'danger', scale: '90~150万', yearOnYear: -10.2, ytd: 5880 },
  { rank: 9, name: '南昌净水通', target: 10000, completed: 4650, rate: 46.5, region: '西南', status: 'danger', scale: '90万以内', yearOnYear: -22.5, ytd: 4650 },
  { rank: 10, name: '昆明净泉科技', target: 11000, completed: 4730, rate: 43.0, region: '西南', status: 'danger', scale: '90~150万', yearOnYear: -18.6, ytd: 4730 },
];

// 城市经理数据（城市经理负责单个城市，目标应比区域目标小）
const cityManagerData = {
  month: [
    { name: '王泽', area: '一区', city: '北京', target: 180, completed: 35, predicted: 65, gap: 115, rate: 36.1, orderCount: 28, projectCount: 18 },
    { name: '孙涛', area: '一区', city: '天津', target: 140, completed: 30, predicted: 45, gap: 95, rate: 32.1, orderCount: 17, projectCount: 10 },
    { name: '张伟', area: '二区', city: '上海', target: 132, completed: 55, predicted: 55, gap: 77, rate: 41.7, orderCount: 52, projectCount: 26 },
    { name: '李明', area: '五区', city: '广州', target: 150, completed: 70, predicted: 58, gap: 92, rate: 38.7, orderCount: 42, projectCount: 21 },
    { name: '刘强', area: '华中', city: '武汉', target: 80, completed: 80, predicted: 78, gap: 2, rate: 97.5, orderCount: 68, projectCount: 35 },
    { name: '陈刚', area: '华北、西北', city: '石家庄', target: 90, completed: 65, predicted: 38, gap: 52, rate: 72.2, orderCount: 36, projectCount: 18 },
    { name: '杨敏', area: '西南', city: '成都', target: 75, completed: 12, predicted: 6.3, gap: 68.7, rate: 16.0, orderCount: 15, projectCount: 8 },
    { name: '赵芳', area: '华南', city: '南宁', target: 96, completed: 55, predicted: 60, gap: 36, rate: 62.5, orderCount: 38, projectCount: 20 },
  ],
  quarter: [
    { name: '王泽', area: '一区', city: '北京', target: 540, completed: 105, predicted: 195, gap: 345, rate: 36.1, orderCount: 84, projectCount: 54 },
    { name: '孙涛', area: '一区', city: '天津', target: 420, completed: 90, predicted: 135, gap: 285, rate: 32.1, orderCount: 51, projectCount: 30 },
    { name: '张伟', area: '二区', city: '上海', target: 396, completed: 165, predicted: 165, gap: 231, rate: 41.7, orderCount: 156, projectCount: 78 },
    { name: '李明', area: '五区', city: '广州', target: 450, completed: 210, predicted: 174, gap: 276, rate: 38.7, orderCount: 126, projectCount: 63 },
    { name: '刘强', area: '华中', city: '武汉', target: 240, completed: 240, predicted: 234, gap: 6, rate: 97.5, orderCount: 204, projectCount: 105 },
    { name: '陈刚', area: '华北、西北', city: '石家庄', target: 270, completed: 195, predicted: 114, gap: 156, rate: 72.2, orderCount: 108, projectCount: 54 },
    { name: '杨敏', area: '西南', city: '成都', target: 225, completed: 36, predicted: 18.9, gap: 206.1, rate: 16.0, orderCount: 45, projectCount: 24 },
    { name: '赵芳', area: '华南', city: '南宁', target: 288, completed: 165, predicted: 180, gap: 108, rate: 62.5, orderCount: 114, projectCount: 60 },
  ],
  year: [
    { name: '王泽', area: '一区', city: '北京', target: 2160, completed: 420, predicted: 780, gap: 1380, rate: 36.1, orderCount: 336, projectCount: 216 },
    { name: '孙涛', area: '一区', city: '天津', target: 1680, completed: 360, predicted: 540, gap: 1140, rate: 32.1, orderCount: 204, projectCount: 120 },
    { name: '张伟', area: '二区', city: '上海', target: 1584, completed: 660, predicted: 660, gap: 924, rate: 41.7, orderCount: 624, projectCount: 312 },
    { name: '李明', area: '五区', city: '广州', target: 1800, completed: 840, predicted: 696, gap: 1104, rate: 38.7, orderCount: 504, projectCount: 252 },
    { name: '刘强', area: '华中', city: '武汉', target: 960, completed: 960, predicted: 936, gap: 24, rate: 97.5, orderCount: 816, projectCount: 420 },
    { name: '陈刚', area: '华北、西北', city: '石家庄', target: 1080, completed: 780, predicted: 456, gap: 624, rate: 72.2, orderCount: 432, projectCount: 216 },
    { name: '杨敏', area: '西南', city: '成都', target: 900, completed: 144, predicted: 75.6, gap: 824.4, rate: 16.0, orderCount: 180, projectCount: 96 },
    { name: '赵芳', area: '华南', city: '南宁', target: 1152, completed: 660, predicted: 720, gap: 432, rate: 62.5, orderCount: 456, projectCount: 240 },
  ],
};

// 经销商KPI数据
const dealerKPI = {
  totalDealers: 10,       // 总经销商数
  activeDealers: 10,      // 活跃经销商
  // 履约率分布
  below60: 5,             // 60%以下
  between60to80: 3,       // 60~80%
  between80to100: 2,      // 80~100%
  newDealers: 2,          // 新经销商数量
};

// 项目KPI数据
const projectKPI = {
  totalProjects: 89,      // 项目数
  highRiskProjects: 12,   // 高风险项目数
};

// 月度趋势数据
// predicted: 预测完成金额（包含已完成的部分，即最终预计完成总额）
const monthlyTrendData = {
  all: [
    { month: '1月', target: 1428, completed: 677, predicted: 1000 },
    { month: '2月', target: 1350, completed: 720, predicted: 1050 },
    { month: '3月', target: 1480, completed: 850, predicted: 1200 },
    { month: '4月', target: 1520, completed: 890, predicted: 1250 },
    { month: '5月', target: 1460, completed: 820, predicted: 1100 },
    { month: '6月', target: 1500, completed: 880, predicted: 1150 },
    { month: '7月', target: 1450, completed: 860, predicted: 1100 },
    { month: '8月', target: 1490, completed: 840, predicted: 1080 },
    { month: '9月', target: 1470, completed: 870, predicted: 1120 },
    { month: '10月', target: 1510, completed: 900, predicted: 1180 },
    { month: '11月', target: 1480, completed: 880, predicted: 1150 },
    { month: '12月', target: 1460, completed: 850, predicted: 1100 },
  ],
  '一区': [
    { month: '1月', target: 320, completed: 65, predicted: 175 },
    { month: '2月', target: 300, completed: 70, predicted: 185 },
    { month: '3月', target: 330, completed: 85, predicted: 205 },
    { month: '4月', target: 340, completed: 90, predicted: 215 },
    { month: '5月', target: 320, completed: 82, predicted: 200 },
    { month: '6月', target: 330, completed: 88, predicted: 210 },
    { month: '7月', target: 325, completed: 86, predicted: 206 },
    { month: '8月', target: 335, completed: 84, predicted: 208 },
    { month: '9月', target: 328, completed: 87, predicted: 207 },
    { month: '10月', target: 340, completed: 90, predicted: 216 },
    { month: '11月', target: 330, completed: 88, predicted: 211 },
    { month: '12月', target: 325, completed: 85, predicted: 206 },
  ],
  '二区': [
    { month: '1月', target: 232, completed: 100, predicted: 200 },
    { month: '2月', target: 220, completed: 110, predicted: 215 },
    { month: '3月', target: 240, completed: 130, predicted: 245 },
    { month: '4月', target: 245, completed: 140, predicted: 265 },
    { month: '5月', target: 235, completed: 125, predicted: 243 },
    { month: '6月', target: 240, completed: 135, predicted: 257 },
    { month: '7月', target: 238, completed: 132, predicted: 252 },
    { month: '8月', target: 242, completed: 128, predicted: 252 },
    { month: '9月', target: 240, completed: 130, predicted: 253 },
    { month: '10月', target: 248, completed: 135, predicted: 261 },
    { month: '11月', target: 242, completed: 132, predicted: 256 },
    { month: '12月', target: 238, completed: 128, predicted: 250 },
  ],
  '五区': [
    { month: '1月', target: 260, completed: 120, predicted: 220.4 },
    { month: '2月', target: 250, completed: 130, predicted: 240 },
    { month: '3月', target: 270, completed: 150, predicted: 280 },
    { month: '4月', target: 280, completed: 160, predicted: 300 },
    { month: '5月', target: 265, completed: 145, predicted: 277 },
    { month: '6月', target: 275, completed: 155, predicted: 293 },
    { month: '7月', target: 270, completed: 152, predicted: 287 },
    { month: '8月', target: 278, completed: 148, predicted: 288 },
    { month: '9月', target: 272, completed: 150, predicted: 287 },
    { month: '10月', target: 285, completed: 158, predicted: 302 },
    { month: '11月', target: 278, completed: 155, predicted: 296 },
    { month: '12月', target: 272, completed: 150, predicted: 288 },
  ],
  '华中': [
    { month: '1月', target: 152, completed: 152, predicted: 152 },
    { month: '2月', target: 145, completed: 155, predicted: 155 },
    { month: '3月', target: 158, completed: 160, predicted: 160 },
    { month: '4月', target: 162, completed: 165, predicted: 165 },
    { month: '5月', target: 155, completed: 158, predicted: 158 },
    { month: '6月', target: 160, completed: 162, predicted: 162 },
    { month: '7月', target: 158, completed: 160, predicted: 160 },
    { month: '8月', target: 162, completed: 158, predicted: 158 },
    { month: '9月', target: 160, completed: 161, predicted: 161 },
    { month: '10月', target: 165, completed: 163, predicted: 163 },
    { month: '11月', target: 162, completed: 160, predicted: 160 },
    { month: '12月', target: 158, completed: 155, predicted: 155 },
  ],
  '华北、西北': [
    { month: '1月', target: 160, completed: 120, predicted: 189.1 },
    { month: '2月', target: 155, completed: 128, predicted: 200 },
    { month: '3月', target: 165, completed: 135, predicted: 213 },
    { month: '4月', target: 170, completed: 140, predicted: 222 },
    { month: '5月', target: 162, completed: 132, predicted: 208 },
    { month: '6月', target: 168, completed: 138, predicted: 218 },
    { month: '7月', target: 165, completed: 136, predicted: 214 },
    { month: '8月', target: 170, completed: 134, predicted: 216 },
    { month: '9月', target: 166, completed: 137, predicted: 217 },
    { month: '10月', target: 172, completed: 142, predicted: 226 },
    { month: '11月', target: 168, completed: 138, predicted: 219 },
    { month: '12月', target: 164, completed: 135, predicted: 214 },
  ],
  '西南': [
    { month: '1月', target: 128, completed: 20, predicted: 30.8 },
    { month: '2月', target: 125, completed: 22, predicted: 34 },
    { month: '3月', target: 135, completed: 25, predicted: 39 },
    { month: '4月', target: 140, completed: 28, predicted: 44 },
    { month: '5月', target: 130, completed: 24, predicted: 37 },
    { month: '6月', target: 135, completed: 26, predicted: 41 },
    { month: '7月', target: 132, completed: 25, predicted: 39 },
    { month: '8月', target: 138, completed: 24, predicted: 40 },
    { month: '9月', target: 134, completed: 25, predicted: 40 },
    { month: '10月', target: 142, completed: 27, predicted: 44 },
    { month: '11月', target: 136, completed: 26, predicted: 41 },
    { month: '12月', target: 132, completed: 24, predicted: 38 },
  ],
  '华南': [
    { month: '1月', target: 176, completed: 100, predicted: 210 },
    { month: '2月', target: 170, completed: 105, predicted: 220 },
    { month: '3月', target: 182, completed: 115, predicted: 240 },
    { month: '4月', target: 188, completed: 120, predicted: 250 },
    { month: '5月', target: 178, completed: 112, predicted: 234 },
    { month: '6月', target: 185, completed: 118, predicted: 246 },
    { month: '7月', target: 180, completed: 116, predicted: 242 },
    { month: '8月', target: 187, completed: 114, predicted: 244 },
    { month: '9月', target: 182, completed: 117, predicted: 245 },
    { month: '10月', target: 192, completed: 122, predicted: 256 },
    { month: '11月', target: 185, completed: 118, predicted: 248 },
    { month: '12月', target: 178, completed: 114, predicted: 240 },
  ],
};

// 临期/超期项目数据
const urgentProjectsData = [
  { name: '某某连锁餐饮总部', amount: '120万', status: 'expired', days: -15 },
  { name: '某某购物中心', amount: '85万', status: 'expired', days: -8 },
  { name: '某某大酒店', amount: '200万', status: 'urgent', days: 5 },
  { name: '某某办公楼', amount: '65万', status: 'urgent', days: 12 },
  { name: '某某连锁超市', amount: '50万', status: 'urgent', days: 18 },
  { name: '某某写字楼', amount: '90万', status: 'urgent', days: 22 },
  { name: '某某医院门诊', amount: '110万', status: 'urgent', days: 25 },
  { name: '某某学校食堂', amount: '75万', status: 'urgent', days: 28 },
];

// 关联项目储备数据
const relatedProjectsData = [
  { name: '某某餐饮连锁', industry: '餐饮', completed: 450, projects: 5, potential: 300, level: 'high' },
  { name: '某某购物中心', industry: '零售', completed: 320, projects: 3, potential: 180, level: 'high' },
  { name: '某某酒店集团', industry: '酒店', completed: 280, projects: 4, potential: 250, level: 'high' },
  { name: '某某连锁超市', industry: '零售', completed: 210, projects: 2, potential: 120, level: 'medium' },
  { name: '某某办公楼宇', industry: '办公', completed: 180, projects: 1, potential: 80, level: 'low' },
  { name: '某某医院', industry: '医疗', completed: 350, projects: 4, potential: 280, level: 'high' },
  { name: '某某学校', industry: '教育', completed: 220, projects: 3, potential: 160, level: 'medium' },
  { name: '某某工业园', industry: '工业', completed: 400, projects: 6, potential: 320, level: 'high' },
];

export default function SalesDashboard() {
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [viewLevel, setViewLevel] = useState<'region' | 'city'>('region');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [trendRegion, setTrendRegion] = useState('all'); // 月度趋势地区筛选
  const [cityManagerPage, setCityManagerPage] = useState(1); // 城市经理表格分页
  const [cityManagerAreaFilter, setCityManagerAreaFilter] = useState('all'); // 城市经理区域筛选
  const cityManagerPageSize = 6;
  const cityManagerTotalPages = Math.ceil(cityManagerData.month.length / cityManagerPageSize);

  // 数据标注状态
  const [annotations, setAnnotations] = useState<Record<string, string>>({});

  const [salesmenCurrentPage, setSalesmenCurrentPage] = useState(1);
  const salesmenPageSize = 8;
  const salesmenTotalPages = Math.ceil(salesmenRanking.length / salesmenPageSize);
  const salesmenCurrentData = salesmenRanking.slice(
    (salesmenCurrentPage - 1) * salesmenPageSize,
    salesmenCurrentPage * salesmenPageSize
  );

  // 经销商达成率排名分页状态
  const [dealerCurrentPage, setDealerCurrentPage] = useState(1);
  const dealerPageSize = 8;
  
  // 经销商筛选状态
  const [dealerRegionFilter, setDealerRegionFilter] = useState('all');
  const [dealerScaleFilter, setDealerScaleFilter] = useState('all');
  const [dealerTargetRangeFilter, setDealerTargetRangeFilter] = useState('all');
  
  // 经销商排序状态
  const [dealerSortField, setDealerSortField] = useState<'rank' | 'name' | 'scale' | 'target' | 'completed' | 'rate' | 'ytd' | 'yearOnYear'>('rate');
  const [dealerSortOrder, setDealerSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // 应用筛选和排序
  const getFilteredAndSortedDealers = () => {
    let filtered = [...dealerAchievementRanking];
    
    // 区域筛选
    if (dealerRegionFilter !== 'all') {
      filtered = filtered.filter(dealer => dealer.region === dealerRegionFilter);
    }
    
    // 规模筛选
    if (dealerScaleFilter !== 'all') {
      filtered = filtered.filter(dealer => dealer.scale === dealerScaleFilter);
    }
    
    // 目标金额区间筛选
    if (dealerTargetRangeFilter !== 'all') {
      if (dealerTargetRangeFilter === 'below10000') {
        filtered = filtered.filter(dealer => dealer.target < 10000);
      } else if (dealerTargetRangeFilter === '10000to12000') {
        filtered = filtered.filter(dealer => dealer.target >= 10000 && dealer.target <= 12000);
      } else if (dealerTargetRangeFilter === '12000to14000') {
        filtered = filtered.filter(dealer => dealer.target > 12000 && dealer.target <= 14000);
      } else if (dealerTargetRangeFilter === 'above14000') {
        filtered = filtered.filter(dealer => dealer.target > 14000);
      }
    }
    
    // 排序
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (dealerSortField) {
        case 'scale':
          const scaleOrder = ['90万以内', '90~150万', '150~300万', '300万以上'];
          aVal = scaleOrder.indexOf(a.scale);
          bVal = scaleOrder.indexOf(b.scale);
          break;
        case 'target':
          aVal = a.target;
          bVal = b.target;
          break;
        case 'completed':
          aVal = a.completed;
          bVal = b.completed;
          break;
        case 'rate':
          aVal = a.rate;
          bVal = b.rate;
          break;
        case 'ytd':
          aVal = a.ytd;
          bVal = b.ytd;
          break;
        case 'yearOnYear':
          aVal = a.yearOnYear;
          bVal = b.yearOnYear;
          break;
        case 'rank':
        default:
          aVal = a.rank;
          bVal = b.rank;
      }
      
      if (aVal === bVal) return 0;
      const comparison = aVal < bVal ? -1 : 1;
      return dealerSortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };
  
  const filteredDealers = getFilteredAndSortedDealers();
  const dealerTotalPages = Math.ceil(filteredDealers.length / dealerPageSize);
  const dealerCurrentData = filteredDealers.slice(
    (dealerCurrentPage - 1) * dealerPageSize,
    dealerCurrentPage * dealerPageSize
  );
  
  // 重置页码当筛选或排序变化时
  useEffect(() => {
    setDealerCurrentPage(1);
  }, [dealerRegionFilter, dealerScaleFilter, dealerTargetRangeFilter, dealerSortField, dealerSortOrder]);
  
  // 排序切换函数
  const handleDealerSort = (field: 'rank' | 'name' | 'scale' | 'target' | 'completed' | 'rate' | 'ytd' | 'yearOnYear') => {
    if (dealerSortField === field) {
      setDealerSortOrder(dealerSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setDealerSortField(field);
      setDealerSortOrder('desc'); // 新列默认降序
    }
  };

  // 临期/超期项目分页状态
  const [urgentCurrentPage, setUrgentCurrentPage] = useState(1);
  const urgentPageSize = 5;
  const urgentTotalPages = Math.ceil(urgentProjectsData.length / urgentPageSize);
  const urgentCurrentData = urgentProjectsData.slice(
    (urgentCurrentPage - 1) * urgentPageSize,
    urgentCurrentPage * urgentPageSize
  );

  // 关联项目储备分页状态
  const [relatedCurrentPage, setRelatedCurrentPage] = useState(1);
  const relatedPageSize = 5;
  const relatedTotalPages = Math.ceil(relatedProjectsData.length / relatedPageSize);
  const relatedCurrentData = relatedProjectsData.slice(
    (relatedCurrentPage - 1) * relatedPageSize,
    relatedCurrentPage * relatedPageSize
  );

  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
    setViewLevel('city');
  };

  const handleBack = () => {
    setViewLevel('region');
    setSelectedRegion('');
  };

  // 时间范围或区域筛选变化时重置城市经理页码
  useEffect(() => {
    setCityManagerPage(1);
  }, [timeRange, cityManagerAreaFilter]);

  const currentData = viewLevel === 'city'
    ? (cityData[timeRange as keyof typeof cityData] as any)[selectedRegion] || []
    : regionData[timeRange as keyof typeof regionData];

  // 按预测达成率降序排序
  currentData.sort((a: any, b: any) => b.rate - a.rate);

  // 获取当前时间范围的目标数据
  // 如果是月度，根据选择的月份获取对应数据
  let currentRangeData;
  if (timeRange === 'month') {
    const monthIndex = parseInt(selectedMonth) - 1;
    const monthData = monthlyTrendData.all[monthIndex];
    const predictedRate = monthData ? (monthData.predicted / monthData.target) : 0;
    currentRangeData = {
      target: monthData?.target || 0,
      completed: monthData?.completed || 0,
      predicted: monthData?.predicted || 0,
      gap: monthData ? (monthData.target - monthData.predicted) : 0,
      canComplete: monthData ? (monthData.predicted >= monthData.target) : false,
      risk: predictedRate >= 1 ? 'low' : predictedRate >= 0.8 ? 'medium' : 'high',
      pendingAmount: monthData ? Math.round(monthData.predicted * 0.64) : 0, // 模拟在手项目金额
      pendingRate: monthData ? Math.round(predictedRate * 100) : 0,
    };
  } else {
    // 季度或年度使用原有数据
    currentRangeData = timeRangeData[timeRange as keyof typeof timeRangeData];
  }

  // 为季度和年度数据添加动态计算的 risk
  if (timeRange !== 'month') {
    const predictedRate = currentRangeData.predicted / currentRangeData.target;
    (currentRangeData as any).risk = predictedRate >= 1 ? 'low' : predictedRate >= 0.8 ? 'medium' : 'high';
  }
  const timeRangeLabel = timeRange === 'month' ? '月度' : timeRange === 'quarter' ? '季度' : '年度';

  // 为租赁数据计算风险等级
  const leaseCurrentData = leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData];
  const leasePredictedRate = leaseCurrentData.predicted / leaseCurrentData.target;
  (leaseCurrentData as any).risk = leasePredictedRate >= 1 ? 'low' : leasePredictedRate >= 0.8 ? 'medium' : 'high';

  // 为续租数据计算风险等级
  const renewalCurrentData = renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData];
  const renewalPredictedRate = renewalCurrentData.predicted / renewalCurrentData.target;
  (renewalCurrentData as any).risk = renewalPredictedRate >= 1 ? 'low' : renewalPredictedRate >= 0.8 ? 'medium' : 'high';

  // 计算合计数据
  const totalTarget = currentRangeData.target + leaseCurrentData.target + renewalCurrentData.target;
  const totalCompleted = currentRangeData.completed + leaseCurrentData.completed + renewalCurrentData.completed;
  const totalPredicted = currentRangeData.predicted + leaseCurrentData.predicted + renewalCurrentData.predicted;
  const totalGap = currentRangeData.gap + leaseCurrentData.gap + renewalCurrentData.gap;
  const totalPendingAmount = (currentRangeData as any).pendingAmount + (leaseCurrentData as any).pendingAmount + (renewalCurrentData as any).pendingAmount;
  const totalPredictedRate = totalPredicted / totalTarget;
  const totalRisk = totalPredictedRate >= 1 ? 'low' : totalPredictedRate >= 0.8 ? 'medium' : 'high';

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
      <div className="mb-3 bg-white p-3 rounded-lg border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
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

            {/* 月份选择器 */}
            {timeRange === 'month' && (
              <>
                <span className="text-sm font-medium text-gray-700">月份：</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {i + 1}月
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* 季度选择器 */}
            {timeRange === 'quarter' && (
              <>
                <span className="text-sm font-medium text-gray-700">季度：</span>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Q1">Q1 (1-3月)</option>
                  <option value="Q2">Q2 (4-6月)</option>
                  <option value="Q3">Q3 (7-9月)</option>
                  <option value="Q4">Q4 (10-12月)</option>
                </select>
              </>
            )}
          </div>

          {/* 右侧：企业微信拉群 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // 企业微信拉群逻辑
                alert('已启动企业微信拉群，将邀请相关成员加入讨论');
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.83 5.17c-2.71 0-5.06 1.55-5.83 3.84-1.63-1.03-3.71-1.02-5.34.02C4.94 11.03 4 13.6 4.92 15.79c.92 2.19 3.3 3.55 5.74 3.28 2.44-.27 4.43-2.09 4.68-4.44.25-2.35-1.31-4.55-3.65-5.24 1.04-1.14 2.63-1.62 4.14-1.27 1.51.35 2.76 1.45 3.2 2.88.44 1.43.03 3.01-1.07 4.06l1.41 1.41c1.66-1.59 2.28-3.98 1.59-6.19-.69-2.21-2.69-3.8-5.13-3.8zM8 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              拉群
            </button>
          </div>
        </div>
      </div>

      {/* Tab页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-3 h-10 bg-white border border-gray-200 rounded-xl shadow-sm p-1">
          <TabsTrigger value="overview" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              目标达成
            </span>
          </TabsTrigger>
          <TabsTrigger value="distributors" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              经销商
            </span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              项目
            </span>
          </TabsTrigger>
          <TabsTrigger value="salesmen" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              业务员
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* 目标达成标题 */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              目标达成
            </h2>
          </div>
        {/* KPI指标 + 月度趋势分析 左右布局 */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* 左侧：KPI指标（买断+租赁+续租）- 三行布局 */}
          <div className="w-full lg:w-1/2 flex flex-col gap-2">
            {/* 第一行：新增买断指标 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-green-50 px-3 py-1.5 border-b border-green-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-gray-800">新增买断</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* 风险等级徽章 */}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${(currentRangeData as any).risk === 'high' ? 'bg-red-100 text-red-700' : (currentRangeData as any).risk === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {(currentRangeData as any).risk === 'high' ? '🔴 高风险' : (currentRangeData as any).risk === 'medium' ? '🟡 中风险' : '🟢 低风险'}
                    </span>
                    {/* 迷你进度条 */}
                    <div className="flex items-center gap-1.5">
                      <div className={`w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden`}>
                        <div className={`h-full ${(currentRangeData as any).risk === 'high' ? 'bg-red-500' : (currentRangeData as any).risk === 'medium' ? 'bg-orange-500' : 'bg-green-500'} rounded-full`} style={{ width: `${((currentRangeData.predicted / currentRangeData.target) * 100).toFixed(0)}%` }}></div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-600">{((currentRangeData.predicted / currentRangeData.target) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5">
                {/* 目标 */}
                <div className="border-r border-b sm:border-b-0 border-gray-200 px-2 py-2 relative">
                  <div className="text-xs font-medium text-gray-500 mb-1">{timeRangeLabel}目标</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{currentRangeData.target.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                  <div className="mt-1">
                    <div className="text-xs text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded">
                      {timeRange === 'month' ? `${selectedMonth}月` : timeRange === 'quarter' ? selectedQuarter : '2026'}
                    </div>
                  </div>
                </div>

                {/* 已完成 */}
                <div className="border-b sm:border-b-0 sm:border-r border-gray-200 px-2 py-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">{timeRangeLabel}已完成</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{currentRangeData.completed.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-red-600 mt-1">
                    <ArrowDown className="w-3 h-3" />
                    <span>-8.3%</span>
                  </div>
                </div>

                {/* 预测完成 */}
                <div className="border-b sm:border-b-0 sm:border-r border-gray-200 px-2 py-2 bg-gradient-to-b from-green-50/50 to-transparent">
                  <div className="text-xs font-medium text-gray-500 mb-1">预测完成</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-green-600 leading-none">{currentRangeData.predicted.toLocaleString()}</span>
                    <span className="text-xs text-green-600">万元</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-green-600 mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>+5.2%</span>
                  </div>
                </div>

                {/* 任务缺口 - 醒目展示 */}
                <div className={`px-2 py-2 border-l-4 ${(currentRangeData as any).risk === 'high' ? 'bg-red-100 border-red-600' : (currentRangeData as any).risk === 'medium' ? 'bg-orange-100 border-orange-600' : (currentRangeData as any).risk === 'low' ? 'bg-green-100 border-green-600' : 'bg-gray-100 border-gray-400'}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${(currentRangeData as any).risk === 'high' ? 'bg-red-600 text-white' : (currentRangeData as any).risk === 'medium' ? 'bg-orange-600 text-white' : (currentRangeData as any).risk === 'low' ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}>
                      <AlertTriangle className={`w-3 h-3 ${currentRangeData.gap > 0 ? 'animate-pulse' : ''}`} />
                      <span>缺口</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black leading-none ${currentRangeData.gap > 0 ? 'text-red-700' : currentRangeData.gap < 0 ? 'text-green-700' : 'text-gray-700'}`}>
                      {currentRangeData.gap.toLocaleString()}
                    </span>
                    <span className={`text-sm font-bold ${currentRangeData.gap > 0 ? 'text-red-600' : currentRangeData.gap < 0 ? 'text-green-600' : 'text-gray-600'}`}>万元</span>
                  </div>
                  {currentRangeData.gap !== 0 && (
                    <div className={`flex items-center gap-0.5 text-xs mt-0.5 ${currentRangeData.gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {currentRangeData.gap > 0 ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                      <span className="font-bold">{currentRangeData.gap > 0 ? '-' : '+'}54.5%</span>
                    </div>
                  )}
                </div>

                {/* 在手项目金额 */}
                <div className={`px-2 py-2 border-l-4 ${(currentRangeData as any).pendingRate >= 80 ? 'border-green-600' : (currentRangeData as any).pendingRate >= 60 ? 'border-orange-600' : 'border-red-600'}`}>
                  <div className="text-xs font-medium text-gray-500 mb-1">在手项目</div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold leading-none ${(currentRangeData as any).pendingRate >= 80 ? 'text-green-700' : (currentRangeData as any).pendingRate >= 60 ? 'text-orange-700' : 'text-red-700'}`}>
                      {(currentRangeData as any).pendingAmount?.toLocaleString() || '0'}
                    </span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 第二行：新增租赁指标 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-green-50 px-3 py-1.5 border-b border-green-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-gray-800">新增租赁</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* 风险等级徽章 */}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].risk === 'high' ? 'bg-red-100 text-red-700' : leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].risk === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].risk === 'high' ? '🔴 高风险' : leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].risk === 'medium' ? '🟡 中风险' : '🟢 低风险'}
                    </span>
                    {/* 迷你进度条 */}
                    <div className="flex items-center gap-1.5">
                      <div className={`w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden`}>
                        <div className={`h-full ${leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].risk === 'high' ? 'bg-red-500' : leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].risk === 'medium' ? 'bg-orange-500' : 'bg-green-500'} rounded-full`} style={{ width: `${((leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].predicted / leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].target) * 100).toFixed(0)}%` }}></div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-600">{((leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].predicted / leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].target) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5">
                {/* 目标 */}
                <div className="border-r border-b sm:border-b-0 border-gray-200 px-2 py-2 relative">
                  <div className="text-xs font-medium text-gray-500 mb-1">{timeRangeLabel}目标</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].target.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                  <div className="mt-1">
                    <div className="text-xs text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded">
                      {timeRange === 'month' ? `${selectedMonth}月` : timeRange === 'quarter' ? selectedQuarter : '2026'}
                    </div>
                  </div>
                </div>

                {/* 已完成 */}
                <div className="border-b sm:border-b-0 sm:border-r border-gray-200 px-2 py-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">{timeRangeLabel}已完成</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].completed.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-green-600 mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>+12.5%</span>
                  </div>
                </div>

                {/* 预测完成 */}
                <div className="border-b sm:border-b-0 sm:border-r border-gray-200 px-2 py-2 bg-gradient-to-b from-green-50/50 to-transparent">
                  <div className="text-xs font-medium text-gray-500 mb-1">预测完成</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-green-600 leading-none">{leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].predicted.toLocaleString()}</span>
                    <span className="text-xs text-green-600">万元</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-green-600 mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>+8.2%</span>
                  </div>
                </div>

                {/* 任务缺口 - 醒目展示 */}
                <div className={`px-2 py-2 border-l-4 ${(leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData] as any).risk === 'high' ? 'bg-red-100 border-red-600' : (leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData] as any).risk === 'medium' ? 'bg-orange-100 border-orange-600' : (leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData] as any).risk === 'low' ? 'bg-green-100 border-green-600' : 'bg-gray-100 border-gray-400'}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${(leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData] as any).risk === 'high' ? 'bg-red-600 text-white' : (leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData] as any).risk === 'medium' ? 'bg-orange-600 text-white' : (leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData] as any).risk === 'low' ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}>
                      <AlertTriangle className={`w-3 h-3 ${leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].gap > 0 ? 'animate-pulse' : ''}`} />
                      <span>缺口</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black leading-none ${leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].gap > 0 ? 'text-red-700' : leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].gap < 0 ? 'text-green-700' : 'text-gray-700'}`}>
                      {leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].gap.toLocaleString()}
                    </span>
                    <span className={`text-sm font-bold ${leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].gap > 0 ? 'text-red-600' : leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].gap < 0 ? 'text-green-600' : 'text-gray-600'}`}>万元</span>
                  </div>
                  {leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].gap !== 0 && (
                    <div className={`flex items-center gap-0.5 text-xs mt-0.5 ${leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].gap > 0 ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                      <span className="font-bold">{leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData].gap > 0 ? '-' : '+'}7.6%</span>
                    </div>
                  )}
                </div>

                {/* 在手项目金额 */}
                <div className={`px-2 py-2 border-l-4 ${(leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData] as any).pendingRate >= 80 ? 'border-green-600' : (leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData] as any).pendingRate >= 60 ? 'border-orange-600' : 'border-red-600'}`}>
                  <div className="text-xs font-medium text-gray-500 mb-1">在手项目</div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold leading-none ${(leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData] as any).pendingRate >= 80 ? 'text-green-700' : (leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData] as any).pendingRate >= 60 ? 'text-orange-700' : 'text-red-700'}`}>
                      {(leaseTimeRangeData[timeRange as keyof typeof leaseTimeRangeData] as any).pendingAmount?.toLocaleString() || '0'}
                    </span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 第三行：续租指标 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-green-50 px-3 py-1.5 border-b border-green-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-gray-800">续租</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* 风险等级徽章 */}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].risk === 'high' ? 'bg-red-100 text-red-700' : renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].risk === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].risk === 'high' ? '🔴 高风险' : renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].risk === 'medium' ? '🟡 中风险' : '🟢 低风险'}
                    </span>
                    {/* 迷你进度条 */}
                    <div className="flex items-center gap-1.5">
                      <div className={`w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden`}>
                        <div className={`h-full ${renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].risk === 'high' ? 'bg-red-500' : renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].risk === 'medium' ? 'bg-orange-500' : 'bg-green-500'} rounded-full`} style={{ width: `${((renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].predicted / renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].target) * 100).toFixed(0)}%` }}></div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-600">{((renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].predicted / renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].target) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5">
                {/* 目标 */}
                <div className="border-r border-b sm:border-b-0 border-gray-200 px-2 py-2 relative">
                  <div className="text-xs font-medium text-gray-500 mb-1">{timeRangeLabel}目标</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].target.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                  <div className="mt-1">
                    <div className="text-xs text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded">
                      {timeRange === 'month' ? `${selectedMonth}月` : timeRange === 'quarter' ? selectedQuarter : '2026'}
                    </div>
                  </div>
                </div>

                {/* 已完成 */}
                <div className="border-b sm:border-b-0 sm:border-r border-gray-200 px-2 py-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">{timeRangeLabel}已完成</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].completed.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-green-600 mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>+15.2%</span>
                  </div>
                </div>

                {/* 预测完成 */}
                <div className="border-b sm:border-b-0 sm:border-r border-gray-200 px-2 py-2 bg-gradient-to-b from-green-50/50 to-transparent">
                  <div className="text-xs font-medium text-gray-500 mb-1">预测完成</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-green-600 leading-none">{renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].predicted.toLocaleString()}</span>
                    <span className="text-xs text-green-600">万元</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-green-600 mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>+18.5%</span>
                  </div>
                </div>

                {/* 任务缺口 - 醒目展示 */}
                <div className={`px-2 py-2 border-l-4 ${(renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData] as any).risk === 'high' ? 'bg-red-100 border-red-600' : (renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData] as any).risk === 'medium' ? 'bg-orange-100 border-orange-600' : (renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData] as any).risk === 'low' ? 'bg-green-100 border-green-600' : 'bg-gray-100 border-gray-400'}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${(renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData] as any).risk === 'high' ? 'bg-red-600 text-white' : (renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData] as any).risk === 'medium' ? 'bg-orange-600 text-white' : (renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData] as any).risk === 'low' ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}>
                      <AlertTriangle className={`w-3 h-3 ${renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].gap > 0 ? 'animate-pulse' : ''}`} />
                      <span>缺口</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black leading-none ${renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].gap > 0 ? 'text-red-700' : renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].gap < 0 ? 'text-green-700' : 'text-gray-700'}`}>
                      {renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].gap.toLocaleString()}
                    </span>
                    <span className={`text-sm font-bold ${renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].gap > 0 ? 'text-red-600' : renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].gap < 0 ? 'text-green-600' : 'text-gray-600'}`}>万元</span>
                  </div>
                  {renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].gap !== 0 && (
                    <div className={`flex items-center gap-0.5 text-xs mt-0.5 ${renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].gap > 0 ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                      <span className="font-bold">{renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData].gap > 0 ? '-' : '+'}4.3%</span>
                    </div>
                  )}
                </div>

                {/* 在手项目金额 */}
                <div className={`px-2 py-2 border-l-4 ${(renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData] as any).pendingRate >= 80 ? 'border-green-600' : (renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData] as any).pendingRate >= 60 ? 'border-orange-600' : 'border-red-600'}`}>
                  <div className="text-xs font-medium text-gray-500 mb-1">在手项目</div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold leading-none ${(renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData] as any).pendingRate >= 80 ? 'text-green-700' : (renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData] as any).pendingRate >= 60 ? 'text-orange-700' : 'text-red-700'}`}>
                      {(renewalTimeRangeData[timeRange as keyof typeof renewalTimeRangeData] as any).pendingAmount?.toLocaleString() || '0'}
                    </span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 合计行 */}
            <div className="bg-gray-100 border-t-2 border-gray-300">
              <div className="grid grid-cols-2 sm:grid-cols-5">
                {/* 目标合计 */}
                <div className="border-r border-gray-300 px-2 py-2 sm:border-r">
                  <div className="text-xs font-bold text-gray-900 mb-1">目标合计</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-900">{totalTarget.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                </div>

                {/* 已完成合计 */}
                <div className="border-r border-gray-300 px-2 py-2 sm:border-r">
                  <div className="text-xs font-bold text-gray-900 mb-1">已完成合计</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-900">{totalCompleted.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                </div>

                {/* 预测完成合计 */}
                <div className="border-r border-gray-300 px-2 py-2 sm:border-r">
                  <div className="text-xs font-bold text-gray-900 mb-1">预测完成合计</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-900">{totalPredicted.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                  <div className={`text-xs mt-1 ${totalPredictedRate >= 1 ? 'text-green-600' : totalPredictedRate >= 0.8 ? 'text-orange-600' : 'text-red-600'}`}>
                    {(totalPredictedRate * 100).toFixed(1)}%
                  </div>
                </div>

                {/* 任务缺口合计 */}
                <div className={`px-2 py-2 border-l-4 ${totalRisk === 'high' ? 'border-red-600 bg-red-100' : totalRisk === 'medium' ? 'border-orange-600 bg-orange-100' : 'border-green-600 bg-green-100'}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${totalRisk === 'high' ? 'bg-red-600 text-white' : totalRisk === 'medium' ? 'bg-orange-600 text-white' : 'bg-green-600 text-white'}`}>
                      <AlertTriangle className={`w-2.5 h-2.5 ${totalGap > 0 ? 'animate-pulse' : ''}`} />
                      <span>缺口合计</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-black leading-none ${totalGap > 0 ? 'text-red-700' : totalGap < 0 ? 'text-green-700' : 'text-gray-700'}`}>
                      {totalGap.toLocaleString()}
                    </span>
                    <span className={`text-xs font-bold ${totalGap > 0 ? 'text-red-600' : totalGap < 0 ? 'text-green-600' : 'text-gray-600'}`}>万元</span>
                  </div>
                </div>

                {/* 在手项目合计 */}
                <div className="px-2 py-2 border-l-4 border-gray-600 bg-gray-50">
                  <div className="text-xs font-medium text-gray-500 mb-1">在手项目合计</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-900">{totalPendingAmount.toLocaleString()}</span>
                    <span className="text-xs text-gray-600">万元</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：月度趋势分析 */}
          <div className="w-full lg:w-1/2 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4">
            {/* 标题和筛选器 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 gap-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-base font-bold text-gray-900">月度趋势分析</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">地区筛选：</span>
                <select
                  value={trendRegion}
                  onChange={(e) => setTrendRegion(e.target.value)}
                  className="flex-1 sm:flex-none px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">全部地区</option>
                  <option value="一区">一区</option>
                  <option value="二区">二区</option>
                  <option value="五区">五区</option>
                  <option value="华中">华中</option>
                  <option value="华北、西北">华北、西北</option>
                  <option value="西南">西南</option>
                  <option value="华南">华南</option>
                </select>
              </div>
            </div>

            {/* 趋势图表 */}
            <div className="bg-white rounded-xl p-2 sm:p-3 shadow-sm border border-gray-100">
              <div style={{ height: '200px' }} className="sm:h-[280px]">
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
                          '目标': '#3B82F6',
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
                      fillOpacity={1}
                      fill="url(#colorTarget)"
                      name="目标"
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCompleted)"
                      name="已完成"
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fillOpacity={1}
                      fill="url(#colorPredicted)"
                      name="预测完成"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* 区域达成情况 */}
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* 左侧：表格 */}
          <Card className="lg:col-span-1 border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-3">
              {/* 标题 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  {viewLevel === 'city' && (
                    <>
                      <button
                        onClick={handleBack}
                        className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1 mr-1"
                      >
                        ← 返回大区
                      </button>
                      <span className="text-gray-400 mx-1">/</span>
                    </>
                  )}
                  <span className="text-base font-bold text-gray-900">
                    {viewLevel === 'city' ? `${selectedRegion}` : '区域达成情况'}
                  </span>
                  {viewLevel === 'region' && (
                    <span className="text-base font-bold text-gray-900 ml-1">({timeRange === 'month' ? `${selectedMonth}月` : timeRange === 'quarter' ? selectedQuarter : '2026年'})</span>
                  )}
                </div>
              </div>

              {/* 大区维度表格 */}
              <div className="overflow-x-auto -mx-3 px-3">
                <div className="bg-white rounded-lg border-0 overflow-hidden min-w-[900px]">
                  <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">
                        {viewLevel === 'city' ? '城市' : '大区'}
                        {viewLevel === 'region' && (
                          <span className="ml-1 text-xs text-green-500 font-normal">（点击查看）</span>
                        )}
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-500">责任人</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">目标</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">已完成</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">预测金额</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">缺口</th>
                      <th className="px-2 py-2 text-center text-sm font-medium text-gray-500">预测达成率</th>
                      <th className="px-2 py-2 text-center text-sm font-medium text-gray-500">在手订单数</th>
                      <th className="px-2 py-2 text-center text-sm font-medium text-gray-500">在手项目数</th>
                      <th className="px-1 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item: any, index: number) => (
                      <tr
                        key={index}
                        onClick={() => viewLevel === 'region' ? handleRegionClick(item.name) : undefined}
                        className={`group border-b border-gray-50 last:border-0 ${viewLevel === 'region' ? 'cursor-pointer hover:bg-green-50 hover:border-l-4 hover:border-l-green-500' : ''}`}
                      >
                        <td className="px-3 py-2.5 text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                          <div className="flex items-center gap-2">
                            {viewLevel === 'region' && (
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all" />
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
                        <td className="px-2 py-2.5 text-center">
                          <span className={`text-sm font-bold ${
                            item.orderCount >= 100 ? 'text-green-600' : item.orderCount >= 80 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.orderCount}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-center text-sm text-gray-600">
                          {item.projectCount}
                        </td>
                        <td className="px-1 py-2.5">
                          {viewLevel === 'region' && (
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </CardContent>
          </Card>

          {/* 右侧：城市经理达成情况 */}
          <Card className="lg:col-span-1 border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-3">
              {/* 标题 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span className="text-base font-bold text-gray-900">城市经理达成情况</span>
                  <span className="text-base font-bold text-gray-900">({timeRange === 'month' ? `${selectedMonth}月` : timeRange === 'quarter' ? selectedQuarter : '2026年'})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">区域筛选：</span>
                  <select
                    value={cityManagerAreaFilter}
                    onChange={(e) => setCityManagerAreaFilter(e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    <option value="all">全部区域</option>
                    <option value="一区">一区</option>
                    <option value="二区">二区</option>
                    <option value="五区">五区</option>
                    <option value="华中">华中</option>
                    <option value="华北、西北">华北、西北</option>
                    <option value="西南">西南</option>
                    <option value="华南">华南</option>
                  </select>
                </div>
              </div>

              {/* 城市经理表格 */}
              <div className="overflow-x-auto -mx-3 px-3">
                <div className="bg-white rounded-lg border-0 overflow-hidden min-w-[900px]">
                  <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">区域</th>
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">城市</th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-500">责任人</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">目标</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">已完成</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">预测金额</th>
                      <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">缺口</th>
                      <th className="px-2 py-2 text-center text-sm font-medium text-gray-500">预测达成率</th>
                      <th className="px-2 py-2 text-center text-sm font-medium text-gray-500">在手订单数</th>
                      <th className="px-2 py-2 text-center text-sm font-medium text-gray-500">在手项目数</th>
                    </tr>
                  </thead>
                  <tbody className="min-h-[320px]">
                    {cityManagerData[timeRange as keyof typeof cityManagerData]
                      .filter((item: any) => cityManagerAreaFilter === 'all' || item.area === cityManagerAreaFilter)
                      .sort((a, b) => b.rate - a.rate)
                      .slice((cityManagerPage - 1) * cityManagerPageSize, cityManagerPage * cityManagerPageSize)
                      .map((item: any, index: number) => (
                      <tr
                        key={index}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="px-3 py-2.5 text-sm font-medium text-gray-900">{item.area}</td>
                        <td className="px-3 py-2.5 text-sm font-medium text-gray-900">{item.city}</td>
                        <td className="px-2 py-2.5 text-sm text-gray-500">{item.name}</td>
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
                        <td className="px-2 py-2.5 text-center">
                          <span className={`text-sm font-bold ${
                            item.orderCount >= 100 ? 'text-green-600' : item.orderCount >= 80 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.orderCount}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-center text-sm text-gray-600">{item.projectCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 分页 */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="text-xs text-gray-500">
                    共 <span className="font-semibold text-gray-700">{cityManagerData[timeRange as keyof typeof cityManagerData].filter((item: any) => cityManagerAreaFilter === 'all' || item.area === cityManagerAreaFilter).length}</span> 条记录，
                    第 <span className="font-semibold text-gray-700">{cityManagerPage}</span> / {Math.ceil(cityManagerData[timeRange as keyof typeof cityManagerData].filter((item: any) => cityManagerAreaFilter === 'all' || item.area === cityManagerAreaFilter).length / cityManagerPageSize)} 页
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCityManagerPage(prev => Math.max(1, prev - 1))}
                      disabled={cityManagerPage === 1}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        cityManagerPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                      }`}
                    >
                      上一页
                    </button>
                    {Array.from({ length: Math.ceil(cityManagerData[timeRange as keyof typeof cityManagerData].filter((item: any) => cityManagerAreaFilter === 'all' || item.area === cityManagerAreaFilter).length / cityManagerPageSize) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCityManagerPage(page)}
                        className={`min-w-[32px] h-8 text-xs font-medium rounded-lg transition-all ${
                          cityManagerPage === page
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCityManagerPage(prev => Math.min(Math.ceil(cityManagerData[timeRange as keyof typeof cityManagerData].filter((item: any) => cityManagerAreaFilter === 'all' || item.area === cityManagerAreaFilter).length / cityManagerPageSize), prev + 1))}
                      disabled={cityManagerPage === Math.ceil(cityManagerData[timeRange as keyof typeof cityManagerData].filter((item: any) => cityManagerAreaFilter === 'all' || item.area === cityManagerAreaFilter).length / cityManagerPageSize)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        cityManagerPage === Math.ceil(cityManagerData[timeRange as keyof typeof cityManagerData].filter((item: any) => cityManagerAreaFilter === 'all' || item.area === cityManagerAreaFilter).length / cityManagerPageSize)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                      }`}
                    >
                      下一页
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="distributors">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Database className="w-5 h-5" />
                经销商经营分析
              </h2>
              <span className="text-sm text-gray-500">2026年度数据</span>
            </div>

            {/* 经销商KPI指标 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
              <div className="bg-green-50 px-3 py-1.5 border-b border-green-100">
                <div className="flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-gray-800">经销商概况</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-0">
                {/* 总经销商数 */}
                <div className="border-r border-gray-200 px-2 py-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Database className="w-2.5 h-2.5 text-blue-500 flex-shrink-0" />
                    <span>总经销商数</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{dealerKPI.totalDealers}</span>
                    <span className="text-xs text-gray-600">家</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">覆盖7个大区</div>
                </div>

                {/* 活跃经销商 */}
                <div className="border-r border-gray-200 px-2 py-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Activity className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                    <span>活跃经销商</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{dealerKPI.activeDealers}</span>
                    <span className="text-xs text-gray-600">家</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    活跃率 {((dealerKPI.activeDealers / dealerKPI.totalDealers) * 100).toFixed(0)}%
                  </div>
                </div>

                {/* 履约率分布 */}
                <div className="border-r border-gray-200 px-2 py-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                    <Target className="w-2.5 h-2.5 text-teal-500 flex-shrink-0" />
                    <span>履约率分布</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-600 font-medium">60%以下</span>
                      <span className="font-bold text-red-600">{dealerKPI.below60}家</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-yellow-600 font-medium">60~80%</span>
                      <span className="font-bold text-yellow-600">{dealerKPI.between60to80}家</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-600 font-medium">80~100%</span>
                      <span className="font-bold text-green-600">{dealerKPI.between80to100}家</span>
                    </div>
                  </div>
                </div>

                {/* 新经销商数量 */}
                <div className="px-2 py-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <TrendingUp className="w-2.5 h-2.5 text-orange-500 flex-shrink-0" />
                    <span>新经销商数量</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{dealerKPI.newDealers}</span>
                    <span className="text-xs text-gray-600">家</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-green-600 mt-1">
                    <ArrowUp className="w-2 h-2" />
                    <span>较上月+1家</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 经销商达成率排名 */}
            <Card className="bg-white border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 mt-3">
              <CardContent className="p-3">
                {/* 标题和筛选器 */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-base font-bold text-gray-900">经销商达成率排名</span>
                  </div>
                  
                  {/* 筛选器 - 移动端适配 */}
                  <div className="hidden sm:flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">区域:</span>
                      <select
                        value={dealerRegionFilter}
                        onChange={(e) => setDealerRegionFilter(e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        <option value="all">全部区域</option>
                        <option value="一区">一区</option>
                        <option value="二区">二区</option>
                        <option value="五区">五区</option>
                        <option value="华中">华中</option>
                        <option value="华南">华南</option>
                        <option value="西南">西南</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">任务规模:</span>
                      <select
                        value={dealerScaleFilter}
                        onChange={(e) => setDealerScaleFilter(e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        <option value="all">全部规模</option>
                        <option value="90万以内">90万以内</option>
                        <option value="90~150万">90~150万</option>
                        <option value="150~300万">150~300万</option>
                        <option value="300万以上">300万以上</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">目标金额:</span>
                      <select
                        value={dealerTargetRangeFilter}
                        onChange={(e) => setDealerTargetRangeFilter(e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        <option value="all">全部区间</option>
                        <option value="below10000">1万以下</option>
                        <option value="10000to12000">1万~1.2万</option>
                        <option value="12000to14000">1.2万~1.4万</option>
                        <option value="above14000">1.4万以上</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        setDealerRegionFilter('all');
                        setDealerScaleFilter('all');
                        setDealerTargetRangeFilter('all');
                        setDealerSortField('rate');
                        setDealerSortOrder('desc');
                      }}
                      className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      重置
                    </button>
                  </div>

                  {/* 移动端筛选器 - 垂直布局 */}
                  <div className="sm:hidden space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600 whitespace-nowrap">区域:</span>
                      <select
                        value={dealerRegionFilter}
                        onChange={(e) => setDealerRegionFilter(e.target.value)}
                        className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        <option value="all">全部区域</option>
                        <option value="一区">一区</option>
                        <option value="二区">二区</option>
                        <option value="五区">五区</option>
                        <option value="华中">华中</option>
                        <option value="华南">华南</option>
                        <option value="西南">西南</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600 whitespace-nowrap">任务规模:</span>
                      <select
                        value={dealerScaleFilter}
                        onChange={(e) => setDealerScaleFilter(e.target.value)}
                        className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        <option value="all">全部规模</option>
                        <option value="90万以内">90万以内</option>
                        <option value="90~150万">90~150万</option>
                        <option value="150~300万">150~300万</option>
                        <option value="300万以上">300万以上</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600 whitespace-nowrap">目标:</span>
                      <select
                        value={dealerTargetRangeFilter}
                        onChange={(e) => setDealerTargetRangeFilter(e.target.value)}
                        className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        <option value="all">全部区间</option>
                        <option value="below10000">1万以下</option>
                        <option value="10000to12000">1万~1.2万</option>
                        <option value="12000to14000">1.2万~1.4万</option>
                        <option value="above14000">1.4万以上</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        setDealerRegionFilter('all');
                        setDealerScaleFilter('all');
                        setDealerTargetRangeFilter('all');
                        setDealerSortField('rate');
                        setDealerSortOrder('desc');
                      }}
                      className="w-full px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      重置筛选
                    </button>
                  </div>
                </div>

                {/* 表格容器 - 移动端横向滚动 */}
                <div className="overflow-x-auto -mx-3 px-3">
                  <div className="bg-white rounded-lg border-0 overflow-hidden min-w-[800px]">
                    <table className="w-full" style={{ tableLayout: 'fixed' }}>
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 cursor-pointer hover:text-green-600 transition-colors" style={{ width: '50px' }} onClick={() => handleDealerSort('rank')}>
                            <div className="flex items-center justify-center gap-0.5">
                              <span className="hidden sm:inline">排名</span>
                              <span className="sm:hidden">排</span>
                              <ArrowUp className={`w-2.5 h-2.5 ${dealerSortField === 'rank' && dealerSortOrder === 'asc' ? 'text-green-600' : 'text-gray-300'}`} />
                              <ArrowDown className={`w-2.5 h-2.5 ${dealerSortField === 'rank' && dealerSortOrder === 'desc' ? 'text-green-600' : 'text-gray-300'}`} />
                            </div>
                          </th>
                          <th className="px-2 py-2 text-left text-sm font-medium text-gray-500" style={{ width: '140px' }}>
                            <span className="hidden sm:inline">经销商名称</span>
                            <span className="sm:hidden">名称</span>
                          </th>
                          <th className="px-2 py-2 text-left text-sm font-medium text-gray-500" style={{ width: '55px' }}>区域</th>
                          <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 cursor-pointer hover:text-green-600 transition-colors" style={{ width: '80px' }} onClick={() => handleDealerSort('scale')}>
                            <div className="flex items-center justify-center gap-0.5">
                              任务规模
                              <ArrowUp className={`w-2.5 h-2.5 ${dealerSortField === 'scale' && dealerSortOrder === 'asc' ? 'text-green-600' : 'text-gray-300'}`} />
                              <ArrowDown className={`w-2.5 h-2.5 ${dealerSortField === 'scale' && dealerSortOrder === 'desc' ? 'text-green-600' : 'text-gray-300'}`} />
                            </div>
                          </th>
                          <th className="px-2 py-2 text-right text-sm font-medium text-gray-500 cursor-pointer hover:text-green-600 transition-colors hidden sm:table-cell" style={{ width: '75px' }} onClick={() => handleDealerSort('target')}>
                            <div className="flex items-center justify-end gap-0.5">
                              目标金额
                              <ArrowUp className={`w-2.5 h-2.5 ${dealerSortField === 'target' && dealerSortOrder === 'asc' ? 'text-green-600' : 'text-gray-300'}`} />
                              <ArrowDown className={`w-2.5 h-2.5 ${dealerSortField === 'target' && dealerSortOrder === 'desc' ? 'text-green-600' : 'text-gray-300'}`} />
                            </div>
                          </th>
                          <th className="px-2 py-2 text-right text-sm font-medium text-gray-500 cursor-pointer hover:text-green-600 transition-colors hidden sm:table-cell" style={{ width: '70px' }} onClick={() => handleDealerSort('completed')}>
                            <div className="flex items-center justify-end gap-0.5">
                              已达成
                              <ArrowUp className={`w-2.5 h-2.5 ${dealerSortField === 'completed' && dealerSortOrder === 'asc' ? 'text-green-600' : 'text-gray-300'}`} />
                              <ArrowDown className={`w-2.5 h-2.5 ${dealerSortField === 'completed' && dealerSortOrder === 'desc' ? 'text-green-600' : 'text-gray-300'}`} />
                            </div>
                          </th>
                          <th className="px-2 py-2 text-right text-sm font-medium text-gray-500 cursor-pointer hover:text-green-600 transition-colors hidden sm:table-cell" style={{ width: '75px' }} onClick={() => handleDealerSort('ytd')}>
                            <div className="flex items-center justify-end gap-0.5">
                              YTD
                              <ArrowUp className={`w-2.5 h-2.5 ${dealerSortField === 'ytd' && dealerSortOrder === 'asc' ? 'text-green-600' : 'text-gray-300'}`} />
                              <ArrowDown className={`w-2.5 h-2.5 ${dealerSortField === 'ytd' && dealerSortOrder === 'desc' ? 'text-green-600' : 'text-gray-300'}`} />
                            </div>
                          </th>
                          <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 cursor-pointer hover:text-green-600 transition-colors" style={{ width: '120px' }} onClick={() => handleDealerSort('rate')}>
                            <div className="flex items-center justify-center gap-0.5">
                              达成率
                              <ArrowUp className={`w-2.5 h-2.5 ${dealerSortField === 'rate' && dealerSortOrder === 'asc' ? 'text-green-600' : 'text-gray-300'}`} />
                              <ArrowDown className={`w-2.5 h-2.5 ${dealerSortField === 'rate' && dealerSortOrder === 'desc' ? 'text-green-600' : 'text-gray-300'}`} />
                            </div>
                          </th>
                          <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 cursor-pointer hover:text-green-600 transition-colors hidden sm:table-cell" style={{ width: '75px' }} onClick={() => handleDealerSort('yearOnYear')}>
                            <div className="flex items-center justify-center gap-0.5">
                              <span className="hidden sm:inline">达成率同比</span>
                              <span className="sm:hidden">同比</span>
                              <ArrowUp className={`w-2.5 h-2.5 ${dealerSortField === 'yearOnYear' && dealerSortOrder === 'asc' ? 'text-green-600' : 'text-gray-300'}`} />
                              <ArrowDown className={`w-2.5 h-2.5 ${dealerSortField === 'yearOnYear' && dealerSortOrder === 'desc' ? 'text-green-600' : 'text-gray-300'}`} />
                            </div>
                          </th>
                          <th className="px-2 py-2 text-center text-sm font-medium text-gray-500" style={{ width: '65px' }}>状态</th>
                        </tr>
                      </thead>
                    <tbody className="min-h-[320px]">
                      {dealerCurrentData.map((dealer) => (
                        <tr key={dealer.rank} className="border-b border-gray-50 last:border-0">
                          <td className="px-2 py-2 text-center" style={{ width: '50px' }}>
                            <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${
                              dealer.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                              dealer.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                              dealer.rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {dealer.rank}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-sm font-semibold text-gray-900 truncate" style={{ width: '140px' }} title={dealer.name}>{dealer.name}</td>
                          <td className="px-2 py-2 text-sm text-gray-500" style={{ width: '55px' }}>{dealer.region}</td>
                          <td className="px-2 py-2 text-center text-sm" style={{ width: '80px' }}>
                            <span className={`inline-block px-1 py-0.5 rounded-[10px] text-sm font-medium ${
                              dealer.scale === '300万以上' ? 'bg-green-100 text-green-700' :
                              dealer.scale === '150~300万' ? 'bg-blue-100 text-blue-700' :
                              dealer.scale === '90~150万' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {dealer.scale}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-sm text-right text-gray-600 hidden sm:table-cell" style={{ width: '75px' }}>{dealer.target.toLocaleString()}万</td>
                          <td className="px-2 py-2 text-sm text-right font-semibold text-gray-900 hidden sm:table-cell" style={{ width: '70px' }}>{dealer.completed.toLocaleString()}万</td>
                          <td className="px-2 py-2 text-sm text-right font-semibold text-emerald-600 hidden sm:table-cell" style={{ width: '75px' }}>{dealer.ytd.toLocaleString()}万</td>
                          <td className="px-2 py-2 text-center" style={{ width: '120px' }}>
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-50 border border-gray-100">
                              <span className={`text-sm font-bold ${
                                dealer.rate >= 80 ? 'text-green-600' :
                                dealer.rate >= 60 ? 'text-blue-600' :
                                dealer.rate >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {dealer.rate.toFixed(1)}%
                              </span>
                              <div className="w-6 h-1 rounded-full bg-gray-200 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    dealer.rate >= 80 ? 'bg-green-500' :
                                    dealer.rate >= 60 ? 'bg-blue-500' :
                                    dealer.rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(dealer.rate, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center hidden sm:table-cell" style={{ width: '75px' }}>
                            <div className={`flex items-center justify-center gap-0.5 text-sm font-bold ${
                              dealer.yearOnYear > 0 ? 'text-green-600' :
                              dealer.yearOnYear < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {dealer.yearOnYear > 0 ? <ArrowUp className="w-2.5 h-2.5" /> :
                               dealer.yearOnYear < 0 ? <ArrowDown className="w-2.5 h-2.5" /> : null}
                              <span>{Math.abs(dealer.yearOnYear).toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center" style={{ width: '65px' }}>
                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-sm font-medium ${
                              dealer.status === 'excellent' ? 'bg-green-100 text-green-700' :
                              dealer.status === 'good' ? 'bg-blue-100 text-blue-700' :
                              dealer.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {dealer.status === 'excellent' ? '优秀' :
                               dealer.status === 'good' ? '良好' :
                               dealer.status === 'warning' ? '需关注' : '风险'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </div>

                {/* 分页 */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="text-xs text-gray-500">
                    共 <span className="font-semibold text-gray-700">{salesmenRanking.length}</span> 条记录，
                    第 <span className="font-semibold text-gray-700">{salesmenCurrentPage}</span> / {salesmenTotalPages} 页
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDealerCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={dealerCurrentPage === 1}
                      className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all sm:px-3 ${
                        dealerCurrentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                      }`}
                    >
                      <span className="hidden sm:inline">上一页</span>
                      <span className="sm:hidden">←</span>
                    </button>
                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: dealerTotalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setDealerCurrentPage(page)}
                          className={`min-w-[32px] h-8 text-xs font-medium rounded-lg transition-all ${
                            dealerCurrentPage === page
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <div className="sm:hidden text-xs text-gray-600 px-2">
                      {dealerCurrentPage} / {dealerTotalPages}
                    </div>
                    <button
                      onClick={() => setDealerCurrentPage(prev => Math.min(dealerTotalPages, prev + 1))}
                      disabled={dealerCurrentPage === dealerTotalPages}
                      className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all sm:px-3 ${
                        dealerCurrentPage === dealerTotalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                      }`}
                    >
                      <span className="hidden sm:inline">下一页</span>
                      <span className="sm:hidden">→</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            {/* 项目分析标题 */}
            <div className="mb-3 flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5" />
                项目分析
              </h2>
              <span className="text-sm text-gray-500">2026年度数据</span>
            </div>

            {/* 项目KPI指标 */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 mb-3">
              {/* 项目数 */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Target className="w-2.5 h-2.5 text-blue-500 flex-shrink-0" />
                    <span>项目数</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-blue-600 leading-tight">{projectKPI.totalProjects}</span>
                    <span className="text-xs text-gray-400">个</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-green-600 mt-0.5">
                    <ArrowUp className="w-2 h-2" />
                    <span>较上月+5个</span>
                  </div>
                </CardContent>
              </Card>

              {/* 高风险项目数 */}
              <Card className="bg-white border-2 border-red-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-500 flex-shrink-0" />
                    <span>高风险项目数</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-red-600 leading-tight">{projectKPI.highRiskProjects}</span>
                    <span className="text-xs text-gray-400">个</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    占比 {((projectKPI.highRiskProjects / projectKPI.totalProjects) * 100).toFixed(0)}%
                  </div>
                </CardContent>
              </Card>

              {/* 在手订单 */}
              <Card className="bg-white border-2 border-purple-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Database className="w-2.5 h-2.5 text-purple-500 flex-shrink-0" />
                    <span>在手订单</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-purple-600 leading-tight">15</span>
                    <span className="text-sm text-gray-600">单</span>
                    <span className="text-sm font-semibold text-gray-700 ml-1">1,200万元</span>
                  </div>
                </CardContent>
              </Card>

              {/* 储备倒推 */}
              <Card className="bg-white border-2 border-green-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Target className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                    <span>储备倒推</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-green-600 leading-tight">需开发</span>
                    <span className="text-xs text-gray-400">项目</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    需新增项目约<span className="font-bold text-green-600">8-10个</span>（平均120-150万/个）
                  </div>
                </CardContent>
              </Card>
            </div>

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
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-600">23</div>
                      <div className="text-xs text-gray-600 mt-1">超期项目（已逾期）</div>
                      <div className="text-xs text-gray-400">总金额 350万</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-600">35</div>
                      <div className="text-xs text-gray-600 mt-1">临期项目（30天内）</div>
                      <div className="text-xs text-gray-400">总金额 420万</div>
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
                      <tbody className="divide-y divide-gray-200 min-h-[200px]">
                        {urgentCurrentData.map((project, index) => (
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

                  {/* 分页 */}
                  <div className="flex items-center justify-between mt-3 px-1">
                    <div className="text-xs text-gray-500">
                      共 <span className="font-semibold text-gray-700">{urgentProjectsData.length}</span> 条记录，
                      第 <span className="font-semibold text-gray-700">{urgentCurrentPage}</span> / {urgentTotalPages} 页
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setUrgentCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={urgentCurrentPage === 1}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          urgentCurrentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                        }`}
                      >
                        上一页
                      </button>
                      {Array.from({ length: urgentTotalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setUrgentCurrentPage(page)}
                          className={`min-w-[32px] h-8 text-xs font-medium rounded-lg transition-all ${
                            urgentCurrentPage === page
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setUrgentCurrentPage(prev => Math.min(urgentTotalPages, prev + 1))}
                        disabled={urgentCurrentPage === urgentTotalPages}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          urgentCurrentPage === urgentTotalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                        }`}
                      >
                        下一页
                      </button>
                    </div>
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
                      <tbody className="divide-y divide-gray-200 min-h-[200px]">
                        {relatedCurrentData.map((customer, index) => (
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

                  {/* 分页 */}
                  <div className="flex items-center justify-between mt-3 px-1">
                    <div className="text-xs text-gray-500">
                      共 <span className="font-semibold text-gray-700">{relatedProjectsData.length}</span> 条记录，
                      第 <span className="font-semibold text-gray-700">{relatedCurrentPage}</span> / {relatedTotalPages} 页
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setRelatedCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={relatedCurrentPage === 1}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          relatedCurrentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                        }`}
                      >
                        上一页
                      </button>
                      {Array.from({ length: relatedTotalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setRelatedCurrentPage(page)}
                          className={`min-w-[32px] h-8 text-xs font-medium rounded-lg transition-all ${
                            relatedCurrentPage === page
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setRelatedCurrentPage(prev => Math.min(relatedTotalPages, prev + 1))}
                        disabled={relatedCurrentPage === relatedTotalPages}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          relatedCurrentPage === relatedTotalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                        }`}
                      >
                        下一页
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="salesmen">
            {/* 业务员分析标题 */}
            <div className="mb-3 flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                业务员分析
              </h2>
              <span className="text-sm text-gray-500">2026年度数据</span>
            </div>

            {/* 业务员KPI指标 */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 mb-3">
              {/* 总业绩 */}
              <Card className="bg-white border-2 border-green-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <TrendingUp className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                    <span>总业绩</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-green-600 leading-tight">{salesmenKPI.totalPerformance.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">万元</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-green-600 mt-0.5">
                    <ArrowUp className="w-2 h-2" />
                    <span>较上月+156万</span>
                  </div>
                </CardContent>
              </Card>

              {/* 业务员数量 */}
              <Card className="bg-white border-2 border-teal-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Activity className="w-2.5 h-2.5 text-teal-500 flex-shrink-0" />
                    <span>业务员数量</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-teal-600 leading-tight">{salesmenKPI.totalCount}</span>
                    <span className="text-xs text-gray-400">人</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">覆盖7个大区</div>
                </CardContent>
              </Card>

              {/* 达标人数 */}
              <Card className="bg-white border-2 border-green-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Target className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                    <span>达标人数</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-green-600 leading-tight">{salesmenKPI.qualifiedCount}</span>
                    <span className="text-xs text-gray-400">人</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    达标率 {((salesmenKPI.qualifiedCount / salesmenKPI.totalCount) * 100).toFixed(0)}%
                  </div>
                </CardContent>
              </Card>

              {/* 新增项目 */}
              <Card className="bg-white border-2 border-orange-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Database className="w-2.5 h-2.5 text-orange-500 flex-shrink-0" />
                    <span>新增项目</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-orange-600 leading-tight">{salesmenKPI.newProjects}</span>
                    <span className="text-xs text-gray-400">个</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-green-600 mt-0.5">
                    <ArrowUp className="w-2 h-2" />
                    <span>较上月+8个</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 业务员排名表格 */}
            <Card className="bg-white border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-3">
                {/* 标题 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-gray-900">业务员排名</span>
                  </div>
                  <span className="text-xs text-gray-500">2026年度数据</span>
                </div>

                <div className="bg-white rounded-lg border-0 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 w-12">排名</th>
                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">姓名</th>
                        <th className="px-2 py-2 text-left text-sm font-medium text-gray-500">所属区域</th>
                        <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">年度目标</th>
                        <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">已达成</th>
                        <th className="px-2 py-2 text-center text-sm font-medium text-gray-500">达成率</th>
                        <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">拜访次数</th>
                        <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">新增项目</th>
                        <th className="px-2 py-2 text-center text-sm font-medium text-gray-500">状态</th>
                      </tr>
                    </thead>
                    <tbody className="min-h-[320px]">
                      {salesmenCurrentData.map((item) => (
                        <tr key={item.rank} className="border-b border-gray-50 hover:bg-blue-50 transition-colors">
                          <td className="px-2 py-2.5 text-center">
                            <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                              item.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                              item.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                              item.rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {item.rank}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="px-2 py-2.5 text-sm text-gray-500">{item.region}</td>
                          <td className="px-2 py-2.5 text-sm text-right text-gray-600">{item.target}万</td>
                          <td className="px-2 py-2.5 text-sm text-right font-semibold text-gray-900">{item.completed}万</td>
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
                          <td className="px-2 py-2.5 text-sm text-right text-gray-600">{item.visits}次</td>
                          <td className="px-2 py-2.5 text-sm text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.newProjects >= 3 ? 'bg-teal-100 text-teal-700' :
                              item.newProjects >= 1 ? 'bg-gray-100 text-gray-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                              {item.newProjects}个
                            </span>
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'excellent' ? 'bg-green-100 text-green-700' :
                              item.status === 'good' ? 'bg-teal-100 text-teal-700' :
                              item.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.status === 'excellent' ? '优秀' :
                               item.status === 'good' ? '良好' :
                               item.status === 'warning' ? '需关注' : '待提升'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 分页 */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="text-xs text-gray-500">
                    共 <span className="font-semibold text-gray-700">{salesmenRanking.length}</span> 条记录，
                    第 <span className="font-semibold text-gray-700">{salesmenCurrentPage}</span> / {salesmenTotalPages} 页
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDealerCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={dealerCurrentPage === 1}
                      className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all sm:px-3 ${
                        dealerCurrentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                      }`}
                    >
                      <span className="hidden sm:inline">上一页</span>
                      <span className="sm:hidden">←</span>
                    </button>
                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: dealerTotalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setDealerCurrentPage(page)}
                          className={`min-w-[32px] h-8 text-xs font-medium rounded-lg transition-all ${
                            dealerCurrentPage === page
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <div className="sm:hidden text-xs text-gray-600 px-2">
                      {dealerCurrentPage} / {dealerTotalPages}
                    </div>
                    <button
                      onClick={() => setDealerCurrentPage(prev => Math.min(dealerTotalPages, prev + 1))}
                      disabled={dealerCurrentPage === dealerTotalPages}
                      className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all sm:px-3 ${
                        dealerCurrentPage === dealerTotalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                      }`}
                    >
                      <span className="hidden sm:inline">下一页</span>
                      <span className="sm:hidden">→</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    );
  }
