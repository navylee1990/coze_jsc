'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Building2, Clock, TrendingDown, Users, ChevronRight, ChevronLeft, FileWarning, Package, PauseCircle } from 'lucide-react';
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
  stagnationDuration: string; // 停滞时长
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
  probability: number; // 风险概率 %
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

// 组件属性
interface RiskIdentificationPanelProps {
  largeProjectDependencies?: LargeProjectDependency[];
  stageStagnations?: StageStagnation[];
  predictedRisks?: PredictedRisk[];
  riskPersonnel?: RiskPersonnel[];
  theme?: 'dashboard' | 'light' | 'dark';
}

// ==================== 默认数据 ====================

// 默认大项目依赖数据
const defaultLargeProjectDependencies: LargeProjectDependency[] = [
  {
    projectName: '北京地铁17号线',
    projectId: 'PRJ-001',
    amount: 1200,
    dependentProjects: ['地铁站点A', '地铁站点B', '控制中心'],
    dependencyCount: 3,
    region: '华北',
    owner: '张明',
    status: 'highRisk'
  },
  {
    projectName: '上海国际机场T4',
    projectId: 'PRJ-002',
    amount: 850,
    dependentProjects: ['航站楼A', '航站楼B'],
    dependencyCount: 2,
    region: '一区',
    owner: '李娜',
    status: 'normal'
  },
  {
    projectName: '深圳科技园',
    projectId: 'PRJ-003',
    amount: 680,
    dependentProjects: ['研发中心', '数据中心', '展示中心'],
    dependencyCount: 3,
    region: '华南',
    owner: '王强',
    status: 'critical'
  },
  {
    projectName: '广州高铁南站',
    projectId: 'PRJ-004',
    amount: 560,
    dependentProjects: ['候车厅', '商业区'],
    dependencyCount: 2,
    region: '华南',
    owner: '赵芳',
    status: 'highRisk'
  },
  {
    projectName: '杭州亚运会场馆',
    projectId: 'PRJ-005',
    amount: 450,
    dependentProjects: ['体育馆', '游泳馆'],
    dependencyCount: 2,
    region: '二区',
    owner: '孙伟',
    status: 'normal'
  }
];

// 默认阶段停滞数据
const defaultStageStagnations: StageStagnation[] = [
  {
    projectName: '北京朝阳医院',
    projectId: 'PRJ-101',
    currentStage: '方案审批',
    stagnationDuration: '25天',
    stagnationDays: 25,
    region: '华北',
    owner: '刘洋',
    reason: '审批流程复杂，资料补充中',
    severity: 'high'
  },
  {
    projectName: '上海外国语学校',
    projectId: 'PRJ-102',
    currentStage: '商务谈判',
    stagnationDuration: '18天',
    stagnationDays: 18,
    region: '一区',
    owner: '陈静',
    reason: '价格谈判中，客户预算缩减',
    severity: 'medium'
  },
  {
    projectName: '深圳华为基地',
    projectId: 'PRJ-103',
    currentStage: '技术方案确认',
    stagnationDuration: '32天',
    stagnationDays: 32,
    region: '华南',
    owner: '吴敏',
    reason: '技术需求变更，重新设计中',
    severity: 'high'
  },
  {
    projectName: '广州白云机场',
    projectId: 'PRJ-104',
    currentStage: '合同签订',
    stagnationDuration: '12天',
    stagnationDays: 12,
    region: '华南',
    owner: '周涛',
    reason: '法务审核中',
    severity: 'low'
  },
  {
    projectName: '杭州阿里巴巴园区',
    projectId: 'PRJ-105',
    currentStage: '招标结果确认',
    stagnationDuration: '20天',
    stagnationDays: 20,
    region: '二区',
    owner: '郑磊',
    reason: '竞争对手质疑，需要复核',
    severity: 'medium'
  }
];

