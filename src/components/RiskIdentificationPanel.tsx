'use client';

import { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Building2, Clock, TrendingDown, Users, ChevronRight, ChevronLeft, PauseCircle, Gauge, Circle, Target, BarChart3, ArrowLeft, Activity, DollarSign, XCircle, Send } from 'lucide-react';
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

// 组件属性
interface RiskIdentificationPanelProps {
  largeProjectDependencies?: LargeProjectDependency[];
  forecastGaps?: ForecastGap[];
  unorderedProjects?: UnorderedProject[];
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

  // 当时间维度变化时，重置当前 Tab
  useEffect(() => {
    if (timeRange === 'current') {
      setCurrentTab(0);
      setCurrentPage(1);
      setViewMode('summary');
    } else {
      setCurrentTab(1);
      setCurrentPage(1);
      setViewMode('summary');
    }
  }, [timeRange]);

  // 所有 Tab 定义
  const allTabs = [
    { id: 2, label: '预测不足', icon: TrendingDown },
    { id: 0, label: '未按计划下单', icon: XCircle },
    { id: 1, label: '大项目依赖', icon: Building2 }
  ];

  // 根据时间维度显示的 Tabs
  // 本月、本季度、本年度：都显示所有 Tabs
  const visibleTabs = allTabs;

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
    return forecastGaps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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

                // 计算角标数量
                const badgeCount = isUnorderedProjects 
                  ? filteredUnorderedProjects.length 
                  : isForecastGap 
                  ? forecastGaps.length 
                  : 0;

