'use client';

import { TrendingUp, Clock, BarChart3, ArrowUpRight, ArrowRight, ArrowDownRight, ChevronRight, Activity, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';

// 主题类型
type Theme = 'dark' | 'light';

// 趋势类型
type TrendType = 'up' | 'stable' | 'down';

// 项目成交概率
type ProbabilityLevel = 'high' | 'medium' | 'low';

// 支撑项目数据
interface SupportProject {
  id: number;
  name: string;
  amount: number;
  contribution: number; // 贡献占比
  probability: ProbabilityLevel;
  trend: TrendType;
  timeToClose: string; // 预计签约时间
  owner?: string; // 责任销售
  status: string; // 项目状态
}

// 支撑层级数据
interface SupportLevel {
  level: 'core' | 'medium' | 'reserve';
  label: string;
  timeLabel: string; // 如"0-30天"、"1-3月"
  totalAmount: number;
  percentage: number; // 占整体预测的比例
  projects: SupportProject[];
  color: string;
  bgColor: string;
}

// 关键支撑面板数据接口
interface KeySupportPanelData {
  coreSupport: SupportLevel; // 核心支撑（0-30天）
  mediumSupport: SupportLevel; // 中期支撑（1-3月）
  reserveSupport: SupportLevel; // 储备支撑（3-6月）
  totalSupport: number;
  forecastAmount: number; // 预测总额
}

// 默认数据
const defaultData: KeySupportPanelData = {
  coreSupport: {
    level: 'core',
    label: '核心支撑',
    timeLabel: '0-30天',
    totalAmount: 850,
    percentage: 63,
    color: '#22c55e',
    bgColor: 'from-green-500/20 to-green-600/10',
    projects: [
      {
        id: 1,
        name: '北京协和医院净化项目',
        amount: 350,
        contribution: 41,
        probability: 'high',
        trend: 'up',
        timeToClose: '14天内',
        owner: '张伟',
        status: '谈判阶段'
      },
      {
        id: 2,
        name: '上海外国语学校净水项目',
        amount: 280,
        contribution: 33,
        probability: 'high',
        trend: 'up',
        timeToClose: '21天内',
        owner: '李娜',
        status: '商务阶段'
      },
      {
        id: 3,
        name: '杭州阿里巴巴园区项目',
        amount: 220,
        contribution: 26,
        probability: 'medium',
        trend: 'stable',
        timeToClose: '28天内',
        owner: '王强',
        status: '方案阶段'
      }
    ]
  },
  mediumSupport: {
    level: 'medium',
    label: '中期支撑',
    timeLabel: '1-3月',
    totalAmount: 320,
    percentage: 24,
    color: '#3b82f6',
    bgColor: 'from-blue-500/20 to-blue-600/10',
    projects: [
      {
        id: 4,
        name: '南京鼓楼医院项目',
        amount: 180,
        contribution: 56,
        probability: 'medium',
        trend: 'up',
        timeToClose: '45天内',
        owner: '刘芳',
        status: '商务阶段'
      },
      {
        id: 5,
        name: '深圳四季酒店净化项目',
        amount: 140,
        contribution: 44,
        probability: 'medium',
        trend: 'stable',
        timeToClose: '60天内',
        owner: '陈明',
        status: '谈判阶段'
      }
    ]
  },
  reserveSupport: {
    level: 'reserve',
    label: '储备支撑',
    timeLabel: '3-6月',
    totalAmount: 180,
    percentage: 13,
    color: '#8b5cf6',
    bgColor: 'from-purple-500/20 to-purple-600/10',
    projects: [
      {
        id: 6,
        name: '武汉绿地中心项目',
        amount: 120,
        contribution: 67,
        probability: 'low',
        trend: 'stable',
        timeToClose: '90天内',
        owner: '赵敏',
        status: '初步接触'
      },
      {
        id: 7,
        name: '西安交通大学项目',
        amount: 60,
        contribution: 33,
        probability: 'low',
        trend: 'down',
        timeToClose: '120天内',
        owner: '孙丽',
        status: '初步接触'
      }
    ]
  },
  totalSupport: 1350,
  forecastAmount: 1500
};

// 组件属性
interface KeySupportPanelProps {
  data?: Partial<KeySupportPanelData>;
  theme?: Theme;
  onProjectHover?: (project: SupportProject) => void;
  onTimelineHover?: (timeLabel: string) => void;
}

export default function KeySupportPanel({
  data: customData,
  theme = 'light',
  onProjectHover,
  onTimelineHover
}: KeySupportPanelProps) {
  // 合并默认数据和自定义数据
  const data = { ...defaultData, ...customData };

  // 获取概率颜色
  const getProbabilityColor = (level: ProbabilityLevel) => {
    switch (level) {
      case 'high':
        return { bg: 'bg-green-500', text: 'text-green-600', label: '高' };
      case 'medium':
        return { bg: 'bg-yellow-500', text: 'text-yellow-600', label: '中' };
      case 'low':
        return { bg: 'bg-gray-400', text: 'text-gray-600', label: '低' };
    }
  };

  // 获取趋势图标
  const getTrendIcon = (trend: TrendType) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />;
      case 'stable':
        return <ArrowRight className="w-3.5 h-3.5 text-slate-600" />;
      case 'down':
        return <ArrowDownRight className="w-3.5 h-3.5 text-red-600" />;
    }
  };

  // 时间轴数据
  const timelineData = [
    { label: 'Week 1', position: 7 },
    { label: 'Week 2', position: 14 },
    { label: 'Week 3', position: 21 },
    { label: 'Week 4', position: 28 },
    { label: '1-3 Month', position: 90 },
    { label: '3-6 Month', position: 180 }
  ];

  // 支撑贡献结构条数据
  const contributionData = [
    { name: '核心支撑', value: data.coreSupport.totalAmount, color: data.coreSupport.color },
    { name: '中期支撑', value: data.mediumSupport.totalAmount, color: data.mediumSupport.color },
    { name: '储备支撑', value: data.reserveSupport.totalAmount, color: data.reserveSupport.color }
  ];

  // 自定义条形图Tooltip
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={cn(
            'rounded-lg p-3 text-xs',
            theme === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200 shadow-lg'
          )}
        >
          <div className="font-semibold mb-2">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
              <span className="text-slate-600">{entry.name}：</span>
              <span className="font-semibold">{entry.value}万</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          'w-full rounded-lg overflow-hidden transition-all duration-300',
          theme === 'dark'
            ? 'bg-slate-900/80 border border-slate-700'
            : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200'
        )}
      >
        {/* 标题栏 */}
        <div
          className={cn(
            'px-6 py-3 border-b flex items-center justify-between',
            theme === 'dark' ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-lg text-slate-900">关键支撑分析</h3>
            </div>
            <div
              className={cn(
                'h-6 w-px',
                theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
              )}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">总支撑</span>
              <span className="text-2xl font-bold text-green-600">{data.totalSupport.toLocaleString()}</span>
              <span className="text-sm text-slate-600">万</span>
            </div>
            <div
              className={cn(
                'h-6 w-px',
                theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
              )}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">预测达成率</span>
              <span className="text-lg font-bold text-blue-600">
                {((data.totalSupport / data.forecastAmount) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <BarChart3 className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-600">支撑贡献结构</span>
          </div>
        </div>

        {/* 主内容区：三层结构 */}
        <div className="p-6 grid grid-cols-12 gap-4">
          {/* 左侧：三层支撑详情（8列） */}
          <div className="col-span-8 space-y-3">
            {/* 核心支撑 */}
            <div
              className={cn(
                'rounded-lg p-4 border',
                theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : `bg-gradient-to-r ${data.coreSupport.bgColor} border-green-500/30`
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      theme === 'dark' ? 'bg-green-500' : 'bg-green-500 shadow-lg shadow-green-500/50'
                    )}
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{data.coreSupport.label}</h4>
                    <span className="text-xs text-slate-600">{data.coreSupport.timeLabel}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{data.coreSupport.totalAmount.toLocaleString()}</div>
                  <div className="text-xs text-slate-600">万</div>
                </div>
              </div>

              {/* TOP3项目 */}
              <div className="space-y-2">
                {data.coreSupport.projects.map((project, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'flex items-center gap-3 p-2 rounded transition-colors cursor-pointer',
                          theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-white/50'
                        )}
                        onMouseEnter={() => onProjectHover?.(project)}
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-900 truncate">{project.name}</span>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              {getTrendIcon(project.trend)}
                              <span className="text-sm font-bold text-green-600">{project.amount}万</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-600">{project.timeToClose}</span>
                              <div
                                className={cn(
                                  'px-1.5 py-0.5 rounded text-[10px]',
                                  getProbabilityColor(project.probability).bg,
                                  'text-white'
                                )}
                              >
                                {getProbabilityColor(project.probability).label}
                              </div>
                            </div>
                            <div className="flex-1 ml-4">
                              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={cn('h-full', getProbabilityColor(project.probability).bg)}
                                  style={{ width: `${project.contribution}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className={cn(
                        'max-w-xs',
                        theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                      )}
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-sm">{project.name}</div>
                        <div className="text-xs text-slate-600">负责人：{project.owner}</div>
                        <div className="text-xs text-slate-600">状态：{project.status}</div>
                        <div className="text-xs text-slate-600">成交概率：{getProbabilityColor(project.probability).label}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* 中期支撑 */}
            <div
              className={cn(
                'rounded-lg p-4 border',
                theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : `bg-gradient-to-r ${data.mediumSupport.bgColor} border-blue-500/30`
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      theme === 'dark' ? 'bg-blue-500' : 'bg-blue-500 shadow-lg shadow-blue-500/50'
                    )}
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{data.mediumSupport.label}</h4>
                    <span className="text-xs text-slate-600">{data.mediumSupport.timeLabel}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{data.mediumSupport.totalAmount.toLocaleString()}</div>
                  <div className="text-xs text-slate-600">万</div>
                </div>
              </div>

              {/* TOP3项目 */}
              <div className="space-y-2">
                {data.mediumSupport.projects.map((project, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'flex items-center gap-3 p-2 rounded transition-colors cursor-pointer',
                          theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-white/50'
                        )}
                        onMouseEnter={() => onProjectHover?.(project)}
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-900 truncate">{project.name}</span>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              {getTrendIcon(project.trend)}
                              <span className="text-sm font-bold text-blue-600">{project.amount}万</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-600">{project.timeToClose}</span>
                              <div
                                className={cn(
                                  'px-1.5 py-0.5 rounded text-[10px]',
                                  getProbabilityColor(project.probability).bg,
                                  'text-white'
                                )}
                              >
                                {getProbabilityColor(project.probability).label}
                              </div>
                            </div>
                            <div className="flex-1 ml-4">
                              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={cn('h-full', getProbabilityColor(project.probability).bg)}
                                  style={{ width: `${project.contribution}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className={cn(
                        'max-w-xs',
                        theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                      )}
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-sm">{project.name}</div>
                        <div className="text-xs text-slate-600">负责人：{project.owner}</div>
                        <div className="text-xs text-slate-600">状态：{project.status}</div>
                        <div className="text-xs text-slate-600">成交概率：{getProbabilityColor(project.probability).label}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* 储备支撑 */}
            <div
              className={cn(
                'rounded-lg p-4 border',
                theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : `bg-gradient-to-r ${data.reserveSupport.bgColor} border-purple-500/30`
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      theme === 'dark' ? 'bg-purple-500' : 'bg-purple-500 shadow-lg shadow-purple-500/50'
                    )}
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{data.reserveSupport.label}</h4>
                    <span className="text-xs text-slate-600">{data.reserveSupport.timeLabel}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">{data.reserveSupport.totalAmount.toLocaleString()}</div>
                  <div className="text-xs text-slate-600">万</div>
                </div>
              </div>

              {/* TOP3项目 */}
              <div className="space-y-2">
                {data.reserveSupport.projects.map((project, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'flex items-center gap-3 p-2 rounded transition-colors cursor-pointer',
                          theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-white/50'
                        )}
                        onMouseEnter={() => onProjectHover?.(project)}
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-900 truncate">{project.name}</span>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              {getTrendIcon(project.trend)}
                              <span className="text-sm font-bold text-purple-600">{project.amount}万</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-600">{project.timeToClose}</span>
                              <div
                                className={cn(
                                  'px-1.5 py-0.5 rounded text-[10px]',
                                  getProbabilityColor(project.probability).bg,
                                  'text-white'
                                )}
                              >
                                {getProbabilityColor(project.probability).label}
                              </div>
                            </div>
                            <div className="flex-1 ml-4">
                              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={cn('h-full', getProbabilityColor(project.probability).bg)}
                                  style={{ width: `${project.contribution}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className={cn(
                        'max-w-xs',
                        theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                      )}
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-sm">{project.name}</div>
                        <div className="text-xs text-slate-600">负责人：{project.owner}</div>
                        <div className="text-xs text-slate-600">状态：{project.status}</div>
                        <div className="text-xs text-slate-600">成交概率：{getProbabilityColor(project.probability).label}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：支撑贡献结构 + 时间轴（4列） */}
          <div className="col-span-4 space-y-4">
            {/* 支撑贡献结构条 */}
            <div
              className={cn(
                'rounded-lg p-4',
                theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'
              )}
            >
              <h4 className="font-semibold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                支撑贡献结构
              </h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contributionData} layout="vertical">
                    <CartesianGrid strokeDasharray="2 2" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                    <XAxis
                      type="number"
                      stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={50}
                    />
                    <RechartsTooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {contributionData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.coreSupport.color }} />
                      <span className="text-slate-600">核心支撑</span>
                    </div>
                    <span className="font-semibold text-green-600">{data.coreSupport.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.mediumSupport.color }} />
                      <span className="text-slate-600">中期支撑</span>
                    </div>
                    <span className="font-semibold text-blue-600">{data.mediumSupport.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.reserveSupport.color }} />
                      <span className="text-slate-600">储备支撑</span>
                    </div>
                    <span className="font-semibold text-purple-600">{data.reserveSupport.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 未来生效时间线 */}
            <div
              className={cn(
                'rounded-lg p-4',
                theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'
              )}
            >
              <h4 className="font-semibold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                未来生效时间线
              </h4>
              <div className="relative">
                {/* 时间轴线 */}
                <div
                  className={cn(
                    'absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2',
                    theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                  )}
                />
                {/* 时间节点 */}
                <div className="flex justify-between relative">
                  {timelineData.map((item, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div
                          className="relative cursor-pointer group"
                          onMouseEnter={() => onTimelineHover?.(item.label)}
                        >
                          <div
                            className={cn(
                              'w-3 h-3 rounded-full border-2 bg-white',
                              index < 3 ? 'border-green-500' : index < 5 ? 'border-blue-500' : 'border-purple-500',
                              'group-hover:scale-125 transition-transform'
                            )}
                          />
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 whitespace-nowrap">
                            {item.label}
                          </div>
                          {index < timelineData.length - 1 && (
                            <div
                              className={cn(
                                'absolute top-1/2 -translate-y-1/2 w-full h-0.5',
                                index < 2 ? 'bg-green-500/50' : index < 4 ? 'bg-blue-500/50' : 'bg-purple-500/50'
                              )}
                            />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className={cn(
                          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                        )}
                      >
                        <div className="text-xs">{item.label}</div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
              {/* 时间线图例 */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-slate-600">核心支撑（0-30天）</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-slate-600">中期支撑（1-3月）</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-slate-600">储备支撑（3-6月）</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
