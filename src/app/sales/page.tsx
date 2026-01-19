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

// 不同时间维度的预测数据
// predicted: 预测完成总额（包含已完成的部分）
const timeRangeData = {
  month: {
    target: 1428,
    completed: 677,
    predicted: 1327.3,
    gap: 100.7,
    canComplete: false,
    risk: 'high',
  },
  quarter: {
    target: 4284,
    completed: 2031,
    predicted: 3981.9,
    gap: 302.1,
    canComplete: false,
    risk: 'high',
  },
  year: {
    target: 17136,
    completed: 8124,
    predicted: 15927.6,
    gap: 1208.4,
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

// 城市维度数据
const cityData = {
  month: {
    '一区': [
      { name: '北京', owner: '王泽', target: 180, completed: 35, predicted: 65, gap: 115, rate: 19.4 },
      { name: '天津', owner: '王泽', target: 140, completed: 30, predicted: 45, gap: 95, rate: 21.4 },
    ],
    '二区': [
      { name: '上海', owner: '陈超', target: 132, completed: 55, predicted: 55, gap: 77, rate: 41.7 },
      { name: '苏州', owner: '陈超', target: 100, completed: 45, predicted: 45, gap: 55, rate: 45.0 },
    ],
    '五区': [
      { name: '广州', owner: '张大鹏', target: 150, completed: 70, predicted: 58, gap: 92, rate: 46.7 },
      { name: '深圳', owner: '张大鹏', target: 110, completed: 50, predicted: 42.4, gap: 67.6, rate: 45.5 },
    ],
    '华中': [
      { name: '武汉', owner: '刘邦军', target: 80, completed: 80, predicted: 78, gap: 2, rate: 100.0 },
      { name: '长沙', owner: '刘邦军', target: 72, completed: 72, predicted: 72, gap: 0, rate: 100.0 },
    ],
    '华北、西北': [
      { name: '石家庄', owner: '康帅', target: 90, completed: 65, predicted: 38, gap: 52, rate: 72.2 },
      { name: '太原', owner: '康帅', target: 70, completed: 55, predicted: 31.1, gap: 38.9, rate: 78.6 },
    ],
    '西南': [
      { name: '成都', owner: '钟莲', target: 75, completed: 12, predicted: 6.3, gap: 68.7, rate: 16.0 },
      { name: '重庆', owner: '钟莲', target: 53, completed: 8, predicted: 4.5, gap: 48.5, rate: 15.1 },
    ],
    '华南': [
      { name: '南宁', owner: '徐婷婷', target: 96, completed: 55, predicted: 60, gap: 36, rate: 57.3 },
      { name: '昆明', owner: '徐婷婷', target: 80, completed: 45, predicted: 50, gap: 30, rate: 56.3 },
    ],
  },
  quarter: {
    '一区': [
      { name: '北京', owner: '王泽', target: 540, completed: 105, predicted: 195, gap: 345, rate: 19.4 },
      { name: '天津', owner: '王泽', target: 420, completed: 90, predicted: 135, gap: 285, rate: 21.4 },
    ],
    '二区': [
      { name: '上海', owner: '陈超', target: 396, completed: 165, predicted: 165, gap: 231, rate: 41.7 },
      { name: '苏州', owner: '陈超', target: 300, completed: 135, predicted: 135, gap: 165, rate: 45.0 },
    ],
    '五区': [
      { name: '广州', owner: '张大鹏', target: 450, completed: 210, predicted: 174, gap: 276, rate: 46.7 },
      { name: '深圳', owner: '张大鹏', target: 330, completed: 150, predicted: 127.2, gap: 202.8, rate: 45.5 },
    ],
    '华中': [
      { name: '武汉', owner: '刘邦军', target: 240, completed: 240, predicted: 234, gap: 6, rate: 100.0 },
      { name: '长沙', owner: '刘邦军', target: 216, completed: 216, predicted: 216, gap: 0, rate: 100.0 },
    ],
    '华北、西北': [
      { name: '石家庄', owner: '康帅', target: 270, completed: 195, predicted: 114, gap: 156, rate: 72.2 },
      { name: '太原', owner: '康帅', target: 210, completed: 165, predicted: 93.3, gap: 116.7, rate: 78.6 },
    ],
    '西南': [
      { name: '成都', owner: '钟莲', target: 225, completed: 36, predicted: 18.9, gap: 206.1, rate: 16.0 },
      { name: '重庆', owner: '钟莲', target: 159, completed: 24, predicted: 13.5, gap: 145.5, rate: 15.1 },
    ],
    '华南': [
      { name: '南宁', owner: '徐婷婷', target: 288, completed: 165, predicted: 180, gap: 108, rate: 57.3 },
      { name: '昆明', owner: '徐婷婷', target: 240, completed: 135, predicted: 150, gap: 90, rate: 56.3 },
    ],
  },
  year: {
    '一区': [
      { name: '北京', owner: '王泽', target: 2160, completed: 420, predicted: 780, gap: 1380, rate: 19.4 },
      { name: '天津', owner: '王泽', target: 1680, completed: 360, predicted: 540, gap: 1140, rate: 21.4 },
    ],
    '二区': [
      { name: '上海', owner: '陈超', target: 1584, completed: 660, predicted: 660, gap: 924, rate: 41.7 },
      { name: '苏州', owner: '陈超', target: 1200, completed: 540, predicted: 540, gap: 660, rate: 45.0 },
    ],
    '五区': [
      { name: '广州', owner: '张大鹏', target: 1800, completed: 840, predicted: 696, gap: 1104, rate: 46.7 },
      { name: '深圳', owner: '张大鹏', target: 1320, completed: 600, predicted: 508.8, gap: 811.2, rate: 45.5 },
    ],
    '华中': [
      { name: '武汉', owner: '刘邦军', target: 960, completed: 960, predicted: 936, gap: 24, rate: 100.0 },
      { name: '长沙', owner: '刘邦军', target: 864, completed: 864, predicted: 864, gap: 0, rate: 100.0 },
    ],
    '华北、西北': [
      { name: '石家庄', owner: '康帅', target: 1080, completed: 780, predicted: 456, gap: 624, rate: 72.2 },
      { name: '太原', owner: '康帅', target: 840, completed: 660, predicted: 373.2, gap: 466.8, rate: 78.6 },
    ],
    '西南': [
      { name: '成都', owner: '钟莲', target: 900, completed: 144, predicted: 75.6, gap: 824.4, rate: 16.0 },
      { name: '重庆', owner: '钟莲', target: 636, completed: 96, predicted: 54, gap: 582, rate: 15.1 },
    ],
    '华南': [
      { name: '南宁', owner: '徐婷婷', target: 1152, completed: 660, predicted: 720, gap: 432, rate: 57.3 },
      { name: '昆明', owner: '徐婷婷', target: 960, completed: 540, predicted: 600, gap: 360, rate: 56.3 },
    ],
  },
};

// 经销商达成率排名数据
const dealerAchievementRanking = [
  { rank: 1, name: '杭州商用净水', target: 15000, completed: 10275, rate: 68.5, region: '一区', status: 'excellent' },
  { rank: 2, name: '上海净泉科技', target: 12000, completed: 7704, rate: 64.2, region: '二区', status: 'excellent' },
  { rank: 3, name: '南京净源设备', target: 13500, completed: 8343, rate: 61.8, region: '华中', status: 'good' },
  { rank: 4, name: '苏州清泉实业', target: 11000, completed: 6435, rate: 58.5, region: '二区', status: 'good' },
  { rank: 5, name: '无锡净水宝', target: 15000, completed: 8250, rate: 55.0, region: '华中', status: 'warning' },
  { rank: 6, name: '常州净康科技', target: 13000, completed: 6799, rate: 52.3, region: '五区', status: 'warning' },
  { rank: 7, name: '宁波净水达人', target: 14500, completed: 7221, rate: 49.8, region: '华南', status: 'danger' },
  { rank: 8, name: '合肥净源环保', target: 12000, completed: 5880, rate: 49.0, region: '华中', status: 'danger' },
  { rank: 9, name: '南昌净水通', target: 10000, completed: 4650, rate: 46.5, region: '西南', status: 'danger' },
  { rank: 10, name: '昆明净泉科技', target: 11000, completed: 4730, rate: 43.0, region: '西南', status: 'danger' },
];

// 经销商KPI数据
const dealerKPI = {
  totalDealers: 10,       // 总经销商数
  activeDealers: 10,      // 活跃经销商
  qualifiedDealers: 0,    // 达标数量
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
    { month: '1月', target: 1428, completed: 677, predicted: 1327.3 },
    { month: '2月', target: 1350, completed: 720, predicted: 1400 },
    { month: '3月', target: 1480, completed: 850, predicted: 1570 },
    { month: '4月', target: 1520, completed: 890, predicted: 1670 },
    { month: '5月', target: 1460, completed: 820, predicted: 1570 },
    { month: '6月', target: 1500, completed: 880, predicted: 1680 },
    { month: '7月', target: 1450, completed: 860, predicted: 1650 },
    { month: '8月', target: 1490, completed: 840, predicted: 1650 },
    { month: '9月', target: 1470, completed: 870, predicted: 1675 },
    { month: '10月', target: 1510, completed: 900, predicted: 1740 },
    { month: '11月', target: 1480, completed: 880, predicted: 1700 },
    { month: '12月', target: 1460, completed: 850, predicted: 1660 },
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

  // 业务员排名分页状态
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
  const dealerTotalPages = Math.ceil(dealerAchievementRanking.length / dealerPageSize);
  const dealerCurrentData = dealerAchievementRanking.slice(
    (dealerCurrentPage - 1) * dealerPageSize,
    dealerCurrentPage * dealerPageSize
  );

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

  const currentData = viewLevel === 'city'
    ? (cityData[timeRange as keyof typeof cityData] as any)[selectedRegion] || []
    : regionData[timeRange as keyof typeof regionData];

  // 获取当前时间范围的目标数据
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
        <div className="flex items-center gap-4">
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

          {/* 二级筛选 */}
          {timeRange === 'month' && (
            <>
              <span className="text-sm font-medium text-gray-700 ml-2">选择月份：</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>{i + 1}月</option>
                ))}
              </select>
            </>
          )}
          {timeRange === 'quarter' && (
            <>
              <span className="text-sm font-medium text-gray-700 ml-2">选择季度：</span>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Q1">Q1（1-3月）</option>
                <option value="Q2">Q2（4-6月）</option>
                <option value="Q3">Q3（7-9月）</option>
                <option value="Q4">Q4（10-12月）</option>
              </select>
            </>
          )}
          {timeRange === 'year' && (
            <span className="text-sm text-gray-500 ml-2">2026年度数据</span>
          )}
        </div>
      </div>

      {/* Tab页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-3 h-10 bg-white border border-gray-200 rounded-xl shadow-sm p-1">
          <TabsTrigger value="overview" className="flex-1 h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              经营总览
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
          {/* 经营总览标题 */}
          <div className="mb-4 flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              经营总览
            </h2>
          </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {/* 目标 */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <Target className="w-2.5 h-2.5 text-blue-500 flex-shrink-0" />
                  <span>{timeRangeLabel}目标</span>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {timeRange === 'month' ? `${selectedMonth}月` : timeRange === 'quarter' ? selectedQuarter : '2026'}
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-3xl font-bold text-gray-900 leading-tight">{currentRangeData.target.toLocaleString()}</span>
                <span className="text-xs text-gray-400">万元</span>
              </div>
            </CardContent>
          </Card>

          {/* 已完成 */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-1">
              <div className="text-xs font-medium text-gray-500">{timeRangeLabel}已完成</div>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-3xl font-bold text-gray-900 leading-tight">{currentRangeData.completed.toLocaleString()}</span>
                <span className="text-xs text-gray-400">万元</span>
              </div>
              <div className="flex items-center gap-0.5 text-xs text-red-600 mt-0.5">
                <ArrowDown className="w-2.5 h-2.5" />
                <span>-8.3%</span>
              </div>
            </CardContent>
          </Card>

          {/* 预测完成 */}
          <Card className="bg-white border border-green-300 border-dashed">
            <CardContent className="p-1">
              <div className="text-xs font-medium text-gray-500">预测完成</div>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-3xl font-bold text-green-600 leading-tight">{currentRangeData.predicted.toLocaleString()}</span>
                <span className="text-xs text-gray-400">万元</span>
              </div>
              <div className="flex items-center gap-0.5 text-xs text-green-600 mt-0.5">
                <ArrowUp className="w-2.5 h-2.5" />
                <span>同比+5.2%</span>
              </div>
            </CardContent>
          </Card>

          {/* 任务缺口 */}
          <Card className="bg-white border-2 border-red-200">
            <CardContent className="p-1">
              <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                <AlertTriangle className="w-2.5 h-2.5 text-red-500 flex-shrink-0" />
                <span>任务缺口</span>
              </div>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-3xl font-bold text-red-600 leading-tight">{currentRangeData.gap.toLocaleString()}</span>
                <span className="text-xs text-gray-400">万元</span>
              </div>
              <div className="flex items-center gap-0.5 text-xs text-gray-500 mt-0.5">
                <ArrowDown className="w-2.5 h-2.5" />
                <span>-54.5%</span>
              </div>
            </CardContent>
          </Card>

          {/* 在手订单 */}
          <Card className="bg-white border-2 border-purple-300">
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
        </div>

        {/* 月度趋势分析 */}
        <Card className="mt-3 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            {/* 标题和筛选器 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-base font-bold text-gray-900">月度趋势分析</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">地区筛选：</span>
                <select
                  value={trendRegion}
                  onChange={(e) => setTrendRegion(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div style={{ height: '320px' }}>
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
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
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
                      height={36}
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
          </CardContent>
        </Card>

        {/* 区域达成情况 */}
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* 左侧：表格 */}
          <Card className="lg:col-span-2 border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-3">
              {/* 标题 */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  {viewLevel === 'city' && (
                    <>
                      <button
                        onClick={handleBack}
                        className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1 mr-1"
                      >
                        ← 返回大区
                      </button>
                      <span className="text-gray-400 mx-1">/</span>
                    </>
                  )}
                  <span className="text-sm font-bold text-gray-900">
                    {viewLevel === 'city' ? `${selectedRegion}` : '区域达成情况'}
                  </span>
                  {viewLevel === 'region' && (
                    <span className="text-sm font-bold text-gray-900 ml-1">({timeRange === 'month' ? `${selectedMonth}月` : timeRange === 'quarter' ? selectedQuarter : '2026年'})</span>
                  )}
                </div>
              </div>

              {/* 大区维度表格 */}
              <div className="bg-white rounded-lg border-0 overflow-hidden">
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
            </CardContent>
          </Card>

          {/* 右侧：下钻分析 */}
          <Card className="lg:col-span-1 border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-gray-900">下钻分析</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setActiveTab('salesmen')}
                  className="group p-2.5 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Activity className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">按业务员</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-green-600">12</span>
                    <span className="text-sm text-gray-500">业务员</span>
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    8人未达标
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('distributors')}
                  className="group p-2.5 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">按经销商</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-green-600">10</span>
                    <span className="text-sm text-gray-500">经销商</span>
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    10家未达标
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="group p-2.5 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">按项目</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-orange-600">12</span>
                    <span className="text-sm text-gray-500">高风险项目</span>
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-sm bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    <Activity className="w-2.5 h-2.5" />
                    需优先跟进
                  </div>
                </button>
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 mb-3">
              {/* 总经销商数 */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Database className="w-2.5 h-2.5 text-blue-500 flex-shrink-0" />
                    <span>总经销商数</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-blue-600 leading-tight">{dealerKPI.totalDealers}</span>
                    <span className="text-xs text-gray-400">家</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">覆盖7个大区</div>
                </CardContent>
              </Card>

              {/* 活跃经销商 */}
              <Card className="bg-white border-2 border-green-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Activity className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                    <span>活跃经销商</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-green-600 leading-tight">{dealerKPI.activeDealers}</span>
                    <span className="text-xs text-gray-400">家</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    活跃率 {((dealerKPI.activeDealers / dealerKPI.totalDealers) * 100).toFixed(0)}%
                  </div>
                </CardContent>
              </Card>

              {/* 达标数量 */}
              <Card className="bg-white border-2 border-teal-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Target className="w-2.5 h-2.5 text-teal-500 flex-shrink-0" />
                    <span>达标数量</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-teal-600 leading-tight">{dealerKPI.qualifiedDealers}</span>
                    <span className="text-xs text-gray-400">家</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    达标率 {dealerKPI.activeDealers > 0 ? ((dealerKPI.qualifiedDealers / dealerKPI.activeDealers) * 100).toFixed(0) : 0}%
                  </div>
                </CardContent>
              </Card>

              {/* 新经销商数量 */}
              <Card className="bg-white border-2 border-orange-200">
                <CardContent className="p-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <TrendingUp className="w-2.5 h-2.5 text-orange-500 flex-shrink-0" />
                    <span>新经销商数量</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-orange-600 leading-tight">{dealerKPI.newDealers}</span>
                    <span className="text-xs text-gray-400">家</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-green-600 mt-0.5">
                    <ArrowUp className="w-2 h-2" />
                    <span>较上月+1家</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 经销商达成率排名 */}
            <Card className="bg-white border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 mt-3">
              <CardContent className="p-3">
                {/* 标题 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-gray-900">经销商达成率排名</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border-0 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 w-12">排名</th>
                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">经销商名称</th>
                        <th className="px-2 py-2 text-left text-sm font-medium text-gray-500">区域</th>
                        <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">目标金额</th>
                        <th className="px-2 py-2 text-right text-sm font-medium text-gray-500">已达成</th>
                        <th className="px-2 py-2 text-center text-sm font-medium text-gray-500">达成率</th>
                        <th className="px-2 py-2 text-center text-sm font-medium text-gray-500">状态</th>
                      </tr>
                    </thead>
                    <tbody className="min-h-[320px]">
                      {dealerCurrentData.map((dealer) => (
                        <tr key={dealer.rank} className="border-b border-gray-50 hover:bg-blue-50 transition-colors">
                          <td className="px-2 py-2.5 text-center">
                            <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                              dealer.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                              dealer.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                              dealer.rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {dealer.rank}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-sm font-semibold text-gray-900">{dealer.name}</td>
                          <td className="px-2 py-2.5 text-sm text-gray-500">{dealer.region}</td>
                          <td className="px-2 py-2.5 text-sm text-right text-gray-600">{dealer.target.toLocaleString()}万</td>
                          <td className="px-2 py-2.5 text-sm text-right font-semibold text-gray-900">{dealer.completed.toLocaleString()}万</td>
                          <td className="px-2 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 min-w-[60px]">
                                <Progress value={dealer.rate} className="h-1.5" />
                              </div>
                              <span className={`text-xs font-bold whitespace-nowrap ${
                                dealer.rate >= 60 ? 'text-green-600' :
                                dealer.rate >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {dealer.rate.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              dealer.status === 'excellent' ? 'bg-green-100 text-green-700' :
                              dealer.status === 'good' ? 'bg-teal-100 text-teal-700' :
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

                {/* 分页 */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="text-xs text-gray-500">
                    共 <span className="font-semibold text-gray-700">{dealerAchievementRanking.length}</span> 条记录，
                    第 <span className="font-semibold text-gray-700">{dealerCurrentPage}</span> / {dealerTotalPages} 页
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDealerCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={dealerCurrentPage === 1}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        dealerCurrentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                      }`}
                    >
                      上一页
                    </button>
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
                    <button
                      onClick={() => setDealerCurrentPage(prev => Math.min(dealerTotalPages, prev + 1))}
                      disabled={dealerCurrentPage === dealerTotalPages}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        dealerCurrentPage === dealerTotalPages
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
                    共 <span className="font-semibold text-gray-700">{dealerAchievementRanking.length}</span> 条记录，
                    第 <span className="font-semibold text-gray-700">{dealerCurrentPage}</span> / {dealerTotalPages} 页
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDealerCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={dealerCurrentPage === 1}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        dealerCurrentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                      }`}
                    >
                      上一页
                    </button>
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
                    <button
                      onClick={() => setDealerCurrentPage(prev => Math.min(dealerTotalPages, prev + 1))}
                      disabled={dealerCurrentPage === dealerTotalPages}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        dealerCurrentPage === dealerTotalPages
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
          </TabsContent>
        </Tabs>
      </div>
    );
  }
