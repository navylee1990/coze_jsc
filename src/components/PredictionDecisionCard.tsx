'use client';

import { Target, TrendingUp, TrendingDown, AlertTriangle, Zap, ChevronRight, ArrowUp, ArrowDown, CheckCircle, XCircle, AlertCircle, TrendingDown as TrendDown, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// 主题类型
type Theme = 'dark' | 'dashboard';

// 趋势类型
type TrendDirection = 'up' | 'down' | 'stable';

// 支撑因子数据类型
interface SupportFactor {
  name: string;
  amount: number;
  percentage: number;
  isNew?: boolean;
  timeLabel: string; // 时间标签：如"30天内生效"、"1-3月支撑"
  details?: string[];
}

// 风险因子数据类型
interface RiskFactor {
  source: string;
  amount: number;
  level: 'high' | 'medium' | 'low';
  owner?: string;
  timeLabel: string; // 时间标签：如"30天内爆发风险"、"1-3月下滑风险"
  details?: string;
}

// 行动建议数据类型
interface ActionItem {
  icon: 'fire' | 'warning' | 'lightbulb';
  text: string;
  link?: string;
  priority: 'high' | 'medium' | 'low';
  impact?: string; // 影响金额描述
}

// 未来趋势数据点
interface TrendDataPoint {
  month: string;
  target: number;
  forecast: number;
  forecastLower?: number; // 预测区间下限
  forecastUpper?: number; // 预测区间上限
}

// 核心预测决策卡片数据接口
interface PredictionDecisionCardData {
  target: number;
  forecast: number;
  completed: number;
  achievementRate: number;
  gap: number;
  trendDirection: TrendDirection;
  trendData: TrendDataPoint[]; // 未来趋势数据
  supportFactors: SupportFactor[];
  riskFactors: RiskFactor[];
  actionItems: ActionItem[];
}

// 默认数据
const defaultData: PredictionDecisionCardData = {
  target: 1500,
  forecast: 1350,
  completed: 800,
  achievementRate: 90,
  gap: 150,
  trendDirection: 'up',
  trendData: [
    { month: '本月', target: 1500, forecast: 1350, forecastLower: 1280, forecastUpper: 1420 },
    { month: '下月', target: 1500, forecast: 1420, forecastLower: 1350, forecastUpper: 1490 },
    { month: '1-3月', target: 4500, forecast: 4200, forecastLower: 4000, forecastUpper: 4400 },
    { month: '3-6月', target: 9000, forecast: 8500, forecastLower: 8100, forecastUpper: 8900 },
  ],
  supportFactors: [
    {
      name: '高质量商机池',
      amount: 580,
      percentage: 43,
      isNew: false,
      timeLabel: '30天内生效',
      details: ['北京协和医院 280万', '上海外国语学校 350万', '杭州阿里巴巴园区 380万']
    },
    {
      name: 'SOP健康度提升',
      amount: 270,
      percentage: 20,
      isNew: true,
      timeLabel: '1-3月支撑',
      details: ['整体SOP合规率提升至85%', '新增5个合规项目', '累计预测提升270万']
    },
    {
      name: '重点项目推进',
      amount: 210,
      percentage: 15.5,
      isNew: true,
      timeLabel: '1-3月支撑',
      details: ['南京鼓楼医院进入谈判阶段', '深圳四季酒店进入商务阶段', '累计提升预测210万']
    }
  ],
  riskFactors: [
    {
      source: '重点项目停滞',
      amount: -180,
      level: 'high',
      owner: '王强、赵敏',
      timeLabel: '30天内爆发风险',
      details: '广州某企业办公楼(405万)、西安某学校(84万)停滞超过30天'
    },
    {
      source: 'SOP不达标扣减',
      amount: -95,
      level: 'medium',
      owner: '陈明',
      timeLabel: '1-3月下滑风险',
      details: '陈明负责项目SOP合规率仅78%，4个项目被降权'
    },
    {
      source: '价格谈判风险',
      amount: -60,
      level: 'medium',
      owner: '李娜',
      timeLabel: '1-3月下滑风险',
      details: '上海项目价格敏感度高，存在降价风险'
    }
  ],
  actionItems: [
    {
      icon: 'fire',
      text: '优先推进项目A（预计影响 +260万）',
      link: '/gm/projects',
      priority: 'high',
      impact: '+260万'
    },
    {
      icon: 'warning',
      text: '跟进项目B已停滞45天（风险-120万）',
      link: '/gm/projects',
      priority: 'high',
      impact: '-120万'
    },
    {
      icon: 'lightbulb',
      text: '与客户C重新对齐商务条款（潜在+80万）',
      link: '/gm/projects',
      priority: 'medium',
      impact: '+80万'
    }
  ]
};

// 组件属性
interface PredictionDecisionCardProps {
  data?: Partial<PredictionDecisionCardData>;
  theme?: Theme;
  onActionClick?: (action: ActionItem) => void;
  onSupportFactorHover?: (factor: SupportFactor) => void;
  onRiskFactorHover?: (factor: RiskFactor) => void;
}

export default function PredictionDecisionCard({
  data: customData,
  theme = 'dark',
  onActionClick,
  onSupportFactorHover,
  onRiskFactorHover
}: PredictionDecisionCardProps) {
  // 合并默认数据和自定义数据
  const data = { ...defaultData, ...customData };

  // 计算状态
  const getStatus = () => {
    if (data.achievementRate >= 110) return 'success';
    if (data.achievementRate >= 90) return 'warning';
    return 'danger';
  };

  const status = getStatus();

  // 获取状态颜色
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          text: 'text-green-600',
          icon: <CheckCircle className="w-6 h-6" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-600',
          icon: <AlertCircle className="w-6 h-6" />
        };
      case 'danger':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-600',
          icon: <XCircle className="w-6 h-6" />
        };
    }
  };

  const statusColor = getStatusColor();

  // 获取趋势方向
  const getTrendDirection = () => {
    switch (data.trendDirection) {
      case 'up':
        return {
          text: '上升',
          icon: <ArrowUpRight className="w-4 h-4" />,
          color: 'text-green-600 bg-green-500/10 border-green-500/30'
        };
      case 'down':
        return {
          text: '下滑',
          icon: <ArrowDownRight className="w-4 h-4" />,
          color: 'text-red-600 bg-red-500/10 border-red-500/30'
        };
      default:
        return {
          text: '稳定',
          icon: <Minus className="w-4 h-4" />,
          color: 'text-slate-600 bg-slate-500/10 border-slate-500/30'
        };
    }
  };

  const trendDirection = getTrendDirection();

  // 计算预测完成警告
  const getForecastWarning = () => {
    if (data.achievementRate >= 80) {
      return { 
        show: true, 
        color: theme === 'dashboard' ? 'text-yellow-400' : 'text-yellow-600', 
        bgColor: theme === 'dashboard' ? 'bg-yellow-500/20' : 'bg-yellow-500/20' 
      };
    } else {
      return { 
        show: true, 
        color: theme === 'dashboard' ? 'text-red-400' : 'text-red-600', 
        bgColor: theme === 'dashboard' ? 'bg-red-500/20' : 'bg-red-500/20' 
      };
    }
  };

  // 计算缺口警告
  const getGapWarning = () => {
    if (data.gap > 0) {
      const gapRatio = (data.gap / data.target) * 100;
      if (gapRatio <= 20) {
        return { 
          show: true, 
          color: theme === 'dashboard' ? 'text-yellow-400' : 'text-yellow-600', 
          bgColor: theme === 'dashboard' ? 'bg-yellow-500/20' : 'bg-yellow-500/20' 
        };
      } else {
        return { 
          show: true, 
          color: theme === 'dashboard' ? 'text-red-400' : 'text-red-600', 
          bgColor: theme === 'dashboard' ? 'bg-red-500/20' : 'bg-red-500/20' 
        };
      }
    } else {
      return { show: false, color: '', bgColor: '' };
    }
  };

  const forecastWarning = getForecastWarning();
  const gapWarning = getGapWarning();

  // 计算支撑和风险总额
  const totalSupport = data.supportFactors.reduce((sum, f) => sum + f.amount, 0);
  const totalRisk = Math.abs(data.riskFactors.reduce((sum, f) => sum + f.amount, 0));

  // 迷你对冲图数据
  const hedgeChartData = [
    { name: '支撑', value: totalSupport, color: '#22c55e' },
    { name: '风险', value: totalRisk, color: '#ef4444' }
  ];

  // 获取风险等级颜色
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-500/10 border-red-500/30';
      case 'medium':
        return 'text-orange-600 bg-orange-500/10 border-orange-500/30';
      case 'low':
        return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/30';
    }
  };

  // 获取行动图标
  const getActionIcon = (icon: string) => {
    switch (icon) {
      case 'fire':
        return <Zap className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'lightbulb':
        return <Target className="w-4 h-4 text-blue-600" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  // 获取行动优先级边框颜色
  const getActionBorderColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-orange-500';
      case 'low':
        return 'border-l-4 border-l-yellow-500';
      default:
        return '';
    }
  };

  // 自定义迷你图表Tooltip
  const MiniChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={cn(
            'rounded-lg p-2 text-xs',
            theme === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200 shadow-lg'
          )}
        >
          <div className="font-semibold mb-1">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={cn('w-2 h-2 rounded-full', entry.dataKey === 'target' ? 'bg-slate-400' : 'bg-blue-500')}
              />
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
          'w-full rounded-xl border-2 transition-all duration-300',
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-700 hover:border-blue-500/50'
            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-2xl'
        )}
      >
        {/* 顶部标题栏 */}
        <div
          className={cn(
            'px-5 py-3 border-b flex items-center justify-between',
            theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
          )}
        >
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-slate-900">核心预测决策卡片</h3>
          </div>
          <div className="flex items-center gap-3">
            {/* 趋势方向标签 */}
            <Badge
              variant="outline"
              className={cn('text-xs px-3 py-1', trendDirection.color)}
            >
              {trendDirection.icon}
              趋势：{trendDirection.text}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'text-xs px-3 py-1',
                status === 'success' && 'bg-green-500/10 text-green-600 border-green-500/30',
                status === 'warning' && 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
                status === 'danger' && 'bg-red-500/10 text-red-600 border-red-500/30'
              )}
            >
              {status === 'success' ? '预计超额' : status === 'warning' ? '接近目标' : '存在风险'}
            </Badge>
          </div>
        </div>

        {/* 主内容区：四区布局 */}
        <div className="p-5 grid grid-cols-12 gap-4">
          {/* 左侧（20%）：汽车仪表盘展示 */}
          <div className="col-span-3">
            <div className="space-y-3">
              {/* 仪表盘1 - 目标 */}
              <div className="relative">
                <div
                  className={cn(
                    'rounded-xl border-2 p-3 transition-all duration-300',
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-600/50'
                      : 'bg-white border-slate-200'
                  )}
                  style={{
                    boxShadow: theme === 'dark'
                      ? '0 0 20px rgba(34, 211, 238, 0.2), inset 0 0 20px rgba(34, 211, 238, 0.05)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* 仪表盘圆形 */}
                    <div className="relative flex-shrink-0" style={{ width: '100px', height: '100px' }}>
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* 背景圆 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'}
                          strokeWidth="8"
                        />
                        {/* 刻度线 */}
                        {[...Array(12)].map((_, i) => {
                          const angle = (i * 30 - 90) * (Math.PI / 180)
                          const innerR = 35
                          const outerR = 42
                          const x1 = 50 + innerR * Math.cos(angle)
                          const y1 = 50 + innerR * Math.sin(angle)
                          const x2 = 50 + outerR * Math.cos(angle)
                          const y2 = 50 + outerR * Math.sin(angle)
                          return (
                            <line
                              key={i}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke={theme === 'dark' ? '#334155' : '#cbd5e1'}
                              strokeWidth="1"
                            />
                          )
                        })}
                        {/* 进度弧线 - 目标始终100% */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray="264"
                          strokeDashoffset="0"
                          style={{
                            filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.6))'
                          }}
                        />
                        {/* 指针 */}
                        <g transform={`translate(50, 50)`}>
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="-35"
                            stroke="#f97316"
                            strokeWidth="2"
                            style={{
                              transform: `rotate(135deg)`,
                              transformOrigin: '0 0',
                              filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.8))'
                            }}
                          />
                          <circle cx="0" cy="0" r="4" fill="#22d3ee" />
                        </g>
                      </svg>
                      {/* 中心数值 */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-cyan-400" style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.8)' }}>
                          100%
                        </span>
                      </div>
                    </div>
                    {/* 右侧数值 */}
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">目标</div>
                      <div className="text-2xl font-bold text-orange-400" style={{ textShadow: '0 0 8px rgba(251, 146, 60, 0.6)' }}>
                        {data.target.toLocaleString()}
                        <span className="text-sm text-slate-500 ml-1">万</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 仪表盘2 - 预测完成 */}
              <div className="relative">
                {/* 警告角标 */}
                {forecastWarning.show && (
                  <div className={`absolute -top-2 -right-2 z-10 ${forecastWarning.bgColor} rounded-full p-1 animate-pulse`}>
                    <AlertTriangle className={`w-5 h-5 ${forecastWarning.color}`} />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-xl border-2 p-3 transition-all duration-300',
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-cyan-500/40'
                      : 'bg-white border-cyan-200'
                  )}
                  style={{
                    boxShadow: theme === 'dark'
                      ? '0 0 25px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.08)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* 仪表盘圆形 */}
                    <div className="relative flex-shrink-0" style={{ width: '100px', height: '100px' }}>
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* 背景圆 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'}
                          strokeWidth="8"
                        />
                        {/* 刻度线 */}
                        {[...Array(12)].map((_, i) => {
                          const angle = (i * 30 - 90) * (Math.PI / 180)
                          const innerR = 35
                          const outerR = 42
                          const x1 = 50 + innerR * Math.cos(angle)
                          const y1 = 50 + innerR * Math.sin(angle)
                          const x2 = 50 + outerR * Math.cos(angle)
                          const y2 = 50 + outerR * Math.sin(angle)
                          return (
                            <line
                              key={i}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke={theme === 'dark' ? '#334155' : '#cbd5e1'}
                              strokeWidth="1"
                            />
                          )
                        })}
                        {/* 进度弧线 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray="264"
                          strokeDashoffset={264 - (264 * Math.min(data.achievementRate, 100) / 100)}
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))',
                            transition: 'stroke-dashoffset 0.5s ease-out'
                          }}
                        />
                        {/* 指针 */}
                        <g transform={`translate(50, 50)`}>
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="-35"
                            stroke="#22d3ee"
                            strokeWidth="3"
                            style={{
                              transform: `rotate(${(Math.min(data.achievementRate, 100) / 100) * 180 - 90}deg)`,
                              transformOrigin: '0 0',
                              filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 1))'
                            }}
                          />
                          <circle cx="0" cy="0" r="5" fill="#22d3ee" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.8))' }} />
                        </g>
                      </svg>
                      {/* 中心数值 */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={cn(
                          'text-2xl font-bold',
                          data.achievementRate >= 90 ? 'text-green-400' : data.achievementRate >= 70 ? 'text-yellow-400' : 'text-red-400'
                        )} style={{ textShadow: `0 0 10px ${data.achievementRate >= 90 ? 'rgba(74, 222, 128, 0.8)' : data.achievementRate >= 70 ? 'rgba(250, 204, 21, 0.8)' : 'rgba(248, 113, 113, 0.8)'}` }}>
                          {data.achievementRate}%
                        </span>
                      </div>
                    </div>
                    {/* 右侧数值 */}
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">预测完成</div>
                      <div className={cn(
                        'text-2xl font-bold',
                        data.forecast >= data.target ? 'text-green-400' : 'text-yellow-400'
                      )} style={{ textShadow: data.forecast >= data.target ? '0 0 8px rgba(74, 222, 128, 0.6)' : '0 0 8px rgba(250, 204, 21, 0.6)' }}>
                        {data.forecast.toLocaleString()}
                        <span className="text-sm text-slate-500 ml-1">万</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 仪表盘3 - 缺口 */}
              <div className="relative">
                {/* 警告角标 */}
                {gapWarning.show && (
                  <div className={`absolute -top-2 -right-2 z-10 ${gapWarning.bgColor} rounded-full p-1 animate-pulse`}>
                    <AlertTriangle className={`w-5 h-5 ${gapWarning.color}`} />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-xl border-2 p-3 transition-all duration-300',
                    data.gap <= 0
                      ? theme === 'dark'
                        ? 'bg-gradient-to-br from-green-900/20 to-slate-900/90 border-green-500/40'
                        : 'bg-white border-green-200'
                      : theme === 'dark'
                        ? 'bg-gradient-to-br from-red-900/20 to-slate-900/90 border-red-500/40'
                        : 'bg-white border-red-200'
                  )}
                  style={{
                    boxShadow: data.gap <= 0
                      ? theme === 'dark'
                        ? '0 0 25px rgba(74, 222, 128, 0.3), inset 0 0 20px rgba(74, 222, 128, 0.08)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      : theme === 'dark'
                        ? '0 0 25px rgba(248, 113, 113, 0.3), inset 0 0 20px rgba(248, 113, 113, 0.08)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* 仪表盘圆形 */}
                    <div className="relative flex-shrink-0" style={{ width: '100px', height: '100px' }}>
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* 背景圆 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'}
                          strokeWidth="8"
                        />
                        {/* 刻度线 */}
                        {[...Array(12)].map((_, i) => {
                          const angle = (i * 30 - 90) * (Math.PI / 180)
                          const innerR = 35
                          const outerR = 42
                          const x1 = 50 + innerR * Math.cos(angle)
                          const y1 = 50 + innerR * Math.sin(angle)
                          const x2 = 50 + outerR * Math.cos(angle)
                          const y2 = 50 + outerR * Math.sin(angle)
                          return (
                            <line
                              key={i}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke={theme === 'dark' ? '#334155' : '#cbd5e1'}
                              strokeWidth="1"
                            />
                          )
                        })}
                        {/* 进度弧线 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke={data.gap <= 0 ? '#4ade80' : '#f87171'}
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray="264"
                          strokeDashoffset={data.gap <= 0 ? '0' : '264'}
                          style={{
                            filter: data.gap <= 0 ? 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.8))' : 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.8))',
                            transition: 'stroke-dashoffset 0.5s ease-out'
                          }}
                        />
                        {/* 指针 */}
                        <g transform={`translate(50, 50)`}>
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="-35"
                            stroke={data.gap <= 0 ? '#4ade80' : '#f87171'}
                            strokeWidth="3"
                            style={{
                              transform: data.gap <= 0 ? `rotate(135deg)` : `rotate(-135deg)`,
                              transformOrigin: '0 0',
                              filter: data.gap <= 0 ? 'drop-shadow(0 0 6px rgba(74, 222, 128, 1))' : 'drop-shadow(0 0 6px rgba(248, 113, 113, 1))'
                            }}
                          />
                          <circle
                            cx="0"
                            cy="0"
                            r="5"
                            fill={data.gap <= 0 ? '#4ade80' : '#f87171'}
                            style={{ filter: data.gap <= 0 ? 'drop-shadow(0 0 4px rgba(74, 222, 128, 0.8))' : 'drop-shadow(0 0 4px rgba(248, 113, 113, 0.8))' }}
                          />
                        </g>
                      </svg>
                      {/* 中心数值 */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {data.gap <= 0 ? (
                          <span className="text-lg font-bold text-green-400 flex items-center gap-1" style={{ textShadow: '0 0 10px rgba(74, 222, 128, 0.8)' }}>
                            <ArrowUp className="w-4 h-4" />
                            超额
                          </span>
                        ) : (
                          <span className="text-lg font-bold text-red-400 flex items-center gap-1" style={{ textShadow: '0 0 10px rgba(248, 113, 113, 0.8)' }}>
                            <ArrowDown className="w-4 h-4" />
                            缺口
                          </span>
                        )}
                      </div>
                    </div>
                    {/* 右侧数值 */}
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">{data.gap <= 0 ? '超额' : '缺口'}</div>
                      <div className={cn(
                        'text-2xl font-bold',
                        data.gap <= 0 ? 'text-green-400' : 'text-red-400'
                      )} style={{ textShadow: data.gap <= 0 ? '0 0 8px rgba(74, 222, 128, 0.6)' : '0 0 8px rgba(248, 113, 113, 0.6)' }}>
                        {data.gap <= 0 ? '+' : ''}{data.gap.toLocaleString()}
                        <span className="text-sm text-slate-500 ml-1">万</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 中间（35%）：支撑性驱动因子 */}
          <div className="col-span-4">
            <div className={cn('h-full rounded-lg p-3', theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50')}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  支撑因子
                </h4>
                <Badge variant="outline" className="text-xs text-slate-600">
                  Top 3
                </Badge>
              </div>

              <div className="space-y-2">
                {data.supportFactors.map((factor, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className="cursor-pointer hover:bg-white/50 rounded transition-colors p-2 border border-slate-200/50"
                        onMouseEnter={() => onSupportFactorHover?.(factor)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            {factor.isNew && (
                              <Badge className="h-4 px-1.5 text-[10px] bg-green-500 text-white flex-shrink-0">
                                新增
                              </Badge>
                            )}
                            <span className="text-xs font-medium text-slate-900 truncate">{factor.name}</span>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <span className="text-xs font-bold text-green-600">
                              +{factor.amount.toLocaleString()}万
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">{factor.timeLabel}</span>
                          <span className="text-[10px] text-slate-600">占比 {factor.percentage}%</span>
                        </div>
                        {/* 进度条 */}
                        <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                          <div
                            className={cn(
                              'h-full transition-all',
                              factor.isNew ? 'bg-green-500' : 'bg-blue-500'
                            )}
                            style={{ width: `${factor.percentage}%` }}
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    {factor.details && (
                      <TooltipContent
                        side="right"
                        className={cn(
                          'max-w-xs',
                          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                        )}
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-sm mb-2">项目明细</div>
                          {factor.details.map((detail, idx) => (
                            <div key={idx} className="text-xs text-slate-600">{detail}</div>
                          ))}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>

              {/* 迷你对冲图 - 支撑vs风险 */}
              <div className="mt-3 pt-3 border-t border-slate-200/50">
                <div className="flex items-center justify-between">
                  <div className="w-20 h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={hedgeChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={35}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {hedgeChartData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">支撑总额</span>
                      <span className="font-bold text-green-600">{totalSupport.toLocaleString()}万</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">风险总额</span>
                      <span className="font-bold text-red-600">-{totalRisk.toLocaleString()}万</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 中右（30%）：风险因子 */}
          <div className="col-span-3">
            <div className={cn('h-full rounded-lg p-3', theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50')}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                  <TrendDown className="w-4 h-4 text-red-600" />
                  风险因子
                </h4>
                <Badge variant="outline" className="text-xs text-slate-600">
                  Top 3
                </Badge>
              </div>

              <div className="space-y-2">
                {data.riskFactors.map((risk, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className="cursor-pointer hover:bg-white/50 rounded transition-colors p-2 border border-slate-200/50"
                        onMouseEnter={() => onRiskFactorHover?.(risk)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-900 flex-1 min-w-0 pr-2 truncate">
                            {risk.source}
                          </span>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-bold text-red-600">
                              {risk.amount.toLocaleString()}万
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={cn('text-[10px] px-1.5 py-0.5', getRiskLevelColor(risk.level))}
                          >
                            {risk.level === 'high' ? '高风险' : risk.level === 'medium' ? '中风险' : '低风险'}
                          </Badge>
                          <span className="text-[10px] text-slate-500 truncate ml-1">{risk.timeLabel}</span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    {risk.details && (
                      <TooltipContent
                        side="left"
                        className={cn(
                          'max-w-xs',
                          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                        )}
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-sm mb-2">风险详情</div>
                          <div className="text-xs text-slate-600">{risk.details}</div>
                          {risk.owner && (
                            <div className="text-xs text-slate-500 mt-2">责任人：{risk.owner}</div>
                          )}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧（15%）：管理动作建议 */}
          <div className="col-span-2">
            <div
              className={cn(
                'h-full rounded-lg p-3 border-2',
                theme === 'dark' ? 'bg-gradient-to-br from-orange-600/10 to-red-600/10 border-orange-500/30' : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-orange-600 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  ⚡ 行动建议
                </h4>
              </div>

              <div className="space-y-2">
                {data.actionItems.map((action, index) => (
                  <div
                    key={index}
                    className={cn(
                      'cursor-pointer rounded p-2 transition-all hover:shadow-md',
                      getActionBorderColor(action.priority),
                      theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-white hover:bg-orange-50',
                      action.link && 'hover:translate-x-0.5'
                    )}
                    onClick={() => {
                      if (action.link && onActionClick) {
                        onActionClick(action);
                      }
                    }}
                  >
                    <div className="flex items-start gap-1.5">
                      <div className="flex-shrink-0 mt-0.5">
                        {getActionIcon(action.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed mb-1">
                          {action.text}
                        </p>
                        {action.impact && (
                          <div className="text-[10px] text-slate-500">
                            预计影响：{action.impact}
                          </div>
                        )}
                      </div>
                    </div>
                    {action.link && (
                      <div className="flex items-center justify-end mt-1">
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
