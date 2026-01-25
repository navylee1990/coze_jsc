'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, TrendingDown, FileWarning, Target, Users, Zap, ChevronRight, Gauge, ArrowUp, ChevronLeft, Circle, Database, Building2 } from 'lucide-react';
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

// 延迟项目时间分类
interface DelayedProjectCategory {
  period: string;
  periodKey: 'current' | 'future1Month' | 'future3Months' | 'future6Months';
  count: number;
  amount: number; // 延期金额
  gapFill: number; // 可填补缺口
  targetGap: number; // 目标缺口（100%）
  severity: 'high' | 'medium' | 'low';
}

// 人效数据
interface EfficiencyData {
  totalStaff: number; // 总人员数
  activeStaff: number; // 有项目人员数
  avgProjectsPerStaff: number; // 人均项目数
  avgRevenuePerStaff: number; // 人均产值（万）
  zeroProjectStaff: {
    name: string; // 姓名
    region: string; // 区域
    zeroProjectDuration: string; // 0项目时长
    severity: 'high' | 'medium' | 'low';
  }[];
  regionEfficiency: {
    region: string;
    staffCount: number;
    avgRevenuePerStaff: number; // 人均产值
    activeRate: number; // 活跃率
  }[];
}

// 其他风险类型
interface OtherRiskItem {
  type: 'specialPrice' | 'reserveInsufficient' | 'scaleInsufficient';
  title: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

// 项目储备分析数据
interface ProjectReserveItem {
  category: string; // 行业或细分市场名称
  type: 'industry' | 'market';
  currentReserve: number; // 当前储备金额（万）
  targetReserve: number; // 目标储备金额（万）
  gap: number; // 储备缺口（万）
  severity: 'high' | 'medium' | 'low';
  description?: string; // 描述信息
}

// 组件属性
interface RiskIdentificationPanelProps {
  delayedProjects?: DelayedProjectCategory[];
  efficiencyData?: EfficiencyData;
  otherRisks?: OtherRiskItem[];
  projectReserve?: ProjectReserveItem[];
  theme?: 'dashboard' | 'light' | 'dark';
}

// 默认延迟项目数据
const defaultDelayedProjects: DelayedProjectCategory[] = [
  {
    period: '本月',
    periodKey: 'current',
    count: 3,
    amount: 200,
    gapFill: 150,
    targetGap: 400,
    severity: 'high'
  },
  {
    period: '未来1月',
    periodKey: 'future1Month',
    count: 5,
    amount: 280,
    gapFill: 200,
    targetGap: 400,
    severity: 'high'
  },
  {
    period: '未来3月',
    periodKey: 'future3Months',
    count: 8,
    amount: 450,
    gapFill: 350,
    targetGap: 500,
    severity: 'medium'
  },
  {
    period: '未来半年',
    periodKey: 'future6Months',
    count: 12,
    amount: 680,
    gapFill: 720,
    targetGap: 800,
    severity: 'medium'
  }
];

// 默认人效数据
const defaultEfficiencyData: EfficiencyData = {
  totalStaff: 120,
  activeStaff: 97,
  avgProjectsPerStaff: 2.3,
  avgRevenuePerStaff: 85,
  zeroProjectStaff: [
    { name: '张明', region: '一区', zeroProjectDuration: '1个月', severity: 'high' },
    { name: '李娜', region: '二区', zeroProjectDuration: '1个月', severity: 'high' },
    { name: '王强', region: '华中', zeroProjectDuration: '1个月', severity: 'medium' },
    { name: '赵芳', region: '华南', zeroProjectDuration: '1个月', severity: 'medium' },
    { name: '刘洋', region: '西南', zeroProjectDuration: '3个月', severity: 'high' },
    { name: '陈静', region: '华北', zeroProjectDuration: '3个月', severity: 'high' },
    { name: '孙伟', region: '一区', zeroProjectDuration: '3个月', severity: 'medium' },
    { name: '吴敏', region: '二区', zeroProjectDuration: '3个月', severity: 'medium' }
  ],
  regionEfficiency: [
    { region: '一区', staffCount: 25, avgRevenuePerStaff: 95, activeRate: 88 },
    { region: '二区', staffCount: 22, avgRevenuePerStaff: 88, activeRate: 82 },
    { region: '华中', staffCount: 18, avgRevenuePerStaff: 92, activeRate: 85 },
    { region: '华南', staffCount: 20, avgRevenuePerStaff: 78, activeRate: 75 },
    { region: '西南', staffCount: 15, avgRevenuePerStaff: 85, activeRate: 80 },
    { region: '华北', staffCount: 20, avgRevenuePerStaff: 82, activeRate: 78 }
  ]
};

// 默认其他风险数据
const defaultOtherRisks: OtherRiskItem[] = [
  {
    type: 'specialPrice',
    title: '特价申请异常',
    count: 3,
    severity: 'medium',
    description: '特价申请超期或异常'
  },
  {
    type: 'reserveInsufficient',
    title: '区域储备不足',
    count: 4,
    severity: 'high',
    description: '多区域3-6月储备不足'
  },
  {
    type: 'scaleInsufficient',
    title: '签约规模不足',
    count: 3,
    severity: 'medium',
    description: '区域签约规模不足以支撑年度目标'
  }
];

// 默认项目储备分析数据
const defaultProjectReserve: ProjectReserveItem[] = [
  // 行业维度
  {
    category: '教育',
    type: 'industry',
    currentReserve: 850,
    targetReserve: 1200,
    gap: 350,
    severity: 'medium',
    description: '学校项目储备需加强'
  },
  {
    category: '政企办公',
    type: 'industry',
    currentReserve: 600,
    targetReserve: 1000,
    gap: 400,
    severity: 'high',
    description: '政府及企业项目储备不足'
  },
  {
    category: '公共交通',
    type: 'industry',
    currentReserve: 450,
    targetReserve: 800,
    gap: 350,
    severity: 'medium',
    description: '交通枢纽项目推进缓慢'
  },
  {
    category: '医疗饮水',
    type: 'industry',
    currentReserve: 700,
    targetReserve: 900,
    gap: 200,
    severity: 'medium',
    description: '医疗机构项目储备尚可'
  },
  {
    category: '水处理',
    type: 'industry',
    currentReserve: 380,
    targetReserve: 700,
    gap: 320,
    severity: 'high',
    description: '水处理项目储备缺口较大'
  }
];

// 环形进度组件
function DashboardGauge({ gapFill, targetGap, severity, amount, label }: { gapFill: number; targetGap: number; severity: 'high' | 'medium' | 'low'; amount: number; label: string }) {
  const getColorClass = () => {
    const percent = Math.min((gapFill / targetGap) * 100, 100);
    if (percent >= 80) return 'stroke-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]';
    if (percent >= 50) return 'stroke-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]';
    return 'stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]';
  };

  const percent = Math.min((gapFill / targetGap) * 100, 100);
  const strokeDasharray = `${percent * 2.5} 250`; // 半圆周长约250

  // 数字滚动动画
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    setAnimatedPercent(0);
    const startDelay = setTimeout(() => {
      const duration = 1500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setAnimatedPercent(Math.floor(percent * easeOut));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }, 100);

    return () => clearTimeout(startDelay);
  }, [percent]);

  return (
    <div className="relative flex flex-col items-center">
      {/* 半圆环形进度 */}
      <div className="relative w-28 h-16 mb-2">
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
            className={getColorClass()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            style={{ transition: 'stroke-dasharray 0.5s ease-out' }}
          />
        </svg>
        {/* 仪表盘中心显示 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <div className={cn('text-lg font-bold', DASHBOARD_STYLES.textSecondary)}>{animatedPercent}%</div>
          <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>填补率</div>
        </div>
      </div>
      <div className={cn('text-sm font-medium', DASHBOARD_STYLES.textSecondary)}>{label}</div>
    </div>
  );
}

export default function RiskIdentificationPanel({
  delayedProjects = defaultDelayedProjects,
  efficiencyData = defaultEfficiencyData,
  otherRisks = defaultOtherRisks,
  projectReserve = defaultProjectReserve,
  theme = 'dashboard'
}: RiskIdentificationPanelProps) {
  // 轮播状态
  const [currentTab, setCurrentTab] = useState(0);
  const [showZeroProjectDetails, setShowZeroProjectDetails] = useState(false);
  const tabs = [
    { id: 0, label: '延期项目', icon: Gauge },
    { id: 1, label: '人效分析', icon: Users },
    { id: 2, label: '项目储备', icon: Database },
    { id: 3, label: '其他风险', icon: AlertTriangle }
  ];

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

  // 获取风险图标
  const getRiskIcon = (type: 'specialPrice' | 'reserveInsufficient' | 'scaleInsufficient') => {
    switch (type) {
      case 'specialPrice':
        return <FileWarning className="w-4 h-4" />;
      case 'reserveInsufficient':
        return <TrendingDown className="w-4 h-4" />;
      case 'scaleInsufficient':
        return <Target className="w-4 h-4" />;
    }
  };

  // 计算高风险数量
  const highRiskCount = [
    ...delayedProjects.filter(p => p.severity === 'high'),
    ...otherRisks.filter(r => r.severity === 'high'),
    ...projectReserve.filter(r => r.severity === 'high')
  ].length;

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

      {/* 轮播控制栏 */}
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

      {/* 风险列表 - 轮播内容 */}
      <div className="flex-1 overflow-hidden">
        {/* Tab 0: 延期项目 */}
        {currentTab === 0 && (
          <div className="h-full p-6 space-y-4 animate-in fade-in duration-300 overflow-y-auto">
            {/* 仪表盘卡片网格 */}
            <div className="grid grid-cols-4 gap-3">
              {delayedProjects.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    'rounded-lg p-3 border-2 transition-all duration-200',
                    item.severity === 'high'
                      ? 'bg-slate-900/60 border-red-500/40 hover:bg-red-500/10 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                      : 'bg-slate-900/60 border-yellow-500/40 hover:bg-yellow-500/10 hover:border-yellow-500/60'
                  )}
                >
                  <DashboardGauge
                    gapFill={item.gapFill}
                    targetGap={item.targetGap}
                    severity={item.severity}
                    amount={item.amount}
                    label={item.period}
                  />

                  {/* 底部信息 */}
                  <div className="mt-3 pt-2 border-t border-cyan-500/20">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className={cn(DASHBOARD_STYLES.textMuted)}>可填补缺口</span>
                      <span className={cn('font-bold text-green-400')}>{item.gapFill}万</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className={cn(DASHBOARD_STYLES.textMuted)}>目标缺口</span>
                      <span className={cn('font-bold', DASHBOARD_STYLES.textSecondary)}>{item.targetGap}万</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={cn(DASHBOARD_STYLES.textMuted)}>延期项目数</span>
                      <span className={cn('font-bold text-orange-400')}>{item.count}个</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 统计总览 */}
            <div className={cn('p-4 rounded-lg border', DASHBOARD_STYLES.cardBorder)}>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className={cn('text-sm mb-1', DASHBOARD_STYLES.textMuted)}>延期项目总数</div>
                  <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                    {delayedProjects.reduce((sum, p) => sum + p.count, 0)}
                  </div>
                </div>
                <div>
                  <div className={cn('text-sm mb-1', DASHBOARD_STYLES.textMuted)}>延期总金额</div>
                  <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                    {delayedProjects.reduce((sum, p) => sum + p.amount, 0)}
                    <span className="text-sm">万</span>
                  </div>
                </div>
                <div>
                  <div className={cn('text-sm mb-1', DASHBOARD_STYLES.textMuted)}>可填补总缺口</div>
                  <div className={cn('text-2xl font-bold text-green-400')}>
                    +{delayedProjects.reduce((sum, p) => sum + p.gapFill, 0)}
                    <span className="text-sm">万</span>
                  </div>
                </div>
                <div>
                  <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>高风险占比</div>
                  <div className={cn('text-2xl font-bold text-red-400')}>
                    {Math.round((delayedProjects.filter(p => p.severity === 'high').length / delayedProjects.length) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: 人效分析 */}
        {currentTab === 1 && (
          <div className="h-full p-6 space-y-4 animate-in fade-in duration-300 overflow-y-auto">
            {/* 关键指标卡片 */}
            <div className="grid grid-cols-4 gap-3">
              <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                <div className={cn('text-xs mb-2', DASHBOARD_STYLES.textMuted)}>总人员数</div>
                <div className={cn('text-3xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                  {efficiencyData.totalStaff}
                  <span className="text-sm ml-1">人</span>
                </div>
                <div className={cn('text-xs mt-2', DASHBOARD_STYLES.textMuted)}>
                  活跃率 {Math.round((efficiencyData.activeStaff / efficiencyData.totalStaff) * 100)}%
                </div>
              </div>
              <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                <div className={cn('text-xs mb-2', DASHBOARD_STYLES.textMuted)}>活跃人员</div>
                <div className={cn('text-3xl font-bold text-green-400')}>
                  {efficiencyData.activeStaff}
                  <span className="text-sm ml-1">人</span>
                </div>
                <div className={cn('text-xs mt-2', DASHBOARD_STYLES.textMuted)}>
                  有项目正在推进
                </div>
              </div>
              <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                <div className={cn('text-xs mb-2', DASHBOARD_STYLES.textMuted)}>人均项目数</div>
                <div className={cn('text-3xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                  {efficiencyData.avgProjectsPerStaff}
                  <span className="text-sm ml-1">个</span>
                </div>
                <div className={cn('text-xs mt-2', DASHBOARD_STYLES.textMuted)}>
                  平均每人推进项目
                </div>
              </div>
              <div className={cn('rounded-lg p-4 border', DASHBOARD_STYLES.cardBorder)}>
                <div className={cn('text-xs mb-2', DASHBOARD_STYLES.textMuted)}>人均产值</div>
                <div className={cn('text-3xl font-bold text-cyan-400')}>
                  {efficiencyData.avgRevenuePerStaff}
                  <span className="text-sm ml-1">万</span>
                </div>
                <div className={cn('text-xs mt-2', DASHBOARD_STYLES.textMuted)}>
                  人均创造营收
                </div>
              </div>
            </div>

            {/* 0项目人员列表 */}
            <div className={cn('rounded-lg border p-4', DASHBOARD_STYLES.cardBorder)}>
              {/* 汇总信息 - 默认显示 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className={cn('text-sm font-medium', DASHBOARD_STYLES.textSecondary)}>
                      无项目人员
                    </h4>
                    <div className={cn('text-2xl font-bold mt-1', DASHBOARD_STYLES.textSecondary)}>
                      {efficiencyData.zeroProjectStaff.length}
                      <span className="text-sm ml-1">人</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn('px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30')}>
                      <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>高风险</div>
                      <div className={cn('text-lg font-bold text-red-400')}>
                        {efficiencyData.zeroProjectStaff.filter(s => s.severity === 'high').length}
                      </div>
                    </div>
                    <div className={cn('px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30')}>
                      <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>中风险</div>
                      <div className={cn('text-lg font-bold text-yellow-400')}>
                        {efficiencyData.zeroProjectStaff.filter(s => s.severity === 'medium').length}
                      </div>
                    </div>
                    <div className={cn('px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30')}>
                      <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>低风险</div>
                      <div className={cn('text-lg font-bold text-green-400')}>
                        {efficiencyData.zeroProjectStaff.filter(s => s.severity === 'low').length}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowZeroProjectDetails(!showZeroProjectDetails)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                    theme === 'dashboard'
                      ? 'bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  )}
                >
                  {showZeroProjectDetails ? '收起明细' : '查看明细'}
                  <ChevronRight className={cn('w-4 h-4 transition-transform', showZeroProjectDetails ? 'rotate-90' : '')} />
                </button>
              </div>

              {/* 明细列表 - 点击后显示 */}
              {showZeroProjectDetails && (
                <div className="mt-4 pt-4 border-t border-cyan-500/20 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {efficiencyData.zeroProjectStaff.map((staff, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border transition-all',
                        staff.severity === 'high'
                          ? 'bg-red-500/10 border-red-500/30'
                          : staff.severity === 'medium'
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-green-500/10 border-green-500/30'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                          staff.severity === 'high' ? 'bg-red-500/30 text-red-300' :
                          staff.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-green-500/30 text-green-300'
                        )}>
                          {staff.name[0]}
                        </div>
                        <div>
                          <div className={cn('text-sm font-medium', DASHBOARD_STYLES.textSecondary)}>{staff.name}</div>
                          <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>{staff.region}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={cn('text-xs', DASHBOARD_STYLES.textMuted)}>无项目时长</div>
                          <div className={cn('text-sm font-medium', DASHBOARD_STYLES.textSecondary)}>{staff.zeroProjectDuration}</div>
                        </div>
                        <span className={cn('px-2 py-1 rounded text-xs font-medium', getSeverityStyles(staff.severity))}>
                          {staff.severity === 'high' ? '高风险' : staff.severity === 'medium' ? '中风险' : '低风险'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: 项目储备分析 */}
        {currentTab === 2 && (
          <div className="h-full p-6 space-y-4 animate-in fade-in duration-300 overflow-y-auto">
            {/* 仪表盘卡片网格 */}
            <div className="grid grid-cols-5 gap-3">
              {projectReserve.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={cn(
                      'rounded-lg p-3 border-2 transition-all duration-200',
                      item.severity === 'high'
                        ? 'bg-slate-900/60 border-red-500/40 hover:bg-red-500/10 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                        : item.severity === 'medium'
                        ? 'bg-slate-900/60 border-yellow-500/40 hover:bg-yellow-500/10 hover:border-yellow-500/60'
                        : 'bg-slate-900/60 border-green-500/40 hover:bg-green-500/10 hover:border-green-500/60'
                    )}
                  >
                    {/* 类型标签 */}
                    <div className="flex items-center gap-1.5 mb-2">
                      {item.type === 'industry' ? (
                        <Building2 className="w-4 h-4" style={{ color: 'rgba(6,182,212,0.7)' }} />
                      ) : (
                        <Target className="w-4 h-4" style={{ color: 'rgba(6,182,212,0.7)' }} />
                      )}
                      <span className="text-sm" style={{ color: 'rgba(6,182,212,0.7)' }}>
                        {item.type === 'industry' ? '行业' : '细分市场'}
                      </span>
                    </div>

                    <DashboardGauge
                      gapFill={item.currentReserve}
                      targetGap={item.targetReserve}
                      severity={item.severity}
                      amount={item.currentReserve}
                      label={item.category}
                    />

                    {/* 底部信息 */}
                    <div className="mt-3 pt-2 border-t border-cyan-500/20">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className={cn(DASHBOARD_STYLES.textMuted)}>当前储备</span>
                        <span className={cn('font-bold text-cyan-400')}>{item.currentReserve}万</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className={cn(DASHBOARD_STYLES.textMuted)}>目标储备</span>
                        <span className={cn('font-bold', DASHBOARD_STYLES.textSecondary)}>{item.targetReserve}万</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={cn(DASHBOARD_STYLES.textMuted)}>储备缺口</span>
                        <span className={cn('font-bold text-orange-400')}>-{item.gap}万</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 统计总览 */}
            <div className={cn('p-4 rounded-lg border', DASHBOARD_STYLES.cardBorder)}>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>储备缺口总计</div>
                  <div className={cn('text-2xl font-bold text-orange-400')}>
                    -{projectReserve.reduce((sum, r) => sum + r.gap, 0)}
                    <span className="text-sm">万</span>
                  </div>
                </div>
                <div>
                  <div className={cn('text-xs mb-1', DASHBOARD_STYLES.textMuted)}>平均达成率</div>
                  <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                    {Math.round(projectReserve.reduce((sum, r) => sum + (r.currentReserve / r.targetReserve) * 100, 0) / projectReserve.length)}%
                  </div>
                </div>
                <div>
                  <div className={cn('text-sm mb-1', DASHBOARD_STYLES.textMuted)}>高风险行业</div>
                  <div className={cn('text-2xl font-bold text-red-400')}>
                    {projectReserve.filter(r => r.severity === 'high').length}
                    <span className="text-sm">个</span>
                  </div>
                </div>
                <div>
                  <div className={cn('text-sm mb-1', DASHBOARD_STYLES.textMuted)}>说明</div>
                  <div className={cn('text-sm text-left', DASHBOARD_STYLES.textSecondary)}>
                    各行业项目储备缺口分析
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 其他风险 */}
        {currentTab === 3 && (
          <div className="h-full p-6 space-y-4 animate-in fade-in duration-300 overflow-y-auto">
            {/* 仪表盘卡片网格 */}
            <div className="grid grid-cols-4 gap-3">
              {otherRisks.map((risk, index) => (
                <div
                  key={index}
                  className={cn(
                    'rounded-lg p-3 border-2 transition-all duration-200',
                    risk.severity === 'high'
                      ? 'bg-slate-900/60 border-red-500/40 hover:bg-red-500/10 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                      : risk.severity === 'medium'
                      ? 'bg-slate-900/60 border-yellow-500/40 hover:bg-yellow-500/10 hover:border-yellow-500/60'
                      : 'bg-slate-900/60 border-green-500/40 hover:bg-green-500/10 hover:border-green-500/60'
                  )}
                >
                  <DashboardGauge
                    gapFill={risk.severity === 'high' ? 90 : risk.severity === 'medium' ? 60 : 30}
                    targetGap={100}
                    severity={risk.severity}
                    amount={risk.count}
                    label={risk.title}
                  />

                  {/* 底部信息 */}
                  <div className="mt-3 pt-2 border-t border-cyan-500/20">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className={cn(DASHBOARD_STYLES.textMuted)">涉及项目</span>
                      <span className={cn('font-bold text-orange-400')}>{risk.count}个</span>
                    </div>
                    <div className="text-sm text-left mt-2">
                      <span className={cn(DASHBOARD_STYLES.textMuted)}>{risk.description}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 统计总览 */}
            <div className={cn('p-4 rounded-lg border', DASHBOARD_STYLES.cardBorder)}>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className={cn('text-sm mb-1', DASHBOARD_STYLES.textMuted)}>风险总数</div>
                  <div className={cn('text-2xl font-bold', DASHBOARD_STYLES.textSecondary)}>
                    {otherRisks.reduce((sum, r) => sum + r.count, 0)}
                  </div>
                </div>
                <div>
                  <div className={cn('text-sm mb-1', DASHBOARD_STYLES.textMuted)}>高风险项</div>
                  <div className={cn('text-2xl font-bold text-red-400')}>
                    {otherRisks.filter(r => r.severity === 'high').length}
                  </div>
                </div>
                <div>
                  <div className={cn('text-sm mb-1', DASHBOARD_STYLES.textMuted)}>中风险项</div>
                  <div className={cn('text-2xl font-bold text-yellow-400')}>
                    {otherRisks.filter(r => r.severity === 'medium').length}
                  </div>
                </div>
                <div>
                  <div className={cn('text-sm mb-1', DASHBOARD_STYLES.textMuted)}>低风险项</div>
                  <div className={cn('text-2xl font-bold text-green-400')}>
                    {otherRisks.filter(r => r.severity === 'low').length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
