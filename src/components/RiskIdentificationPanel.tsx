'use client';

import { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Building2, Clock, TrendingDown, Users, ChevronRight, ChevronLeft, PauseCircle, Gauge, Circle, Target, BarChart3, ArrowLeft, Activity, DollarSign, XCircle, Send, FileText, PlusCircle, Zap, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConfirmDialog from '@/components/ui/confirm-dialog';

// 驾驶舱样式
const DASHBOARD_STYLES = {
  bg: 'bg-slate-900/80',
  text: 'text-cyan-50',
  textMuted: 'text-cyan-300/70',
  textSecondary: 'text-cyan-200',
  cardBorder: 'border-cyan-500/30',
  neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
  neonGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.6)]',
  warningGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]',
};

// Tab颜色方案 - 专业驾驶舱设计
const TAB_COLOR_SCHEMES = {
  0: { // 未按计划下单 - 红色（严重警告）
    primary: 'red',
    primaryHex: '239,68,68',
    bgGradient: 'from-red-950/40 via-slate-900 to-slate-900',
    cardGradient: 'from-red-900/50 to-red-800/30',
    border: 'border-red-500/60',
    text: 'text-red-200',
    textMuted: 'text-red-300/70',
    textHighlight: 'text-red-400',
    neon: 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]',
    buttonGradient: 'from-red-900/30 to-rose-900/20',
    buttonHover: 'hover:from-red-900/50 hover:to-rose-900/30',
    shadow: 'shadow-[0_0_25px_rgba(239,68,68,0.5)]',
    hoverShadow: 'hover:shadow-[0_0_40px_rgba(239,68,68,0.7)]',
  },
  1: { // 大项目依赖 - 蓝色（结构、依赖）
    primary: 'blue',
    primaryHex: '59,130,246',
    bgGradient: 'from-blue-950/40 via-slate-900 to-slate-900',
    cardGradient: 'from-blue-900/50 to-blue-800/30',
    border: 'border-blue-500/60',
    text: 'text-blue-200',
    textMuted: 'text-blue-300/70',
    textHighlight: 'text-blue-400',
    neon: 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.6)]',
    buttonGradient: 'from-blue-900/30 to-indigo-900/20',
    buttonHover: 'hover:from-blue-900/50 hover:to-indigo-900/30',
    shadow: 'shadow-[0_0_25px_rgba(59,130,246,0.5)]',
    hoverShadow: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.7)]',
  },
  2: { // 预测不足 - 橙色（警告）
    primary: 'orange',
    primaryHex: '249,115,22',
    bgGradient: 'from-orange-950/40 via-slate-900 to-slate-900',
    cardGradient: 'from-orange-900/50 to-orange-800/30',
    border: 'border-orange-500/60',
    text: 'text-orange-200',
    textMuted: 'text-orange-300/70',
    textHighlight: 'text-orange-400',
    neon: 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.6)]',
    buttonGradient: 'from-orange-900/30 to-amber-900/20',
    buttonHover: 'hover:from-orange-900/50 hover:to-amber-900/30',
    shadow: 'shadow-[0_0_25px_rgba(249,115,22,0.5)]',
    hoverShadow: 'hover:shadow-[0_0_40px_rgba(249,115,22,0.7)]',
  },
  3: { // 报备不足 - 紫色（流程）
    primary: 'purple',
    primaryHex: '168,85,247',
    bgGradient: 'from-purple-950/40 via-slate-900 to-slate-900',
    cardGradient: 'from-purple-900/50 to-purple-800/30',
    border: 'border-purple-500/60',
    text: 'text-purple-200',
    textMuted: 'text-purple-300/70',
    textHighlight: 'text-purple-400',
    neon: 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.6)]',
    buttonGradient: 'from-purple-900/30 to-violet-900/20',
    buttonHover: 'hover:from-purple-900/50 hover:to-violet-900/30',
    shadow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]',
    hoverShadow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.7)]',
  },
  4: { // 转化不足 - 粉色（机会）
    primary: 'pink',
    primaryHex: '236,72,153',
    bgGradient: 'from-pink-950/40 via-slate-900 to-slate-900',
    cardGradient: 'from-pink-900/50 to-pink-800/30',
    border: 'border-pink-500/60',
    text: 'text-pink-200',
    textMuted: 'text-pink-300/70',
    textHighlight: 'text-pink-400',
    neon: 'text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]',
    glow: 'shadow-[0_0_15px_rgba(236,72,153,0.6)]',
    buttonGradient: 'from-pink-900/30 to-rose-900/20',
    buttonHover: 'hover:from-pink-900/50 hover:to-rose-900/30',
    shadow: 'shadow-[0_0_25px_rgba(236,72,153,0.5)]',
    hoverShadow: 'hover:shadow-[0_0_40px_rgba(236,72,153,0.7)]',
  },
  5: { // 阶段停滞 - 靛蓝色（需要推进）
    primary: 'indigo',
    primaryHex: '99,102,241',
    bgGradient: 'from-indigo-950/40 via-slate-900 to-slate-900',
    cardGradient: 'from-indigo-900/50 to-indigo-800/30',
    border: 'border-indigo-500/60',
    text: 'text-indigo-200',
    textMuted: 'text-indigo-300/70',
    textHighlight: 'text-indigo-400',
    neon: 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]',
    glow: 'shadow-[0_0_15px_rgba(99,102,241,0.6)]',
    buttonGradient: 'from-indigo-900/30 to-violet-900/20',
    buttonHover: 'hover:from-indigo-900/50 hover:to-violet-900/30',
    shadow: 'shadow-[0_0_25px_rgba(99,102,241,0.5)]',
    hoverShadow: 'hover:shadow-[0_0_40px_rgba(99,102,241,0.7)]',
  },
};

// ==================== 数据类型定义 ====================

// 1. 大项目依赖数据
interface LargeProjectDependency {
  projectName: string;
  projectId: string;
  amount: number;
  predictionAmount: number; // 当月预测金额
  predictionRatio: number; // 占预测金额的比例（百分比）
  region: string;
  owner: string;
  status: 'normal' | 'highRisk' | 'critical';
}

// 5. 未按计划下单数据
interface UnorderedProject {
  id: number;
  name: string; // 项目名称
  amount: number; // 金额
  probability: 'high' | 'medium' | 'low'; // 成交概率
  region: string; // 大区
  salesEngineer: string; // 销售工程师
  cityManager: string; // 城市经理
  projectType: string; // 项目类型
  projectPhase: string; // 项目阶段
  detail: string; // 项目详情
  expectedOrderDate: string; // 预计下单时间
  delayDays?: number; // 延迟天数
  riskReason: string; // 未下单原因
}

// 6. 预测不足数据
interface ForecastGap {
  projectName: string;
  region: string;
  owner: string;
  gapAmount: number; // 缺口金额（万元）
  currentForecast: number; // 当前预测金额
  targetForecast: number; // 目标预测金额
  gapPercentage: number; // 缺口百分比
}

// 7. 转化不足数据（项目报备一直没有进入下一阶段）
interface InsufficientConversion {
  projectName: string;
  region: string;
  salesEngineer: string;
  cityManager: string;
  currentPhase: string; // 当前阶段
  stayDays: number; // 停留天数
  amount: number; // 金额
  riskReason: string; // 转化不足原因
}

// 8. 阶段停滞数据（项目在某个阶段停滞）
interface PhaseStagnation {
  projectName: string;
  region: string;
  salesEngineer: string;
  cityManager: string;
  currentPhase: string; // 当前阶段
  stayDays: number; // 停留天数
  amount: number; // 金额
  riskLevel: 'high' | 'medium' | 'low'; // 风险等级
  nextPhase?: string; // 下一阶段
}

// 组件属性
interface RiskIdentificationPanelProps {
  largeProjectDependencies?: LargeProjectDependency[];
  forecastGaps?: ForecastGap[];
  unorderedProjects?: UnorderedProject[];
  insufficientConversions?: InsufficientConversion[];
  phaseStagnations?: PhaseStagnation[];
  theme?: 'dashboard' | 'light' | 'dark';
  timeRange?: 'current' | 'quarter' | 'year';
}

// ==================== 默认数据 ====================

const defaultLargeProjectDependencies: LargeProjectDependency[] = [
  { projectName: '北京地铁17号线', projectId: 'PRJ-001', amount: 1200, predictionAmount: 2000, predictionRatio: 60, region: '华北', owner: '张明', status: 'highRisk' },
  { projectName: '上海国际机场T4', projectId: 'PRJ-002', amount: 850, predictionAmount: 1500, predictionRatio: 57, region: '一区', owner: '李娜', status: 'normal' },
  { projectName: '深圳科技园', projectId: 'PRJ-003', amount: 680, predictionAmount: 1200, predictionRatio: 57, region: '华南', owner: '王强', status: 'critical' },
  { projectName: '广州高铁南站', projectId: 'PRJ-004', amount: 560, predictionAmount: 1000, predictionRatio: 56, region: '华南', owner: '赵芳', status: 'highRisk' },
  { projectName: '杭州亚运会场馆', projectId: 'PRJ-005', amount: 450, predictionAmount: 800, predictionRatio: 56, region: '二区', owner: '孙伟', status: 'normal' }
];

