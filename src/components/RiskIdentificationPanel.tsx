'use client';

import { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Building2, Clock, TrendingDown, Users, ChevronRight, ChevronLeft, PauseCircle, Gauge, Circle, Target, BarChart3, ArrowLeft, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  dependentProjects: string[];
  dependencyCount: number;
  region: string;
  owner: string;
  status: 'normal' | 'highRisk' | 'critical';
}

// 2. 阶段停滞数据
interface StageStagnation {
  projectName: string;
  projectId: string;
  currentStage: string;
  stagnationDuration: string;
  stagnationDays: number;
  region: string;
  owner: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

// 3. 预测风险数据
interface PredictedRisk {
  projectName: string;
  projectId: string;
  riskType: string;
  riskAmount: number;
  probability: number;
  region: string;
  owner: string;
  impact: 'high' | 'medium' | 'low';
}

// 4. 风险人员数据
interface RiskPersonnel {
  name: string;
  region: string;
  role: string;
  riskType: 'zeroProject' | 'lowPerformance' | 'stagnantProject' | 'highDependency';
  riskDuration: string;
  riskScore: number;
  activeProjects: number;
  lastClosedAmount: number;
}

// 5. 当月未下单数据
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
  stageStagnations?: StageStagnation[];
  predictedRisks?: PredictedRisk[];
  riskPersonnel?: RiskPersonnel[];
  unorderedProjects?: UnorderedProject[];
  theme?: 'dashboard' | 'light' | 'dark';
  timeRange?: 'current' | 'quarter' | 'year';
}

// ==================== 默认数据 ====================

const defaultLargeProjectDependencies: LargeProjectDependency[] = [
  { projectName: '北京地铁17号线', projectId: 'PRJ-001', amount: 1200, dependentProjects: ['地铁站点A', '地铁站点B', '控制中心'], dependencyCount: 3, region: '华北', owner: '张明', status: 'highRisk' },
  { projectName: '上海国际机场T4', projectId: 'PRJ-002', amount: 850, dependentProjects: ['航站楼A', '航站楼B'], dependencyCount: 2, region: '一区', owner: '李娜', status: 'normal' },
  { projectName: '深圳科技园', projectId: 'PRJ-003', amount: 680, dependentProjects: ['研发中心', '数据中心', '展示中心'], dependencyCount: 3, region: '华南', owner: '王强', status: 'critical' },
  { projectName: '广州高铁南站', projectId: 'PRJ-004', amount: 560, dependentProjects: ['候车厅', '商业区'], dependencyCount: 2, region: '华南', owner: '赵芳', status: 'highRisk' },
  { projectName: '杭州亚运会场馆', projectId: 'PRJ-005', amount: 450, dependentProjects: ['体育馆', '游泳馆'], dependencyCount: 2, region: '二区', owner: '孙伟', status: 'normal' }
];

const defaultStageStagnations: StageStagnation[] = [
  { projectName: '北京朝阳医院', projectId: 'PRJ-101', currentStage: '方案审批', stagnationDuration: '25天', stagnationDays: 25, region: '华北', owner: '刘洋', reason: '审批流程复杂，资料补充中', severity: 'high' },
  { projectName: '上海外国语学校', projectId: 'PRJ-102', currentStage: '商务谈判', stagnationDuration: '18天', stagnationDays: 18, region: '一区', owner: '陈静', reason: '价格谈判中，客户预算缩减', severity: 'medium' },
  { projectName: '深圳华为基地', projectId: 'PRJ-103', currentStage: '技术方案确认', stagnationDuration: '32天', stagnationDays: 32, region: '华南', owner: '吴敏', reason: '技术需求变更，重新设计中', severity: 'high' },
  { projectName: '广州白云机场', projectId: 'PRJ-104', currentStage: '合同签订', stagnationDuration: '12天', stagnationDays: 12, region: '华南', owner: '周涛', reason: '法务审核中', severity: 'low' },
  { projectName: '杭州阿里巴巴园区', projectId: 'PRJ-105', currentStage: '招标结果确认', stagnationDuration: '20天', stagnationDays: 20, region: '二区', owner: '郑磊', reason: '竞争对手质疑，需要复核', severity: 'medium' }
];

