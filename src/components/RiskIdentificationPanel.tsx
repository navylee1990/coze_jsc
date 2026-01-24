'use client';

import { AlertTriangle, Clock, TrendingDown, FileWarning, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

// 风险类型
type RiskType = 'delayed' | 'noProgress' | 'specialPrice' | 'reserveInsufficient' | 'scaleInsufficient';

// 风险严重程度
type SeverityLevel = 'high' | 'medium' | 'low';

// 风险项接口
interface RiskItem {
  type: RiskType;
  title: string;
  count: number;
  severity: SeverityLevel;
  description: string;
  details?: string[];
}

// 组件属性
interface RiskIdentificationPanelProps {
  data?: RiskItem[];
  theme?: 'dashboard' | 'light' | 'dark';
}

// 默认风险数据
const defaultRiskData: RiskItem[] = [
  {
    type: 'delayed',
    title: '延迟项目',
    count: 8,
    severity: 'high',
    description: '项目进度滞后于计划',
    details: [
      '北京协和医院项目延迟15天',
      '上海阿里巴巴园区项目延迟20天',
      '广州某企业办公楼项目延迟32天'
    ]
  },
  {
    type: 'noProgress',
    title: '长期无进展',
    count: 5,
    severity: 'high',
    description: '项目超过30天无进展',
    details: [
      '西安某学校项目停滞45天',
      '成都某医院项目停滞38天',
      '武汉某企业项目停滞35天'
    ]
  },
  {
    type: 'specialPrice',
    title: '特价申请异常',
    count: 3,
    severity: 'medium',
    description: '特价申请超期或异常',
    details: [
      '深圳某酒店特价申请待审核15天',
      '南京某医院特价申请待审批10天'
    ]
  },
  {
    type: 'reserveInsufficient',
    title: '区域储备不足',
    count: 4,
    severity: 'high',
    description: '多区域3-6月储备不足',
    details: [
      '西南区域储备缺口300万',
      '华北区域储备缺口250万',
      '一区储备缺口200万'
    ]
  },
  {
    type: 'scaleInsufficient',
    title: '签约规模不足',
    count: 3,
    severity: 'medium',
    description: '区域签约规模不足以支撑年度目标',
    details: [
      '西南区域签约规模仅达目标40%',
      '华北区域签约规模仅达目标55%',
      '华南区域签约规模仅达目标65%'
    ]
  }
];

export default function RiskIdentificationPanel({
  data = defaultRiskData,
  theme = 'dashboard'
}: RiskIdentificationPanelProps) {
  // 获取风险图标
  const getRiskIcon = (type: RiskType) => {
    switch (type) {
      case 'delayed':
        return <Clock className="w-4 h-4" />;
      case 'noProgress':
        return <AlertTriangle className="w-4 h-4" />;
      case 'specialPrice':
        return <FileWarning className="w-4 h-4" />;
      case 'reserveInsufficient':
        return <TrendingDown className="w-4 h-4" />;
      case 'scaleInsufficient':
        return <Target className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // 获取严重程度样式
  const getSeverityStyles = (severity: SeverityLevel) => {
    switch (severity) {
      case 'high':
        return theme === 'dashboard'
          ? 'bg-red-500/30 text-red-300 border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
          : 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return theme === 'dashboard'
          ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50'
          : 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return theme === 'dashboard'
          ? 'bg-green-500/30 text-green-300 border-green-500/50'
          : 'bg-green-100 text-green-700 border-green-300';
    }
  };

  // 获取严重程度标签
  const getSeverityLabel = (severity: SeverityLevel) => {
    switch (severity) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
    }
  };

  // 计算高风险数量
  const highRiskCount = data.filter(item => item.severity === 'high').length;

  return (
    <div
      className={cn(
        'w-full rounded-lg overflow-hidden transition-all duration-300',
        theme === 'dashboard'
          ? 'bg-slate-900/80 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
          : theme === 'dark'
          ? 'bg-slate-800 border border-slate-700'
          : 'bg-white border border-slate-200'
      )}
    >
      {/* 标题栏 */}
      <div
        className={cn(
          'px-4 py-3 border-b flex items-center justify-between',
          theme === 'dashboard' ? 'border-cyan-500/30 bg-slate-900/50' : 'border-slate-200 bg-white'
        )}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className={cn('w-5 h-5', theme === 'dashboard' ? 'text-cyan-400' : 'text-slate-700')} />
          <h3 className={cn('font-bold text-lg', theme === 'dashboard' ? 'text-cyan-200' : 'text-slate-900')}>
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

      {/* 风险列表 */}
      <div className="p-3 space-y-2">
        {data.map((risk, index) => (
          <div
            key={index}
            className={cn(
              'relative rounded-lg p-3 border transition-all duration-200',
              theme === 'dashboard'
                ? risk.severity === 'high'
                  ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : risk.severity === 'medium'
                  ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                  : 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                : risk.severity === 'high'
                ? 'bg-red-50 border-red-200 hover:bg-red-100'
                : risk.severity === 'medium'
                ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                : 'bg-green-50 border-green-200 hover:bg-green-100'
            )}
          >
            <div className="flex items-start gap-3">
              {/* 图标 */}
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                  theme === 'dashboard'
                    ? risk.severity === 'high'
                      ? 'bg-red-500/20'
                      : risk.severity === 'medium'
                      ? 'bg-yellow-500/20'
                      : 'bg-green-500/20'
                    : risk.severity === 'high'
                    ? 'bg-red-100'
                    : risk.severity === 'medium'
                    ? 'bg-yellow-100'
                    : 'bg-green-100'
                )}
              >
                <span
                  className={cn(
                    risk.severity === 'high'
                      ? 'text-red-400'
                      : risk.severity === 'medium'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  )}
                >
                  {getRiskIcon(risk.type)}
                </span>
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={cn(
                      'text-sm font-semibold',
                      theme === 'dashboard'
                        ? risk.severity === 'high'
                          ? 'text-red-300'
                          : risk.severity === 'medium'
                          ? 'text-yellow-300'
                          : 'text-green-300'
                        : 'text-slate-900'
                    )}
                  >
                    {risk.title}
                  </h4>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      getSeverityStyles(risk.severity)
                    )}
                  >
                    {risk.count}
                  </span>
                </div>
                <p
                  className={cn('text-xs', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}
                >
                  {risk.description}
                </p>
                {risk.details && risk.details.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {risk.details.slice(0, 2).map((detail, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'text-xs flex items-center gap-1',
                          theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500'
                        )}
                      >
                        <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                        {detail}
                      </div>
                    ))}
                    {risk.details.length > 2 && (
                      <div
                        className={cn('text-xs', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}
                      >
                        还有 {risk.details.length - 2} 项...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 严重程度标签 */}
              <div
                className={cn(
                  'flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase',
                  risk.severity === 'high'
                    ? 'bg-red-500/20 text-red-400'
                    : risk.severity === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-green-500/20 text-green-500'
                )}
              >
                {getSeverityLabel(risk.severity)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部统计 */}
      <div
        className={cn(
          'px-4 py-2 border-t text-xs',
          theme === 'dashboard' ? 'border-cyan-500/30 bg-slate-900/50' : 'border-slate-200 bg-gray-50'
        )}
      >
        <div className="flex items-center justify-between">
          <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>
            共识别 {data.length} 类风险
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>
                高风险: {data.filter(r => r.severity === 'high').length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>
                中风险: {data.filter(r => r.severity === 'medium').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
