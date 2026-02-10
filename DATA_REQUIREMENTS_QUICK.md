# 📦 数据需求清单（快速版）

## 📋 您需要提供的7张表

### 表1：核心指标 (dealer_core_metrics)
**作用**：显示顶部的3个仪表盘指标（目标、已完成、预计）

| 字段 | 说明 | 示例 |
|------|------|------|
| dealer_id | 经销商ID | 'DEALER001' |
| period | 时间周期（current/quarter/year） | 'current' |
| year | 年份 | 2024 |
| target_amount | 目标金额（万元） | 10000 |
| completed_amount | 已完成金额（万元） | 6800 |
| forecast_amount | 预计完成金额（万元） | 8500 |
| year_over_year_growth | 同比增长率（%） | 12.5 |
| completion_rate | 完成率（%） | 68 |

**时间周期说明**：
- `current`：当前月度数据
- `quarter`：当季度累计数据
- `year`：当年累计数据

---

### 表2：月度销售 (dealer_monthly_sales)
**作用**：显示月度销售趋势折线图

| 字段 | 说明 | 示例 |
|------|------|------|
| dealer_id | 经销商ID | 'DEALER001' |
| year | 年份 | 2024 |
| month | 月份（1-12） | 3 |
| target_amount | 月度目标金额（万元） | 1200 |
| completed_amount | 月度已完成金额（万元） | 960 |
| forecast_amount | 月度预计金额（万元） | 1050 |
| completion_rate | 月度完成率（%） | 80 |

**数据要求**：12个月的记录，从1月到12月

---

### 表3：赛道分析 (dealer_track_analysis)
**作用**：显示赛道分布饼图

| 字段 | 说明 | 示例 |
|------|------|------|
| dealer_id | 经销商ID | 'DEALER001' |
| period | 时间周期 | 'current' |
| year | 年份 | 2024 |
| track_name | 赛道名称 | '教育' |
| percentage | 占比（%） | 35 |
| growth | 增长率（%） | 12 |
| health | 健康状况 | '良好' |
| health_score | 健康评分（0-100） | 85 |
| total_amount | 总金额（万元） | 10000 |
| margin | 利润率（%） | 18 |

**赛道分类**：教育、企业、金融、医疗、政府等

---

### 表4：行业细分 (dealer_subcategory_analysis)
**作用**：显示各赛道下细分行业的详细数据

| 字段 | 说明 | 示例 |
|------|------|------|
| dealer_id | 经销商ID | 'DEALER001' |
| period | 时间周期 | 'current' |
| year | 年份 | 2024 |
| track_name | 所属赛道 | '教育' |
| subcategory_name | 细分行业名称 | '幼教' |
| target_amount | 目标金额（万元） | 2000 |
| actual_amount | 实际金额（万元） | 960 |
| completion_rate | 完成率（%） | 48 |
| margin | 利润率（%） | 16 |
| product_mix_premium | 高端产品占比（%） | 30 |
| product_mix_standard | 标准产品占比（%） | 50 |
| product_mix_budget | 预算型产品占比（%） | 20 |
| status | 状态 | '需加强' |
| insight | 洞察说明 | '完成率仅48%...' |
| actions | 行动建议（JSON数组） | '["减少预算型产品占比..."]' |
| priority | 优先级 | '高' |

**行业细分示例**：
- 教育：幼教、K12、高校含BOT
- 企业：国央企、外资、民营、水处理
- 金融：银行、保险、证券
- 医疗：医院、诊所、体检中心

---

### 表5：项目漏斗 (dealer_project_funnel)
**作用**：显示项目销售漏斗分析

| 字段 | 说明 | 示例 |
|------|------|------|
| dealer_id | 经销商ID | 'DEALER001' |
| period | 时间周期 | 'current' |
| year | 年份 | 2024 |
| stage | 漏斗阶段 | '需求确认' |
| project_count | 项目数量 | 140 |
| conversion_rate | 转化率（%） | 56 |
| issues | 存在问题 | '需求不明确' |
| risk_level | 风险等级（低/中/高） | '高' |
| actions | 建议行动 | '增加需求调研投入' |

**漏斗阶段**：
1. 初报备
2. 现场勘察
3. 需求确认
4. 方案提交
5. 方案确认
6. 采购流程
7. 合同签约

---

