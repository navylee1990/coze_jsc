'use client';

import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 超标项目数据
const overrunProjects: {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  threshold: number;
  overrun: number;
  amount: number;
  status: 'critical' | 'warning';
}[] = [
  {
    id: 'O001',
    name: '华东区-某大型企业项目',
    type: '折扣折让率',
    currentValue: 12.5,
    threshold: 10,
    overrun: 2.5,
    amount: 850,
    status: 'critical'
  },
  {
    id: 'O002',
    name: '华南区-某医院项目',
    type: '退机率',
    currentValue: 5.8,
    threshold: 4,
    overrun: 1.8,
    amount: 320,
    status: 'critical'
  },
  {
    id: 'O003',
    name: '华北区-某学校项目',
    type: '折扣折让率',
    currentValue: 11.2,
    threshold: 10,
    overrun: 1.2,
    amount: 560,
    status: 'warning'
  },
  {
    id: 'O004',
    name: '西南区-某办公楼项目',
    type: '退机率',
    currentValue: 5.0,
    threshold: 4,
    overrun: 1.0,
    amount: 280,
    status: 'warning'
  },
  {
    id: 'O005',
    name: '华东区-某政府项目',
    type: '折扣折让率',
    currentValue: 10.8,
    threshold: 10,
    overrun: 0.8,
    amount: 620,
    status: 'warning'
  },
];

// 获取状态颜色
const getStatusColor = (status: 'critical' | 'warning') => {
  return status === 'critical'
    ? 'text-red-400 border-red-500/40 bg-red-500/10'
    : 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10';
};

// 获取状态标签
const getStatusLabel = (status: 'critical' | 'warning') => {
  return status === 'critical' ? '严重超标' : '超标';
};

export default function SeriousOverrunProjects() {
  return (
    <Card className="backdrop-blur-xl border-2 border-red-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-red-500/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-red-50 font-bold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          严重超标项目
          <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
            {overrunProjects.length} 个项目
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {overrunProjects.map((project) => (
            <div
              key={project.id}
              className={cn(
                'p-3 rounded-lg border-2 transition-all duration-300 hover:scale-102',
                getStatusColor(project.status)
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-cyan-50 mb-1 truncate">
                    {project.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cyan-300/70">
                    <span>{project.type}</span>
                    <span className="text-cyan-500/40">•</span>
                    <span>项目金额: {project.amount}万</span>
                  </div>
                </div>
                <div className={cn(
                  'px-2 py-1 rounded text-xs font-bold ml-2 whitespace-nowrap',
                  getStatusColor(project.status)
                )}>
                  {getStatusLabel(project.status)}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-cyan-300/70">
                    当前值: <span className="font-bold text-cyan-50">{project.currentValue}%</span>
                  </span>
                  <span className="text-cyan-300/70">
                    阈值: <span className="font-bold text-cyan-50">{project.threshold}%</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-red-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-bold">
                    超标 {project.overrun}%
                  </span>
                </div>
              </div>
              {/* 进度条 */}
              <div className="mt-2">
                <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      project.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                    )}
                    style={{ width: `${(project.currentValue / project.threshold) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 统计信息 */}
        <div className="mt-4 pt-3 border-t border-red-500/20">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-red-500/10">
              <span className="text-red-400">严重超标项目</span>
              <span className="font-bold text-red-50">
                {overrunProjects.filter(p => p.status === 'critical').length} 个
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-yellow-500/10">
              <span className="text-yellow-400">一般超标项目</span>
              <span className="font-bold text-yellow-50">
                {overrunProjects.filter(p => p.status === 'warning').length} 个
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-500/10 col-span-2">
              <span className="text-cyan-300/70">总超标金额</span>
              <span className="font-bold text-cyan-50">
                {overrunProjects.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} 万
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
