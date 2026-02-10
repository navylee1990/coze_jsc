# 经销商销售预测系统 - 数据库接入与部署指南

## 📋 目录
1. [环境配置](#环境配置)
2. [数据库表结构](#数据库表结构)
3. [API 接口说明](#api-接口说明)
4. [前端集成](#前端集成)
5. [数据初始化](#数据初始化)
6. [部署上线](#部署上线)

---

## 🔧 环境配置

### 1. 配置数据库连接

编辑项目根目录的 `.env` 文件，配置正式数据库连接信息：

```env
# 正式数据库连接（必填）
PGDATABASE_URL=postgresql://username:password@your-host:5432/database_name

# 可选：开发和测试环境
PGDATABASE_URL_DEV=postgresql://username:password@dev-host:5432/database_dev
PGDATABASE_URL_TEST=postgresql://username:password@test-host:5432/database_test
```

**连接字符串格式说明：**
```
postgresql://用户名:密码@主机:端口/数据库名?sslmode=require
```

**示例：**
```env
PGDATABASE_URL=postgresql://dealer_user:SecurePass123@prod-db.example.com:5432/dealer_db?sslmode=require
```

### 2. 安装依赖

```bash
pnpm install
```

---

## 📊 数据库表结构

### 已创建的7张核心表：

1. **dealer_core_metrics** - 核心指标表
   - 经销商ID、时间周期、目标金额、已完成金额、预计金额、同比增长、完成率

2. **dealer_monthly_sales** - 月度销售趋势表
   - 经销商ID、年份、月份、目标、已完成、预计

3. **dealer_track_data** - 赛道定位分析表
   - 经销商ID、赛道名称、占比、增长率、健康度、金额、毛利率

4. **dealer_subcategory_data** - 行业细分数据表
   - 经销商ID、赛道、细分行业、目标、实际、完成率、毛利率、产品配置、洞察、建议

5. **dealer_project_funnel** - 项目漏斗分析表
   - 经销商ID、阶段、项目数量、转化率、问题、风险、措施

6. **dealer_project_risk** - 项目风险分析表
   - 经销商ID、风险类别、数量、占比、金额、问题描述、建议、预期收益

7. **dealer_critical_project** - 关键项目预警表
   - 项目ID、经销商ID、项目名称、客户、行业、阶段、金额、超期天数、风险等级、问题、成功率、建议

---

## 🌐 API 接口说明

### 1. 获取所有数据（推荐）

**端点：** `GET /api/dealer/data`

**请求参数：**
- `dealerId`: 经销商ID（默认: default）
- `period`: 时间周期（current | quarter | year，默认: current）

**示例请求：**
```bash
GET /api/dealer/data?dealerId=D001&period=current
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "coreMetrics": { ... },
    "monthlySales": [ ... ],
    "trackData": [ ... ],
    "subcategoryData": [ ... ],
    "projectFunnel": [ ... ],
    "projectRisk": [ ... ],
    "criticalProjects": [ ... ]
  }
}
```

### 2. 获取核心指标

**端点：** `GET /api/dealer/core-metrics`

**请求参数：**
- `dealerId`: 经销商ID
- `period`: 时间周期

### 3. 其他独立端点

可以按照类似模式创建以下端点：
- `GET /api/dealer/monthly-sales` - 月度销售趋势
- `GET /api/dealer/track-data` - 赛道定位分析
- `GET /api/dealer/subcategory-data` - 行业细分数据
- `GET /api/dealer/project-funnel` - 项目漏斗分析
- `GET /api/dealer/project-risk` - 项目风险分析
- `GET /api/dealer/critical-projects` - 关键项目预警

---

## 💻 前端集成

### 修改组件，从API获取数据

**示例：修改 CoreMetrics.tsx**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
// ... 其他导入

export default function CoreMetrics({ timeRange }: { timeRange: string }) {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 从API获取数据
        const response = await fetch(
          `/api/dealer/data?dealerId=default&period=${timeRange}`
        );
        const result = await response.json();

        if (result.success) {
          setMetrics(result.data.coreMetrics);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  if (!metrics) return <div>暂无数据</div>;

  // 使用 metrics.targetAmount, metrics.completedAmount 等数据渲染UI
  return (
    // ... 渲染代码
  );
}
```

**需要修改的组件列表：**
1. `CoreMetrics.tsx` - 核心指标
2. `DealerFinancialMetrics.tsx` - 月度销售趋势
3. `TrackAnalysisPanel.tsx` - 赛道定位分析
4. `BusinessInsightsPanel.tsx` - 盈利能力总览
5. `ProjectFunnelPanel.tsx` - 项目漏斗分析
6. `ProjectRiskPanel.tsx` - 项目风险分析

---

## 📥 数据初始化

### 方式1：通过SQL脚本初始化

创建 `init-data.sql` 文件：

```sql
-- 插入核心指标数据
INSERT INTO dealer_core_metrics (dealer_id, period, target_amount, completed_amount, forecast_amount, year_over_year_growth, completion_rate)
VALUES
  ('default', 'current', 10000, 6800, 8500, 12.5, 68.0);

-- 插入月度销售数据
INSERT INTO dealer_monthly_sales (dealer_id, year, month, target_amount, completed_amount, forecast_amount, period)
VALUES
  ('default', 2024, 1, 800, 600, 750, 'current'),
  ('default', 2024, 2, 800, 700, 800, 'current'),
  ('default', 2024, 3, 900, 800, 900, 'current'),
  ('default', 2024, 4, 850, 650, 780, 'current'),
  ('default', 2024, 5, 900, 720, 820, 'current'),
  ('default', 2024, 6, 1000, 750, 900, 'current');

-- 插入赛道数据
INSERT INTO dealer_track_data (dealer_id, track_name, period, percentage, growth_rate, health_score, health_status, total_amount, margin_rate)
VALUES
  ('default', '教育', 'current', 35.0, 12.0, 85, '良好', 3500, 18.0),
  ('default', '企业', 'current', 30.0, -5.0, 65, '需关注', 3000, 22.0),
  ('default', '金融', 'current', 15.0, 25.0, 92, '优秀', 1500, 28.0),
  ('default', '医疗', 'current', 12.0, 8.0, 78, '良好', 1200, 24.0),
  ('default', '政府', 'current', 8.0, -10.0, 55, '风险', 800, 15.0);

-- 插入行业细分数据
INSERT INTO dealer_subcategory_data (dealer_id, track_name, subcategory_name, period, target_amount, actual_amount, completion_rate, margin_rate, status, product_mix, insight, actions, priority)
VALUES
  ('default', '教育', '幼教', 'current', 2000, 960, 48.0, 16.0, '需加强', '{"premium": 30, "standard": 50, "budget": 20}', '完成率仅48%', ARRAY['减少预算型产品'], '高'),
  ('default', '教育', 'K12', 'current', 3000, 2720, 91.0, 19.0, '良好', '{"premium": 40, "standard": 45, "budget": 15}', '表现良好', ARRAY['保持当前策略'], '中'),
  -- ... 更多数据
```

**执行SQL：**
```bash
psql $PGDATABASE_URL -f init-data.sql
```

### 方式2：通过管理工具初始化

使用PostgreSQL管理工具（如pgAdmin、DataGrip、DBeaver）连接数据库，手动插入数据。

---

## 🚀 部署上线

### 1. 构建项目

```bash
pnpm build
```

### 2. 启动生产服务

```bash
coze start
```

### 3. 部署到云平台

#### 部署到 Vercel

```bash
# 安装 Vercel CLI
pnpm add -g vercel

# 登录 Vercel
vercel login

# 部署
vercel --prod

# 配置环境变量
vercel env add PGDATABASE_URL production
```

#### 部署到 Docker

创建 `Dockerfile`：

```dockerfile
FROM node:24-alpine

WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 暴露端口
EXPOSE 5000

# 启动应用
CMD ["pnpm", "start"]
```

**构建和运行：**
```bash
# 构建镜像
docker build -t dealer-dashboard:latest .

# 运行容器
docker run -d \
  -p 5000:5000 \
  -e PGDATABASE_URL="postgresql://..." \
  dealer-dashboard:latest
```

---

## 🔐 安全注意事项

1. **数据库连接字符串**
   - 使用环境变量存储，不要硬编码
   - 生产环境启用 SSL (`sslmode=require`)
   - 使用强密码和最小权限用户

2. **API 安全**
   - 添加身份验证（如 JWT、Session）
   - 添加速率限制
   - 验证和清理所有输入数据

3. **数据隐私**
   - 敏感数据加密存储
   - 定期备份数据库
   - 记录访问日志

---

## 📝 常见问题

### Q1: 数据库连接失败

**检查清单：**
- 确认 `PGDATABASE_URL` 环境变量已正确配置
- 确认数据库服务器可访问（防火墙、网络）
- 确认数据库用户有足够权限
- 查看日志：`tail -f /app/work/logs/bypass/app.log`

### Q2: API 返回 500 错误

**排查步骤：**
1. 检查数据库表是否存在：`\dt` in psql
2. 检查数据是否符合 schema 定义
3. 查看服务器日志获取详细错误信息

### Q3: 前端显示"暂无数据"

**原因分析：**
- 数据库表中没有数据
- `dealerId` 或 `period` 参数不匹配
- API 请求失败（检查网络和响应）

**解决方法：**
1. 初始化测试数据（参考"数据初始化"章节）
2. 检查前端传递的参数是否正确
3. 打开浏览器开发者工具查看网络请求

---

## 📚 参考资源

- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [PostgreSQL 连接字符串格式](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

---

## ✅ 检查清单

部署前请确认：

- [ ] 环境变量已配置（PGDATABASE_URL）
- [ ] 数据库表已创建并验证
- [ ] 初始化数据已导入
- [ ] API 接口测试通过
- [ ] 前端组件已集成API调用
- [ ] 生产构建成功（`pnpm build`）
- [ ] 数据库备份策略已制定
- [ ] 监控和日志已配置

---

**技术支持：** 如遇到问题，请查看日志文件 `/app/work/logs/bypass/app.log`