### 表6：风险统计 (dealer_project_risk_stats)
**作用**：显示项目风险分类统计

| 字段 | 说明 | 示例 |
|------|------|------|
| dealer_id | 经销商ID | 'DEALER001' |
| period | 时间周期 | 'current' |
| year | 年份 | 2024 |
| risk_category | 风险类别 | '高风险项目' |
| project_count | 项目数量 | 28 |
| percentage | 占比（%） | 11.2 |
| total_amount | 总金额（万元） | 2800 |
| avg_amount | 平均金额（万元） | 100 |
| issues | 存在问题（JSON数组） | '["超期超过30天..."]' |
| suggestions | 建议（JSON数组） | '["立即停止投入..."]' |
| impact | 预期影响 | '释放报备资源28个...' |

**风险类别**：
- 高风险项目
- 中风险项目
- 低风险项目
- 高价值项目
- 即将成交项目

---

### 表7：关键项目 (dealer_critical_projects)
**作用**：显示高风险但价值大的关键项目预警

| 字段 | 说明 | 示例 |
|------|------|------|
| dealer_id | 经销商ID | 'DEALER001' |
| project_id | 项目编号 | 'P001' |
| project_name | 项目名称 | 'XX学校净化项目' |
| customer | 客户名称 | 'XX教育集团' |
| industry | 所属行业 | '教育' |
| stage | 当前阶段 | '方案确认' |
| amount | 项目金额（万元） | 350 |
| overdue_days | 超期天数 | 35 |
| risk_level | 风险等级（严重/高/中/低） | '严重' |
| issues | 存在问题（JSON数组） | '["超期35天..."]' |
| probability | 成功概率（%） | 20 |
| suggestion | 建议 | '立即安排高层拜访...' |
| action_plan | 行动计划 | '紧急拜访 \| 竞品分析...' |
| priority | 优先级（高/中/低） | '高' |

---

## 🎯 数据汇总

### 关键字段说明

**公共字段**：
- `dealer_id`：所有表的关联字段，用于区分不同经销商
- `period`：时间周期（current/quarter/year），用于支持时间范围切换
- `year`：年份，支持跨年度数据查询

**金额单位**：
- 所有金额字段统一为 **万元**

**百分比字段**：
- 保留2位小数，如 `12.50` 表示 12.5%

**JSON数组字段**：
- `actions`、`issues`、`suggestions` 等存储 JSON 数组格式
- 示例：`'["建议1", "建议2", "建议3"]'`

---

## 📊 数据量估算

### 最少数据量（单个经销商）：
- 表1（核心指标）：3条（current、quarter、year各1条）
- 表2（月度销售）：12条（1-12月）
- 表3（赛道分析）：5条（5个赛道）
- 表4（行业细分）：15条（每个赛道3个细分）
- 表5（项目漏斗）：7条（7个阶段）
- 表6（风险统计）：5条（5个风险类别）
- 表7（关键项目）：10条（10个高风险项目）

**合计**：约57条记录

### 多经销商场景：
- 每增加1个经销商，数据量 × N
- 支持无限扩展

---

## ✅ 准备清单

**您需要准备：**

- [ ] 从业务系统导出7张表的数据
- [ ] 确保数据格式符合上述要求
- [ ] 将数据导出为 CSV 或 SQL INSERT 语句
- [ ] 提供数据库连接信息（`PGDATABASE_URL`）
- [ ] （可选）提供示例数据，用于功能测试

**我会做的：**

- [ ] 根据您提供的表结构更新代码
- [ ] 修改前端组件从API获取数据
- [ ] 编写数据导入脚本
- [ ] 提供测试和部署指导

---

## 📞 交付给我时

请提供以下信息：

1. **数据库连接信息**
   ```bash
   export PGDATABASE_URL="postgresql://username:password@host:port/database"
   ```

2. **表结构SQL文件**
   - 包含CREATE TABLE语句
   - 包含索引定义
   - 保存为 `create_tables.sql`

3. **数据文件（可选）**
   - CSV文件 或
   - SQL INSERT语句 或
   - 示例数据

4. **表结构调整说明**（如果有）
   - 哪些字段需要修改
   - 哪些字段可以删除
   - 哪些新增字段

---

## 🚀 快速开始

如果您已经准备好了数据，可以直接告诉我：

> "数据已准备好，表结构和数据库连接信息如下：..."

我会立即开始修改代码！
