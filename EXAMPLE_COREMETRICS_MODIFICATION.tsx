// ============================================
// 实际操作示例 - 修改 CoreMetrics.tsx
// ============================================
// 这个文件展示如何把 CoreMetrics 组件从硬编码改为从API获取数据

// ============================================
// 第1步：查看当前的 CoreMetrics.tsx
// ============================================

/*
当前文件位置: src/components/dealer/CoreMetrics.tsx

当前代码（硬编码）大概是这样：
*/

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';

export default function CoreMetrics({ timeRange }: { timeRange: string }) {
  // ❌ 这里是硬编码的假数据，需要改成从API获取
  const metrics = {
    targetAmount: 10000,
    completedAmount: 6800,
    forecastAmount: 8500,
    yearOverYearGrowth: 12.5,
    completionRate: 68,
  };

  return (
    // ... 渲染UI，使用 metrics.targetAmount 等
  );
}

// ============================================
// 第2步：修改后的代码（从API获取）
// ============================================

/*
新的代码应该是这样：
*/

'use client';

import { useEffect, useState } from 'react';  // ✅ 新增：导入 hooks
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';

export default function CoreMetrics({ timeRange }: { timeRange: string }) {
  // ✅ 新增：定义状态变量
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 新增：useEffect 在组件加载时执行
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // ✅ 新增：从API获取数据
        // 注意：dealerId 可以改成您的经销商ID，比如 'DEALER001'
        const response = await fetch(
          `/api/dealer/data?dealerId=default&period=${timeRange}`
        );

        const result = await response.json();

        // ✅ 新增：保存数据到状态
        if (result.success && result.data.coreMetrics) {
          setMetrics(result.data.coreMetrics);
        } else {
          setError('暂无数据');
        }
      } catch (err) {
        setError('数据加载失败');
        console.error('Failed to fetch core metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);  // ✅ 新增：timeRange 变化时重新获取数据

  // ✅ 新增：显示加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyan-300/70">加载中...</div>
      </div>
    );
  }

  // ✅ 新增：显示错误状态
  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400">{error || '暂无数据'}</div>
      </div>
    );
  }

  // ✅ 这里使用真实的数据 metrics.targetAmount 等
  return (
    <div className="space-y-3">
      <div className="bg-slate-800/30 rounded-lg p-3 border border-white/10">
        <div className="text-xs text-cyan-300/70 mb-1">目标金额</div>
        <div className="text-2xl font-bold text-cyan-50">
          {metrics.targetAmount.toLocaleString()}万
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-lg p-3 border border-white/10">
        <div className="text-xs text-cyan-300/70 mb-1">已完成</div>
        <div className="text-2xl font-bold text-green-400">
          {metrics.completedAmount.toLocaleString()}万
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-lg p-3 border border-white/10">
        <div className="text-xs text-cyan-300/70 mb-1">预计完成</div>
        <div className="text-2xl font-bold text-cyan-400">
          {metrics.forecastAmount.toLocaleString()}万
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/30 rounded-lg p-2 border border-white/10">
          <div className="text-xs text-cyan-300/70">同比增长</div>
          <div className={cn(
            "text-lg font-bold",
            metrics.yearOverYearGrowth >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {metrics.yearOverYearGrowth >= 0 ? "+" : ""}{metrics.yearOverYearGrowth}%
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-lg p-2 border border-white/10">
          <div className="text-xs text-cyan-300/70">完成率</div>
          <div className={cn(
            "text-lg font-bold",
            metrics.completionRate >= 80 ? "text-green-400" :
            metrics.completionRate >= 60 ? "text-yellow-400" : "text-red-400"
          )}>
            {metrics.completionRate}%
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 第3步：如何修改实际文件
// ============================================

/*
步骤：
1. 打开文件 src/components/dealer/CoreMetrics.tsx
2. 添加 import { useEffect, useState } from 'react';
3. 添加状态变量定义
4. 添加 useEffect 函数
5. 添加加载和错误状态的显示
6. 修改 return 中的渲染逻辑（使用 metrics 而不是硬编码数据）
*/

// ============================================
// 其他组件的修改模式
// ============================================

/*
所有其他5个组件都按照相同的模式修改：

1. DealerFinancialMetrics.tsx
   - 使用 result.data.monthlySales

2. TrackAnalysisPanel.tsx
   - 使用 result.data.trackData

3. BusinessInsightsPanel.tsx
   - 使用 result.data.subcategoryData

4. ProjectFunnelPanel.tsx
   - 使用 result.data.projectFunnel

5. ProjectRiskPanel.tsx
   - 使用 result.data.projectRisk 和 result.data.criticalProjects
*/

// ============================================
// API返回的数据结构
// ============================================

/*
API: GET /api/dealer/data?dealerId=default&period=current

返回结构：
{
  "success": true,
  "data": {
    "coreMetrics": {
      "targetAmount": 10000,
      "completedAmount": 6800,
      "forecastAmount": 8500,
      "yearOverYearGrowth": 12.5,
      "completionRate": 68
    },
    "monthlySales": [
      { "year": 2024, "month": 1, "targetAmount": 800, "completedAmount": 600, ... },
      { "year": 2024, "month": 2, "targetAmount": 800, "completedAmount": 700, ... },
      ...
    ],
    "trackData": [
      { "trackName": "教育", "percentage": 35, "totalAmount": 3500, ... },
      ...
    ],
    "subcategoryData": [
      { "trackName": "教育", "subcategoryName": "幼教", "targetAmount": 2000, ... },
      ...
    ],
    "projectFunnel": [
      { "stage": "初报备", "projectCount": 250, "conversionRate": 100, ... },
      ...
    ],
    "projectRisk": [
      { "category": "高风险项目", "projectCount": 28, "percentage": 11.2, ... },
      ...
    ],
    "criticalProjects": [
      { "id": "P001", "projectName": "XX学校净化项目", "amount": 350, ... },
      ...
    ]
  }
}
*/

// ============================================
// 测试方法
// ============================================

/*
修改完组件后：

1. 保存文件

2. 等待热更新（如果开发环境）

3. 或手动重启：
   pm2 restart dealer-dashboard

4. 打开浏览器访问

5. 查看是否显示真实的数据库数据

如果显示"加载中..."一直不消失：
- 检查 .env 文件是否配置正确
- 检查数据库是否可以连接
- 浏览器F12查看网络请求是否成功

如果显示"暂无数据"：
- 数据库里没有数据
- 需要先执行SQL插入数据
*/

export {};  // 导出空对象，避免TypeScript报错
