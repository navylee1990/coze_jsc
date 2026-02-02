'use client';

import { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Building2, Clock, TrendingDown, Users, ChevronRight, ChevronLeft, PauseCircle, Gauge, Circle, Target, BarChart3, ArrowLeft, Activity, DollarSign, XCircle, Send, FileText, PlusCircle, Zap, Pause, Play, Calendar } from 'lucide-react';
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
  5: { // 阶段停滞 - 青色（需要推进）
    primary: 'cyan',
    primaryHex: '6,182,212',
    bgGradient: 'from-cyan-950/40 via-slate-900 to-slate-900',
    cardGradient: 'from-cyan-900/50 to-cyan-800/30',
    border: 'border-cyan-500/60',
    text: 'text-cyan-200',
    textMuted: 'text-cyan-300/70',
    textHighlight: 'text-cyan-400',
    neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.6)]',
    buttonGradient: 'from-cyan-900/30 to-blue-900/20',
    buttonHover: 'hover:from-cyan-900/50 hover:to-blue-900/30',
    shadow: 'shadow-[0_0_25px_rgba(6,182,212,0.5)]',
    hoverShadow: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.7)]',
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
  projectCode?: string; // 项目编号
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
  feedback?: string; // 情况反馈
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
  feedback?: string; // 情况反馈
}

// 7. 转化不足数据（项目未初步接洽）
interface InsufficientConversion {
  owner: string; // 负责人
  region: string; // 大区
  uncontactedCount: number; // 未初步接洽项目数
  feedback?: string; // 情况反馈
}

// 7.5 报备不足数据（报备项目数不足）
interface InsufficientReport {
  owner: string; // 负责人
  region: string; // 大区
  newReportedCount: number; // 新报备项目数
  gapCount: number; // 缺口项目数
  feedback?: string; // 情况反馈
}

// 8. 阶段停滞数据（项目在某个阶段停滞）
interface PhaseStagnation {
  owner: string; // 负责人
  region: string; // 大区
  stagnationCount: number; // 停滞阶段项目数
  feedback?: string; // 情况反馈
}

// 组件属性
interface RiskIdentificationPanelProps {
  largeProjectDependencies?: LargeProjectDependency[];
  forecastGaps?: ForecastGap[];
  unorderedProjects?: UnorderedProject[];
  insufficientConversions?: InsufficientConversion[];
  insufficientReports?: InsufficientReport[];
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
  { projectName: '深圳前海自贸区综合项目', region: '华南', owner: '周杰', gapAmount: 200, currentForecast: 300, targetForecast: 500, gapPercentage: 40, feedback: '预计3月会有新增项目补充' },
  { projectName: '天津天河城扩建项目', region: '华北', owner: '李明', gapAmount: 150, currentForecast: 250, targetForecast: 400, gapPercentage: 37.5, feedback: '正在洽谈两个大型项目' },
  { projectName: '杭州阿里巴巴园区二期', region: '二区', owner: '刘芳', gapAmount: 180, currentForecast: 220, targetForecast: 400, gapPercentage: 45, feedback: '客户决策流程延期' },
  { projectName: '广州白云机场T3扩建', region: '华南', owner: '王强', gapAmount: 120, currentForecast: 180, targetForecast: 300, gapPercentage: 40, feedback: '待确认最终方案' },
  { projectName: '北京大兴机场配套二期', region: '华北', owner: '张伟', gapAmount: 100, currentForecast: 150, targetForecast: 250, gapPercentage: 40, feedback: '正在等待预算批复' }
];

// 默认转化不足数据
const defaultInsufficientConversions: InsufficientConversion[] = [
  {
    owner: '刘洋',
    region: '一区',
    uncontactedCount: 3,
    feedback: '正在整理客户资料，预计下周完成初步接洽'
  },
  {
    owner: '陈静',
    region: '华南',
    uncontactedCount: 5,
    feedback: '客户预约时间紧张，正在协调'
  },
  {
    owner: '赵雪',
    region: '华南',
    uncontactedCount: 2,
    feedback: '已安排初次拜访，等待客户确认'
  },
  {
    owner: '杨帆',
    region: '二区',
    uncontactedCount: 4,
    feedback: '需要产品经理支持技术方案'
  },
  {
    owner: '马龙',
    region: '华北',
    uncontactedCount: 3,
    feedback: '客户在评估期，保持定期沟通'
  }
];

// 默认报备不足数据
const defaultInsufficientReports: InsufficientReport[] = [
  {
    owner: '张明',
    region: '一区',
    newReportedCount: 2,
    gapCount: 3,
    feedback: '正在跟进3个项目，预计下周报备'
  },
  {
    owner: '李娜',
    region: '华南',
    newReportedCount: 1,
    gapCount: 4,
    feedback: '客户决策流程延迟'
  },
  {
    owner: '王强',
    region: '华南',
    newReportedCount: 0,
    gapCount: 5,
    feedback: '需要总部技术支持'
  },
  {
    owner: '赵芳',
    region: '华北',
    newReportedCount: 3,
    gapCount: 2,
    feedback: '正在整理项目资料'
  },
  {
    owner: '孙伟',
    region: '二区',
    newReportedCount: 1,
    gapCount: 3,
    feedback: '等待客户预算确认'
  }
];

