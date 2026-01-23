'use client';

import { ArrowUp, ArrowDown, ArrowRight, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Activity, Clock, Target, DollarSign, Zap, Flame, Lightbulb, Compass, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

// 主题类型
type Theme = 'dark' | 'light';

// 支撑层级数据
interface SupportLevel {
  period: string; // '0-30天' | '1-3月' | '3-6月'
  label: string;
  amount: number;
  coverage: number; // 覆盖度百分比
  status: 'green' | 'yellow' | 'red';
  target: number;
  gap: number;
  projects: {
    id: number;
    name: string;
    amount: number;
    probability: 'high' | 'medium' | 'low';
    health: 'high' | 'medium' | 'low';
    isOnTrack: boolean;
    delayDays?: number;
    isNew?: boolean;
    isDelayed?: boolean;
    isRisk?: boolean;
  }[];
}

// 诊断问题数据
interface DiagnosticIssue {
  id: string;
  type: 'project_delay' | 'reserve_shortage' | 'channel_decline';
  name: string;
  impact: number;
  reason: string;
  riskLevel: 'red' | 'orange' | 'yellow';
}

// 时间线节点数据
interface TimelineNode {
  period: string;
  label: string;
  projects: {
    name: string;
    amount: number;
    probability: 'high' | 'medium' | 'low';
    isNew?: boolean;
    isDelayed?: boolean;
    isRisk?: boolean;
  }[];
  totalAmount: number;
}

// 行动建议数据
interface ActionRecommendation {
  id: string;
  type: 'urgent' | 'supplement' | 'channel' | 'sop';
  priority: number; // 1-4，1最高
  title: string;
  description: string;
  impact: string; // 如 '+310 万'
  owner?: string;
  deadline?: string;
}

// 未来支撑充分性面板数据
interface FutureSupportAdequacyData {
  coreMetrics: {
    coverage: number; // 未来90天支撑覆盖度
    coverageStatus: 'green' | 'yellow' | 'red';
    targetAmount: number;
    supportAmount: number;
    gap: number;
    trend: 'up' | 'stable' | 'down';
    trendValue: number; // 趋势百分比
  };
  supportStructure: {
    '0-30天': SupportLevel;
    '1-3月': SupportLevel;
    '3-6月': SupportLevel;
  };
  diagnosticIssues: DiagnosticIssue[];
  timeline: TimelineNode[];
  actions: ActionRecommendation[];
}

// 默认数据
const defaultData: FutureSupportAdequacyData = {
  coreMetrics: {
    coverage: 78,
    coverageStatus: 'red',
    targetAmount: 1500,
    supportAmount: 1170,
    gap: 330,
    trend: 'down',
    trendValue: -5.2
  },
  supportStructure: {
    '0-30天': {
      period: '0-30天',
      label: '核心支撑期',
      amount: 520,
      coverage: 52,
      status: 'red',
      target: 1000,
      gap: 480,
      projects: [
        {
          id: 1,
          name: '北京协和医院净化项目',
          amount: 350,
          probability: 'high',
          health: 'high',
          isOnTrack: true
        },
        {
          id: 2,
          name: '上海外国语学校净水项目',
          amount: 170,
          probability: 'medium',
          health: 'medium',
          isOnTrack: false,
          delayDays: 12
        }
      ]
    },
    '1-3月': {
      period: '1-3月',
      label: '中期支撑期',
      amount: 450,
      coverage: 75,
      status: 'yellow',
      target: 600,
      gap: 150,
      projects: [
        {
          id: 3,
          name: '南京鼓楼医院项目',
          amount: 180,
          probability: 'medium',
          health: 'high',
          isOnTrack: true
        },
        {
          id: 4,
          name: '深圳四季酒店净化项目',
          amount: 140,
          probability: 'medium',
          health: 'medium',
          isOnTrack: true
        },
        {
          id: 5,
          name: '杭州阿里巴巴园区项目',
          amount: 130,
          probability: 'low',
          health: 'low',
          isOnTrack: false,
          delayDays: 8
        }
      ]
    },
    '3-6月': {
      period: '3-6月',
      label: '储备支撑期',
      amount: 200,
      coverage: 100,
      status: 'green',
      target: 200,
      gap: 0,
      projects: [
        {
          id: 6,
          name: '武汉绿地中心项目',
          amount: 120,
          probability: 'low',
          health: 'low',
          isOnTrack: true,
          isNew: true
        },
        {
          id: 7,
          name: '西安交通大学项目',
          amount: 80,
          probability: 'low',
          health: 'low',
          isOnTrack: false,
          isRisk: true
        }
      ]
    }
  },
  diagnosticIssues: [
    {
      id: '1',
      type: 'project_delay',
      name: '项目推进延迟',
      impact: -180,
      reason: '2个项目延迟超过10天，降低短期支撑',
      riskLevel: 'red'
    },
    {
      id: '2',
      type: 'reserve_shortage',
      name: '储备新增不足',
      impact: -90,
      reason: '本月新增储备项目仅2个，低于目标5个',
      riskLevel: 'orange'
    },
    {
      id: '3',
      type: 'channel_decline',
      name: '渠道贡献下滑',
      impact: -60,
      reason: '华北渠道近30天无新增项目',
      riskLevel: 'yellow'
    }
  ],
  timeline: [
    {
      period: 'Week 1',
      label: 'Week 1',
      projects: [
        { name: '北京协和医院净化项目', amount: 350, probability: 'high' },
        { name: '上海外国语学校净水项目', amount: 170, probability: 'medium', isDelayed: true }
      ],
      totalAmount: 520
    },
    {
      period: 'Week 2',
      label: 'Week 2',
      projects: [],
      totalAmount: 0
    },
    {
      period: 'Week 3',
      label: 'Week 3',
      projects: [],
      totalAmount: 0
    },
    {
      period: 'Week 4',
      label: 'Week 4',
      projects: [
        { name: '南京鼓楼医院项目', amount: 180, probability: 'medium' }
      ],
      totalAmount: 180
    },
    {
      period: '1-3 Month',
      label: '1-3 Month',
      projects: [
        { name: '深圳四季酒店净化项目', amount: 140, probability: 'medium' },
        { name: '杭州阿里巴巴园区项目', amount: 130, probability: 'low', isDelayed: true }
      ],
      totalAmount: 270
    },
    {
      period: '3-6 Month',
      label: '3-6 Month',
      projects: [
        { name: '武汉绿地中心项目', amount: 120, probability: 'low', isNew: true },
        { name: '西安交通大学项目', amount: 80, probability: 'low', isRisk: true }
      ],
      totalAmount: 200
    }
  ],
  actions: [
    {
      id: '1',
      type: 'urgent',
      priority: 1,
      title: '紧急推进',
      description: '立刻推进上海外国语学校、杭州阿里巴巴园区项目（释放 +310 万）',
      impact: '+310 万',
      owner: '李娜、王强',
      deadline: '本周内'
    },
    {
      id: '2',
      type: 'supplement',
      priority: 2,
      title: '补齐支撑',
      description: '需新增 3 个中期储备项目（填补 +180 万缺口）',
      impact: '+180 万',
      owner: '张伟',
      deadline: '15天内'
    },
    {
      id: '3',
      type: 'channel',
      priority: 3,
      title: '渠道动作',
      description: '激活华北渠道代理，本周需新增项目≥4 个',
      impact: '+200 万',
      owner: '刘芳',
      deadline: '本周内'
    },
    {
      id: '4',
      type: 'sop',
      priority: 4,
      title: 'SOP督办',
      description: '陈明、赵敏 SOP 未更新>14天，影响支撑 +120 万',
      impact: '+120 万',
      owner: '张伟',
      deadline: '3天内'
    }
  ]
};

// 组件属性
interface FutureSupportAdequacyPanelProps {
  data?: Partial<FutureSupportAdequacyData>;
  theme?: Theme;
}

export default function FutureSupportAdequacyPanel({
  data: customData,
  theme = 'light'
}: FutureSupportAdequacyPanelProps) {
  // 合并默认数据和自定义数据
  const data = { ...defaultData, ...customData };

  // 获取状态颜色
  const getStatusColor = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green':
        return { bg: theme === 'dark' ? 'bg-green-500' : 'bg-green-500', text: 'text-green-600', border: theme === 'dark' ? 'border-green-500' : 'border-green-500' };
      case 'yellow':
        return { bg: theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-500', text: 'text-yellow-600', border: theme === 'dark' ? 'border-yellow-500' : 'border-yellow-500' };
      case 'red':
        return { bg: theme === 'dark' ? 'bg-red-500' : 'bg-red-500', text: 'text-red-600', border: theme === 'dark' ? 'border-red-500' : 'border-red-500' };
    }
  };

  // 获取风险等级颜色
  const getRiskLevelColor = (level: 'red' | 'orange' | 'yellow') => {
    switch (level) {
      case 'red':
        return 'bg-red-500';
      case 'orange':
        return 'bg-orange-500';
      case 'yellow':
        return 'bg-yellow-500';
    }
  };

  // 获取概率颜色
  const getProbabilityColor = (probability: 'high' | 'medium' | 'low') => {
    switch (probability) {
      case 'high':
        return theme === 'dark' ? 'bg-green-500' : 'bg-green-500';
      case 'medium':
        return theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-500';
      case 'low':
        return theme === 'dark' ? 'bg-gray-500' : 'bg-gray-500';
    }
  };

  // 获取健康度颜色
  const getHealthColor = (health: 'high' | 'medium' | 'low') => {
    switch (health) {
      case 'high':
        return theme === 'dark' ? 'text-green-500' : 'text-green-600';
      case 'medium':
        return theme === 'dark' ? 'text-yellow-500' : 'text-yellow-600';
      case 'low':
        return theme === 'dark' ? 'text-red-500' : 'text-red-600';
    }
  };

  // 获取趋势图标
  const getTrendIcon = (trend: 'up' | 'stable' | 'down') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-5 h-5 text-green-600" />;
      case 'stable':
        return <ArrowRight className="w-5 h-5 text-slate-600" />;
      case 'down':
        return <ArrowDown className="w-5 h-5 text-red-600" />;
    }
  };

  // 获取行动类型图标
  const getActionIcon = (type: 'urgent' | 'supplement' | 'channel' | 'sop') => {
    switch (type) {
      case 'urgent':
        return <Flame className="w-4 h-4 text-red-600" />;
      case 'supplement':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'channel':
        return <Lightbulb className="w-4 h-4 text-blue-600" />;
      case 'sop':
        return <Compass className="w-4 h-4 text-purple-600" />;
    }
  };

  // 获取行动类型背景色
  const getActionTypeBg = (type: 'urgent' | 'supplement' | 'channel' | 'sop', theme: Theme) => {
    switch (type) {
      case 'urgent':
        return theme === 'dark' ? 'bg-red-500/20' : 'bg-red-50';
      case 'supplement':
        return theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-50';
      case 'channel':
        return theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50';
      case 'sop':
        return theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-50';
    }
  };

  // 支撑结构数据转换（用于图表）
  const supportStructureData = [
    { name: '0-30天', amount: data.supportStructure['0-30天'].amount, coverage: data.supportStructure['0-30天'].coverage, status: data.supportStructure['0-30天'].status },
    { name: '1-3月', amount: data.supportStructure['1-3月'].amount, coverage: data.supportStructure['1-3月'].coverage, status: data.supportStructure['1-3月'].status },
    { name: '3-6月', amount: data.supportStructure['3-6月'].amount, coverage: data.supportStructure['3-6月'].coverage, status: data.supportStructure['3-6月'].status }
  ];

  return (
    <div
      className={cn(
        'w-full rounded-lg overflow-hidden transition-all duration-300',
        theme === 'dark'
          ? 'bg-slate-900/80 border border-slate-700'
          : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200'
      )}
    >
      {/* 标题区 */}
      <div
        className={cn(
          'px-6 py-3 border-b flex items-center justify-between',
          theme === 'dark' ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'
        )}
      >
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-lg text-slate-900">未来支撑够不够？</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-700">未来90天</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">驾驶舱模式</span>
            <BarChart3 className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      </div>

      {/* 主内容区 - 5大核心区块 */}
      <div className="grid grid-cols-12 gap-0">
        {/* 【1）核心数值区 - 左侧3列】 */}
        <div
          className={cn(
            'col-span-3 p-6 border-r flex flex-col justify-center',
            theme === 'dark' ? 'border-slate-700 bg-slate-900/30' : 'border-slate-200 bg-white'
          )}
        >
          {/* 覆盖度大数字 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-slate-600" />
              <span className="text-sm text-slate-600">未来90天支撑覆盖度</span>
            </div>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-6xl font-bold" style={{ color: getStatusColor(data.coreMetrics.coverageStatus).text }}>
                {data.coreMetrics.coverage}
              </span>
              <span className="text-2xl text-slate-600">%</span>
              {getTrendIcon(data.coreMetrics.trend)}
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-3 h-3 rounded-full',
                  getStatusColor(data.coreMetrics.coverageStatus).bg
                )}
              />
              <span className="text-sm text-slate-600">
                {data.coreMetrics.coverageStatus === 'green' && '充足'}
                {data.coreMetrics.coverageStatus === 'yellow' && '基本达标'}
                {data.coreMetrics.coverageStatus === 'red' && '不足'}
              </span>
            </div>
          </div>

          {/* 目标金额 vs 可支撑金额 */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">未来目标金额</span>
                <span className="text-lg font-bold text-slate-900">{data.coreMetrics.targetAmount.toLocaleString()}万</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">可支撑金额</span>
                <span className="text-lg font-bold text-green-600">{data.coreMetrics.supportAmount.toLocaleString()}万</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${data.coreMetrics.coverage}%` }} />
              </div>
            </div>
            <div
              className={cn(
                'p-3 rounded-lg flex items-center justify-between',
                theme === 'dark' ? 'bg-red-500/20' : 'bg-red-50'
              )}
            >
              <span className="text-sm text-slate-700">缺口金额</span>
              <span className="text-xl font-bold text-red-600">- {data.coreMetrics.gap.toLocaleString()}万</span>
            </div>
          </div>
        </div>

        {/* 右侧9列 - 包含其他4个区块 */}
        <div className="col-span-9">
          {/* 【2）未来支撑结构区 - 横向三段结构条】 */}
          <div
            className={cn(
              'p-4 border-b grid grid-cols-3 gap-0',
              theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
            )}
          >
            {(['0-30天', '1-3月', '3-6月'] as const).map((period, index) => {
              const level = data.supportStructure[period];
              const statusColor = getStatusColor(level.status);
              return (
                <div
                  key={period}
                  className={cn(
                    'p-4 relative',
                    index > 0 && 'border-l',
                    theme === 'dark' ? `border-slate-700 bg-gradient-to-b from-slate-800/50 to-slate-900/30` : `border-slate-200 bg-gradient-to-b ${index === 0 ? 'from-red-50/50 to-slate-50/30' : index === 1 ? 'from-yellow-50/50 to-slate-50/30' : 'from-green-50/50 to-slate-50/30'}`
                  )}
                >
                  {/* 时间段标签 */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-600">{period}</span>
                    <div className={cn('w-2 h-2 rounded-full', statusColor.bg)} />
                  </div>
                  
                  {/* 金额 */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-bold text-slate-900">{level.amount.toLocaleString()}</span>
                    <span className="text-sm text-slate-600">万</span>
                  </div>
                  
                  {/* 覆盖度 */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-600">覆盖度</span>
                    <span className={cn('text-sm font-bold', statusColor.text)}>{level.coverage}%</span>
                  </div>
                  
                  {/* Top项目列表 */}
                  <div className="space-y-2">
                    {level.projects.slice(0, 3).map((project, pIndex) => (
                      <div
                        key={project.id}
                        className={cn(
                          'p-1.5 rounded text-xs relative',
                          theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/60'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-900 truncate flex-1 mr-2">{project.name}</span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {project.isNew && <span className="px-1 rounded bg-blue-500 text-white text-[10px]">新</span>}
                            {project.isDelayed && <span className="px-1 rounded bg-red-500 text-white text-[10px]">延</span>}
                            {project.isRisk && <span className="px-1 rounded bg-orange-500 text-white text-[10px]">险</span>}
                            <span className="font-bold text-slate-900">{project.amount}万</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className={cn('w-1.5 h-1.5 rounded-full', getProbabilityColor(project.probability))} />
                            <span className="text-[10px] text-slate-600">{project.probability === 'high' ? '高' : project.probability === 'medium' ? '中' : '低'}概率</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={cn('text-[10px]', getHealthColor(project.health))}>
                              {project.health === 'high' ? '健康' : project.health === 'medium' ? '一般' : '风险'}
                            </span>
                            {!project.isOnTrack && project.delayDays && (
                              <span className="text-[10px] text-red-600">延迟{project.delayDays}天</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 【3）未来支撑缺失诊断区 - 3个诊断卡条】 */}
          <div
            className={cn(
              'p-4 border-b',
              theme === 'dark' ? 'border-slate-700 bg-slate-900/20' : 'border-slate-200 bg-slate-50/50'
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-slate-900">支撑缺失诊断</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {data.diagnosticIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={cn(
                    'p-3 rounded-lg relative',
                    theme === 'dark' ? 'bg-slate-800/50' : 'bg-white border border-slate-200'
                  )}
                >
                  <div className="absolute top-2 right-2">
                    <div className={cn('w-2 h-2 rounded-full', getRiskLevelColor(issue.riskLevel))} />
                  </div>
                  <div className="text-xs text-slate-600 mb-1">{issue.name}</div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-lg font-bold text-red-600">{issue.impact}</span>
                    <span className="text-xs text-slate-600">万</span>
                  </div>
                  <div className="text-[10px] text-slate-600 line-clamp-2">{issue.reason}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 【4）未来支撑路径图 - 横向Timeline】 */}
          <div
            className={cn(
              'p-4 border-b',
              theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-900">未来支撑路径</span>
            </div>
            <div className="relative">
              {/* 横向时间轴线 */}
              <div
                className={cn(
                  'absolute left-0 right-0 h-0.5 top-4',
                  theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                )}
              />
              {/* 时间节点 */}
              <div className="flex justify-between relative">
                {data.timeline.map((node, index) => (
                  <div
                    key={node.period}
                    className="relative flex flex-col items-center flex-shrink-0"
                    style={{ minWidth: '60px' }}
                  >
                    {/* 时间点 */}
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full border-2 bg-white z-10 mb-2',
                        node.totalAmount > 0 ? 'border-green-500' : 'border-slate-400'
                      )}
                    />
                    {/* 时间标签 */}
                    <div className="text-[10px] text-slate-600 text-center mb-1 whitespace-nowrap">{node.label}</div>
                    {/* 金额 */}
                    {node.totalAmount > 0 && (
                      <div className="text-xs font-bold text-green-600">+{node.totalAmount}万</div>
                    )}
                    {/* 项目列表 */}
                    {node.projects.length > 0 && (
                      <div className="mt-2 space-y-1 w-full">
                        {node.projects.slice(0, 2).map((project, pIndex) => (
                          <div
                            key={pIndex}
                            className={cn(
                              'p-1 rounded text-[10px] text-center',
                              theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100/80'
                            )}
                          >
                            <div className="flex items-center justify-center gap-1 mb-0.5">
                              {project.isNew && <span className="w-1 h-1 rounded-full bg-blue-500" />}
                              {project.isDelayed && <span className="w-1 h-1 rounded-full bg-red-500" />}
                              {project.isRisk && <span className="w-1 h-1 rounded-full bg-orange-500" />}
                              <span className="truncate text-slate-900">{project.name.substring(0, 8)}...</span>
                            </div>
                            <div className="text-slate-600">{project.amount}万</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 【5）行动建议区 - 任务条风格】 */}
          <div
            className={cn(
              'p-4',
              theme === 'dark' ? 'bg-slate-900/20' : 'bg-slate-50/50'
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-slate-900">行动建议</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-700">
                {data.actions.length}项关键行动
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {data.actions.map((action) => (
                <div
                  key={action.id}
                  className={cn(
                    'p-3 rounded-lg flex items-start gap-3',
                    getActionTypeBg(action.type, theme),
                    action.type === 'urgent' && theme === 'dark' ? 'border border-red-500/30' : action.type === 'urgent' ? 'border border-red-200' : ''
                  )}
                >
                  {/* 优先级标记 */}
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                        action.priority === 1 ? 'bg-red-500 text-white' : action.priority === 2 ? 'bg-yellow-500 text-white' : action.priority === 3 ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white'
                      )}
                    >
                      {action.priority}
                    </div>
                  </div>
                  {/* 图标 */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getActionIcon(action.type)}
                  </div>
                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">{action.title}</span>
                      <span className={cn('text-xs font-bold', action.type === 'urgent' ? 'text-red-600' : action.type === 'supplement' ? 'text-yellow-600' : action.type === 'channel' ? 'text-blue-600' : 'text-purple-600')}>
                        {action.impact}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 line-clamp-2 mb-1">{action.description}</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      {action.owner && <span>负责人：{action.owner}</span>}
                      {action.deadline && <span>· 截止：{action.deadline}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
