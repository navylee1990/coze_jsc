# 数据源替换完全指南 - 一看就懂版

## 🎯 核心概念

### 您需要做的事情只有2步：

1. **把真实数据存入数据库** - 使用SQL（在数据库工具里执行）
2. **修改前端组件** - 让组件从API获取数据（不是在代码里写SQL）

---

## 📁 第1部分：哪些文件需要修改？

只需要修改**6个前端组件文件**，它们都在 `src/components/dealer/` 目录下：

```
src/components/dealer/
├── CoreMetrics.tsx              ✅ 需要修改（核心指标）
├── DealerFinancialMetrics.tsx   ✅ 需要修改（月度销售趋势）
├── TrackAnalysisPanel.tsx       ✅ 需要修改（赛道定位分析）
├── BusinessInsightsPanel.tsx    ✅ 需要修改（盈利能力总览）
├── ProjectFunnelPanel.tsx       ✅ 需要修改（项目漏斗分析）
└── ProjectRiskPanel.tsx         ✅ 需要修改（项目风险分析）
```

**不需要修改的文件**：
- ✅ `src/storage/database/dealerManager.ts` - 数据库操作层（已经写好了）
- ✅ `src/app/api/dealer/data/route.ts` - API接口（已经写好了）
- ✅ `.env` 文件 - 只需要配置数据库连接地址

---

## 💡 第2部分：如何替换数据源？

### 概念说明

**现在的状态**：
- 组件里有硬编码的示例数据（假的）
- 不连接数据库

**要改成**：
- 组件从API获取数据（真实的）
- API从数据库读取数据

### 具体修改步骤（以 CoreMetrics.tsx 为例）

#### ❌ 修改前的代码（硬编码数据）：

```typescript
'use client';

export default function CoreMetrics() {
  // 这里是硬编码的假数据
  const metrics = {
    targetAmount: 10000,
    completedAmount: 6800,
    forecastAmount: 8500,
    yearOverYearGrowth: 12.5,
    completionRate: 68,
  };

  return (
    <div>
      <div>目标金额: {metrics.targetAmount}万</div>
      <div>已完成: {metrics.completedAmount}万</div>
    </div>
  );
}
```