// 默认阶段停滞数据
const defaultPhaseStagnations: PhaseStagnation[] = [
  {
    owner: '胡燕',
    region: '西南',
    stagnationCount: 3,
    feedback: '客户决策流程复杂，需要高层支持'
  },
  {
    owner: '杨洋',
    region: '西南',
    stagnationCount: 2,
    feedback: '正在协调技术部门完善方案'
  },
  {
    owner: '赵峰',
    region: '西南',
    stagnationCount: 4,
    feedback: '竞争对手介入，需要调整报价策略'
  },
  {
    owner: '郑浩',
    region: '华中',
    stagnationCount: 2,
    feedback: '客户预算审批中，保持跟进'
  },
  {
    owner: '吴敏',
    region: '华中',
    stagnationCount: 3,
    feedback: '需要安排高层拜访推进项目'
  }
];

const defaultUnorderedProjects: UnorderedProject[] = [
  {
    id: 1,
    projectCode: 'P202601001',
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
    riskReason: '合同条款待确认',
    feedback: '预计本周内完成合同确认'
  },
  {
    id: 2,
    projectCode: 'P202601002',
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
    riskReason: '客户需求变更，方案需调整',
    feedback: '正在根据新需求调整方案'
  },
  {
    id: 3,
    projectCode: 'P202601003',
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
    riskReason: '商务合同待审批',
    feedback: '合同已提交审批流程'
  },
  {
    id: 4,
    projectCode: 'P202602001',
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
    riskReason: '客户决策延迟，商务谈判暂停',
    feedback: '等待客户高层决策'
  },
  {
    id: 5,
    projectCode: 'P202602002',
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
    riskReason: '客户决策延迟，商务谈判暂停',
    feedback: '计划下周重新启动谈判'
  },
  {
    id: 6,
    projectCode: 'P202602003',
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
    riskReason: '需求变更延迟',
    feedback: '正在协调内部资源'
  },
  {
    id: 7,
    projectCode: 'P202603001',
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
    riskReason: '项目风险较高，客户资金链紧张',
    feedback: '需评估风险后决定是否继续'
  },
  {
    id: 8,
    projectCode: 'P202603002',
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
    riskReason: '项目未最终确认，处于意向阶段',
    feedback: '待客户确认项目可行性'
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
  insufficientReports = defaultInsufficientReports,
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
      case 3: return insufficientReports;
      case 4: return insufficientConversions;
      case 5: return phaseStagnations;
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
  const getPaginatedInsufficientReports = () => {
    const result = insufficientReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return result;
  };
  const getPaginatedInsufficientConversions = () => {
    const result = insufficientConversions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return result;
  };
  const getPaginatedPhaseStagnations = () => {
    const result = phaseStagnations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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
    <div className={cn('w-full flex flex-col h-full')}>
      {/* 标题栏 */}
      <div
        className={cn(
          'px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 border-b flex items-center justify-between flex-shrink-0',
          theme === 'dashboard' ? `${DASHBOARD_STYLES.cardBorder} bg-slate-900/60` : 'border-slate-200 bg-white'
        )}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          {viewMode === 'detail' && (
            <button
              onClick={() => setViewMode('summary')}
              className={cn(
                'p-1 sm:p-1.5 rounded-lg transition-all mr-1 sm:mr-2',
                theme === 'dashboard'
                  ? 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
          <AlertTriangle className={cn(
            'w-4 h-4 sm:w-5 sm:h-5',
            theme === 'dashboard'
              ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]'
              : 'text-slate-700'
          )} />
          <h3 className={cn('font-bold text-sm sm:text-base md:text-lg', theme === 'dashboard'
            ? 'text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]'
            : 'text-slate-900')}>
            风险识别
          </h3>
        </div>
      </div>

      {/* Tab切换栏 - 仅在汇总视图显示 */}
      {viewMode === 'summary' && visibleTabs.length >= 1 && (
        <div className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const currentIndex = visibleTabs.findIndex(tab => tab.id === currentTab);
                const newIndex = (currentIndex - 1 + visibleTabs.length) % visibleTabs.length;
                setCurrentTab(visibleTabs[newIndex].id);
              }}
              className={cn(
                'p-0.5 sm:p-1 rounded-lg transition-all',
                theme === 'dashboard'
                  ? 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </button>

            <div className="flex items-center gap-1 sm:gap-2">
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

                // 是否闪烁（数量>0且是当前Tab）
                const shouldPulse = badgeCount > 0 && tab.id === currentTab;

                // 获取当前tab的颜色方案
                const colorScheme = TAB_COLOR_SCHEMES[tab.id as keyof typeof TAB_COLOR_SCHEMES] || TAB_COLOR_SCHEMES[0];
                const isActive = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={cn(
                      'flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-lg text-[8px] sm:text-[10px] md:text-xs font-medium transition-all relative',
                      // 激活状态
                      isActive && theme === 'dashboard'
                        ? cn(
                            `bg-${colorScheme.primary}-500/40 text-${colorScheme.primary}-200 border-2 ${colorScheme.border} ${colorScheme.shadow}`,
                            shouldPulse && 'animate-pulse'
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
                    <span className={isActive && theme === 'dashboard' ? 'font-bold text-sm' : ''}>
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
                'p-0.5 sm:p-1 rounded-lg transition-all',
                theme === 'dashboard'
                  ? 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden min-h-0">
        {/* ============ Tab 0: 未按计划下单 ============ */}
        {currentTab === 0 && (
          // 明细视图
          <div className="h-full flex flex-col animate-in fade-in duration-300">
                {/* 顶部仪表盘风格指标卡片 */}
                <div className={cn(
                  'p-3 relative overflow-hidden',
                  'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900',
                  'border-b-2 border-cyan-500/60',
                  'shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                )}>
                  {/* 背景装饰网格 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* 顶部发光线条 */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(6,182,212,1), transparent)'
                    }}
                  ></div>

                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {/* 项目数量卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                      'border-2 border-cyan-500/60',
                      'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                    )}>
                      <div
                        className="absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl animate-pulse"
                        style={{ backgroundColor: 'rgba(6,182,212,0.2)' }}
                      ></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-cyan-400 animate-pulse drop-shadow-[0_0_8px_rgba(6,182,212,1)]" />
                          <div className="text-sm font-bold text-cyan-300">项目数量</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,1)]">
                            {filteredUnorderedProjects.length}
                          </span>
                          <span className="text-xs text-cyan-300/80">个</span>
                        </div>
                      </div>
                    </div>

                    {/* 总金额卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                      'border-2 border-cyan-500/60',
                      'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,1)]" />
                          <div className="text-sm font-bold text-cyan-300">总金额</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                            {filteredUnorderedProjects.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
                          </span>
                          <span className="text-xs text-cyan-300/80">万</span>
                        </div>
                      </div>
                    </div>

                    {/* 催下单按钮 */}
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
                           title: '催下单提醒',
                           description: `XX，你好：您名下XX项目（编码、名称、预计下单日期、数量、金额）截止到当前仍未找到对应的订单信息。【数据来源：企业微信工作台-渠道运营-销售机会（预计下单日期）】请关注订单进展，确保按承诺执行。请在沟通后反馈本任务单，当前的最新情况。`,
                           confirmText: '确认发送',
                           cancelText: '取消',
                           onConfirm: async () => {
                             // TODO: 实际的催下单逻辑
                             console.log('催下单操作已执行');
                           },
                           type: 'warning'
                         })}>
                      {/* 按钮发光效果 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-xl animate-pulse"></div>

                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/40 border-2 border-cyan-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                            <Send className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
                          </div>
                          <div className="text-base font-black text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,1)]">催下单</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          <div className="text-xs text-cyan-300 font-semibold">全部 {filteredUnorderedProjects.length} 个项目</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 表格区域 */}
                <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-cyan-500/30', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16 text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>序号</th>
                        <th className={cn('text-center py-2 px-3 font-medium hidden lg:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>大区</th>
                        <th className={cn('text-center py-2 px-3 font-medium hidden md:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>项目编号</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>项目名称</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>预计下单</th>
                        <th className={cn('text-center py-2 px-3 font-medium hidden md:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>销售</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>金额（万）</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>情况反馈</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedUnorderedProjects().map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'align-middle border-b border-cyan-500/10 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-200 h-[44px]',
                            index === getPaginatedUnorderedProjects().length - 1 && 'border-b-0'
                          )}
                        >
                          {/* 序号 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                              {(currentPage - 1) * 5 + index + 1}
                            </div>
                          </td>

                          {/* 大区 */}
                          <td className={cn('hidden lg:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.region || '-'}
                          </td>

                          {/* 项目编号 */}
                          <td className={cn('hidden md:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            <span className="text-cyan-300/80 font-mono text-xs">{item.projectCode || '-'}</span>
                          </td>

                          {/* 项目名称 */}
                          <td className={cn('py-2 px-3 text-sm', DASHBOARD_STYLES.textSecondary, 'align-middle')}>
                            <div className="font-medium leading-snug text-cyan-100 whitespace-nowrap" title={item.name}>{item.name}</div>
                          </td>

                          {/* 预计下单时间 */}
                          <td className={cn('py-2 px-3 text-sm whitespace-nowrap text-cyan-200 align-middle')}>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-cyan-400/70" />
                              {item.expectedOrderDate || '-'}
                            </div>
                          </td>

                          {/* 销售工程师 */}
                          <td className={cn('hidden md:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.salesEngineer || '-'}
                          </td>

                          {/* 金额 */}
                          <td className={cn('text-center py-2 px-3 whitespace-nowrap', DASHBOARD_STYLES.textSecondary, 'align-middle')}>
                            <span className="font-black text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                              {item.amount.toFixed(2)}
                            </span>
                          </td>

                          {/* 情况反馈 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-200 align-middle max-w-[200px]')}>
                            <span
                              className="text-cyan-300/90 text-sm block whitespace-nowrap overflow-hidden truncate"
                              title={item.feedback || '-'}
                            >
                              {item.feedback || '-'}
                            </span>
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
            {/* 顶部仪表盘风格指标卡片 */}
            <div className={cn(
              'p-3 relative overflow-hidden',
              'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900',
              'border-b-2 border-cyan-500/60',
              'shadow-[0_0_15px_rgba(6,182,212,0.6)]'
            )}>
              {/* 背景装饰网格 */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `
                  linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}></div>
              {/* 顶部发光线条 */}
              <div
                className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(6,182,212,1), transparent)'
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
                      <div className="text-sm font-bold text-cyan-300">大项目数</div>
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
                  'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                  'border-2 border-cyan-500/60',
                  'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                )}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="relative z-10 w-full flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
                      <div className="text-sm font-bold text-cyan-300">总金额</div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                        {largeProjectDependencies.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
                      </span>
                      <span className="text-xs text-cyan-300/80">万</span>
                    </div>
                  </div>
                </div>

                {/* 在线确认按钮 */}
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
                       title: '在线确认',
                       description: `XX 大区经理：您负责区域下的XX项目存在大项目依赖（编码、名称、预计下单日期、数量、金额），因金额涉及较大，请回复本任务单，当前的最新情况，是否存在风险。`,
                       confirmText: '确认发送',
                       cancelText: '取消',
                       onConfirm: async () => {
                         // TODO: 实际的在线确认逻辑
                         console.log('在线确认操作已执行');
                       },
                       type: 'info'
                     })}>
                  {/* 按钮发光效果 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-xl animate-pulse"></div>

                  <div className="relative z-10 w-full flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/40 border-2 border-cyan-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                        <Send className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
                      </div>
                      <div className="text-base font-black text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,1)]">在线确认</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      <div className="text-xs text-cyan-300 font-semibold">全部 {largeProjectDependencies.length} 个项目</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 表格区域 */}
            <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-cyan-500/30', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16 text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>序号</th>
                        <th className={cn('text-center py-2 px-3 font-medium hidden lg:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>大区</th>
                        <th className={cn('text-center py-2 px-3 font-medium hidden md:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>项目编号</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>项目名称</th>
                        <th className={cn('text-center py-2 px-3 font-medium hidden md:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>销售</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>金额（万）</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>占总预测%</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>情况反馈</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedLargeProjectDependencies().map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'align-middle border-b border-cyan-500/10 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-cyan-500/5 transition-all duration-200 h-[44px]',
                            index === getPaginatedLargeProjectDependencies().length - 1 && 'border-b-0'
                          )}
                        >
                          {/* 序号 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                              {(currentPage - 1) * 5 + index + 1}
                            </div>
                          </td>
                          {/* 大区 */}
                          <td className={cn('hidden lg:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.region || '-'}
                          </td>
                          {/* 项目编号 */}
                          <td className={cn('hidden md:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.projectId || '-'}
                          </td>
                          {/* 项目名称 */}
                          <td className={cn('py-2 px-3 text-sm', DASHBOARD_STYLES.textSecondary, 'align-middle')}>
                            <div className="font-medium leading-snug text-cyan-100 whitespace-nowrap" title={item.projectName}>{item.projectName}</div>
                          </td>
                          {/* 销售（工程师） */}
                          <td className={cn('hidden md:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.owner || '-'}
                          </td>
                          {/* 金额 */}
                          <td className={cn('text-center py-2 px-3 whitespace-nowrap text-sm text-cyan-200 align-middle')}>
                            {item.amount.toFixed(0)}
                          </td>
                          {/* 占总预测% */}
                          <td className={cn('text-center py-2 px-3 whitespace-nowrap text-sm', DASHBOARD_STYLES.textSecondary, 'align-middle')}>
                            <span className={cn(
                              'px-2 py-1 rounded text-xs font-medium',
                              item.predictionRatio >= 60 ? 'bg-red-500/20 text-red-400' :
                              item.predictionRatio >= 55 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            )}>
                              {item.predictionRatio}%
                            </span>
                          </td>
                          {/* 情况反馈 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-200 align-middle max-w-[200px]')}>
                            <span
                              className={cn('text-cyan-300/90 text-sm block whitespace-nowrap overflow-hidden truncate',
                                item.status === 'critical' ? 'text-red-400' :
                                item.status === 'highRisk' ? 'text-orange-400' :
                                'text-cyan-300'
                              )}
                              title={item.status === 'critical' ? '占比过高，建议增加项目储备' :
                                     item.status === 'highRisk' ? '占比偏高，需关注项目进展' :
                                     '正常'}
                            >
                              {item.status === 'critical' ? '占比过高，建议增加项目储备' :
                               item.status === 'highRisk' ? '占比偏高，需关注项目进展' :
                               '正常'}
                            </span>
                          </td>
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
                {/* 顶部仪表盘风格指标卡片 */}
                <div className={cn(
                  'p-3 relative overflow-hidden',
                  'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900',
                  'border-b-2 border-cyan-500/60',
                  'shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                )}>
                  {/* 背景装饰网格 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* 顶部发光线条 */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(6,182,212,1), transparent)'
                    }}
                  ></div>
                  
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {/* 预计缺口金额卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                      'border-2 border-cyan-500/60',
                      'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
                          <div className="text-sm font-bold text-cyan-300">预计缺口金额</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                            {forecastGaps.reduce((sum, p) => sum + p.gapAmount, 0).toFixed(0)}
                          </span>
                          <span className="text-xs text-cyan-300/80">万</span>
                        </div>
                      </div>
                    </div>

                    {/* 缺口数量卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                      'border-2 border-cyan-500/60',
                      'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
                          <div className="text-sm font-bold text-cyan-300">缺口数量</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                            {forecastGaps.length}
                          </span>
                          <span className="text-xs text-cyan-300/80">个</span>
                        </div>
                      </div>
                    </div>

                    {/* 补预测按钮 - 跑车启动按钮风格 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden cursor-pointer group h-full flex flex-col items-center justify-center',
                      'border-2 border-cyan-500/70',
                      'bg-gradient-to-br from-slate-900/80 to-slate-800/60',
                      'hover:from-slate-900 hover:to-slate-800',
                      'shadow-[0_0_30px_rgba(6,182,212,0.5)]',
                      'hover:shadow-[0_0_50px_rgba(6,182,212,0.8)]',
                      'transition-all duration-300'
                    )}
                         onClick={() => openDialog({
                           title: '补预测',
                           description: `XX 大区经理：您负责的大区X月的预测金额XXX万元无法支撑本月的XXX万元目标金额，请尽快进行补充。【数据来源：企业微信工作台-渠道运营-销售机会（预计下单日期）。更新路径：企业微信工作台-渠道运行-销售机会（预计下单日期、数量、金额）】。您区域预测更新完毕后请反馈本任务单，当前的最新情况。`,
                           confirmText: '确认发送',
                           cancelText: '取消',
                           onConfirm: async () => {
                             // TODO: 实际的补预测逻辑
                             console.log('补预测操作已执行');
                           },
                           type: 'warning'
                         })}>
                      {/* 背景光晕 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* 旋转外光圈 */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="absolute w-20 h-20 border-2 border-cyan-500/30 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
                        <div className="absolute w-24 h-24 border border-cyan-500/20 rounded-full animate-spin" style={{animationDuration: '4s', animationDirection: 'reverse'}}></div>
                      </div>

                      {/* 脉冲内光圈 */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-cyan-500/20 rounded-full animate-pulse"></div>
                      </div>

                      {/* 主启动按钮 */}
                      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                        {/* 圆形启动键 */}
                        <div className={cn(
                          'relative w-14 h-14 rounded-full flex items-center justify-center',
                          'bg-gradient-to-br from-cyan-600 to-blue-700',
                          'border-3 border-cyan-400',
                          'shadow-[0_0_30px_rgba(6,182,212,0.6)]',
                          'group-hover:shadow-[0_0_50px_rgba(6,182,212,1)]',
                          'group-hover:scale-105',
                          'transition-all duration-300 cursor-pointer'
                        )}>
                          {/* 按钮内发光 */}
                          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm animate-pulse"></div>

                          {/* 启动图标 */}
                          <div className="relative z-10">
                            <svg className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M13 5L13 3L21 12L13 21L13 19C8.02944 19 4 14.9706 4 10C4 5.02944 8.02944 1 13 1C13.7 1 14.37 1.07 15 1.2C12.21 1.71 10 4.28 10 7.5C10 10.72 12.21 13.29 15 13.8C14.37 13.93 13.7 14 13 14C9.13401 14 6 10.866 6 7C6 6.34 6.07 5.7 6.2 5.1C7.93 3.74 10.34 3 13 3L13 5Z" />
                            </svg>
                          </div>

                          {/* 底部高光 */}
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/30 rounded-full blur-[1px]"></div>
                        </div>

                        {/* 按钮文字 */}
                        <div className="text-center">
                          <div className="text-base font-black text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,1)] tracking-wide">
                            补预测
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                            <div className="text-xs text-cyan-400/80 font-medium">
                              {forecastGaps.length} 个缺口
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 底部装饰线 */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* 表格区域 */}
                <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-cyan-500/30', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16 text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>序号</th>
                        <th className={cn('text-center py-2 px-3 font-medium hidden lg:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>大区</th>
                        <th className={cn('text-center py-2 px-3 font-medium hidden md:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>负责人</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>当前预测（万）</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>目标预测（万）</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>缺口金额（万）</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>缺口比例</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>情况反馈</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedForecastGaps().map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'align-middle border-b border-cyan-500/10 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-200 h-[44px]',
                            index === getPaginatedForecastGaps().length - 1 && 'border-b-0'
                          )}
                        >
                          {/* 序号 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                              {(currentPage - 1) * 5 + index + 1}
                            </div>
                          </td>

                          {/* 大区 */}
                          <td className={cn('hidden lg:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.region || '-'}
                          </td>

                          {/* 负责人 */}
                          <td className={cn('hidden md:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.owner || '-'}
                          </td>

                          {/* 当前预测 */}
                          <td className={cn('text-center py-2 px-3 whitespace-nowrap text-cyan-200 align-middle')}>
                            <span className="font-medium text-cyan-300">{item.currentForecast}</span>
                          </td>

                          {/* 目标预测 */}
                          <td className={cn('text-center py-2 px-3 whitespace-nowrap text-cyan-200 align-middle')}>
                            <span className="font-medium text-cyan-300">{item.targetForecast}</span>
                          </td>

                          {/* 缺口金额 */}
                          <td className={cn('text-center py-2 px-3 whitespace-nowrap', DASHBOARD_STYLES.textSecondary, 'align-middle')}>
                            <span className="font-black text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                              {item.gapAmount.toFixed(2)}
                            </span>
                          </td>

                          {/* 缺口比例 */}
                          <td className={cn('text-center py-2 px-3 whitespace-nowrap', DASHBOARD_STYLES.textSecondary, 'align-middle')}>
                            <span className={cn(
                              'px-2 py-1 rounded text-xs font-bold',
                              item.gapPercentage >= 50 ? 'bg-red-500/20 text-red-400' :
                              item.gapPercentage >= 40 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-cyan-500/20 text-cyan-400'
                            )}>
                              {item.gapPercentage}%
                            </span>
                          </td>

                          {/* 情况反馈 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-200 align-middle max-w-[200px]')}>
                            <span
                              className="text-cyan-300/90 text-sm block whitespace-nowrap overflow-hidden truncate"
                              title={item.feedback || '-'}
                            >
                              {item.feedback || '-'}
                            </span>
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
                    共 {forecastGaps.length} 条记录，当前第 {currentPage} / {totalPages} 页
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              </div>
            )}

        {/* ============ Tab 3: 报备不足 ============ */}
        {currentTab === 3 && (
          // 明细视图
          <div className="h-full flex flex-col animate-in fade-in duration-300">
                {/* 顶部仪表盘风格指标卡片 */}
                <div className={cn(
                  'p-3 relative overflow-hidden',
                  'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900',
                  'border-b-2 border-cyan-500/60',
                  'shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                )}>
                  {/* 背景装饰网格 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* 顶部发光线条 */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(6,182,212,1), transparent)'
                    }}
                  ></div>
                  
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {/* 新报备项目数卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                      'border-2 border-cyan-500/60',
                      'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <FileText className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
                          <div className="text-sm font-bold text-cyan-300">新报备项目数</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                            {insufficientReports.reduce((sum, p) => sum + p.newReportedCount, 0)}
                          </span>
                          <span className="text-xs text-cyan-300/80">个</span>
                        </div>
                      </div>
                    </div>

                    {/* 缺口项目数卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                      'border-2 border-cyan-500/60',
                      'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
                          <div className="text-sm font-bold text-cyan-300">缺口项目数</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                            {insufficientReports.reduce((sum, p) => sum + p.gapCount, 0)}
                          </span>
                          <span className="text-xs text-cyan-300/80">个</span>
                        </div>
                      </div>
                    </div>

                    {/* 立即上报按钮 */}
                    <div
                      className={cn(
                        'relative rounded-xl p-2 overflow-hidden cursor-pointer group h-full flex flex-col items-center justify-center',
                        'border-2 border-cyan-500/70',
                        'bg-gradient-to-br from-cyan-900/30 to-blue-900/20',
                        'hover:from-cyan-900/50 hover:to-blue-900/30',
                        'shadow-[0_0_30px_rgba(6,182,212,0.5)]',
                        'hover:shadow-[0_0_40px_rgba(6,182,212,0.7)]',
                        'transition-all duration-300'
                      )}
                      onClick={() => openDialog({
                        title: '立即上报',
                        description: '暂无模板内容',
                        confirmText: '确认发送',
                        cancelText: '取消',
                        onConfirm: async () => {
                          // TODO: 实际的上报逻辑
                          console.log('上报操作已执行');
                        },
                        type: 'info'
                      })}
                    >
                      {/* 按钮发光效果 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-xl animate-pulse"></div>

                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/40 border-2 border-cyan-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                            <Send className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
                          </div>
                          <div className="text-base font-black text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,1)]">立即上报</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          <div className="text-xs text-cyan-300 font-semibold">全部 {insufficientReports.reduce((sum, p) => sum + p.gapCount, 0)} 个缺口</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 表格区域 */}
                <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-cyan-500/30', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16 text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>序号</th>
                        <th className={cn('text-center py-2 px-3 font-medium hidden lg:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>大区</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>负责人</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>新报备项目数</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>缺口项目数</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>情况反馈</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedInsufficientReports().map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'align-middle border-b border-cyan-500/10 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-200 h-[44px]',
                            index === getPaginatedInsufficientReports().length - 1 && 'border-b-0'
                          )}
                        >
                          {/* 序号 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                              {(currentPage - 1) * 5 + index + 1}
                            </div>
                          </td>

                          {/* 大区 */}
                          <td className={cn('hidden lg:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.region || '-'}
                          </td>

                          {/* 负责人 */}
                          <td className={cn('py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.owner || '-'}
                          </td>

                          {/* 新报备项目数 */}
                          <td className={cn('text-center py-2 px-3 whitespace-nowrap text-sm text-cyan-200 align-middle')}>
                            <span className="font-bold text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                              {item.newReportedCount}
                            </span>
                          </td>

                          {/* 缺口项目数 */}
                          <td className={cn('text-center py-2 px-3 whitespace-nowrap text-sm', DASHBOARD_STYLES.textSecondary, 'align-middle')}>
                            <span className={cn(
                              'font-bold px-2 py-1 rounded text-xs',
                              item.gapCount > 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-cyan-500/20 text-cyan-400'
                            )}>
                              {item.gapCount}
                            </span>
                          </td>

                          {/* 情况反馈 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-200 align-middle max-w-[200px]')}>
                            <span
                              className="text-cyan-300/90 text-sm block whitespace-nowrap overflow-hidden truncate"
                              title={item.feedback || '-'}
                            >
                              {item.feedback || '-'}
                            </span>
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
                    共 {insufficientReports.length} 条记录，当前第 {currentPage} / {totalPages} 页
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              </div>
            )}

        {/* ============ Tab 4: 转化不足 ============ */}
        {currentTab === 4 && (
          // 明细视图
          <div className="h-full flex flex-col animate-in fade-in duration-300">
                {/* 顶部仪表盘风格指标卡片 */}
                <div className={cn(
                  'p-3 relative overflow-hidden',
                  'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900',
                  'border-b-2 border-cyan-500/60',
                  'shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                )}>
                  {/* 背景装饰网格 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* 顶部发光线条 */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(6,182,212,1), transparent)'
                    }}
                  ></div>
                  
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {/* 待初步接洽项目数卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                      'border-2 border-cyan-500/60',
                      'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Zap className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
                          <div className="text-sm font-bold text-cyan-300">未初步接洽</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                            {insufficientConversions.reduce((sum, p) => sum + p.uncontactedCount, 0)}
                          </span>
                          <span className="text-xs text-cyan-300/80">个</span>
                        </div>
                      </div>
                    </div>

                    {/* 涉及负责人卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                      'border-2 border-cyan-500/60',
                      'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Users className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
                          <div className="text-sm font-bold text-cyan-300">涉及负责人</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                            {insufficientConversions.length}
                          </span>
                          <span className="text-xs text-cyan-300/80">人</span>
                        </div>
                      </div>
                    </div>

                    {/* 推进接洽按钮 */}
                    <div
                      className={cn(
                        'relative rounded-xl p-2 overflow-hidden cursor-pointer group h-full flex flex-col items-center justify-center',
                        'border-2 border-cyan-500/70',
                        'bg-gradient-to-br from-cyan-900/30 to-blue-900/20',
                        'hover:from-cyan-900/50 hover:to-blue-900/30',
                        'shadow-[0_0_30px_rgba(6,182,212,0.5)]',
                        'hover:shadow-[0_0_40px_rgba(6,182,212,0.7)]',
                        'transition-all duration-300'
                      )}
                      onClick={() => openDialog({
                        title: '推进接洽',
                        description: '暂无模板内容',
                        confirmText: '确认发送',
                        cancelText: '取消',
                        onConfirm: async () => {
                          // TODO: 实际的跟进逻辑
                          console.log('跟进操作已执行');
                        },
                        type: 'info'
                      })}
                    >
                      {/* 按钮发光效果 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-xl animate-pulse"></div>

                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/40 border-2 border-cyan-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                            <Send className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
                          </div>
                          <div className="text-base font-black text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,1)]">推进接洽</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          <div className="text-xs text-cyan-300 font-semibold">全部 {insufficientConversions.reduce((sum, p) => sum + p.uncontactedCount, 0)} 个项目</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 表格区域 */}
                <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-cyan-500/30', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16 text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>序号</th>
                        <th className={cn('text-center py-2 px-3 font-medium hidden lg:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>大区</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>负责人</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>未初步接洽项目数</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>情况反馈</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedInsufficientConversions().map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'align-middle border-b border-cyan-500/10 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-200 h-[44px]',
                            index === getPaginatedInsufficientConversions().length - 1 && 'border-b-0'
                          )}
                        >
                          {/* 序号 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                              {(currentPage - 1) * 5 + index + 1}
                            </div>
                          </td>

                          {/* 大区 */}
                          <td className={cn('hidden lg:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.region || '-'}
                          </td>

                          {/* 负责人 */}
                          <td className={cn('py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.owner || '-'}
                          </td>

                          {/* 未初步接洽项目数 */}
                          <td className={cn('text-center py-2 px-3 whitespace-nowrap text-sm text-cyan-200 align-middle')}>
                            <span className={cn(
                              'font-bold px-2 py-1 rounded text-xs',
                              item.uncontactedCount > 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-cyan-500/20 text-cyan-400'
                            )}>
                              {item.uncontactedCount}
                            </span>
                          </td>

                          {/* 情况反馈 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-200 align-middle max-w-[200px]')}>
                            <span
                              className="text-cyan-300/90 text-sm block whitespace-nowrap overflow-hidden truncate"
                              title={item.feedback || '-'}
                            >
                              {item.feedback || '-'}
                            </span>
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
                    共 {insufficientConversions.length} 条记录，当前第 {currentPage} / {totalPages} 页
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
                      background: 'linear-gradient(to right, transparent, rgba(6,182,212,1), transparent)'
                    }}
                  ></div>
                  
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {/* 停滞项目数卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                      'border-2 border-cyan-500/60',
                      'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Pause className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
                          <div className="text-sm font-bold text-cyan-300">停滞项目数</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                            {phaseStagnations.reduce((sum, p) => sum + p.stagnationCount, 0)}
                          </span>
                          <span className="text-xs text-cyan-300/80">个</span>
                        </div>
                      </div>
                    </div>

                    {/* 涉及负责人卡片 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30',
                      'border-2 border-cyan-500/60',
                      'shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Users className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
                          <div className="text-sm font-bold text-cyan-300">涉及负责人</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                            {phaseStagnations.length}
                          </span>
                          <span className="text-xs text-cyan-300/80">人</span>
                        </div>
                      </div>
                    </div>

                    {/* 推进处理按钮 */}
                    <div
                      className={cn(
                        'relative rounded-xl p-2 overflow-hidden cursor-pointer group h-full flex flex-col items-center justify-center',
                        'border-2 border-cyan-500/70',
                        'bg-gradient-to-br from-cyan-900/30 to-blue-900/20',
                        'hover:from-cyan-900/50 hover:to-blue-900/30',
                        'shadow-[0_0_30px_rgba(6,182,212,0.5)]',
                        'hover:shadow-[0_0_40px_rgba(6,182,212,0.7)]',
                        'transition-all duration-300'
                      )}
                      onClick={() => openDialog({
                        title: '推进处理',
                        description: `XX，你好：你名下共计 ${phaseStagnations.reduce((sum, p) => sum + p.stagnationCount, 0)} 个项目阶段停滞，请及时更新项目进展。【数据来源：企业微信工作台-渠道运营-销售机会（预计下单日期、项目阶段）。更新路径：企业微信工作台-渠道运营-跟进记录、销售机会机会】`,
                        confirmText: '确认发送',
                        cancelText: '取消',
                        onConfirm: async () => {
                          // TODO: 实际的推进逻辑
                          console.log('推进操作已执行');
                        },
                        type: 'info'
                      })}
                    >
                      {/* 按钮发光效果 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-xl animate-pulse"></div>

                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/40 border-2 border-cyan-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                            <Play className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
                          </div>
                          <div className="text-base font-black text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,1)]">推进处理</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          <div className="text-xs text-cyan-300 font-semibold">全部 {phaseStagnations.reduce((sum, p) => sum + p.stagnationCount, 0)} 个项目</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 表格区域 */}
                <div className="flex-1 overflow-auto p-3 bg-gradient-to-b from-slate-900/50 to-transparent">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-sm border-b border-cyan-500/30', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16 text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>序号</th>
                        <th className={cn('text-center py-2 px-3 font-medium hidden lg:table-cell text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>大区</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>负责人</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>停滞阶段项目数</th>
                        <th className={cn('text-center py-2 px-3 font-medium text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] whitespace-nowrap')}>情况反馈</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedPhaseStagnations().map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'align-middle border-b border-cyan-500/10 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-200 h-[44px]',
                            index === getPaginatedPhaseStagnations().length - 1 && 'border-b-0'
                          )}
                        >
                          {/* 序号 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-300 align-middle')}>
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                              {(currentPage - 1) * 5 + index + 1}
                            </div>
                          </td>

                          {/* 项目名称 */}
                          <td className={cn('hidden lg:table-cell py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.region || '-'}
                          </td>

                          {/* 负责人 */}
                          <td className={cn('py-2 px-3 text-sm text-cyan-200 align-middle')}>
                            {item.owner || '-'}
                          </td>

                          {/* 停滞阶段项目数 */}
                          <td className={cn('text-center py-2 px-3 whitespace-nowrap text-sm text-cyan-200 align-middle')}>
                            <span className={cn(
                              'font-bold px-2 py-1 rounded text-xs',
                              item.stagnationCount > 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-cyan-500/20 text-cyan-400'
                            )}>
                              {item.stagnationCount}
                            </span>
                          </td>

                          {/* 情况反馈 */}
                          <td className={cn('text-center py-2 px-3 text-sm text-cyan-200 align-middle max-w-[200px]')}>
                            <span
                              className="text-cyan-300/90 text-sm block whitespace-nowrap overflow-hidden truncate"
                              title={item.feedback || '-'}
                            >
                              {item.feedback || '-'}
                            </span>
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
                    共 {phaseStagnations.length} 条记录，当前第 {currentPage} / {totalPages} 页
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