// 默认预测风险数据
const defaultPredictedRisks: PredictedRisk[] = [
  {
    projectName: '北京首都机场扩建',
    projectId: 'PRJ-201',
    riskType: '项目延期',
    riskAmount: 350,
    probability: 85,
    region: '华北',
    owner: '张明',
    impact: 'high'
  },
  {
    projectName: '上海浦东新区学校',
    projectId: 'PRJ-202',
    riskType: '利润不足',
    riskAmount: 120,
    probability: 72,
    region: '一区',
    owner: '李娜',
    impact: 'medium'
  },
  {
    projectName: '深圳腾讯大厦',
    projectId: 'PRJ-203',
    riskType: '客户取消',
    riskAmount: 480,
    probability: 65,
    region: '华南',
    owner: '王强',
    impact: 'high'
  },
  {
    projectName: '广州政务中心',
    projectId: 'PRJ-204',
    riskType: '预算缩减',
    riskAmount: 180,
    probability: 58,
    region: '华南',
    owner: '赵芳',
    impact: 'medium'
  },
  {
    projectName: '杭州西湖景区项目',
    projectId: 'PRJ-205',
    riskType: '项目延期',
    riskAmount: 95,
    probability: 45,
    region: '二区',
    owner: '孙伟',
    impact: 'low'
  }
];

// 默认风险人员数据
const defaultRiskPersonnel: RiskPersonnel[] = [
  {
    name: '刘洋',
    region: '华北',
    role: '销售经理',
    riskType: 'stagnantProject',
    riskDuration: '2个月',
    riskScore: 85,
    activeProjects: 1,
    lastClosedAmount: 120
  },
  {
    name: '陈静',
    region: '一区',
    role: '销售经理',
    riskType: 'zeroProject',
    riskDuration: '3个月',
    riskScore: 92,
    activeProjects: 0,
    lastClosedAmount: 0
  },
  {
    name: '吴敏',
    region: '华南',
    role: '销售经理',
    riskType: 'highDependency',
    riskDuration: '1个月',
    riskScore: 78,
    activeProjects: 2,
    lastClosedAmount: 280
  },
  {
    name: '周涛',
    region: '华南',
    role: '销售经理',
    riskType: 'lowPerformance',
    riskDuration: '4个月',
    riskScore: 88,
    activeProjects: 3,
    lastClosedAmount: 85
  },
  {
    name: '郑磊',
    region: '二区',
    role: '销售经理',
    riskType: 'stagnantProject',
    riskDuration: '2个月',
    riskScore: 75,
    activeProjects: 2,
    lastClosedAmount: 180
  },
  {
    name: '王芳',
    region: '华中',
    role: '销售经理',
    riskType: 'zeroProject',
    riskDuration: '1个月',
    riskScore: 70,
    activeProjects: 0,
    lastClosedAmount: 0
  },
  {
    name: '赵强',
    region: '西南',
    role: '销售经理',
    riskType: 'lowPerformance',
    riskDuration: '3个月',
    riskScore: 82,
    activeProjects: 2,
    lastClosedAmount: 95
  },
  {
    name: '孙丽',
    region: '华北',
    role: '销售经理',
    riskType: 'highDependency',
    riskDuration: '2个月',
    riskScore: 80,
    activeProjects: 1,
    lastClosedAmount: 450
  }
];

// ==================== 辅助函数 ====================

// 获取严重程度样式
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

// 获取状态样式
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