                // 是否闪烁（数量>0且非当前Tab）
                const shouldPulse = badgeCount > 0 && tab.id !== currentTab;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative',
                      // 未按计划下单使用红色主题
                      isUnorderedProjects && theme === 'dashboard'
                        ? 'bg-red-500/40 text-red-200 border-2 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
                        : isUnorderedProjects
                        ? 'bg-red-100 text-red-700 border-2 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                        : isForecastGap && theme === 'dashboard'
                        ? 'bg-orange-500/40 text-orange-200 border-2 border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.6)]'
                        : isForecastGap
                        ? 'bg-orange-100 text-orange-700 border-2 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                        : currentTab === tab.id
                        ? theme === 'dashboard'
                          ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                          : 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                        : theme === 'dashboard'
                        ? 'bg-slate-800/30 text-cyan-400/70 border border-cyan-400/20'
                        : 'bg-slate-100 text-slate-600 border border-slate-300',
                      // 闪烁效果
                      shouldPulse && 'animate-pulse'
                    )}
                  >
                    {isUnorderedProjects ? (
                      <Icon className={cn(
                        'w-4 h-4',
                        theme === 'dashboard' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,1)]' : 'text-red-600'
                      )} />
                    ) : isForecastGap ? (
                      <Icon className={cn(
                        'w-4 h-4',
                        theme === 'dashboard' ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,1)]' : 'text-orange-600'
                      )} />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                    <span className={isUnorderedProjects && theme === 'dashboard' ? 'font-bold text-xs' : ''}>
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
                {/* 顶部仪表盘风格指标卡片 - 增强红色警告效果 */}
                <div className={cn(
                  'p-3 relative overflow-hidden',
                  'bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900',
                  'border-b-2 border-red-500/50',
                  'shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                )}>
                  {/* 背景装饰网格 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(239,68,68,0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(239,68,68,0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* 顶部发光线条 - 红色 */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
                  
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {/* 项目数量卡片 - 增强效果 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden h-full flex flex-col items-center justify-center',
                      'bg-gradient-to-br from-red-900/50 to-red-800/30',
                      'border-2 border-red-500/60',
                      'shadow-[0_0_25px_rgba(239,68,68,0.5)]'
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse" />
                          <div className="text-xs font-bold text-red-300">项目数量</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,1)]">
                            {filteredUnorderedProjects.length}
                          </span>
                          <span className="text-xs text-red-300/80">个</span>
                        </div>
                      </div>
                    </div>

                    {/* 总金额卡片 - 增强效果 */}
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

                    {/* 催下单按钮 - 增强效果 */}
                    <div className={cn(
                      'relative rounded-xl p-2 overflow-hidden cursor-pointer group h-full flex flex-col items-center justify-center',
                      'border-2 border-red-500/70',
                      'bg-gradient-to-br from-red-900/30 to-orange-900/20',
                      'hover:from-red-900/50 hover:to-orange-900/30',
                      'shadow-[0_0_30px_rgba(239,68,68,0.5)]',
                      'hover:shadow-[0_0_40px_rgba(239,68,68,0.7)]',
                      'transition-all duration-300'
                    )}
                         onClick={() => openDialog({
                           title: '催下单提醒',
                           description: `确定要向所有未下单项目的销售工程师发送催办提醒吗？\n\n共 ${filteredUnorderedProjects.length} 个项目，总金额 ${filteredUnorderedProjects.reduce((sum, p) => sum + p.amount, 0).toFixed(0)} 万元`,
                           confirmText: '确认发送',
                           cancelText: '取消',
                           onConfirm: async () => {
                             // TODO: 实际的催下单逻辑
                             console.log('催下单操作已执行');
                           },
                           type: 'warning'
                         })}>
                      {/* 按钮发光效果 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 border-2 border-red-500/50 rounded-xl animate-pulse"></div>

                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-8 h-8 rounded-full bg-red-500/40 border-2 border-red-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                            <Send className="w-4 h-4 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,1)]" />
                          </div>
                          <div className="text-base font-black text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,1)]">催下单</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          <div className="text-xs text-red-300 font-semibold">全部 {filteredUnorderedProjects.length} 个项目</div>
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
            {/* 顶部仪表盘风格指标卡片 */}
            <div className={cn(
              'p-3 relative overflow-hidden',
              'bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900',
              'border-b-2 border-cyan-500/50',
              'shadow-[0_0_20px_rgba(6,182,212,0.3)]'
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>

              <div className="relative z-10 grid grid-cols-3 gap-3">
                {/* 依赖项目数卡片 */}
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
                      <div className="text-xs font-bold text-cyan-300">依赖项目</div>
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

                {/* 在线沟通按钮 */}
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
                       title: '在线沟通',
                       description: `确定要向大项目依赖的负责人发送沟通提醒吗？\n\n共 ${largeProjectDependencies.length} 个大项目，总金额 ${largeProjectDependencies.reduce((sum, p) => sum + p.amount, 0).toFixed(0)} 万元`,
                       confirmText: '确认发送',
                       cancelText: '取消',
                       onConfirm: async () => {
                         // TODO: 实际的在线沟通逻辑
                         console.log('在线沟通操作已执行');
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
                      <div className="text-base font-black text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,1)]">在线沟通</div>
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
                  <div className={cn('text-xs flex items-center gap-2', DASHBOARD_STYLES.textMuted)}>
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
                {/* 顶部仪表盘风格指标卡片 - 黄色警告效果 */}
                <div className={cn(
                  'p-3 relative overflow-hidden',
                  'bg-gradient-to-br from-yellow-950/40 via-slate-900 to-slate-900',
                  'border-b-2 border-yellow-500/50',
                  'shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                )}>
                  {/* 背景装饰网格 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(234,179,8,0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(234,179,8,0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* 顶部发光线条 - 黄色 */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-pulse"></div>
                  
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

                    {/* 补预测按钮 - 增强效果 */}
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
                           title: '补预测',
                           description: `确定要生成预测不足项目的补充预测方案吗？\n\n共 ${forecastGaps.length} 个项目，预计缺口 ${forecastGaps.reduce((sum, p) => sum + p.gapAmount, 0).toFixed(0)} 万元`,
                           confirmText: '确认生成',
                           cancelText: '取消',
                           onConfirm: async () => {
                             // TODO: 实际的补预测逻辑
                             console.log('补预测操作已执行');
                           },
                           type: 'warning'
                         })}>
                      {/* 按钮发光效果 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 border-2 border-yellow-500/50 rounded-xl animate-pulse"></div>

                      <div className="relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-8 h-8 rounded-full bg-yellow-500/40 border-2 border-yellow-400/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.8)]">
                            <TrendingDown className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,1)]" />
                          </div>
                          <div className="text-base font-black text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,1)]">补预测</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          <div className="text-xs text-yellow-300 font-semibold">全部 {forecastGaps.length} 个项目</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 占位区域 - 保持与其他Tab高度一致 */}
                <div className="flex-1 bg-gradient-to-b from-slate-900/50 to-transparent"></div>
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
