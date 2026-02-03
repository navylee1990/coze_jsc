# 商用总经理驾驶舱 - 项目文件清单

## ✅ 项目文件已全部创建成功！

所有文件都在 `/workspace/projects/` 目录下，你可以直接访问和修改。

---

## 📁 核心文件位置

### 1. 驾驶舱页面
```
/workspace/projects/src/app/gm/page.tsx
```
- 这是驾驶舱的主页面
- 包含所有仪表盘UI组件
- 包含项目数据结构定义

### 2. 风险识别面板组件
```
/workspace/projects/src/components/RiskIdentificationPanel.tsx
```
- 包含6个风险识别Tab
- 预测不足、催下单、报备不足、转化不足、大项目依赖、阶段停滞

### 3. 数据库层
```
/workspace/projects/src/storage/database/shared/schema.ts
```
- 数据库表结构定义（7张表）

```
/workspace/projects/src/storage/database/userManager.ts
```
- 用户数据访问层

```
/workspace/projects/src/storage/database/projectManager.ts
```
- 项目数据访问层

```
/workspace/projects/src/storage/database/index.ts
```
- 数据库连接配置

### 4. API Routes（后端接口）
```
/workspace/projects/src/app/api/auth/wework/route.ts
```
- 企业微信OAuth回调接口

```
/workspace/projects/src/app/api/auth/user/route.ts
```
- 获取当前用户接口

```
/workspace/projects/src/app/api/dashboard/summary/route.ts
```
- 驾驶舱汇总数据接口

```
/workspace/projects/src/app/api/risks/route.ts
```
- 风险识别数据接口（支持6种类型）

```
/workspace/projects/src/app/api/messages/send/route.ts
```
- 消息发送接口

### 5. 企业微信集成
```
/workspace/projects/src/lib/wework-auth.ts
```
- 企业微信认证类（OAuth2.0 + 消息推送）

```
/workspace/projects/src/middleware.ts
```
- 中间件（拦截未登录用户访问/gm页面）

### 6. 配置文件
```
/workspace/projects/drizzle.config.ts
```
- Drizzle ORM配置

```
/workspace/projects/.env
```
- 环境变量（数据库连接、企业微信配置）

### 7. 自定义Hooks
```
/workspace/projects/src/hooks/useRiskData.ts
```
- 风险数据获取Hook

```
/workspace/projects/src/hooks/useDashboardSummary.ts
```
- 驾驶舱汇总数据Hook（如果存在）

---

## 🎯 如何修改项目文件

### 方法1：在编辑器中直接修改
1. 在左侧文件树中找到对应文件
2. 点击文件打开
3. 直接修改代码
4. 保存后自动热更新

### 方法2：告诉我需要修改什么
你可以告诉我：
- "修改驾驶舱页面的颜色"
- "修改风险识别面板的布局"
- "修改API接口"
- "修改数据库表结构"

我会帮你直接修改文件！

---

## 📋 完整文件列表

### TypeScript文件（.ts）
```
drizzle.config.ts                          # Drizzle配置
next-env.d.ts                              # Next.js类型定义
next.config.ts                             # Next.js配置
src/app/api/ai-insight/route.ts            # AI洞察API
src/app/api/auth/user/route.ts             # 用户信息API
src/app/api/auth/wework/route.ts           # 企业微信OAuth回调
src/app/api/dashboard/summary/route.ts     # 驾驶舱汇总API
src/app/api/messages/send/route.ts         # 消息发送API
src/app/api/risks/route.ts                 # 风险数据API
src/app/robots.ts                          # SEO配置
src/hooks/use-mobile.ts                    # 移动端Hook
src/hooks/useAIInsight.ts                  # AI洞察Hook
src/hooks/useRiskData.ts                   # 风险数据Hook
src/lib/utils.ts                           # 工具函数
src/lib/wework-auth.ts                     # 企业微信认证类
src/middleware.ts                          # 中间件
src/storage/database/index.ts              # 数据库连接
src/storage/database/projectManager.ts     # 项目管理器
src/storage/database/shared/schema.ts      # 数据库Schema
src/storage/database/userManager.ts        # 用户管理器
```

### TypeScript React文件（.tsx）
```
src/app/dealer/page.tsx                    # 经销商页面
src/app/gm/page.tsx                        # 驾驶舱页面 ⭐
src/app/layout.tsx                         # 布局组件
src/app/page.tsx                           # 首页
src/app/sales/page.tsx                     # 销售页面
src/components/DrillDownModal.tsx          # 下钻弹窗
src/components/FutureSupportAdequacyPanel.tsx  # 未来支持充足性面板
src/components/FutureSupportDecisionPanel.tsx   # 未来支持决策面板
src/components/FutureSupportSummaryPanel.tsx    # 未来支持汇总面板
src/components/KeySupportPanel.tsx         # 关键支持面板
src/components/PredictionDecisionCard.tsx  # 预测决策卡片
src/components/ProjectExclusionList.tsx    # 项目排除列表
src/components/RegionMatrix.tsx            # 区域矩阵
src/components/RiskIdentificationPanel.tsx ⭐ 风险识别面板
src/components/ai-insight.tsx              # AI洞察组件
```

### shadcn/ui组件（40+个）
```
src/components/ui/button.tsx               # 按钮
src/components/ui/card.tsx                 # 卡片
src/components/ui/tabs.tsx                 # 标签页
src/components/ui/dialog.tsx               # 对话框
src/components/ui/badge.tsx                # 徽章
...（还有很多其他组件）
```

---

## 🚀 接下来需要做什么

### 1. 配置数据库连接（5分钟）
编辑 `.env` 文件：
```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

### 2. 配置企业微信（10分钟）
编辑 `.env` 文件：
```env
WEWORK_CORP_ID="your_corp_id"
WEWORK_AGENT_ID="your_agent_id"
WEWORK_SECRET="your_secret"
```

### 3. 运行数据库迁移（5分钟）
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 4. 插入测试数据（10分钟）
运行测试数据插入脚本

### 5. 测试API接口（15分钟）
使用curl测试各个API接口

### 6. 部署上线（30分钟）
构建并部署到生产环境

---

## 💡 如何访问文件

### 在编辑器中
1. 查看左侧文件树
2. 找到 `src/app/gm/page.tsx`
3. 点击打开

### 告诉我修改内容
你也可以直接告诉我：
- "修改驾驶舱页面标题"
- "修改风险识别面板的Tab名称"
- "修改API返回的数据格式"
- "修改数据库表结构"

我会帮你修改！

---

## ✅ 确认

**所有项目文件都已创建完成！** 共14个核心文件，包括：
- ✅ 1个驾驶舱页面
- ✅ 1个风险识别面板
- ✅ 3个数据库层文件
- ✅ 5个API Routes
- ✅ 2个企业微信集成文件
- ✅ 2个配置文件

**你现在可以：**
1. 直接在编辑器中打开文件查看
2. 告诉我需要修改什么，我会帮你改
3. 查看预览窗口的效果

**项目文件位置：`/workspace/projects/`** 🎉