const defaultForecastGaps: ForecastGap[] = [
  { projectName: '深圳前海自贸区综合项目', region: '华南', owner: '周杰', gapAmount: 200, currentForecast: 300, targetForecast: 500, gapPercentage: 40 },
  { projectName: '天津天河城扩建项目', region: '华北', owner: '李明', gapAmount: 150, currentForecast: 250, targetForecast: 400, gapPercentage: 37.5 },
  { projectName: '杭州阿里巴巴园区二期', region: '二区', owner: '刘芳', gapAmount: 180, currentForecast: 220, targetForecast: 400, gapPercentage: 45 },
  { projectName: '广州白云机场T3扩建', region: '华南', owner: '王强', gapAmount: 120, currentForecast: 180, targetForecast: 300, gapPercentage: 40 },
  { projectName: '北京大兴机场配套二期', region: '华北', owner: '张伟', gapAmount: 100, currentForecast: 150, targetForecast: 250, gapPercentage: 40 }
];

// 默认转化不足数据
const defaultInsufficientConversions: InsufficientConversion[] = [
  {
    projectName: '上海浦东国际博览中心项目',
    region: '一区',
    salesEngineer: '刘洋',
    cityManager: '陈明',
    currentPhase: '项目报备',
    stayDays: 15,
    amount: 180,
    riskReason: '报备后无跟进，客户需求不明确'
  },
  {
    projectName: '广州天河城购物中心',
    region: '华南',
    salesEngineer: '陈静',
    cityManager: '林婷',
    currentPhase: '初步接洽',
    stayDays: 12,
    amount: 220,
    riskReason: '初步接洽后客户反馈不及时'
  },
  {
    projectName: '深圳前海自贸区',
    region: '华南',
    salesEngineer: '赵雪',
    cityManager: '黄磊',
    currentPhase: '现场勘察',
    stayDays: 8,
    amount: 150,
    riskReason: '现场勘察未完成，技术方案待确认'
  },
  {
    projectName: '杭州阿里巴巴园区',
    region: '二区',
    salesEngineer: '杨帆',
    cityManager: '郑浩',
    currentPhase: '需求意向',
    stayDays: 10,
    amount: 200,
    riskReason: '需求意向不明确，客户预算未确定'
  },
  {
    projectName: '北京中关村科技园',
    region: '华北',
    salesEngineer: '马龙',
    cityManager: '张伟',
    currentPhase: '方案设计',
    stayDays: 18,
    amount: 250,
    riskReason: '方案设计反复修改，客户要求不明确'
  }
];

// 默认阶段停滞数据
const defaultPhaseStagnations: PhaseStagnation[] = [
  {
    projectName: '成都天府新区',
    region: '西南',
    salesEngineer: '胡燕',
    cityManager: '吴敏',
    currentPhase: '方案设计',
    stayDays: 25,
    amount: 120,
    riskLevel: 'high',
    nextPhase: '项目采购'
  },
  {
    projectName: '重庆江北国际机场',
    region: '西南',
    salesEngineer: '杨洋',
    cityManager: '孙丽',
    currentPhase: '项目采购',
    stayDays: 20,
    amount: 300,
    riskLevel: 'high',
    nextPhase: '项目合同'
  },
  {
    projectName: '西安高新区',
    region: '西南',
    salesEngineer: '赵峰',
    cityManager: '王芳',
    currentPhase: '项目合同',
    stayDays: 15,
    amount: 180,
    riskLevel: 'medium',
    nextPhase: '赢单'
  },
  {
    projectName: '武汉绿地中心',
    region: '华中',
    salesEngineer: '郑浩',
    cityManager: '李强',
    currentPhase: '需求意向',
    stayDays: 12,
    amount: 150,
    riskLevel: 'medium',
    nextPhase: '方案设计'
  },
  {
    projectName: '长沙五一广场',
    region: '华中',
    salesEngineer: '吴敏',
    cityManager: '王伟',
    currentPhase: '初步接洽',
    stayDays: 10,
    amount: 100,
    riskLevel: 'low',
    nextPhase: '现场勘察'
  }
];

const defaultUnorderedProjects: UnorderedProject[] = [
  {
    id: 1,
    name: '扬州万达广场租赁项目',
    amount: 25.5,
    probability: 'medium',
    region: '一区',
    salesEngineer: '张伟',
    cityManager: '卢继栋',
    projectType: '租赁',
    projectPhase: '项目采购',
    detail: '商业广场租赁服务',
    expectedOrderDate: '2026/1/15',
    delayDays: 3,
    riskReason: '合同条款待确认'
  },
  {
    id: 2,
    name: '天津天河城净水项目',
    amount: 100,
    probability: 'high',
    region: '华北',
    salesEngineer: '李明',
    cityManager: '王强',
    projectType: '买断',
    projectPhase: '项目采购',
    detail: '商业综合体净水系统',
    expectedOrderDate: '2026/1/20',
    delayDays: 15,
    riskReason: '客户需求变更，方案需调整'
  },
  {
    id: 3,
    name: '广州白云机场航站楼项目',
    amount: 80,
    probability: 'high',
    region: '华南',
    salesEngineer: '赵敏',
    cityManager: '陈明',
    projectType: '买断',
    projectPhase: '商务谈判',
    detail: '机场航站楼净化系统',
    expectedOrderDate: '2026/1/25',
    delayDays: 8,
    riskReason: '商务合同待审批'
  },
  {
    id: 4,
    name: '北京大兴国际机场配套项目',
    amount: 60,
    probability: 'medium',
    region: '华北',
    salesEngineer: '李明',
    cityManager: '张伟',
    projectType: '买断',
    projectPhase: '项目采购',
    detail: '机场配套设施净化系统',
    expectedOrderDate: '2026/2/1',
    delayDays: 20,
    riskReason: '客户决策延迟，商务谈判暂停'
  },
  {
    id: 5,
    name: '重庆环球金融中心项目',
    amount: 150,
    probability: 'medium',
    region: '西南',
    salesEngineer: '周杰',
    cityManager: '孙丽',
    projectType: '买断',
    projectPhase: '商务谈判',
    detail: '商业中心净化系统',
    expectedOrderDate: '2026/2/10',
    delayDays: 12,
    riskReason: '客户决策延迟，商务谈判暂停'
  },
  {
    id: 6,
    name: '杭州阿里巴巴园区项目',
    amount: 130,
    probability: 'low',
    region: '二区',
    salesEngineer: '刘芳',
    cityManager: '王强',
    projectType: '买断',
    projectPhase: '项目采购',
    detail: '企业园区净水设备',
    expectedOrderDate: '2026/2/15',
    delayDays: 8,
    riskReason: '需求变更延迟'
  },
  {
    id: 7,
    name: '上海浦东国际博览中心项目',
    amount: 40,
    probability: 'low',
    region: '一区',
    salesEngineer: '刘芳',
    cityManager: '李娜',
    projectType: '买断',
    projectPhase: '初步接触',
    detail: '展览中心净水设备',
    expectedOrderDate: '2026/3/1',
    delayDays: 5,
    riskReason: '项目风险较高，客户资金链紧张'
  },
  {
    id: 8,
    name: '深圳前海自贸区综合项目',
    amount: 20,
    probability: 'medium',
    region: '华南',
    salesEngineer: '周杰',
    cityManager: '孙丽',
    projectType: '买断',
    projectPhase: '意向',
    detail: '自贸区综合项目净水系统',
    expectedOrderDate: '2026/3/5',
    delayDays: 10,
    riskReason: '项目未最终确认，处于意向阶段'
  }
];

// ==================== 辅助函数 ====================

const getSeverityStyles = (severity: 'high' | 'medium' | 'low') => {
  switch (severity) {
    case 'high':
      return 'bg-red-500/30 text-red-300 border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    case 'medium':
      return 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50';
    case 'low':
      return 'bg-green-500/30 text-green-300 border-green-500/50';
  }
};

const getStatusStyles = (status: 'normal' | 'highRisk' | 'critical') => {
  switch (status) {
    case 'critical':
      return 'bg-red-500/30 text-red-300 border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    case 'highRisk':
      return 'bg-orange-500/30 text-orange-300 border-orange-500/50';
    case 'normal':
      return 'bg-green-500/30 text-green-300 border-green-500/50';
  }
};

// ==================== 仪表盘组件 ====================