const defaultPredictedRisks: PredictedRisk[] = [
  { projectName: '北京首都机场扩建', projectId: 'PRJ-201', riskType: '项目延期', riskAmount: 350, probability: 85, region: '华北', owner: '张明', impact: 'high' },
  { projectName: '上海浦东新区学校', projectId: 'PRJ-202', riskType: '利润不足', riskAmount: 120, probability: 72, region: '一区', owner: '李娜', impact: 'medium' },
  { projectName: '深圳腾讯大厦', projectId: 'PRJ-203', riskType: '客户取消', riskAmount: 480, probability: 65, region: '华南', owner: '王强', impact: 'high' },
  { projectName: '广州政务中心', projectId: 'PRJ-204', riskType: '预算缩减', riskAmount: 180, probability: 58, region: '华南', owner: '赵芳', impact: 'medium' },
  { projectName: '杭州西湖景区项目', projectId: 'PRJ-205', riskType: '项目延期', riskAmount: 95, probability: 45, region: '二区', owner: '孙伟', impact: 'low' }
];

const defaultRiskPersonnel: RiskPersonnel[] = [
  { name: '刘洋', region: '华北', role: '销售经理', riskType: 'stagnantProject', riskDuration: '2个月', riskScore: 85, activeProjects: 1, lastClosedAmount: 120 },
  { name: '陈静', region: '一区', role: '销售经理', riskType: 'zeroProject', riskDuration: '3个月', riskScore: 92, activeProjects: 0, lastClosedAmount: 0 },
  { name: '吴敏', region: '华南', role: '销售经理', riskType: 'highDependency', riskDuration: '1个月', riskScore: 78, activeProjects: 2, lastClosedAmount: 280 },
  { name: '周涛', region: '华南', role: '销售经理', riskType: 'lowPerformance', riskDuration: '4个月', riskScore: 88, activeProjects: 3, lastClosedAmount: 85 },
  { name: '郑磊', region: '二区', role: '销售经理', riskType: 'stagnantProject', riskDuration: '2个月', riskScore: 75, activeProjects: 2, lastClosedAmount: 180 },
  { name: '王芳', region: '华中', role: '销售经理', riskType: 'zeroProject', riskDuration: '1个月', riskScore: 70, activeProjects: 0, lastClosedAmount: 0 },
  { name: '赵强', region: '西南', role: '销售经理', riskType: 'lowPerformance', riskDuration: '3个月', riskScore: 82, activeProjects: 2, lastClosedAmount: 95 },
  { name: '孙丽', region: '华北', role: '销售经理', riskType: 'highDependency', riskDuration: '2个月', riskScore: 80, activeProjects: 1, lastClosedAmount: 450 }
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

const getRiskTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    zeroProject: '无项目',
    lowPerformance: '业绩不佳',
    stagnantProject: '项目停滞',
    highDependency: '高依赖度'
  };
  return typeMap[type] || type;
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
  stageStagnations = defaultStageStagnations,
  predictedRisks = defaultPredictedRisks,
  riskPersonnel = defaultRiskPersonnel,
  unorderedProjects = defaultUnorderedProjects,
  theme = 'dashboard',
  timeRange = 'current'
}: RiskIdentificationPanelProps) {
  // Tab状态
  const [currentTab, setCurrentTab] = useState(timeRange === 'current' ? 4 : 0);
  const [viewMode, setViewMode] = useState<'summary' | 'detail'>('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 当时间维度变化时，重置当前 Tab
  useEffect(() => {
    if (timeRange === 'current') {
      setCurrentTab(4);
      setCurrentPage(1);
      setViewMode('summary');
    } else {
      setCurrentTab(0);
      setCurrentPage(1);
      setViewMode('summary');
    }
  }, [timeRange]);

  // 所有 Tab 定义
  const allTabs = [
    { id: 0, label: '大项目依赖', icon: Building2 },
    { id: 1, label: '阶段停滞', icon: PauseCircle },
    { id: 2, label: '预测风险', icon: TrendingDown },
    { id: 3, label: '风险人员', icon: Users },
    { id: 4, label: '当月未下单', icon: Target }
  ];

  // 根据时间维度显示的 Tabs
  // 本月：只显示"当月未下单"
  // 本季度/本年度：显示所有 Tabs
  const visibleTabs = timeRange === 'current'
    ? allTabs.filter(tab => tab.id === 4)
    : allTabs;

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
      case 0: return largeProjectDependencies;
      case 1: return stageStagnations;
      case 2: return predictedRisks;
      case 3: return riskPersonnel;
      case 4: return filteredUnorderedProjects;
      default: return [];
    }
  };

  const currentData = getCurrentData();
  const totalPages = Math.ceil(currentData.length / itemsPerPage);

  // 分页数据
  const getPaginatedLargeProjectDependencies = () => {
    return largeProjectDependencies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };
  const getPaginatedStageStagnations = () => {
    return stageStagnations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };
  const getPaginatedPredictedRisks = () => {
    return predictedRisks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };
  const getPaginatedRiskPersonnel = () => {
    return riskPersonnel.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };
  const getPaginatedUnorderedProjects = () => {
    return filteredUnorderedProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };

  // 高风险数量
  const highRiskCount = (() => {
    switch (currentTab) {
      case 0: return largeProjectDependencies.filter(p => p.status === 'critical').length;
      case 1: return stageStagnations.filter(p => p.severity === 'high').length;
      case 2: return predictedRisks.filter(p => p.impact === 'high').length;
      case 3: return riskPersonnel.filter(p => p.riskScore >= 80).length;
      case 4: return filteredUnorderedProjects.filter(p => p.delayDays && p.delayDays >= 10).length;
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
          <AlertTriangle className={cn('w-5 h-5', theme === 'dashboard' ? 'text-cyan-400' : 'text-slate-700')} />
          <h3 className={cn('font-bold text-lg', theme === 'dashboard' ? DASHBOARD_STYLES.textSecondary : 'text-slate-900')}>
            风险识别
          </h3>
        </div>
        {highRiskCount > 0 && viewMode === 'summary' && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium animate-pulse',
            theme === 'dashboard' ? 'bg-red-500/30 text-red-300 border border-red-500/40' : 'bg-red-100 text-red-700'
          )}>
            <AlertTriangle className="w-3 h-3" />
            {highRiskCount} 项高风险
          </div>
        )}
      </div>

      {/* Tab切换栏 - 仅在汇总视图显示 */}
      {viewMode === 'summary' && visibleTabs.length > 1 && (
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
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      currentTab === tab.id
                        ? theme === 'dashboard'
                          ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                          : 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                        : theme === 'dashboard'
                        ? 'bg-slate-800/30 text-cyan-400/70 border border-cyan-400/20'
                        : 'bg-slate-100 text-slate-600 border border-slate-300'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
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
        {/* ============ Tab 0: 大项目依赖 ============ */}
        {currentTab === 0 && (
          <>
            {viewMode === 'summary' ? (
              // 汇总视图
              <div className="h-full p-4 space-y-4 animate-in fade-in duration-300 overflow-y-auto">
                {/* 顶部仪表盘 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className={cn('rounded-lg p-4 border text-center', DASHBOARD_STYLES.cardBorder)}>
                    <CircularGauge value={largeProjectDependencies.length} max={20} color="cyan" size={100} label="依赖项目" />
                  </div>
                  <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                    <div className="text-xs mb-2 text-cyan-400/70">总金额</div>
                    <div className="text-3xl font-bold text-cyan-300" style={{ textShadow: '0 0 10px rgba(34,211,238,0.8)' }}>
                      {largeProjectDependencies.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
                      <span className="text-sm ml-1">万</span>
                    </div>
                  </div>
                  <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                    <HalfGauge value={largeProjectDependencies.reduce((sum, p) => sum + p.dependencyCount, 0) / largeProjectDependencies.length} max={5} unit="平均依赖数" />
                  </div>
                </div>

                {/* 状态分布饼图风格 */}
                <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                  <h4 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                    <Circle className="w-4 h-4" />
                    状态分布
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400 mb-1">{largeProjectDependencies.filter(p => p.status === 'critical').length}</div>
                      <div className="text-xs text-red-300/70">紧急</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-1">{largeProjectDependencies.filter(p => p.status === 'highRisk').length}</div>
                      <div className="text-xs text-orange-300/70">高风险</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-1">{largeProjectDependencies.filter(p => p.status === 'normal').length}</div>
                      <div className="text-xs text-green-300/70">正常</div>
                    </div>
                  </div>
                </div>

                {/* Top 3 高风险项目卡片 */}
                <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                  <h4 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    高风险项目 Top 3
                  </h4>
                  <div className="space-y-2">
                    {largeProjectDependencies
                      .filter(p => p.status === 'critical')
                      .slice(0, 3)
                      .map((item, index) => (
                        <div key={index} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium text-cyan-200">{item.projectName}</div>
                              <div className="text-xs text-cyan-400/70">{item.region} · {item.owner}</div>
                            </div>
                            <div className="text-xl font-bold text-red-400">{item.amount}万</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 查看详情按钮 */}
                <button
                  onClick={() => setViewMode('detail')}
                  className="w-full py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-medium hover:bg-cyan-500/30 transition-all"
                >
                  查看详细数据
                </button>
              </div>
            ) : (
              // 明细视图
              <div className="h-full flex flex-col animate-in fade-in duration-300">
                <div className="p-4 border-b border-cyan-500/20">
                  <div className="grid grid-cols-4 gap-3">
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>依赖项目数</div>
                      <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>{largeProjectDependencies.length}</div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>总金额</div>
                      <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                        {largeProjectDependencies.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}万
                      </div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>高风险项目</div>
                      <div className={cn('text-2xl font-bold text-red-400')}>
                        {largeProjectDependencies.filter(p => p.status === 'critical').length}
                      </div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>平均依赖数</div>
                      <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                        {(largeProjectDependencies.reduce((sum, p) => sum + p.dependencyCount, 0) / largeProjectDependencies.length).toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-xs border-b', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>项目名称</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>金额</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>依赖数</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>依赖项目</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>区域</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>负责人</th>
                        <th className={cn('text-center py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedLargeProjectDependencies().map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors',
                            index === getPaginatedLargeProjectDependencies().length - 1 && 'border-b-0'
                          )}
                        >
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <div className="font-medium">{item.projectName}</div>
                            <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{item.projectId}</div>
                          </td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.amount.toFixed(0)}万</td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.dependencyCount}</td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <div className="text-xs space-y-1">
                              {item.dependentProjects.map((dep: string, idx: number) => (
                                <div key={idx} className={cn(DASHBOARD_STYLES.textMuted)}>{dep}</div>
                              ))}
                            </div>
                          </td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.region}</td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.owner}</td>
                          <td className={cn('py-3 px-3 text-center', DASHBOARD_STYLES.textSecondary)}>
                            <span className={cn('px-2 py-1 rounded text-xs font-medium', getStatusStyles(item.status))}>
                              {item.status === 'critical' ? '紧急' : item.status === 'highRisk' ? '高风险' : '正常'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3 border-t border-cyan-500/20 flex justify-between items-center">
                  <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
                    共 {largeProjectDependencies.length} 条记录，当前第 {currentPage} / {totalPages} 页
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              </div>
            )}
          </>
        )}

        {/* ============ Tab 1: 阶段停滞 ============ */}
        {currentTab === 1 && (
          <>
            {viewMode === 'summary' ? (
              // 汇总视图
              <div className="h-full p-4 space-y-4 animate-in fade-in duration-300 overflow-y-auto">
                {/* 顶部仪表盘 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className={cn('rounded-lg p-4 border text-center', DASHBOARD_STYLES.cardBorder)}>
                    <CircularGauge value={stageStagnations.length} max={20} color="red" size={100} label="停滞项目" />
                  </div>
                  <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                    <div className="text-xs mb-2 text-cyan-400/70">平均停滞时长</div>
                    <div className="text-3xl font-bold text-orange-400" style={{ textShadow: '0 0 10px rgba(249,115,22,0.8)' }}>
                      {Math.round(stageStagnations.reduce((sum, p) => sum + p.stagnationDays, 0) / stageStagnations.length)}
                      <span className="text-sm ml-1">天</span>
                    </div>
                  </div>
                  <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                    <HalfGauge value={Math.max(...stageStagnations.map(p => p.stagnationDays))} max={60} unit="最长停滞(天)" />
                  </div>
                </div>

                {/* 严重程度分布 */}
                <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                  <h4 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    严重程度分布
                  </h4>
                  <div className="space-y-3">
                    {['high', 'medium', 'low'].map((severity) => {
                      const count = stageStagnations.filter(p => p.severity === severity as any).length;
                      const percentage = (count / stageStagnations.length) * 100;
                      const color = severity === 'high' ? 'bg-red-500' : severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
                      return (
                        <div key={severity} className="flex items-center gap-3">
                          <div className="text-xs text-cyan-300 w-12">
                            {severity === 'high' ? '高' : severity === 'medium' ? '中' : '低'}
                          </div>
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full transition-all', color)}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="text-xs text-cyan-300 w-8">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 停滞最长项目时间轴 */}
                <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                  <h4 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    停滞最长的项目
                  </h4>
                  <div className="space-y-3">
                    {stageStagnations
                      .sort((a, b) => b.stagnationDays - a.stagnationDays)
                      .slice(0, 4)
                      .map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 10px rgba(34,211,238,0.8)' }} />
                            {index < 3 && <div className="w-0.5 h-8 bg-cyan-500/30" />}
                          </div>
                          <div className="flex-1 bg-slate-800/50 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <div className="text-sm font-medium text-cyan-200">{item.projectName}</div>
                              <div className={cn(
                                'px-2 py-0.5 rounded text-xs font-medium',
                                item.severity === 'high' ? 'bg-red-500/30 text-red-300' :
                                item.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-green-500/30 text-green-300'
                              )}>
                                {item.stagnationDays}天
                              </div>
                            </div>
                            <div className="text-xs text-cyan-400/70 mt-1">{item.currentStage} · {item.owner}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  onClick={() => setViewMode('detail')}
                  className="w-full py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-medium hover:bg-cyan-500/30 transition-all"
                >
                  查看详细数据
                </button>
              </div>
            ) : (
              // 明细视图 - 保留原有表格
              <div className="h-full flex flex-col animate-in fade-in duration-300">
                <div className="p-4 border-b border-cyan-500/20">
                  <div className="grid grid-cols-4 gap-3">
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>停滞项目数</div>
                      <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>{stageStagnations.length}</div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>平均停滞时长</div>
                      <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                        {Math.round(stageStagnations.reduce((sum, p) => sum + p.stagnationDays, 0) / stageStagnations.length)}天
                      </div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>高风险项目</div>
                      <div className={cn('text-2xl font-bold text-red-400')}>
                        {stageStagnations.filter(p => p.severity === 'high').length}
                      </div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>最长停滞</div>
                      <div className={cn('text-2xl font-bold text-orange-400')}>
                        {Math.max(...stageStagnations.map(p => p.stagnationDays))}天
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-xs border-b', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>项目名称</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>当前阶段</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>停滞时长</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>区域</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>负责人</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>原因</th>
                        <th className={cn('text-center py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>严重程度</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedStageStagnations().map((item, index) => (
                        <tr key={index} className={cn('border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors', index === getPaginatedStageStagnations().length - 1 && 'border-b-0')}>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <div className="font-medium">{item.projectName}</div>
                            <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{item.projectId}</div>
                          </td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.currentStage}</td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <div className="font-medium">{item.stagnationDuration}</div>
                            <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{item.stagnationDays}天</div>
                          </td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.region}</td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.owner}</td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}><div className="text-xs max-w-[200px] truncate">{item.reason}</div></td>
                          <td className={cn('py-3 px-3 text-center', DASHBOARD_STYLES.textSecondary)}>
                            <span className={cn('px-2 py-1 rounded text-xs font-medium', getSeverityStyles(item.severity))}>
                              {item.severity === 'high' ? '高' : item.severity === 'medium' ? '中' : '低'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3 border-t border-cyan-500/20 flex justify-between items-center">
                  <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
                    共 {largeProjectDependencies.length} 条记录，当前第 {currentPage} / {totalPages} 页
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              </div>
            )}
          </>
        )}

        {/* ============ Tab 2: 预测风险 ============ */}
        {currentTab === 2 && (
          <>
            {viewMode === 'summary' ? (
              // 汇总视图
              <div className="h-full p-4 space-y-4 animate-in fade-in duration-300 overflow-y-auto">
                {/* 顶部仪表盘 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className={cn('rounded-lg p-4 border text-center', DASHBOARD_STYLES.cardBorder)}>
                    <CircularGauge value={predictedRisks.length} max={20} color="orange" size={100} label="预测风险" />
                  </div>
                  <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                    <div className="text-xs mb-2 text-cyan-400/70">总风险金额</div>
                    <div className="text-3xl font-bold text-orange-400" style={{ textShadow: '0 0 10px rgba(249,115,22,0.8)' }}>
                      {predictedRisks.reduce((sum, p) => sum + p.riskAmount, 0).toFixed(0)}
                      <span className="text-sm ml-1">万</span>
                    </div>
                  </div>
                  <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                    <HalfGauge value={Math.round(predictedRisks.reduce((sum, p) => sum + p.probability, 0) / predictedRisks.length)} max={100} unit="平均概率%" />
                  </div>
                </div>

                {/* 风险类型分布 */}
                <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                  <h4 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    风险类型分布
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from(new Set(predictedRisks.map(r => r.riskType))).map((riskType) => {
                      const risks = predictedRisks.filter(r => r.riskType === riskType);
                      return (
                        <div key={riskType} className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-sm font-medium text-cyan-200 mb-1">{riskType}</div>
                          <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold text-orange-400">{risks.length}</div>
                            <div className="text-xs text-cyan-400/70">{risks.reduce((sum, r) => sum + r.riskAmount, 0).toFixed(0)}万</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 高风险热力卡片 */}
                <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                  <h4 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    高风险项目预警
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {predictedRisks
                      .filter(p => p.impact === 'high')
                      .slice(0, 4)
                      .map((item, index) => (
                        <div key={index} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                          <div className="text-xs text-cyan-400/70 mb-1">{item.riskType}</div>
                          <div className="text-sm font-medium text-cyan-200 mb-2">{item.projectName}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-red-500" style={{ width: `${item.probability}%` }} />
                            </div>
                            <div className="text-xs text-red-400">{item.probability}%</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  onClick={() => setViewMode('detail')}
                  className="w-full py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-medium hover:bg-cyan-500/30 transition-all"
                >
                  查看详细数据
                </button>
              </div>
            ) : (
              // 明细视图 - 保留原有表格
              <div className="h-full flex flex-col animate-in fade-in duration-300">
                <div className="p-4 border-b border-cyan-500/20">
                  <div className="grid grid-cols-4 gap-3">
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>预测风险数</div>
                      <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>{predictedRisks.length}</div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>总风险金额</div>
                      <div className={cn('text-2xl font-bold text-orange-400')}>
                        {predictedRisks.reduce((sum, p) => sum + p.riskAmount, 0).toFixed(0)}万
                      </div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>高风险项目</div>
                      <div className={cn('text-2xl font-bold text-red-400')}>
                        {predictedRisks.filter(p => p.impact === 'high').length}
                      </div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>平均概率</div>
                      <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                        {Math.round(predictedRisks.reduce((sum, p) => sum + p.probability, 0) / predictedRisks.length)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-xs border-b', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>项目名称</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>风险类型</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>风险金额</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>发生概率</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>区域</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>负责人</th>
                        <th className={cn('text-center py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>影响程度</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedPredictedRisks().map((item, index) => (
                        <tr key={index} className={cn('border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors', index === getPaginatedPredictedRisks().length - 1 && 'border-b-0')}>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <div className="font-medium">{item.projectName}</div>
                            <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{item.projectId}</div>
                          </td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.riskType}</td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <span className="text-orange-400 font-medium">{item.riskAmount.toFixed(0)}万</span>
                          </td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className={cn('h-full transition-all', item.probability >= 80 ? 'bg-red-500' : item.probability >= 60 ? 'bg-yellow-500' : 'bg-green-500')} style={{ width: `${item.probability}%` }} />
                              </div>
                              <span className="text-xs">{item.probability}%</span>
                            </div>
                          </td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.region}</td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.owner}</td>
                          <td className={cn('py-3 px-3 text-center', DASHBOARD_STYLES.textSecondary)}>
                            <span className={cn('px-2 py-1 rounded text-xs font-medium', getSeverityStyles(item.impact))}>
                              {item.impact === 'high' ? '高' : item.impact === 'medium' ? '中' : '低'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3 border-t border-cyan-500/20 flex justify-between items-center">
                  <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
                    共 {largeProjectDependencies.length} 条记录，当前第 {currentPage} / {totalPages} 页
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              </div>
            )}
          </>
        )}

        {/* ============ Tab 3: 风险人员 ============ */}
        {currentTab === 3 && (
          <>
            {viewMode === 'summary' ? (
              // 汇总视图
              <div className="h-full p-4 space-y-4 animate-in fade-in duration-300 overflow-y-auto">
                {/* 顶部仪表盘 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className={cn('rounded-lg p-4 border text-center', DASHBOARD_STYLES.cardBorder)}>
                    <CircularGauge value={riskPersonnel.length} max={20} color="cyan" size={100} label="风险人员" />
                  </div>
                  <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                    <div className="text-xs mb-2 text-cyan-400/70">平均风险分</div>
                    <div className="text-3xl font-bold text-cyan-300" style={{ textShadow: '0 0 10px rgba(34,211,238,0.8)' }}>
                      {Math.round(riskPersonnel.reduce((sum, p) => sum + p.riskScore, 0) / riskPersonnel.length)}
                    </div>
                  </div>
                  <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                    <HalfGauge value={riskPersonnel.filter(p => p.riskScore >= 80).length} max={riskPersonnel.length} unit="高风险人数" />
                  </div>
                </div>

                {/* 风险类型分布 */}
                <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                  <h4 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    风险类型分布
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from(new Set(riskPersonnel.map(r => r.riskType))).map((riskType) => {
                      const personnel = riskPersonnel.filter(r => r.riskType === riskType);
                      return (
                        <div key={riskType} className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-sm font-medium text-cyan-200 mb-1">{getRiskTypeText(riskType)}</div>
                          <div className="text-2xl font-bold text-orange-400">{personnel.length}<span className="text-xs ml-1">人</span></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 高风险人员卡片 */}
                <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                  <h4 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    高风险人员 Top 4
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {riskPersonnel
                      .sort((a, b) => b.riskScore - a.riskScore)
                      .slice(0, 4)
                      .map((item, index) => (
                        <div key={index} className={cn(
                          'rounded-lg p-3 border transition-all',
                          item.riskScore >= 90 ? 'bg-red-500/20 border-red-500/50' :
                          item.riskScore >= 80 ? 'bg-orange-500/20 border-orange-500/50' :
                          'bg-yellow-500/20 border-yellow-500/50'
                        )}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold',
                              item.riskScore >= 90 ? 'bg-red-500/30 text-red-300' :
                              item.riskScore >= 80 ? 'bg-orange-500/30 text-orange-300' : 'bg-yellow-500/30 text-yellow-300'
                            )}>
                              {item.name[0]}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-cyan-200">{item.name}</div>
                              <div className="text-xs text-cyan-400/70">{item.region}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div className={cn(
                                  'h-full',
                                  item.riskScore >= 90 ? 'bg-red-500' :
                                  item.riskScore >= 80 ? 'bg-orange-500' : 'bg-yellow-500'
                                )} style={{ width: `${item.riskScore}%` }} />
                              </div>
                              <span className="text-xs font-bold">{item.riskScore}</span>
                            </div>
                            <div className="text-xs text-cyan-400/70">{getRiskTypeText(item.riskType)}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  onClick={() => setViewMode('detail')}
                  className="w-full py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-medium hover:bg-cyan-500/30 transition-all"
                >
                  查看详细数据
                </button>
              </div>
            ) : (
              // 明细视图 - 保留原有表格
              <div className="h-full flex flex-col animate-in fade-in duration-300">
                <div className="p-4 border-b border-cyan-500/20">
                  <div className="grid grid-cols-4 gap-3">
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>风险人员数</div>
                      <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>{riskPersonnel.length}</div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>平均风险分</div>
                      <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                        {Math.round(riskPersonnel.reduce((sum, p) => sum + p.riskScore, 0) / riskPersonnel.length)}
                      </div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>高风险人员</div>
                      <div className={cn('text-2xl font-bold text-red-400')}>
                        {riskPersonnel.filter(p => p.riskScore >= 80).length}
                      </div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>无项目人员</div>
                      <div className={cn('text-2xl font-bold text-orange-400')}>
                        {riskPersonnel.filter(p => p.activeProjects === 0).length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-xs border-b', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>姓名</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>区域</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>风险类型</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>风险时长</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>风险分</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>活跃项目</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>最近成交</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedRiskPersonnel().map((item, index) => (
                        <tr key={index} className={cn('border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors', index === getPaginatedRiskPersonnel().length - 1 && 'border-b-0')}>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <div className="font-medium">{item.name}</div>
                            <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{item.role}</div>
                          </td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.region}</td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <span className={cn(
                              'px-2 py-1 rounded text-xs font-medium',
                              item.riskScore >= 80 ? 'bg-red-500/30 text-red-300 border border-red-500/50' :
                              item.riskScore >= 70 ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50' :
                              'bg-green-500/30 text-green-300 border border-green-500/50'
                            )}>
                              {getRiskTypeText(item.riskType)}
                            </span>
                          </td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>{item.riskDuration}</td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className={cn('h-full transition-all', item.riskScore >= 80 ? 'bg-red-500' : item.riskScore >= 70 ? 'bg-yellow-500' : 'bg-green-500')} style={{ width: `${item.riskScore}%` }} />
                              </div>
                              <span className="text-xs">{item.riskScore}</span>
                            </div>
                          </td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <div className="font-medium">{item.activeProjects}</div>
                            <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>个</div>
                          </td>
                          <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            {item.lastClosedAmount > 0 ? (
                              <span className="text-cyan-400">{item.lastClosedAmount.toFixed(0)}万</span>
                            ) : (
                              <span className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3 border-t border-cyan-500/20 flex justify-between items-center">
                  <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
                    共 {riskPersonnel.length} 条记录，当前第 {currentPage} / {totalPages} 页
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              </div>
            )}
          </>
        )}

        {/* ============ Tab 4: 当月未下单 ============ */}
        {currentTab === 4 && (
          // 明细视图
          <div className="h-full flex flex-col animate-in fade-in duration-300">
                <div className="p-4 border-b border-cyan-500/20">
                  <div className="grid grid-cols-4 gap-3">
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>未下单项目数</div>
                      <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>{filteredUnorderedProjects.length}</div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>总金额</div>
                      <div className={cn('text-2xl font-bold text-orange-400')}>
                        {filteredUnorderedProjects.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}万
                      </div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>高风险项目</div>
                      <div className={cn('text-2xl font-bold text-red-400')}>
                        {filteredUnorderedProjects.filter(p => p.delayDays && p.delayDays >= 10).length}
                      </div>
                    </div>
                    <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                      <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>平均延迟天数</div>
                      <div className={cn('text-2xl font-bold text-orange-400')}>
                        {filteredUnorderedProjects.length > 0
                          ? Math.round(filteredUnorderedProjects.reduce((sum, p) => sum + (p.delayDays || 0), 0) / filteredUnorderedProjects.length)
                          : 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <tr className={cn('text-xs border-b', DASHBOARD_STYLES.cardBorder)}>
                        <th className={cn('text-center py-2 px-3 font-medium w-16', DASHBOARD_STYLES.textSecondary)}>序号</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>项目阶段</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>预计下单</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>项目阶段</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>预计下单时间</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>项目名称</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>大区</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>销售</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>城市经理</th>
                        <th className={cn('text-left py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>类型</th>
                        <th className={cn('text-right py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>金额</th>
                        <th className={cn('text-center py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>状态</th>
                        <th className={cn('text-center py-2 px-3 font-medium', DASHBOARD_STYLES.textSecondary)}>延迟天数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedUnorderedProjects().map((item, index) => (
                        <tr
                          key={index}
                          className={cn(
                            'border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors',
                            index === getPaginatedUnorderedProjects().length - 1 && 'border-b-0'
                          )}
                        >
                          {/* 序号 */}
                          <td className={cn('text-center py-3 px-3 text-xs', DASHBOARD_STYLES.textSecondary)}>
                            {(currentPage - 1) * 5 + index + 1}
                          </td>

                          {/* 项目阶段 */}
                          <td className={cn('py-3 px-3 text-xs', DASHBOARD_STYLES.textSecondary)}>
                            {item.projectPhase || '项目采购'}
                          </td>

                          {/* 预计下单时间 */}
                          <td className={cn('py-3 px-3 text-xs whitespace-nowrap', DASHBOARD_STYLES.textSecondary)}>
                            {item.expectedOrderDate || '-'}
                          </td>

                          {/* 项目名称 */}
                          <td className={cn('py-3 px-3 text-xs', DASHBOARD_STYLES.textSecondary)}>
                            <div className="font-medium leading-snug">{item.name}</div>
                          </td>

                          {/* 大区 */}
                          <td className={cn('py-3 px-3 text-xs', DASHBOARD_STYLES.textSecondary)}>
                            {item.region || '-'}
                          </td>

                          {/* 销售工程师 */}
                          <td className={cn('py-3 px-3 text-xs', DASHBOARD_STYLES.textSecondary)}>
                            {item.salesEngineer || '-'}
                          </td>

                          {/* 城市经理 */}
                          <td className={cn('py-3 px-3 text-xs', DASHBOARD_STYLES.textSecondary)}>
                            {item.cityManager || '-'}
                          </td>

                          {/* 项目类型 */}
                          <td className={cn('py-3 px-3 text-xs', DASHBOARD_STYLES.textSecondary)}>
                            {item.projectType || '-'}
                          </td>

                          {/* 金额 */}
                          <td className={cn('text-right py-3 px-3 whitespace-nowrap', DASHBOARD_STYLES.textSecondary)}>
                            <span className="font-bold text-orange-400">
                              {item.amount.toFixed(2)}
                            </span>
                            <span className={cn('text-xs ml-1', DASHBOARD_STYLES.textMuted)}>
                              万
                            </span>
                          </td>

                          {/* 状态 */}
                          <td className={cn('text-center py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            <span className={cn(
                              'inline-block px-2 py-1 rounded text-xs font-medium border bg-orange-500/20 text-orange-300 border-orange-500/50',
                              item.delayDays && item.delayDays >= 20 && 'animate-pulse'
                            )}>
                              未下单
                            </span>
                          </td>

                          {/* 延迟天数 */}
                          <td className={cn('text-center py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                            {item.delayDays !== undefined && item.delayDays > 0 ? (
                              <span className={cn(
                                'px-2 py-1 rounded text-xs font-medium',
                                item.delayDays >= 20 ? 'bg-red-500/30 text-red-300 border border-red-500/50' :
                                item.delayDays >= 10 ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50' :
                                'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                              )}>
                                {item.delayDays}天
                              </span>
                            ) : (
                              <span className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3 border-t border-cyan-500/20 flex justify-between items-center">
                  <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
                    共 {filteredUnorderedProjects.length} 条记录，当前第 {currentPage} / {totalPages} 页
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              </div>
            )}
      </div>
    </div>
  );
}
