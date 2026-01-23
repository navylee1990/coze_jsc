'use client';

import { Target, TrendingUp, TrendingDown, AlertTriangle, Zap, ChevronRight, ArrowUp, ArrowDown, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// 主题类型
type Theme = 'dark' | 'light';

// 支撑因子数据类型
interface SupportFactor {
  name: string;
  amount: number;
  percentage: number;
  isNew?: boolean;
  details?: string[];
}

// 风险因子数据类型
interface RiskFactor {
  source: string;
  amount: number;
  level: 'high' | 'medium' | 'low';
  owner?: string;
  details?: string;
}

// 行动建议数据类型
interface ActionItem {
  icon: 'fire' | 'warning' | 'lightbulb';
  text: string;
  link?: string;
  priority: 'high' | 'medium' | 'low';
}

// 核心预测决策卡片数据接口
interface PredictionDecisionCardData {
  target: number;
  forecast: number;
  completed: number;
  achievementRate: number;
  gap: number;
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
  supportFactors: [
    {
      name: '高质量商机池',
      amount: 580,
      percentage: 43,
      isNew: false,
      details: ['北京协和医院 280万', '上海外国语学校 350万', '杭州阿里巴巴园区 380万']
    },
    {
      name: 'SOP健康度提升',
      amount: 270,
      percentage: 20,
      isNew: true,
      details: ['整体SOP合规率提升至85%', '新增5个合规项目', '累计预测提升270万']
    },
    {
      name: '重点项目推进',
      amount: 210,
      percentage: 15.5,
      isNew: true,
      details: ['南京鼓楼医院进入谈判阶段', '深圳四季酒店进入商务阶段', '累计提升预测210万']
    }
  ],
  riskFactors: [
    {
      source: '重点项目停滞',
      amount: -180,
      level: 'high',
      owner: '王强、赵敏',
      details: '广州某企业办公楼(405万)、西安某学校(84万)停滞超过30天'
    },
    {
      source: 'SOP不达标扣减',
      amount: -95,
      level: 'medium',
      owner: '陈明',
      details: '陈明负责项目SOP合规率仅78%，4个项目被降权'
    },
    {
      source: '价格谈判风险',
      amount: -60,
      level: 'medium',
      owner: '李娜',
      details: '上海项目价格敏感度高，存在降价风险'
    }
  ],
  actionItems: [
    {
      icon: 'fire',
      text: '本月需推进 A、B 两个卡点项目（价值 489 万）',
      link: '/gm/projects',
      priority: 'high'
    },
    {
      icon: 'warning',
      text: '销售张三 SOP 未更新 14 天，影响预测 60 万',
      link: '/gm/personnel',
      priority: 'high'
    },
    {
      icon: 'lightbulb',
      text: '复盘重点项目 C 的价格谈判，可提升 120 万',
      link: '/gm/projects',
      priority: 'medium'
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
  theme = 'light',
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

        {/* 主内容区：四区布局 */}
        <div className="p-5 grid grid-cols-12 gap-4">
          {/* 左侧（20%）：目标达成状态 - 红绿灯 + 指标 */}
          <div className="col-span-3">
            <div className={cn('rounded-lg p-4', statusColor.bg, statusColor.border, 'border-2')}>
              {/* 状态图标 */}
              <div className={cn('flex items-center justify-center mb-2', statusColor.text)}>
                {statusColor.icon}
              </div>

              {/* 预测金额 - 超大数字 */}
              <div className="text-center">
                <div className={cn('text-4xl font-bold mb-1', data.forecast >= data.target ? 'text-green-600' : 'text-red-600')}>
                  {data.forecast.toLocaleString()}
                  <span className="text-base text-slate-600 ml-1">万</span>
                </div>

                {/* 目标完成度 */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm text-slate-600">完成度</span>
                  <Badge className={cn('text-sm px-2 py-0.5', statusColor.text, statusColor.bg, statusColor.border)}>
                    {data.achievementRate}%
                  </Badge>
                </div>

                {/* 缺口或超额 */}
                <div className="text-xs text-slate-600">
                  {data.gap < 0 ? (
                    <span className="text-green-600 font-semibold">
                      <ArrowUp className="w-3 h-3 inline mr-0.5" />
                      超额 {Math.abs(data.gap).toLocaleString()}万
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      <ArrowDown className="w-3 h-3 inline mr-0.5" />
                      缺口 {data.gap.toLocaleString()}万
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 小提示 */}
            <div className="mt-2 text-center">
              <p className={cn('text-xs', theme === 'dark' ? 'text-slate-500' : 'text-slate-500')}>
                目标 {data.target.toLocaleString()}万
              </p>
            </div>
          </div>

          {/* 中间（35%）：支撑性驱动因子 - 正向贡献 Top3 */}
          <div className="col-span-4">
            <div className={cn('h-full rounded-lg p-3', theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50')}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  支撑因子
                </h4>
                <Badge variant="outline" className="text-xs text-slate-600">
                  Top 3
                </Badge>
              </div>

              <div className="space-y-2.5">
                {data.supportFactors.map((factor, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className="cursor-pointer hover:bg-white/50 rounded transition-colors"
                        onMouseEnter={() => onSupportFactorHover?.(factor)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            {factor.isNew && (
                              <Badge className="h-4 px-1.5 text-[10px] bg-green-500 text-white">
                                新增
                              </Badge>
                            )}
                            <span className="text-xs font-medium text-slate-900">{factor.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-blue-600">
                              {factor.amount >= 0 ? '+' : ''}{factor.amount.toLocaleString()}万
                            </span>
                          </div>
                        </div>
                        <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full transition-all',
                              factor.isNew ? 'bg-green-500' : 'bg-blue-500'
                            )}
                            style={{ width: `${factor.percentage}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          贡献占比 {factor.percentage}%
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
            </div>
          </div>

          {/* 中间右（30%）：风险因子 - 负向 Top3 */}
          <div className="col-span-3">
            <div className={cn('h-full rounded-lg p-3', theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50')}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  风险因子
                </h4>
                <Badge variant="outline" className="text-xs text-slate-600">
                  Top 3
                </Badge>
              </div>

              <div className="space-y-2.5">
                {data.riskFactors.map((risk, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className="cursor-pointer hover:bg-white/50 rounded transition-colors p-2 border border-slate-200/50"
                        onMouseEnter={() => onRiskFactorHover?.(risk)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-900 flex-1 pr-2 truncate">
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
                          {risk.owner && (
                            <span className="text-[10px] text-slate-500 truncate ml-2">
                              {risk.owner}
                            </span>
                          )}
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

          {/* 右侧（15%）：管理动作建议 - 真正驱动决策 */}
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
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {action.text}
                      </p>
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