// 环形进度仪表盘
function CircularGauge({ 
  value, 
  max, 
  color = 'cyan',
  size = 120,
  label 
}: { 
  value: number; 
  max: number; 
  color?: 'cyan' | 'red' | 'orange' | 'green';
  size?: number;
  label?: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  const colorMap = {
    cyan: '#22d3ee',
    red: '#ef4444',
    orange: '#f97316',
    green: '#22c55e'
  };
  
  const strokeColor = colorMap[color];

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 100 100" className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(30, 41, 59, 0.8)"
          strokeWidth="8"
        />
        {/* 进度圆 */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ 
            filter: `drop-shadow(0 0 8px ${strokeColor}80)`,
            transition: 'stroke-dashoffset 1s ease-out'
          }}
        />
      </svg>
      {/* 中心数值 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color: strokeColor, textShadow: `0 0 10px ${strokeColor}80` }}>
          {value}
        </span>
        {label && <span className="text-xs text-cyan-300/70">{label}</span>}
      </div>
    </div>
  );
}

// 半圆仪表盘
function HalfGauge({ 
  value, 
  max, 
  unit = '' 
}: { 
  value: number; 
  max: number; 
  unit?: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = `${percentage * 2} 250`;

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-24 h-12">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          {/* 背景弧线 */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(6,182,212,0.2)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* 进度弧线 */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            className="stroke-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            style={{ transition: 'stroke-dasharray 0.5s ease-out' }}
          />
        </svg>
      </div>
      <div className="text-center mt-[-8px]">
        <div className="text-lg font-bold text-cyan-300">{percentage.toFixed(0)}%</div>
        <div className="text-xs text-cyan-400/70">{unit}</div>
      </div>
    </div>
  );
}

// ==================== 分页组件 ====================
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={cn(
          'px-2 py-1 rounded text-xs transition-all',
          currentPage === 1
            ? 'bg-slate-800/50 text-cyan-400/30 cursor-not-allowed'
            : 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20'
        )}
      >
        首页
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'px-2 py-1 rounded text-xs transition-all',
          currentPage === 1
            ? 'bg-slate-800/50 text-cyan-400/30 cursor-not-allowed'
            : 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20'
        )}
      >
        <ChevronLeft className="w-3 h-3" />
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={cn(
            'px-2 py-1 rounded text-xs transition-all min-w-[28px]',
            page === '...'
              ? 'text-cyan-400/70'
              : page === currentPage
              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
              : 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20'
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'px-2 py-1 rounded text-xs transition-all',
          currentPage === totalPages
            ? 'bg-slate-800/50 text-cyan-400/30 cursor-not-allowed'
            : 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20'
        )}
      >
        <ChevronRight className="w-3 h-3" />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={cn(
          'px-2 py-1 rounded text-xs transition-all',
          currentPage === totalPages
            ? 'bg-slate-800/50 text-cyan-400/30 cursor-not-allowed'
            : 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20'
        )}
      >
        末页
      </button>
    </div>
  );
}

