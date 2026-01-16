# 商用净水经营驾驶舱 - 部署和集成文档

## 📋 项目概述

本项目包含两个企业级数据看板：
- **AO经营看板**：AO视角，关注销售业绩、项目进度、业务员表现
- **经销商经营看板**：老板视角，关注年度目标达成、区域分析、项目储备、月度趋势与AI智能洞察

## 🚀 快速开始

### 1. 本地开发

```bash
# 克隆项目
git clone <项目地址>
cd <项目目录>

# 安装依赖
pnpm install

# 启动开发环境
coze dev

# 访问应用
open http://localhost:5000
```

### 2. 一键部署

```bash
# 使用部署脚本
chmod +x deploy.sh
./deploy.sh
```

## 📚 文档索引

1. **[快速开发指南](./development-guide.md)**
   - 项目初始化
   - 开发流程
   - 构建和部署
   - API集成

2. **[企业微信集成指南](./wecom-integration-guide.md)**
   - 部署方案（云服务/容器化）
   - 企业微信登录实现
   - 工作台集成
   - 权限控制
   - 数据安全

## 🎯 核心功能

### AO经营看板
- 经营总览（健康值、风险预警）
- 经销商管理
- 项目跟踪
- 业务员表现

### 经销商经营看板
- 年度目标达成情况
- 月度趋势分析（AI智能洞察 + 折线图）
- 项目阶段统计
- 风险预警

## 🔧 技术栈

- **框架**: Next.js 16 (App Router)
- **UI库**: React 19 + shadcn/ui
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **图表**: Recharts
- **AI**: 大语言模型集成

## 📱 企业微信集成步骤

### 步骤1：部署应用
- 选择部署方案（云服务或容器化）
- 配置域名和HTTPS证书
- 使用PM2或Docker运行

### 步骤2：企业微信配置
1. 登录企业微信管理后台
2. 创建自建应用
3. 配置可信域名
4. 获取应用凭证（CorpID、AgentId、Secret）

### 步骤3：实现登录
- 安装企业微信SDK
- 实现OAuth2授权登录
- 配置后端API接口

### 步骤4：工作台集成
- 添加应用到工作台
- 配置应用主页URL
- 设置可见范围和权限

详细步骤请参考 [企业微信集成指南](./wecom-integration-guide.md)

## 🔒 安全建议

1. **HTTPS强制使用**
   - 所有通信必须使用HTTPS
   - 配置HSTS头部

2. **环境变量保护**
   - 不要在代码中硬编码密钥
   - 使用.env文件管理敏感信息

3. **权限控制**
   - 实现基于角色的访问控制
   - 数据接口增加权限验证

4. **数据加密**
   - 敏感数据加密存储
   - 使用JWT保护会话

## 📊 数据结构

### KPI数据结构
```typescript
interface KPIData {
  annualTarget: number;        // 年度目标（万元）
  completedAmount: number;     // 已完成金额（万元）
  shippedAmount: number;       // 已提货金额（万元）
  achievementRate: number;     // 达成率（%）
  projectReserveCount: number; // 项目储备数量
  projectReserveAmount: number;// 项目储备金额（万元）
  currentMonthActual: number;  // 本月实际完成（万元）
}
```

### 月度趋势数据
```typescript
interface MonthlyTrend {
  month: string;      // 月份
  target: number;     // 目标金额（万元）
  actual: number;     // 实际完成（万元）
  achievement: number; // 达成率（%）
}
```

## 🛠️ 常用命令

```bash
# 开发
coze dev                    # 启动开发环境
npx tsc --noEmit           # 类型检查

# 构建
pnpm build                 # 构建生产版本
coze start                 # 启动生产环境

# PM2管理
pm2 start npm -- start     # 启动应用
pm2 restart dashboard      # 重启应用
pm2 stop dashboard         # 停止应用
pm2 logs dashboard         # 查看日志
pm2 status                 # 查看状态

# Docker
docker build -t dashboard:v1 .
docker run -d -p 5000:5000 --name dashboard dashboard:v1
```

## 🐛 故障排查

### 问题1：端口5000被占用
```bash
# 查找占用进程
lsof -i:5000

# 杀死进程
kill -9 <PID>
```

### 问题2：企业微信登录失败
- 检查应用凭证是否正确
- 验证域名和HTTPS配置
- 查看后端日志

### 问题3：构建失败
```bash
# 清理缓存
rm -rf node_modules .next
pnpm install
pnpm build
```

## 📞 技术支持

如有问题，请联系：
- **技术支持**: tech-support@example.com
- **企业微信对接**: wecom-support@example.com

## 📝 更新日志

### v1.0.0 (2026-01-16)
- ✅ 初始版本发布
- ✅ AO经营看板
- ✅ 经销商经营看板
- ✅ 月度趋势分析模块
- ✅ AI智能洞察功能
- ✅ 企业微信集成方案

## 📄 许可证

内部使用，保留所有权利。
