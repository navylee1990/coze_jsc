# 📊 经销商销售预测系统 - 数据库接入完成

## ✅ 已完成的工作

### 1. 数据库表结构设计 ✓
已创建7张核心数据表：
- `dealer_core_metrics` - 核心指标
- `dealer_monthly_sales` - 月度销售趋势
- `dealer_track_data` - 赛道定位分析
- `dealer_subcategory_data` - 行业细分数据
- `dealer_project_funnel` - 项目漏斗分析
- `dealer_project_risk` - 项目风险分析
- `dealer_critical_project` - 关键项目预警

### 2. 数据库Manager层 ✓
已创建 `dealerManager`，包含完整的CRUD方法：
- 核心指标管理
- 月度销售趋势管理
- 赛道定位分析管理
- 行业细分数据管理
- 项目漏斗分析管理
- 项目风险分析管理
- 关键项目预警管理
- 全量数据查询方法

### 3. API接口 ✓
已创建API路由：
- `GET /api/dealer/data` - 获取所有数据（推荐使用）
- `GET /api/dealer/core-metrics` - 获取核心指标

### 4. 部署文档 ✓
已创建完整文档：
- `DEPLOYMENT_GUIDE.md` - 详细的部署和接入指南
- `init-sample-data.sql` - 示例数据初始化脚本

---

## 🚀 快速开始

### 步骤1：配置数据库连接

编辑 `.env` 文件，设置正式数据库连接：

```env
PGDATABASE_URL=postgresql://username:password@your-host:5432/database_name?sslmode=require
```

### 步骤2：初始化数据库表

表结构已经同步到数据库，无需额外操作。

### 步骤3：导入示例数据

```bash
# 方法1：使用psql
psql $PGDATABASE_URL -f init-sample-data.sql

# 方法2：直接复制SQL内容在数据库管理工具中执行
```

### 步骤4：启动开发服务器

```bash
coze dev
```

### 步骤5：测试API接口

```bash
# 测试获取所有数据
curl "http://localhost:5000/api/dealer/data?dealerId=default&period=current"

# 预期响应：
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

---

## 📋 接下来的工作

### 必须完成（生产上线前）

1. **配置正式环境变量**
   ```bash
   # 编辑 .env 文件
   PGDATABASE_URL=postgresql://正式用户:密码@正式数据库地址:5432/数据库名
   ```

2. **导入真实数据**
   - 使用 `init-sample-data.sql` 作为模板
   - 替换为真实业务数据
   - 定期更新数据（建议每日或每周）

3. **修改前端组件**
   - 将硬编码的数据改为从API获取
   - 参考 `DEPLOYMENT_GUIDE.md` 中的"前端集成"章节

4. **测试验证**
   ```bash
   # 构建检查
   npx tsc --noEmit

   # 测试API
   curl http://localhost:5000/api/dealer/data

   # 测试前端
   # 在浏览器中打开 http://localhost:5000/dealer
   ```

### 可选优化

1. **添加认证和授权**
   - 集成企业微信登录
   - 添加用户权限控制

2. **添加数据刷新机制**
   - 定时任务自动同步数据
   - 前端添加刷新按钮

3. **添加监控和日志**
   - 配置错误监控（如Sentry）
   - 完善访问日志

4. **性能优化**
   - 添加数据库索引
   - 实现数据缓存
   - API响应压缩

---

## 📁 项目结构

```
src/
├── app/
│   ├── api/
│   │   └── dealer/
│   │       ├── data/
│   │       │   └── route.ts          # API：获取所有数据
│   │       └── core-metrics/
│   │           └── route.ts          # API：获取核心指标
│   └── dealer/
│       └── page.tsx                  # 经销商销售预测页面
├── components/
│   └── dealer/
│       ├── CoreMetrics.tsx           # 核心指标组件（待修改）
│       ├── DealerFinancialMetrics.tsx # 月度销售趋势组件（待修改）
│       ├── TrackAnalysisPanel.tsx     # 赛道定位分析组件（待修改）
│       ├── BusinessInsightsPanel.tsx  # 盈利能力总览组件（待修改）
│       ├── ProjectFunnelPanel.tsx     # 项目漏斗分析组件（待修改）
│       └── ProjectRiskPanel.tsx       # 项目风险分析组件（待修改）
└── storage/
    └── database/
        ├── shared/
        │   └── schema.ts              # 数据库表结构定义（已完成）
        ├── dealerManager.ts           # 经销商数据Manager（已完成）
        └── index.ts                   # 统一导出（已完成）

根目录文件：
├── .env                               # 环境变量配置（需修改）
├── DEPLOYMENT_GUIDE.md                # 详细部署指南（已完成）
└── init-sample-data.sql               # 示例数据脚本（已完成）
```

---

## 🔧 常用命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
coze dev

# 构建生产版本
pnpm build

# 启动生产服务器
coze start

# 同步数据库schema（已执行，通常不需要重复）
coze-coding-ai db generate-models

# 更新数据库表结构（已执行，通常不需要重复）
coze-coding-ai db upgrade

# 类型检查
npx tsc --noEmit

# 查看日志
tail -f /app/work/logs/bypass/app.log
```

---

## 📞 获取帮助

### 问题排查

1. **数据库连接失败**
   - 检查 `.env` 文件中的 `PGDATABASE_URL`
   - 确认数据库服务器可访问
   - 查看日志：`tail -f /app/work/logs/bypass/app.log`

2. **API返回500错误**
   - 确认数据库表已创建
   - 确认数据已导入
   - 查看服务器日志获取详细错误信息

3. **前端显示"暂无数据"**
   - 确认API返回数据正常
   - 检查前端组件的数据获取逻辑
   - 打开浏览器开发者工具查看网络请求

### 参考文档

- [完整部署指南](./DEPLOYMENT_GUIDE.md)
- [Drizzle ORM文档](https://orm.drizzle.team/)
- [Next.js文档](https://nextjs.org/docs)

---

## ✅ 检查清单

上线前请确认：

- [ ] 数据库连接已配置（.env文件）
- [ ] 数据库表已创建并验证
- [ ] 真实数据已导入
- [ ] API接口测试通过
- [ ] 前端组件已集成API调用
- [ ] 生产构建成功（pnpm build）
- [ ] 数据库备份策略已制定

---

**状态：数据库接入已完成 ✅**

现在您可以：
1. 配置正式数据库连接
2. 导入真实业务数据
3. 修改前端组件以使用真实数据
4. 部署上线

**下一步：** 请参考 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 完成剩余的部署步骤。