#### ✅ 修改后的代码（从API获取数据）：

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function CoreMetrics({ timeRange }: { timeRange: string }) {
  // 1. 定义状态变量
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. useEffect 在组件加载时执行
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 3. 从API获取数据
        const response = await fetch(
          `/api/dealer/data?dealerId=default&period=${timeRange}`
        );
        const result = await response.json();

        // 4. 保存数据到状态
        if (result.success && result.data.coreMetrics) {
          setMetrics(result.data.coreMetrics);
        } else {
          setError('暂无数据');
        }
      } catch (err) {
        setError('数据加载失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  // 5. 显示加载状态
  if (loading) {
    return <div className="text-cyan-300/70">加载中...</div>;
  }

  // 6. 显示错误状态
  if (error || !metrics) {
    return <div className="text-red-400">{error || '暂无数据'}</div>;
  }

  // 7. 使用真实数据渲染
  return (
    <div>
      <div>目标金额: {metrics.targetAmount}万</div>
      <div>已完成: {metrics.completedAmount}万</div>
      <div>预计完成: {metrics.forecastAmount}万</div>
    </div>
  );
}
```

### 修改模式总结

所有6个组件都按照这个模式修改：

1. **导入**：`import { useEffect, useState } from 'react';`
2. **定义状态**：`const [data, setData] = useState(null);`
3. **useEffect**：在组件加载时从API获取数据
4. **显示加载/错误状态**
5. **使用数据渲染**

---

## 🗄️ 第3部分：SQL写在哪里？

### 重要概念

**SQL不写在代码文件里！**

SQL有两种使用方式：

### 方式1：在数据库管理工具里执行（用于初始化数据）

**步骤：**

1. 打开数据库管理工具（如 pgAdmin、DBeaver、Navicat）
2. 连接到数据库
3. 新建查询窗口
4. 粘贴SQL代码
5. 点击执行

**或者使用命令行：**

```bash
# 在服务器终端执行
psql $PGDATABASE_URL

# 进入数据库后，粘贴SQL
```

### 方式2：保存为 .sql 文件，然后批量执行

**步骤：**

1. 创建文件 `init-my-data.sql`：

```sql
INSERT INTO dealer_core_metrics (
  dealer_id,
  period,
  target_amount,
  completed_amount,
  forecast_amount,
  year_over_year_growth,
  completion_rate
) VALUES (
  'MY_DEALER',
  'current',
  10000,
  6800,
  8500,
  12.5,
  68.0
);
```

2. 执行SQL文件：

```bash
psql $PGDATABASE_URL -f init-my-data.sql
```

### 示例：批量插入数据

创建文件 `init-all-data.sql`：

```sql
-- 1. 插入核心指标
INSERT INTO dealer_core_metrics (...)
VALUES (...);

-- 2. 插入月度销售数据（12个月）
INSERT INTO dealer_monthly_sales (...)
VALUES (...), (...), (...), ...;

-- 3. 插入赛道数据
INSERT INTO dealer_track_data (...)
VALUES (...), (...), ...;

-- 4. 插入行业细分数据
INSERT INTO dealer_subcategory_data (...)
VALUES (...), (...), ...;

-- 5. 插入项目漏斗数据
INSERT INTO dealer_project_funnel (...)
VALUES (...), (...), ...;

-- 6. 插入项目风险数据
INSERT INTO dealer_project_risk (...)
VALUES (...), (...), ...;

-- 7. 插入关键项目预警
INSERT INTO dealer_critical_project (...)
VALUES (...), (...), ...;
```

执行：
```bash
psql $PGDATABASE_URL -f init-all-data.sql
```

---

## 🔄 完整工作流程

### 步骤1：准备真实数据

**在数据库管理工具或命令行执行SQL：**

```sql
-- 插入您的真实数据
INSERT INTO dealer_core_metrics (dealer_id, period, target_amount, completed_amount, forecast_amount, completion_rate)
VALUES ('DEALER001', 'current', 1000000, 680000, 850000, 68.0);

INSERT INTO dealer_monthly_sales (dealer_id, year, month, target_amount, completed_amount, period)
VALUES
  ('DEALER001', 2024, 1, 80000, 60000, 'current'),
  ('DEALER001', 2024, 2, 80000, 70000, 'current'),
  ('DEALER001', 2024, 3, 90000, 80000, 'current');
```

### 步骤2：验证数据

```bash
# 查询数据
psql $PGDATABASE_URL -c "SELECT * FROM dealer_core_metrics WHERE dealer_id = 'DEALER001';"
```

### 步骤3：修改前端组件

修改 `src/components/dealer/CoreMetrics.tsx`：

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function CoreMetrics({ timeRange }: { timeRange: string }) {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/dealer/data?dealerId=DEALER001&period=${timeRange}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setMetrics(result.data.coreMetrics);
        }
        setLoading(false);
      });
  }, [timeRange]);

  if (loading) return <div>加载中...</div>;
  if (!metrics) return <div>暂无数据</div>;

  return (
    <div>
      <div>目标: {metrics.targetAmount}万</div>
      <div>已完成: {metrics.completedAmount}万</div>
    </div>
  );
}
```

### 步骤4：测试

```bash
# 重启应用
pm2 restart dealer-dashboard

# 打开浏览器访问
# 应该显示真实的数据库数据
```

---

## 📋 快速检查清单

### ✅ 已完成的事情
- [x] 数据库表已创建
- [x] API接口已写好
- [x] Manager层已写好

### 📝 您需要做的事情

1. **配置数据库连接**
   ```bash
   # 编辑 .env 文件
   nano .env
   # 填入真实的数据库连接信息
   ```

2. **插入真实数据**
   ```bash
   # 方式1: 使用 init-sample-data.sql
   psql $PGDATABASE_URL -f init-sample-data.sql

   # 方式2: 在数据库工具里执行SQL
   ```

3. **修改6个前端组件**
   - CoreMetrics.tsx
   - DealerFinancialMetrics.tsx
   - TrackAnalysisPanel.tsx
   - BusinessInsightsPanel.tsx
   - ProjectFunnelPanel.tsx
   - ProjectRiskPanel.tsx

4. **测试**
   ```bash
   pm2 restart dealer-dashboard
   # 浏览器访问，查看是否显示真实数据
   ```

---

## 🎓 核心要点

### ❌ 错误理解

- ❌ "要在前端组件里写SQL" → **错误！**前端组件不写SQL
- ❌ "要修改 dealerManager.ts" → **错误！**已经写好了，不需要改
- ❌ "要手动执行SQL查询" → **错误！**应用会自动查询

### ✅ 正确理解

- ✅ SQL在数据库工具里执行，用来初始化数据
- ✅ 前端组件从API获取数据
- ✅ API通过Manager层自动查询数据库
- ✅ 您只需要：配置数据库、插入数据、修改前端组件

---

## 🔧 实际操作示例

### 今天的任务

**任务：把 CoreMetrics 组件改成从数据库获取数据**

**步骤：**

1. **在数据库里插入数据**

   打开数据库管理工具（如 pgAdmin），执行：
   ```sql
   INSERT INTO dealer_core_metrics (dealer_id, period, target_amount, completed_amount, forecast_amount, completion_rate)
   VALUES ('D001', 'current', 1000000, 680000, 850000, 68.0);
   ```

2. **修改 CoreMetrics.tsx**

   按照上面的示例代码修改

3. **测试**

   打开浏览器，应该显示：`目标: 1000000万`

---

## 📚 常用SQL在哪里？

项目里已经准备好了SQL模板：

| 文件 | 用途 |
|-----|------|
| `init-sample-data.sql` | 示例数据（可以修改成真实数据） |
| `SQL_QUICK_GUIDE.md` | 详细的SQL教程 |
| `SQL_QUICK_REFERENCE.md` | SQL快速参考 |

**使用方法：**

```bash
# 1. 打开 init-sample-data.sql
nano init-sample-data.sql

# 2. 修改数据为您的真实数据

# 3. 执行
psql $PGDATABASE_URL -f init-sample-data.sql
```

---

## 🎯 总结

### 您需要做的事情：

1. **配置 .env** - 填写数据库连接地址
2. **执行SQL** - 在数据库工具或命令行里，把真实数据插入数据库
3. **修改组件** - 修改6个前端组件，让它们从API获取数据

### SQL写在哪里？

- **不写在代码里！**
- 写在数据库管理工具的查询窗口
- 或者保存为 .sql 文件，通过命令行执行

### 前端组件怎么改？

- 添加 useState 和 useEffect
- 从 `/api/dealer/data` 获取数据
- 使用数据渲染UI

---

**现在明白了吗？** 😊

还不明白的话，可以告诉我哪一步不清楚，我详细解释！