// ==================== 主组件 ====================
export default function RiskIdentificationPanel({
  largeProjectDependencies = defaultLargeProjectDependencies,
  forecastGaps = defaultForecastGaps,
  unorderedProjects = defaultUnorderedProjects,
  insufficientConversions = defaultInsufficientConversions,
  phaseStagnations = defaultPhaseStagnations,
  theme = 'dashboard',
  timeRange = 'current'
}: RiskIdentificationPanelProps) {
  // Tab状态
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState<'summary' | 'detail'>('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // 模态框状态
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => Promise<void> | void;
    type?: 'default' | 'danger' | 'warning' | 'success' | 'info';
  } | null>(null);

  // 打开模态框的辅助函数
  const openDialog = (config: typeof dialogConfig) => {
    setDialogConfig(config);
    setDialogOpen(true);
  };

  // 根据时间范围获取按钮配置
  const getButtonConfig = (tabId: number, dataCount: number, totalAmount: number) => {
    const isQuarter = timeRange === 'quarter';

    if (isQuarter) {
      // 季度模式：记录风险，需要周记录和月度闭环
      return {
        title: '记录风险',
        description: `检测到 ${dataCount} 个项目存在风险，总金额 ${totalAmount.toFixed(0)} 万元\n\n建议进行周记录跟踪，实现月度闭环管理`,
        confirmText: '确认记录',
        actionText: '记录风险',
        hintText: '周记录 · 月度闭环'
      };
    }

    // 月度/年度模式：立即执行动作
    switch (tabId) {
      case 0: // 未按计划下单
        return {
          title: '催下单提醒',
          description: `确定要向所有未下单项目的销售工程师发送催办提醒吗？\n\n共 ${dataCount} 个项目，总金额 ${totalAmount.toFixed(0)} 万元`,
          confirmText: '确认发送',
          actionText: '催下单',
          hintText: ''
        };
      case 1: // 大项目依赖
        return {
          title: '在线确认',
          description: `确定要向大项目依赖的负责人发送确认提醒吗？\n\n共 ${dataCount} 个大项目，总金额 ${totalAmount.toFixed(0)} 万元`,
          confirmText: '确认发送',
          actionText: '在线确认',
          hintText: ''
        };
      case 2: // 预测不足
        return {
          title: '补预测',
          description: `确定要生成预测不足项目的补充预测方案吗？\n\n共 ${dataCount} 个项目，预计缺口 ${totalAmount.toFixed(0)} 万元`,
          confirmText: '确认生成',
          actionText: '补预测',
          hintText: ''
        };
      case 3: // 报备不足
        return {
          title: '立即上报',
          description: `确定要立即上报待报备项目吗？\n\n共 ${dataCount} 个待报备项目，总金额 ${totalAmount.toFixed(0)} 万元`,
          confirmText: '确认上报',
          actionText: '立即上报',
          hintText: ''
        };
      case 4: // 转化不足
        return {
          title: '立即跟进',
          description: `确定要立即跟进待转化项目吗？\n\n共 ${dataCount} 个项目，总金额 ${totalAmount.toFixed(0)} 万元`,
          confirmText: '确认跟进',
          actionText: '立即跟进',
          hintText: ''
        };
      case 5: // 阶段停滞
        return {
          title: '推进处理',
          description: `确定要推进停滞项目吗？\n\n共 ${dataCount} 个项目，总金额 ${totalAmount.toFixed(0)} 万元`,
          confirmText: '确认推进',
          actionText: '推进处理',
          hintText: ''
        };
      default:
        return {
          title: '确认操作',
          description: `共 ${dataCount} 个项目`,
          confirmText: '确认',
          actionText: '执行',
          hintText: ''
        };
    }
  };

  // 当时间维度变化时，重置当前 Tab 到对应的第一个Tab
  useEffect(() => {
    if (timeRange === 'current') {
      // 月度：选中预测不足
      setCurrentTab(2);
    } else if (timeRange === 'quarter') {
      // 季度：选中报备不足
      setCurrentTab(3);
    } else {
      // 年度：选中第一个Tab
      setCurrentTab(2);
    }
    setCurrentPage(1);
    setViewMode('summary');
  }, [timeRange]);

  // 所有 Tab 定义
  const allTabs = [
    { id: 2, label: '预测不足', icon: TrendingDown },
    { id: 0, label: '未按计划下单', icon: XCircle },
    { id: 1, label: '大项目依赖', icon: Building2 },
    { id: 3, label: '报备不足', icon: PlusCircle },
    { id: 4, label: '转化不足', icon: Zap },
    { id: 5, label: '阶段停滞', icon: Pause }
  ];

  // 根据时间维度显示的 Tabs
  const visibleTabs = useMemo(() => {
    // 月度：关注预测不足、未按计划下单、大项目依赖
    if (timeRange === 'current') {
      return allTabs.filter(tab => [2, 0, 1].includes(tab.id));
    }
    // 季度：关注报备不足、转化不足、阶段停滞
    else if (timeRange === 'quarter') {
      return allTabs.filter(tab => [3, 4, 5].includes(tab.id));
    }
    // 年度：显示所有Tabs
    else {
      return allTabs;
    }
  }, [timeRange]);

  // 根据时间维度过滤数据
  const filteredUnorderedProjects = useMemo(() => {
    return unorderedProjects.filter(project => {
      if (!project.expectedOrderDate) return false;

      // 解析日期字符串 (格式: "2026/1/15")
      const dateMatch = project.expectedOrderDate.match(/(\d{4})\/(\d{1,2})/);
      if (!dateMatch) return false;

      const year = parseInt(dateMatch[1]);
      const month = parseInt(dateMatch[2]);

      // 当前年月（假设是2026年1月）
      const currentYear = 2026;
      const currentMonth = 1;

      // 根据时间维度过滤
      switch (timeRange) {
        case 'current':
          // 本月：同一年同一个月
          return year === currentYear && month === currentMonth;
        case 'quarter':
          // 本季度：同一年且1-3月（Q1）
          return year === currentYear && month >= 1 && month <= 3;
        case 'year':
          // 本年度：同一年
          return year === currentYear;
        default:
          return true;
      }
    });
  }, [unorderedProjects, timeRange]);

  // 切换Tab时重置
  useEffect(() => {
    setCurrentPage(1);
    setViewMode('summary');
  }, [currentTab]);

  // 获取当前Tab的数据
  const getCurrentData = () => {
    switch (currentTab) {
      case 0: return filteredUnorderedProjects;
      case 1: return largeProjectDependencies;
      case 2: return forecastGaps;
      default: return [];
    }
  };

  const currentData = getCurrentData();
  const totalPages = Math.ceil(currentData.length / itemsPerPage);

  // 分页数据
  const getPaginatedLargeProjectDependencies = () => {
    return largeProjectDependencies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };
  const getPaginatedForecastGaps = () => {
    const result = forecastGaps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    console.log('getPaginatedForecastGaps:', { currentPage, itemsPerPage, forecastGaps: forecastGaps.length, result: result.length });
    return result;
  };
  const getPaginatedUnorderedProjects = () => {
    return filteredUnorderedProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };

  // 高风险数量
  const highRiskCount = (() => {
    switch (currentTab) {
      case 0: return filteredUnorderedProjects.filter(p => p.delayDays && p.delayDays >= 10).length;
      case 1: return largeProjectDependencies.filter(p => p.status === 'critical').length;
      case 2: return forecastGaps.filter(p => p.gapPercentage >= 40).length;
      default: return 0;
    }
  })();

  return (
    <div className={cn('w-full flex flex-col')}>
      {/* 标题栏 */}
      <div
        className={cn(
          'px-6 py-3 border-b flex items-center justify-between',
          theme === 'dashboard' ? `${DASHBOARD_STYLES.cardBorder} bg-slate-900/60` : 'border-slate-200 bg-white'
        )}
      >
        <div className="flex items-center gap-2">
          {viewMode === 'detail' && (
            <button
              onClick={() => setViewMode('summary')}
              className={cn(
                'p-1.5 rounded-lg transition-all mr-2',
                theme === 'dashboard'
                  ? 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <AlertTriangle className={cn(
            'w-6 h-6',
            theme === 'dashboard' 
              ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]' 
              : 'text-slate-700'
          )} />
          <h3 className={cn('font-bold text-xl', theme === 'dashboard' 
            ? 'text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]' 
            : 'text-slate-900')}>
            风险识别
          </h3>
        </div>
      </div>

      {/* Tab切换栏 - 仅在汇总视图显示 */}
      {viewMode === 'summary' && visibleTabs.length >= 1 && (
        <div className="px-6 py-2 border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const currentIndex = visibleTabs.findIndex(tab => tab.id === currentTab);
                const newIndex = (currentIndex - 1 + visibleTabs.length) % visibleTabs.length;
                setCurrentTab(visibleTabs[newIndex].id);
              }}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                theme === 'dashboard'
                  ? 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const isUnorderedProjects = tab.id === 0; // 未按计划下单
                const isForecastGap = tab.id === 2; // 预测不足
                const isReportProject = tab.id === 3; // 报备不足

                // 计算角标数量
                const badgeCount = isUnorderedProjects 
                  ? filteredUnorderedProjects.length 
                  : isForecastGap 
                  ? forecastGaps.length 
                  : 0;

                // 是否闪烁（数量>0且非当前Tab）
                const shouldPulse = badgeCount > 0 && tab.id !== currentTab;

                // 获取当前tab的颜色方案
                const colorScheme = TAB_COLOR_SCHEMES[tab.id as keyof typeof TAB_COLOR_SCHEMES] || TAB_COLOR_SCHEMES[0];
                const isActive = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative',
                      // 激活状态
                      isActive && theme === 'dashboard'
                        ? cn(
                            `bg-${colorScheme.primary}-500/40 text-${colorScheme.primary}-200 border-2 ${colorScheme.border} ${colorScheme.shadow}`,
                            'animate-pulse'
                          )
                        : isActive
                        ? cn(`bg-${colorScheme.primary}-100 text-${colorScheme.primary}-700 border-2 border-${colorScheme.primary}-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]`)
                        : theme === 'dashboard'
                        ? 'bg-slate-800/30 text-cyan-400/70 border border-cyan-400/20'
                        : 'bg-slate-100 text-slate-600 border border-slate-300',
                      // 闪烁效果
                      shouldPulse && 'animate-pulse'
                    )}
                    style={isActive && theme === 'dashboard' ? {
                      backgroundColor: `rgba(${colorScheme.primaryHex}, 0.4)`,
                      borderColor: `rgba(${colorScheme.primaryHex}, 0.6)`,
                      boxShadow: `0 0 20px rgba(${colorScheme.primaryHex}, 0.6)`
                    } : undefined}
                  >
                    <Icon 
                      className={cn(
                        'w-4 h-4',
                        theme === 'dashboard' 
                          ? isActive 
                            ? cn(colorScheme.neon)
                            : 'text-slate-400'
                          : `text-${colorScheme.primary}-600`
                      )}
                      style={isActive && theme === 'dashboard' ? {
                        color: `rgb(${colorScheme.primaryHex})`,
                        textShadow: `0 0 8px rgba(${colorScheme.primaryHex}, 1)`
                      } : undefined}
                    />
                    <span className={isActive && theme === 'dashboard' ? 'font-bold text-xs' : ''}>
                      {tab.label}
                    </span>
                    {/* 角标 */}
                    {badgeCount > 0 && (
                      <span className={cn(
                        'absolute -top-1 -right-1 flex items-center justify-center',
                        'min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold',
                        theme === 'dashboard'
                          ? isUnorderedProjects
                            ? 'bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                            : 'bg-orange-500 text-white shadow-[0_0_8px_rgba(249,115,22,0.8)]'
                          : isUnorderedProjects
                          ? 'bg-red-600 text-white'
                          : 'bg-orange-600 text-white'
                      )}>
                        {badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                const currentIndex = visibleTabs.findIndex(tab => tab.id === currentTab);
                const newIndex = (currentIndex + 1) % visibleTabs.length;
                setCurrentTab(visibleTabs[newIndex].id);
              }}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                theme === 'dashboard'
                  ? 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        {/* ============ Tab 0: 未按计划下单 ============ */}
        {currentTab === 0 && (
          // 明细视图
          <div className="h-full flex flex-col animate-in fade-in duration-300">
                {/* 顶部仪表盘风格指标卡片 - 红色警告效果 */}
                <div className={cn(
                  'p-3 relative overflow-hidden',
                  TAB_COLOR_SCHEMES[0].bgGradient,
                  `border-b-2 ${TAB_COLOR_SCHEMES[0].border}`,
                  TAB_COLOR_SCHEMES[0].glow
                )}>
                  {/* 背景装饰网格 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(${TAB_COLOR_SCHEMES[0].primaryHex},0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(${TAB_COLOR_SCHEMES[0].primaryHex},0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* 顶部发光线条 */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                    style={{
                      background: `linear-gradient(to right, transparent, rgba(${TAB_COLOR_SCHEMES[0].primaryHex},1), transparent)`
                    }}
                  ></div>
                  
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {/* 项目数量卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      TAB_COLOR_SCHEMES[0].cardGradient,
                      `border-2 ${TAB_COLOR_SCHEMES[0].border}`,
                      TAB_COLOR_SCHEMES[0].shadow
                    )}>
                      <div 
                        className="absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl animate-pulse"
                        style={{ backgroundColor: `rgba(${TAB_COLOR_SCHEMES[0].primaryHex},0.2)` }}
                      ></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <AlertTriangle className={cn('w-3.5 h-3.5 animate-pulse', TAB_COLOR_SCHEMES[0].textHighlight)} 
                            style={{ 
                              color: `rgb(${TAB_COLOR_SCHEMES[0].primaryHex})`,
                              textShadow: `0 0 10px rgba(${TAB_COLOR_SCHEMES[0].primaryHex},1)` 
                            }}
                          />
                          <div 
                            className="text-xs font-bold"
                            style={{ color: `rgba(${TAB_COLOR_SCHEMES[0].primaryHex},0.9)` }}
                          >项目数量</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span 
                            className="text-3xl font-black"
                            style={{ 
                              color: `rgb(${TAB_COLOR_SCHEMES[0].primaryHex})`,
                              textShadow: `0 0 15px rgba(${TAB_COLOR_SCHEMES[0].primaryHex},1)` 
                            }}
                          >
                            {filteredUnorderedProjects.length}
                          </span>
                          <span 
                            className="text-xs"
                            style={{ color: `rgba(${TAB_COLOR_SCHEMES[0].primaryHex},0.8)` }}
                          >个</span>
                        </div>
                      </div>
                    </div>

                    {/* 总金额卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-orange-900/50 to-orange-800/30',
                      'border-2 border-orange-500/60',
                      'shadow-[0_0_25px_rgba(251,146,60,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,1)]" />
                          <div className="text-xs font-bold text-orange-300">总金额</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,1)]">
                            {filteredUnorderedProjects.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
                          </span>
                          <span className="text-xs text-orange-300/80">万</span>
                        </div>
                      </div>
                    </div>

                    {/* 催下单按钮 */}
                    {(() => {
                      const buttonConfig = getButtonConfig(0, filteredUnorderedProjects.length, filteredUnorderedProjects.reduce((sum, p) => sum + p.amount, 0));
                      return (
                        <div className={cn(
                          'relative rounded-xl p-2 overflow-hidden cursor-pointer group h-full flex flex-col items-center justify-center',
                          `border-2 ${TAB_COLOR_SCHEMES[0].border}`,
                          TAB_COLOR_SCHEMES[0].buttonGradient,
                          TAB_COLOR_SCHEMES[0].buttonHover,
                          TAB_COLOR_SCHEMES[0].shadow,
                          TAB_COLOR_SCHEMES[0].hoverShadow,
                          'transition-all duration-300'
                        )}
                             onClick={() => openDialog({
                               title: buttonConfig.title,
                               description: buttonConfig.description,
                               confirmText: buttonConfig.confirmText,
                               cancelText: '取消',
                               onConfirm: async () => {
                                 // TODO: 根据按钮配置执行不同逻辑
                                 console.log('操作已执行:', buttonConfig.actionText);
                               },
                               type: timeRange === 'quarter' ? 'info' : 'warning'
                             })}>
                          {/* 按钮发光效果 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute inset-0 border-2 border-red-500/50 rounded-xl animate-pulse"></div>

                          <div className="relative z-10 w-full flex flex-col items-center justify-center">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <div className="w-8 h-8 rounded-full bg-red-500/40 border-2 border-red-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                                <Send className="w-4 h-4 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,1)]" />
                              </div>
                              <div className="text-base font-black text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,1)]">{buttonConfig.actionText}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                              <div className="text-xs text-red-300 font-semibold">
                                {buttonConfig.hintText ? buttonConfig.hintText : `全部 ${filteredUnorderedProjects.length} 个项目`}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 表格区域 */}
                <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-cyan-500/30', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16 text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>序号</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>预计下单</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>项目名称</th>
                        <th className={cn('text-left py-2 px-3 font-medium hidden lg:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>大区</th>
                        <th className={cn('text-left py-2 px-3 font-medium hidden md:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>销售</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedUnorderedProjects().map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'align-middle border-b border-cyan-500/10 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 transition-all duration-200',
                            index === getPaginatedUnorderedProjects().length - 1 && 'border-b-0'
                          )}
                        >
                          {/* 序号 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                              {(currentPage - 1) * 5 + index + 1}
                            </div>
                          </td>

                          {/* 预计下单时间 */}
                          <td className={cn('py-2 px-3 text-sm whitespace-nowrap text-cyan-200 align-middle')}>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-cyan-400/70" />
                              {item.expectedOrderDate || '-'}
                            </div>
                          </td>

                          {/* 项目名称 */}
                          <td className={cn('py-2 px-3 text-sm', DASHBOARD_STYLES.textSecondary, 'align-middle')}>
                            <div className="font-medium leading-snug text-cyan-100">{item.name}</div>
                          </td>

                          {/* 大区 */}
                          <td className={cn('hidden lg:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.region || '-'}
                          </td>

                          {/* 销售工程师 */}
                          <td className={cn('hidden md:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.salesEngineer || '-'}
                          </td>

                          {/* 金额 */}
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap', DASHBOARD_STYLES.textSecondary, 'align-middle')}>
                            <span className="font-black text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.6)]">
                              {item.amount.toFixed(2)}
                            </span>
                            <span className={cn('text-sm ml-1 text-orange-300/70')}>万</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 分页 */}
                <div className="px-4 py-2 border-t border-cyan-500/20 flex justify-between items-center bg-gradient-to-r from-slate-900/50 to-transparent">
                  <div className={cn('text-xs flex items-center gap-2', DASHBOARD_STYLES.textMuted)}>
                    <Activity className="w-3 h-3 text-cyan-400/70" />
                    共 {filteredUnorderedProjects.length} 条记录，当前第 {currentPage} / {totalPages} 页
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              </div>
            )}

        {/* ============ Tab 1: 大项目依赖 ============ */}
        {currentTab === 1 && (
          // 明细视图
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            {/* 顶部仪表盘风格指标卡片 - 蓝色 */}
            <div className={cn(
              'p-3 relative overflow-hidden',
              TAB_COLOR_SCHEMES[1].bgGradient,
              `border-b-2 ${TAB_COLOR_SCHEMES[1].border}`,
              TAB_COLOR_SCHEMES[1].glow
            )}>
              {/* 背景装饰网格 */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `
                  linear-gradient(rgba(${TAB_COLOR_SCHEMES[1].primaryHex},0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(${TAB_COLOR_SCHEMES[1].primaryHex},0.2) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}></div>
              {/* 顶部发光线条 */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                style={{
                  background: `linear-gradient(to right, transparent, rgba(${TAB_COLOR_SCHEMES[1].primaryHex},1), transparent)`
                }}
              ></div>

              <div className="relative z-10 grid grid-cols-3 gap-3">
                {/* 大项目数卡片 */}
                <div className={cn(
                  'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                  'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                  'border-2 border-cyan-500/60',
                  'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                )}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="relative z-10 w-full flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
                      <div className="text-xs font-bold text-cyan-300">大项目数</div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                        {largeProjectDependencies.length}
                      </span>
                      <span className="text-xs text-cyan-300/80">个</span>
                    </div>
                  </div>
                </div>

                {/* 总金额卡片 */}
                <div className={cn(
                  'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                  'bg-gradient-to-br from-orange-900/50 to-orange-800/30',
                  'border-2 border-orange-500/60',
                  'shadow-[0_0_25px_rgba(249,115,22,0.5)]'
                )}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="relative z-10 w-full flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,1)] animate-pulse" />
                      <div className="text-xs font-bold text-orange-300">总金额</div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,1)]">
                        {largeProjectDependencies.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
                      </span>
                      <span className="text-xs text-orange-300/80">万</span>
                    </div>
                  </div>
                </div>

                {/* 在线确认按钮 */}
                {(() => {
                  const buttonConfig = getButtonConfig(1, largeProjectDependencies.length, largeProjectDependencies.reduce((sum, p) => sum + p.amount, 0));
                  return (
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden cursor-pointer group h-full flex flex-col items-center justify-center',
                      'border-2 border-cyan-500/70',
                      'bg-gradient-to-br from-cyan-900/30 to-blue-900/20',
                      'hover:from-cyan-900/50 hover:to-blue-900/30',
                      'shadow-[0_0_30px_rgba(6,182,212,0.5)]',
                      'hover:shadow-[0_0_40px_rgba(6,182,212,0.7)]',
                      'transition-all duration-300'
                    )}
                         onClick={() => openDialog({
                           title: buttonConfig.title,
                           description: buttonConfig.description,
                           confirmText: buttonConfig.confirmText,
                           cancelText: '取消',
                           onConfirm: async () => {
                             console.log('操作已执行:', buttonConfig.actionText);
                           },
                           type: timeRange === 'quarter' ? 'info' : 'info'
                         })}>
                      {/* 按钮发光效果 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-xl animate-pulse"></div>

                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/40 border-2 border-cyan-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                            <Send className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
                          </div>
                          <div className="text-base font-black text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,1)]">{buttonConfig.actionText}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          <div className="text-xs text-cyan-300 font-semibold">
                            {buttonConfig.hintText ? buttonConfig.hintText : `全部 ${largeProjectDependencies.length} 个项目`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* 表格区域 */}
            <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-cyan-500/30', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>序号</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>项目名称</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>金额</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>预测金额</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>占比</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>区域</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]')}>负责人</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedLargeProjectDependencies().map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'align-middle border-b border-cyan-500/10 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-cyan-500/5 transition-all duration-200',
                            index === getPaginatedLargeProjectDependencies().length - 1 && 'border-b-0'
                          )}
                        >
                          {/* 序号 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                              {(currentPage - 1) * 5 + index + 1}
                            </div>
                          </td>
                          <td className={cn('py-2 px-3 text-sm', DASHBOARD_STYLES.textSecondary, 'align-middle')}>
                            <div className="font-medium leading-snug text-cyan-100">{item.projectName}</div>
                          </td>
                          <td className={cn('py-2 px-3 text-sm text-cyan-200 align-middle')}>{item.amount.toFixed(0)}万</td>
                          <td className={cn('py-2 px-3 text-sm text-cyan-200 align-middle')}>{item.predictionAmount}万</td>
                          <td className={cn('py-2 px-3 text-sm', DASHBOARD_STYLES.textSecondary, 'align-middle')}>
                            <span className={cn(
                              'px-2 py-1 rounded text-xs font-medium',
                              item.predictionRatio >= 60 ? 'bg-red-500/20 text-red-400' :
                              item.predictionRatio >= 55 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            )}>
                              {item.predictionRatio}%
                            </span>
                          </td>
                          <td className={cn('py-2 px-3 text-sm text-cyan-200 align-middle')}>{item.region}</td>
                          <td className={cn('py-2 px-3 text-sm text-cyan-200 align-middle')}>{item.owner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-2 border-t border-cyan-500/20 flex justify-between items-center bg-gradient-to-r from-slate-900/50 to-transparent">
                  <div className={cn('text-sm flex items-center gap-2', DASHBOARD_STYLES.textMuted)}>
                    <Activity className="w-3 h-3 text-cyan-400/70" />
                    共 {largeProjectDependencies.length} 条记录，当前第 {currentPage} / {totalPages} 页
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
          </div>
        )}

        {/* ============ Tab 2: 预测不足 ============ */}
        {currentTab === 2 && (
          // 明细视图
          <div className="h-full flex flex-col animate-in fade-in duration-300">
                {/* 顶部仪表盘风格指标卡片 - 橙色警告 */}
                <div className={cn(
                  'p-3 relative overflow-hidden',
                  TAB_COLOR_SCHEMES[2].bgGradient,
                  `border-b-2 ${TAB_COLOR_SCHEMES[2].border}`,
                  TAB_COLOR_SCHEMES[2].glow
                )}>
                  {/* 背景装饰网格 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(${TAB_COLOR_SCHEMES[2].primaryHex},0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(${TAB_COLOR_SCHEMES[2].primaryHex},0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* 顶部发光线条 */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                    style={{
                      background: `linear-gradient(to right, transparent, rgba(${TAB_COLOR_SCHEMES[2].primaryHex},1), transparent)`
                    }}
                  ></div>
                  
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {/* 预计缺口金额卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-yellow-900/50 to-yellow-800/30',
                      'border-2 border-yellow-500/60',
                      'shadow-[0_0_25px_rgba(234,179,8,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,1)] animate-pulse" />
                          <div className="text-xs font-bold text-yellow-300">预计缺口金额</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,1)]">
                            {forecastGaps.reduce((sum, p) => sum + p.gapAmount, 0).toFixed(0)}
                          </span>
                          <span className="text-xs text-yellow-300/80">万</span>
                        </div>
                      </div>
                    </div>

                    {/* 缺口数量卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-orange-900/50 to-orange-800/30',
                      'border-2 border-orange-500/60',
                      'shadow-[0_0_25px_rgba(251,146,60,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,1)] animate-pulse" />
                          <div className="text-xs font-bold text-orange-300">缺口数量</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,1)]">
                            {forecastGaps.length}
                          </span>
                          <span className="text-xs text-orange-300/80">个</span>
                        </div>
                      </div>
                    </div>

                    {/* 补预测按钮 */}
                    {(() => {
                      const buttonConfig = getButtonConfig(2, forecastGaps.length, forecastGaps.reduce((sum, p) => sum + p.gapAmount, 0));
                      return (
                        <div className={cn(
                          'relative rounded-xl p-2 overflow-hidden cursor-pointer group h-full flex flex-col items-center justify-center',
                          'border-2 border-yellow-500/70',
                          'bg-gradient-to-br from-yellow-900/30 to-orange-900/20',
                          'hover:from-yellow-900/50 hover:to-orange-900/30',
                          'shadow-[0_0_30px_rgba(234,179,8,0.5)]',
                          'hover:shadow-[0_0_40px_rgba(234,179,8,0.7)]',
                          'transition-all duration-300'
                        )}
                             onClick={() => openDialog({
                               title: buttonConfig.title,
                               description: buttonConfig.description,
                               confirmText: buttonConfig.confirmText,
                               cancelText: '取消',
                               onConfirm: async () => {
                                 console.log('操作已执行:', buttonConfig.actionText);
                               },
                               type: timeRange === 'quarter' ? 'info' : 'warning'
                             })}>
                          {/* 按钮发光效果 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute inset-0 border-2 border-yellow-500/50 rounded-xl animate-pulse"></div>

                          <div className="relative z-10 w-full flex flex-col items-center justify-center">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <div className="w-8 h-8 rounded-full bg-yellow-500/40 border-2 border-yellow-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.8)]">
                                <TrendingDown className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,1)]" />
                              </div>
                              <div className="text-base font-black text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,1)]">{buttonConfig.actionText}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                              <div className="text-xs text-yellow-300 font-semibold">
                                {buttonConfig.hintText ? buttonConfig.hintText : `全部 ${forecastGaps.length} 个项目`}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 表格区域 - 占位，保持宽度一致 */}
                <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full invisible">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-yellow-500/30', 'border-yellow-500/20')}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16 text-yellow-300 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]')}>序号</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-yellow-300 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]')}>项目名称</th>
                        <th className={cn('text-left py-2 px-3 font-medium hidden lg:table-cell text-yellow-300 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]')}>大区</th>
                        <th className={cn('text-left py-2 px-3 font-medium hidden md:table-cell text-yellow-300 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]')}>负责人</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-yellow-300 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]')}>当前预测</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-yellow-300 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]')}>目标预测</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-yellow-300 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]')}>缺口金额</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-yellow-300 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]')}>缺口比例</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(Math.min(5, forecastGaps.length))].map((_, index) => (
                        <tr key={index} className={cn('align-middle border-b border-yellow-500/10', index === Math.min(5, forecastGaps.length) - 1 && 'border-b-0')}>
                          <td className={cn('text-center py-2 px-3 text-sm text-yellow-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                              {index + 1}
                            </div>
                          </td>
                          <td className={cn('py-2 px-3 text-sm text-yellow-200 align-middle')}>
                            <div className="font-medium leading-snug text-yellow-100">占位项目名称</div>
                          </td>
                          <td className={cn('hidden lg:table-cell py-2 px-3 text-sm text-yellow-200 align-middle')}>-</td>
                          <td className={cn('hidden md:table-cell py-2 px-3 text-sm text-yellow-200 align-middle')}>-</td>
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap text-yellow-200 align-middle')}>
                            <span className="font-medium text-yellow-300">0</span>
                            <span className="text-sm ml-1 text-yellow-300/70">万</span>
                          </td>
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap text-yellow-200 align-middle')}>
                            <span className="font-medium text-yellow-300">0</span>
                            <span className="text-sm ml-1 text-yellow-300/70">万</span>
                          </td>
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap text-yellow-200 align-middle')}>
                            <span className="font-black text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.6)]">0</span>
                            <span className={cn('text-sm ml-1 text-orange-300/70')}>万</span>
                          </td>
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap text-yellow-200 align-middle')}>
                            <span className={cn('px-2 py-1 rounded text-xs font-bold', 'bg-yellow-500/20 text-yellow-400')}>0%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 分页 - 占位，保持高度一致 */}
                <div className="px-4 py-2 border-t border-yellow-500/20 flex justify-between items-center bg-gradient-to-r from-slate-900/50 to-transparent">
                  <div className={cn('text-xs flex items-center gap-2', 'text-yellow-300/70 invisible')}>
                    <Activity className="w-3 h-3 text-yellow-400/70" />
                    占位分页信息
                  </div>
                  <div className="invisible">
                    {/* 占位分页控件 */}
                    <span className="text-sm">◀ 1 / 1 ▶</span>
                  </div>
                </div>
              </div>
            )}

        {/* ============ Tab 3: 报备不足 ============ */}
        {currentTab === 3 && (
          // 明细视图
          <div className="h-full flex flex-col animate-in fade-in duration-300">
                {/* 顶部仪表盘风格指标卡片 - 紫色 */}
                <div className={cn(
                  'p-3 relative overflow-hidden',
                  TAB_COLOR_SCHEMES[3].bgGradient,
                  `border-b-2 ${TAB_COLOR_SCHEMES[3].border}`,
                  TAB_COLOR_SCHEMES[3].glow
                )}>
                  {/* 背景装饰网格 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(${TAB_COLOR_SCHEMES[3].primaryHex},0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(${TAB_COLOR_SCHEMES[3].primaryHex},0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* 顶部发光线条 */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                    style={{
                      background: `linear-gradient(to right, transparent, rgba(${TAB_COLOR_SCHEMES[3].primaryHex},1), transparent)`
                    }}
                  ></div>
                  
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {/* 待报项目数卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-purple-900/50 to-purple-800/30',
                      'border-2 border-purple-500/60',
                      'shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <FileText className="w-3.5 h-3.5 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,1)] animate-pulse" />
                          <div className="text-xs font-bold text-purple-300">待报备项目数</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,1)]">
                            3
                          </span>
                          <span className="text-xs text-purple-300/80">个</span>
                        </div>
                      </div>
                    </div>

                    {/* 总金额卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-indigo-900/50 to-indigo-800/30',
                      'border-2 border-indigo-500/60',
                      'shadow-[0_0_25px_rgba(99,102,241,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,1)] animate-pulse" />
                          <div className="text-xs font-bold text-indigo-300">总金额</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,1)]">
                            450
                          </span>
                          <span className="text-xs text-indigo-300/80">万</span>
                        </div>
                      </div>
                    </div>

                    {/* 立即上报按钮 */}
                    {(() => {
                      const buttonConfig = getButtonConfig(3, 3, 450);
                      return (
                        <div className={cn(
                          'relative rounded-xl p-2 overflow-hidden cursor-pointer group h-full flex flex-col items-center justify-center',
                          'border-2 border-purple-500/70',
                          'bg-gradient-to-br from-purple-900/30 to-indigo-900/20',
                          'hover:from-purple-900/50 hover:to-indigo-900/30',
                          'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
                          'hover:shadow-[0_0_40px_rgba(168,85,247,0.7)]',
                          'transition-all duration-300'
                        )}
                             onClick={() => openDialog({
                               title: buttonConfig.title,
                               description: buttonConfig.description,
                               confirmText: buttonConfig.confirmText,
                               cancelText: '取消',
                               onConfirm: async () => {
                                 console.log('操作已执行:', buttonConfig.actionText);
                               },
                               type: timeRange === 'quarter' ? 'info' : 'info'
                             })}>
                          {/* 按钮发光效果 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute inset-0 border-2 border-purple-500/50 rounded-xl animate-pulse"></div>

                          <div className="relative z-10 w-full flex flex-col items-center justify-center">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <div className="w-8 h-8 rounded-full bg-purple-500/40 border-2 border-purple-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                                <Send className="w-4 h-4 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,1)]" />
                              </div>
                              <div className="text-base font-black text-purple-400 drop-shadow-[0_0_12px_rgba(192,132,252,1)]">{buttonConfig.actionText}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                              <div className="text-xs text-purple-300 font-semibold">
                                {buttonConfig.hintText ? buttonConfig.hintText : '全部 3 个项目'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 占位区域 - 保持宽度一致但不显示内容 */}
                <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full invisible">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-purple-500/30', 'border-purple-500/20')}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16 text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]')}>序号</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]')}>项目名称</th>
                        <th className={cn('text-left py-2 px-3 font-medium hidden lg:table-cell text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]')}>大区</th>
                        <th className={cn('text-left py-2 px-3 font-medium hidden md:table-cell text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]')}>负责人</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]')}>金额</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]')}>预计报单</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]')}>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(3)].map((_, index) => (
                        <tr key={index} className={cn('align-middle border-b border-purple-500/10', index === 2 && 'border-b-0')}>
                          <td className={cn('text-center py-2 px-3 text-sm text-purple-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/30">
                              {index + 1}
                            </div>
                          </td>
                          <td className={cn('py-2 px-3 text-sm text-purple-200 align-middle')}>
                            <div className="font-medium leading-snug text-purple-100">待报备项目名称</div>
                          </td>
                          <td className={cn('hidden lg:table-cell py-2 px-3 text-sm text-purple-200 align-middle')}>-</td>
                          <td className={cn('hidden md:table-cell py-2 px-3 text-sm text-purple-200 align-middle')}>-</td>
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap text-purple-200 align-middle')}>
                            <span className="font-medium text-purple-300">0</span>
                            <span className="text-sm ml-1 text-purple-300/70">万</span>
                          </td>
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap text-purple-200 align-middle')}>
                            <span className="font-medium text-purple-300">-</span>
                          </td>
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap text-purple-200 align-middle')}>
                            <span className={cn('px-2 py-1 rounded text-xs font-bold', 'bg-purple-500/20 text-purple-400')}>待报</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 分页 - 占位，保持高度一致 */}
                <div className="px-4 py-2 border-t border-purple-500/20 flex justify-between items-center bg-gradient-to-r from-slate-900/50 to-transparent">
                  <div className={cn('text-xs flex items-center gap-2', 'text-purple-300/70 invisible')}>
                    <Activity className="w-3 h-3 text-purple-400/70" />
                    占位分页信息
                  </div>
                  <div className="invisible">
                    {/* 占位分页控件 */}
                    <span className="text-sm">◀ 1 / 1 ▶</span>
                  </div>
                </div>
              </div>
            )}

        {/* ============ Tab 4: 转化不足 ============ */}
        {currentTab === 4 && (
          // 明细视图
          <div className="h-full flex flex-col animate-in fade-in duration-300">
                {/* 顶部仪表盘风格指标卡片 - 粉色 */}
                <div className={cn(
                  'p-3 relative overflow-hidden',
                  TAB_COLOR_SCHEMES[4].bgGradient,
                  `border-b-2 ${TAB_COLOR_SCHEMES[4].border}`,
                  TAB_COLOR_SCHEMES[4].glow
                )}>
                  {/* 背景装饰网格 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(${TAB_COLOR_SCHEMES[4].primaryHex},0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(${TAB_COLOR_SCHEMES[4].primaryHex},0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* 顶部发光线条 */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                    style={{
                      background: `linear-gradient(to right, transparent, rgba(${TAB_COLOR_SCHEMES[4].primaryHex},1), transparent)`
                    }}
                  ></div>
                  
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {/* 待转化项目数卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-pink-900/50 to-pink-800/30',
                      'border-2 border-pink-500/60',
                      'shadow-[0_0_25px_rgba(236,72,153,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Zap className="w-3.5 h-3.5 text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,1)] animate-pulse" />
                          <div className="text-xs font-bold text-pink-300">待转化项目数</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,1)]">
                            {insufficientConversions.length}
                          </span>
                          <span className="text-xs text-pink-300/80">个</span>
                        </div>
                      </div>
                    </div>

                    {/* 总金额卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-rose-900/50 to-rose-800/30',
                      'border-2 border-rose-500/60',
                      'shadow-[0_0_25px_rgba(244,63,94,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,1)] animate-pulse" />
                          <div className="text-xs font-bold text-rose-300">总金额</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,1)]">
                            {insufficientConversions.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
                          </span>
                          <span className="text-xs text-rose-300/80">万</span>
                        </div>
                      </div>
                    </div>

                    {/* 立即跟进按钮 */}
                    {(() => {
                      const buttonConfig = getButtonConfig(4, insufficientConversions.length, insufficientConversions.reduce((sum, p) => sum + p.amount, 0));
                      return (
                        <div className={cn(
                          'relative rounded-xl p-2 overflow-hidden cursor-pointer group h-full flex flex-col items-center justify-center',
                          'border-2 border-pink-500/70',
                          'bg-gradient-to-br from-pink-900/30 to-rose-900/20',
                          'hover:from-pink-900/50 hover:to-rose-900/30',
                          'shadow-[0_0_30px_rgba(236,72,153,0.5)]',
                          'hover:shadow-[0_0_40px_rgba(236,72,153,0.7)]',
                          'transition-all duration-300'
                        )}
                             onClick={() => openDialog({
                               title: buttonConfig.title,
                               description: buttonConfig.description,
                               confirmText: buttonConfig.confirmText,
                               cancelText: '取消',
                               onConfirm: async () => {
                                 console.log('操作已执行:', buttonConfig.actionText);
                               },
                               type: timeRange === 'quarter' ? 'info' : 'info'
                             })}>
                          {/* 按钮发光效果 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-rose-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute inset-0 border-2 border-pink-500/50 rounded-xl animate-pulse"></div>

                          <div className="relative z-10 w-full flex flex-col items-center justify-center">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <div className="w-8 h-8 rounded-full bg-pink-500/40 border-2 border-pink-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(236,72,153,0.8)]">
                                <Send className="w-4 h-4 text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,1)]" />
                              </div>
                              <div className="text-base font-black text-pink-400 drop-shadow-[0_0_12px_rgba(244,114,182,1)]">{buttonConfig.actionText}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                              <div className="text-xs text-pink-300 font-semibold">
                                {buttonConfig.hintText ? buttonConfig.hintText : `全部 ${insufficientConversions.length} 个项目`}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 表格区域 */}
                <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-pink-500/30', 'border-pink-500/20')}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16 text-pink-300 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]')}>序号</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-pink-300 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]')}>项目名称</th>
                        <th className={cn('text-left py-2 px-3 font-medium hidden lg:table-cell text-pink-300 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]')}>当前阶段</th>
                        <th className={cn('text-left py-2 px-3 font-medium hidden md:table-cell text-pink-300 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]')}>大区</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-pink-300 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]')}>停留天数</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-pink-300 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]')}>金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      {insufficientConversions.map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'align-middle border-b border-pink-500/10 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-rose-500/10 transition-all duration-200',
                            index === insufficientConversions.length - 1 && 'border-b-0'
                          )}
                        >
                          {/* 序号 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-pink-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/10 border border-pink-500/30">
                              {index + 1}
                            </div>
                          </td>

                          {/* 项目名称 */}
                          <td className={cn('py-2 px-3 text-sm', 'text-pink-200', 'align-middle')}>
                            <div className="font-medium leading-snug text-pink-100">{item.projectName}</div>
                          </td>

                          {/* 当前阶段 */}
                          <td className={cn('hidden lg:table-cell py-2 px-3 text-sm text-pink-200 align-middle')}>
                            <span className={cn('px-2 py-1 rounded text-xs font-medium bg-pink-500/20 text-pink-300')}>{item.currentPhase}</span>
                          </td>

                          {/* 大区 */}
                          <td className={cn('hidden md:table-cell py-2 px-3 text-sm text-pink-200 align-middle')}>
                            {item.region || '-'}
                          </td>

                          {/* 停留天数 */}
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap text-pink-200 align-middle')}>
                            <span className={cn(
                              'font-bold',
                              item.stayDays >= 15 ? 'text-red-400' : item.stayDays >= 10 ? 'text-orange-400' : 'text-pink-300'
                            )}>{item.stayDays}</span>
                            <span className="text-sm ml-1 text-pink-300/70">天</span>
                          </td>

                          {/* 金额 */}
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap', 'text-pink-200', 'align-middle')}>
                            <span className="font-black text-pink-300">{item.amount.toFixed(0)}</span>
                            <span className={cn('text-sm ml-1 text-pink-300/70')}>万</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 分页 */}
                <div className="px-4 py-2 border-t border-pink-500/20 flex justify-between items-center bg-gradient-to-r from-slate-900/50 to-transparent">
                  <div className={cn('text-xs flex items-center gap-2', 'text-pink-300/70')}>
                    <Activity className="w-3 h-3 text-pink-400/70" />
                    共 {insufficientConversions.length} 条记录
                  </div>
                </div>
              </div>
            )}

        {/* ============ Tab 5: 阶段停滞 ============ */}
        {currentTab === 5 && (
          // 明细视图
          <div className="h-full flex flex-col animate-in fade-in duration-300">
                {/* 顶部仪表盘风格指标卡片 - 灰色 */}
                <div className={cn(
                  'p-3 relative overflow-hidden',
                  TAB_COLOR_SCHEMES[5].bgGradient,
                  `border-b-2 ${TAB_COLOR_SCHEMES[5].border}`,
                  TAB_COLOR_SCHEMES[5].glow
                )}>
                  {/* 背景装饰网格 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(${TAB_COLOR_SCHEMES[5].primaryHex},0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(${TAB_COLOR_SCHEMES[5].primaryHex},0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* 顶部发光线条 */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                    style={{
                      background: `linear-gradient(to right, transparent, rgba(${TAB_COLOR_SCHEMES[5].primaryHex},1), transparent)`
                    }}
                  ></div>
                  
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {/* 停滞项目数卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-slate-800/50 to-slate-700/30',
                      'border-2 border-slate-500/60',
                      'shadow-[0_0_25px_rgba(148,163,184,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-slate-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Pause className="w-3.5 h-3.5 text-slate-400 drop-shadow-[0_0_10px_rgba(148,163,184,1)] animate-pulse" />
                          <div className="text-xs font-bold text-slate-300">停滞项目数</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-400 drop-shadow-[0_0_15px_rgba(203,213,225,1)]">
                            {phaseStagnations.length}
                          </span>
                          <span className="text-xs text-slate-300/80">个</span>
                        </div>
                      </div>
                    </div>

                    {/* 总金额卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-stone-800/50 to-stone-700/30',
                      'border-2 border-stone-500/60',
                      'shadow-[0_0_25px_rgba(168,162,158,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-stone-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-stone-400 drop-shadow-[0_0_10px_rgba(168,162,158,1)] animate-pulse" />
                          <div className="text-xs font-bold text-stone-300">总金额</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-stone-400 drop-shadow-[0_0_15px_rgba(214,211,209,1)]">
                            {phaseStagnations.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
                          </span>
                          <span className="text-xs text-stone-300/80">万</span>
                        </div>
                      </div>
                    </div>

                    {/* 推进处理按钮 */}
                    {(() => {
                      const buttonConfig = getButtonConfig(5, phaseStagnations.length, phaseStagnations.reduce((sum, p) => sum + p.amount, 0));
                      return (
                        <div className={cn(
                          'relative rounded-xl p-2 overflow-hidden cursor-pointer group h-full flex flex-col items-center justify-center',
                          'border-2 border-slate-500/70',
                          'bg-gradient-to-br from-slate-800/30 to-stone-900/20',
                          'hover:from-slate-800/50 hover:to-stone-900/30',
                          'shadow-[0_0_30px_rgba(148,163,184,0.5)]',
                          'hover:shadow-[0_0_40px_rgba(148,163,184,0.7)]',
                          'transition-all duration-300'
                        )}
                             onClick={() => openDialog({
                               title: buttonConfig.title,
                               description: buttonConfig.description,
                               confirmText: buttonConfig.confirmText,
                               cancelText: '取消',
                               onConfirm: async () => {
                                 console.log('操作已执行:', buttonConfig.actionText);
                               },
                               type: timeRange === 'quarter' ? 'info' : 'info'
                             })}>
                          {/* 按钮发光效果 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-500/30 to-stone-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute inset-0 border-2 border-slate-500/50 rounded-xl animate-pulse"></div>

                          <div className="relative z-10 w-full flex flex-col items-center justify-center">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <div className="w-8 h-8 rounded-full bg-slate-500/40 border-2 border-slate-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(148,163,184,0.8)]">
                                <Play className="w-4 h-4 text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,1)]" />
                              </div>
                              <div className="text-base font-black text-slate-400 drop-shadow-[0_0_12px_rgba(203,213,225,1)]">{buttonConfig.actionText}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                              <div className="text-xs text-slate-300 font-semibold">
                                {buttonConfig.hintText ? buttonConfig.hintText : `全部 ${phaseStagnations.length} 个项目`}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 表格区域 */}
                <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-slate-500/30', 'border-slate-500/20')}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16 text-slate-300 drop-shadow-[0_0_5px_rgba(148,163,184,0.5)]')}>序号</th>
                        <th className={cn('text-left py-2 px-3 font-medium text-slate-300 drop-shadow-[0_0_5px_rgba(148,163,184,0.5)]')}>项目名称</th>
                        <th className={cn('text-left py-2 px-3 font-medium hidden lg:table-cell text-slate-300 drop-shadow-[0_0_5px_rgba(148,163,184,0.5)]')}>当前阶段</th>
                        <th className={cn('text-left py-2 px-3 font-medium hidden md:table-cell text-slate-300 drop-shadow-[0_0_5px_rgba(148,163,184,0.5)]')}>大区</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-slate-300 drop-shadow-[0_0_5px_rgba(148,163,184,0.5)]')}>停留天数</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-slate-300 drop-shadow-[0_0_5px_rgba(148,163,184,0.5)]')}>金额</th>
                        <th className={cn('text-right py-2 px-3 font-medium text-slate-300 drop-shadow-[0_0_5px_rgba(148,163,184,0.5)]')}>风险等级</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phaseStagnations.map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'align-middle border-b border-slate-500/10 hover:bg-gradient-to-r hover:from-slate-500/10 hover:to-stone-500/10 transition-all duration-200',
                            index === phaseStagnations.length - 1 && 'border-b-0'
                          )}
                        >
                          {/* 序号 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-slate-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-500/10 border border-slate-500/30">
                              {index + 1}
                            </div>
                          </td>

                          {/* 项目名称 */}
                          <td className={cn('py-2 px-3 text-sm', 'text-slate-200', 'align-middle')}>
                            <div className="font-medium leading-snug text-slate-100">{item.projectName}</div>
                          </td>

                          {/* 当前阶段 */}
                          <td className={cn('hidden lg:table-cell py-2 px-3 text-sm text-slate-200 align-middle')}>
                            <span className={cn('px-2 py-1 rounded text-xs font-medium bg-slate-500/20 text-slate-300')}>{item.currentPhase}</span>
                          </td>

                          {/* 大区 */}
                          <td className={cn('hidden md:table-cell py-2 px-3 text-sm text-slate-200 align-middle')}>
                            {item.region || '-'}
                          </td>

                          {/* 停留天数 */}
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap text-slate-200 align-middle')}>
                            <span className={cn(
                              'font-bold',
                              item.stayDays >= 20 ? 'text-red-400' : item.stayDays >= 15 ? 'text-orange-400' : 'text-slate-300'
                            )}>{item.stayDays}</span>
                            <span className="text-sm ml-1 text-slate-300/70">天</span>
                          </td>

                          {/* 金额 */}
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap', 'text-slate-200', 'align-middle')}>
                            <span className="font-black text-slate-300">{item.amount.toFixed(0)}</span>
                            <span className={cn('text-sm ml-1 text-slate-300/70')}>万</span>
                          </td>

                          {/* 风险等级 */}
                          <td className={cn('text-right py-2 px-3 whitespace-nowrap text-slate-200 align-middle')}>
                            <span className={cn(
                              'px-2 py-1 rounded text-xs font-bold',
                              item.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                              item.riskLevel === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-green-500/20 text-green-400'
                            )}>
                              {item.riskLevel === 'high' ? '高' : item.riskLevel === 'medium' ? '中' : '低'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 分页 */}
                <div className="px-4 py-2 border-t border-slate-500/20 flex justify-between items-center bg-gradient-to-r from-slate-900/50 to-transparent">
                  <div className={cn('text-xs flex items-center gap-2', 'text-slate-300/70')}>
                    <Activity className="w-3 h-3 text-slate-400/70" />
                    共 {phaseStagnations.length} 条记录
                  </div>
                </div>
              </div>
            )}
      </div>

      {/* 确认对话框 */}
      {dialogConfig && (
        <ConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={dialogConfig.title}
          description={dialogConfig.description}
          confirmText={dialogConfig.confirmText}
          cancelText={dialogConfig.cancelText}
          onConfirm={dialogConfig.onConfirm}
          type={dialogConfig.type}
        />
      )}
    </div>
  );
}