// 获取风险类型文字
const getRiskTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    zeroProject: '无项目',
    lowPerformance: '业绩不佳',
    stagnantProject: '项目停滞',
    highDependency: '高依赖度'
  };
  return typeMap[type] || type;
};

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
  theme = 'dashboard'
}: RiskIdentificationPanelProps) {
  // Tab状态
  const [currentTab, setCurrentTab] = useState(0);
  const tabs = [
    { id: 0, label: '大项目依赖', icon: Building2 },
    { id: 1, label: '阶段停滞', icon: PauseCircle },
    { id: 2, label: '预测风险', icon: TrendingDown },
    { id: 3, label: '风险人员', icon: Users }
  ];

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 切换Tab时重置分页
  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab]);

  // 获取当前Tab的数据
  const getCurrentData = () => {
    switch (currentTab) {
      case 0:
        return largeProjectDependencies;
      case 1:
        return stageStagnations;
      case 2:
        return predictedRisks;
      case 3:
        return riskPersonnel;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  
  // 为每个Tab获取特定类型的数据
  const getPaginatedLargeProjectDependencies = () => 
    largeProjectDependencies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const getPaginatedStageStagnations = () => 
    stageStagnations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const getPaginatedPredictedRisks = () => 
    predictedRisks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const getPaginatedRiskPersonnel = () => 
    riskPersonnel.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 手动切换Tab
  const goToTab = (index: number) => {
    setCurrentTab(index);
  };

  const prevTab = () => {
    setCurrentTab(prev => (prev - 1 + tabs.length) % tabs.length);
  };

  const nextTab = () => {
    setCurrentTab(prev => (prev + 1) % tabs.length);
  };

  // 计算高风险数量
  const highRiskCount = (() => {
    switch (currentTab) {
      case 0:
        return largeProjectDependencies.filter(p => p.status === 'critical').length;
      case 1:
        return stageStagnations.filter(p => p.severity === 'high').length;
      case 2:
        return predictedRisks.filter(p => p.impact === 'high').length;
      case 3:
        return riskPersonnel.filter(p => p.riskScore >= 80).length;
      default:
        return 0;
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
          <AlertTriangle className={cn('w-5 h-5', theme === 'dashboard' ? 'text-cyan-400' : 'text-slate-700')} />
          <h3 className={cn('font-bold text-lg', theme === 'dashboard' ? DASHBOARD_STYLES.textSecondary : 'text-slate-900')}>
            风险识别
          </h3>
        </div>
        {highRiskCount > 0 && (
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium animate-pulse',
              theme === 'dashboard' ? 'bg-red-500/30 text-red-300 border border-red-500/40' : 'bg-red-100 text-red-700'
            )}
          >
            <AlertTriangle className="w-3 h-3" />
            {highRiskCount} 项高风险
          </div>
        )}
      </div>

      {/* Tab切换栏 */}
      <div className="px-6 py-2 border-b border-cyan-500/20">
        <div className="flex items-center justify-between">
          {/* 左箭头 */}
          <button
            onClick={prevTab}
            className={cn(
              'p-1.5 rounded-lg transition-all',
              theme === 'dashboard'
                ? 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Tab指示器 */}
          <div className="flex items-center gap-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => goToTab(index)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    currentTab === index
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

          {/* 右箭头 */}
          <button
            onClick={nextTab}
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

      {/* Tab内容区域 */}
      <div className="flex-1 overflow-hidden">
        {/* Tab 0: 大项目依赖 */}
        {currentTab === 0 && (
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            {/* 统计卡片 */}
            <div className="p-4 border-b border-cyan-500/20">
              <div className="grid grid-cols-4 gap-3">
                <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                  <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>依赖项目数</div>
                  <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                    {largeProjectDependencies.length}
                  </div>
                </div>
                <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                  <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>总金额</div>
                  <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                    {largeProjectDependencies.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
                    <span className="text-sm ml-1">万</span>
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

            {/* 表格 */}
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
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.amount.toFixed(0)}万
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.dependencyCount}
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        <div className="text-xs space-y-1">
                          {item.dependentProjects.map((dep: string, idx: number) => (
                            <div key={idx} className={cn(DASHBOARD_STYLES.textMuted)}>{dep}</div>
                          ))}
                        </div>
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.region}
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.owner}
                      </td>
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

            {/* 分页 */}
            <div className="px-4 py-3 border-t border-cyan-500/20 flex justify-between items-center">
              <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
                共 {largeProjectDependencies.length} 条记录，当前第 {currentPage} / {totalPages} 页
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}

        {/* Tab 1: 阶段停滞 */}
        {currentTab === 1 && (
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            {/* 统计卡片 */}
            <div className="p-4 border-b border-cyan-500/20">
              <div className="grid grid-cols-4 gap-3">
                <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                  <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>停滞项目数</div>
                  <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                    {stageStagnations.length}
                  </div>
                </div>
                <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                  <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>平均停滞时长</div>
                  <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                    {Math.round(stageStagnations.reduce((sum, p) => sum + p.stagnationDays, 0) / stageStagnations.length)}
                    <span className="text-sm ml-1">天</span>
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
                    {Math.max(...stageStagnations.map(p => p.stagnationDays))}
                    <span className="text-sm ml-1">天</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 表格 */}
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
                    <tr
                      key={index}
                      className={cn(
                        'border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors',
                        index === getPaginatedStageStagnations().length - 1 && 'border-b-0'
                      )}
                    >
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        <div className="font-medium">{item.projectName}</div>
                        <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{item.projectId}</div>
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.currentStage}
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        <div className="font-medium">{item.stagnationDuration}</div>
                        <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{item.stagnationDays}天</div>
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.region}
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.owner}
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        <div className="text-xs max-w-[200px] truncate">{item.reason}</div>
                      </td>
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

            {/* 分页 */}
            <div className="px-4 py-3 border-t border-cyan-500/20 flex justify-between items-center">
              <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
                共 {stageStagnations.length} 条记录，当前第 {currentPage} / {totalPages} 页
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}

        {/* Tab 2: 预测风险 */}
        {currentTab === 2 && (
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            {/* 统计卡片 */}
            <div className="p-4 border-b border-cyan-500/20">
              <div className="grid grid-cols-4 gap-3">
                <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                  <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>预测风险数</div>
                  <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                    {predictedRisks.length}
                  </div>
                </div>
                <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                  <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>总风险金额</div>
                  <div className={cn('text-2xl font-bold text-orange-400')}>
                    {predictedRisks.reduce((sum, p) => sum + p.riskAmount, 0).toFixed(0)}
                    <span className="text-sm ml-1">万</span>
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
                    {Math.round(predictedRisks.reduce((sum, p) => sum + p.probability, 0) / predictedRisks.length)}
                    <span className="text-sm ml-1">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 表格 */}
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
                    <tr
                      key={index}
                      className={cn(
                        'border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors',
                        index === getPaginatedPredictedRisks().length - 1 && 'border-b-0'
                      )}
                    >
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        <div className="font-medium">{item.projectName}</div>
                        <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{item.projectId}</div>
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.riskType}
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        <span className="text-orange-400 font-medium">{item.riskAmount.toFixed(0)}万</span>
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full transition-all',
                                item.probability >= 80 ? 'bg-red-500' :
                                item.probability >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                              )}
                              style={{ width: `${item.probability}%` }}
                            />
                          </div>
                          <span className="text-xs">{item.probability}%</span>
                        </div>
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.region}
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.owner}
                      </td>
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

            {/* 分页 */}
            <div className="px-4 py-3 border-t border-cyan-500/20 flex justify-between items-center">
              <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
                共 {predictedRisks.length} 条记录，当前第 {currentPage} / {totalPages} 页
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}

        {/* Tab 3: 风险人员 */}
        {currentTab === 3 && (
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            {/* 统计卡片 */}
            <div className="p-4 border-b border-cyan-500/20">
              <div className="grid grid-cols-4 gap-3">
                <div className={cn('rounded-lg p-3 border', DASHBOARD_STYLES.cardBorder)}>
                  <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>风险人员数</div>
                  <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                    {riskPersonnel.length}
                  </div>
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

            {/* 表格 */}
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
                    <tr
                      key={index}
                      className={cn(
                        'border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors',
                        index === getPaginatedRiskPersonnel().length - 1 && 'border-b-0'
                      )}
                    >
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        <div className="font-medium">{item.name}</div>
                        <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{item.role}</div>
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.region}
                      </td>
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
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        {item.riskDuration}
                      </td>
                      <td className={cn('py-3 px-3', DASHBOARD_STYLES.textSecondary)}>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full transition-all',
                                item.riskScore >= 80 ? 'bg-red-500' :
                                item.riskScore >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                              )}
                              style={{ width: `${item.riskScore}%` }}
                            />
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

            {/* 分页 */}
            <div className="px-4 py-3 border-t border-cyan-500/20 flex justify-between items-center">
              <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>
                共 {riskPersonnel.length} 条记录，当前第 {currentPage} / {totalPages} 页
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
