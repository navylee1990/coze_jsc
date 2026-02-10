# 经销商销售预测系统 - 数据库表结构设计

## 📋 概述

本文档定义了"商用总经理驾驶舱（经销商销售预测）"系统的完整数据库表结构。系统共有7张核心表，支持多经销商、多时间维度的数据分析。

---

## 🎯 设计原则

1. **多维度分析**：支持按经销商（dealer_id）、时间周期（period）、年份（year）查询
2. **时间周期划分**：
   - `current` - 当前月度
   - `quarter` - 当季度（累计3个月）
   - `year` - 当年度（累计12个月）
3. **主键设计**：使用复合主键 `(dealer_id, period, year)` 确保唯一性
4. **数据类型**：统一使用 `NUMERIC` 存储金额和百分比，保证精度

---

## 📊 表结构详解

### 1. 核心指标表 (dealer_core_metrics)

**用途**：存储各经销商的核心KPI指标

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| dealer_id | VARCHAR(50) | 经销商ID（主键） | 'DEALER001' |
| period | VARCHAR(20) | 时间周期（主键） | 'current' |
| year | INTEGER | 年份（主键） | 2024 |
| target_amount | NUMERIC(18,2) | 目标金额（万元） | 10000.00 |
| completed_amount | NUMERIC(18,2) | 已完成金额（万元） | 6800.00 |
| forecast_amount | NUMERIC(18,2) | 预计完成金额（万元） | 8500.00 |
| year_over_year_growth | NUMERIC(5,2) | 同比增长率（%） | 12.50 |
| completion_rate | NUMERIC(5,2) | 完成率（%） | 68.00 |
| created_at | TIMESTAMP | 创建时间 | 2024-03-15 10:00:00 |
| updated_at | TIMESTAMP | 更新时间 | 2024-03-15 10:00:00 |

**主键**：`(dealer_id, period, year)`

**关联页面**：CoreMetrics 组件

---

### 2. 月度销售表 (dealer_monthly_sales)

**用途**：存储各经销商每月的销售趋势数据

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | SERIAL | 自增主键 | 1 |
| dealer_id | VARCHAR(50) | 经销商ID | 'DEALER001' |
| year | INTEGER | 年份 | 2024 |
| month | INTEGER | 月份（1-12） | 3 |
| target_amount | NUMERIC(18,2) | 月度目标金额（万元） | 1200.00 |
| completed_amount | NUMERIC(18,2) | 月度已完成金额（万元） | 960.00 |
| forecast_amount | NUMERIC(18,2) | 月度预计金额（万元） | 1050.00 |
| completion_rate | NUMERIC(5,2) | 月度完成率（%） | 80.00 |
| created_at | TIMESTAMP | 创建时间 | 2024-03-15 10:00:00 |
| updated_at | TIMESTAMP | 更新时间 | 2024-03-15 10:00:00 |

**主键**：`id`

**索引**：
- `idx_dealer_year_month (dealer_id, year, month)`

**关联页面**：DealerFinancialMetrics 组件（月度趋势折线图）

---

### 3. 赛道分析表 (dealer_track_analysis)

**用途**：存储各赛道（行业大类）的业绩分析数据

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | SERIAL | 自增主键 | 1 |
| dealer_id | VARCHAR(50) | 经销商ID | 'DEALER001' |
| period | VARCHAR(20) | 时间周期 | 'current' |
| year | INTEGER | 年份 | 2024 |
| track_name | VARCHAR(100) | 赛道名称 | '教育' |
| percentage | NUMERIC(5,2) | 占总业绩比例（%） | 35.00 |
| growth | NUMERIC(5,2) | 增长率（%） | 12.00 |
| health | VARCHAR(20) | 健康状况 | '良好' |
| health_score | INTEGER | 健康评分（0-100） | 85 |
| total_amount | NUMERIC(18,2) | 赛道总金额（万元） | 10000.00 |
| margin | NUMERIC(5,2) | 利润率（%） | 18.00 |
| created_at | TIMESTAMP | 创建时间 | 2024-03-15 10:00:00 |
| updated_at | TIMESTAMP | 更新时间 | 2024-03-15 10:00:00 |

**主键**：`id`

**索引**：
- `idx_dealer_period_year (dealer_id, period, year)`

**关联页面**：TrackAnalysisPanel 组件（赛道饼图）

---

### 4. 行业细分表 (dealer_subcategory_analysis)

**用途**：存储各赛道下细分行业的详细业绩数据

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | SERIAL | 自增主键 | 1 |
| dealer_id | VARCHAR(50) | 经销商ID | 'DEALER001' |
| period | VARCHAR(20) | 时间周期 | 'current' |
| year | INTEGER | 年份 | 2024 |
| track_name | VARCHAR(100) | 所属赛道名称 | '教育' |
| subcategory_name | VARCHAR(100) | 细分行业名称 | '幼教' |
| target_amount | NUMERIC(18,2) | 目标金额（万元） | 2000.00 |
| actual_amount | NUMERIC(18,2) | 实际金额（万元） | 960.00 |
| completion_rate | NUMERIC(5,2) | 完成率（%） | 48.00 |
| margin | NUMERIC(5,2) | 利润率（%） | 16.00 |
| product_mix_premium | NUMERIC(5,2) | 高端产品占比（%） | 30.00 |
| product_mix_standard | NUMERIC(5,2) | 标准产品占比（%） | 50.00 |
| product_mix_budget | NUMERIC(5,2) | 预算型产品占比（%） | 20.00 |
| status | VARCHAR(20) | 状态 | '需加强' |
| insight | TEXT | 洞察说明 | '完成率仅48%，主要因为...' |
| actions | TEXT | 行动建议（JSON数组） | '["减少预算型产品占比..."]' |
| priority | VARCHAR(10) | 优先级 | '高' |
| created_at | TIMESTAMP | 创建时间 | 2024-03-15 10:00:00 |
| updated_at | TIMESTAMP | 更新时间 | 2024-03-15 10:00:00 |

**主键**：`id`

**索引**：
- `idx_dealer_period_year_track (dealer_id, period, year, track_name)`

**关联页面**：
- TrackAnalysisPanel 组件（赛道详情）
- BusinessInsightsPanel 组件（利润区间分析）

---

### 5. 项目漏斗表 (dealer_project_funnel)

**用途**：存储项目销售漏斗各阶段的数据

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | SERIAL | 自增主键 | 1 |
| dealer_id | VARCHAR(50) | 经销商ID | 'DEALER001' |
| period | VARCHAR(20) | 时间周期 | 'current' |
| year | INTEGER | 年份 | 2024 |
| stage | VARCHAR(50) | 漏斗阶段 | '需求确认' |
| project_count | INTEGER | 项目数量 | 140 |
| conversion_rate | NUMERIC(5,2) | 转化率（%） | 56.00 |
| issues | TEXT | 存在问题 | '需求不明确' |
| risk_level | VARCHAR(10) | 风险等级 | '高' |
| actions | TEXT | 建议行动 | '增加需求调研投入...' |
| created_at | TIMESTAMP | 创建时间 | 2024-03-15 10:00:00 |
| updated_at | TIMESTAMP | 更新时间 | 2024-03-15 10:00:00 |

**主键**：`id`

**索引**：
- `idx_dealer_period_year (dealer_id, period, year)`

**关联页面**：ProjectFunnelPanel 组件（漏斗分析）

---

### 6. 项目风险统计表 (dealer_project_risk_stats)

**用途**：存储项目风险分类统计数据

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | SERIAL | 自增主键 | 1 |
| dealer_id | VARCHAR(50) | 经销商ID | 'DEALER001' |
| period | VARCHAR(20) | 时间周期 | 'current' |
| year | INTEGER | 年份 | 2024 |
| risk_category | VARCHAR(50) | 风险类别 | '高风险项目' |
| project_count | INTEGER | 项目数量 | 28 |
| percentage | NUMERIC(5,2) | 占比（%） | 11.20 |
| total_amount | NUMERIC(18,2) | 总金额（万元） | 2800.00 |
| avg_amount | NUMERIC(18,2) | 平均金额（万元） | 100.00 |
| issues | TEXT | 存在问题（JSON数组） | '["超期超过30天..."]' |
| suggestions | TEXT | 建议（JSON数组） | '["立即停止投入..."]' |
| impact | TEXT | 预期影响 | '释放报备资源28个...' |
| created_at | TIMESTAMP | 创建时间 | 2024-03-15 10:00:00 |
| updated_at | TIMESTAMP | 更新时间 | 2024-03-15 10:00:00 |

**主键**：`id`

**索引**：
- `idx_dealer_period_year (dealer_id, period, year)`

**关联页面**：ProjectRiskPanel 组件（风险统计）

---

### 7. 关键项目预警表 (dealer_critical_projects)

**用途**：存储高风险但价值大的关键项目信息

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | SERIAL | 自增主键 | 1 |
| dealer_id | VARCHAR(50) | 经销商ID | 'DEALER001' |
| project_id | VARCHAR(50) | 项目编号 | 'P001' |
| project_name | VARCHAR(200) | 项目名称 | 'XX学校净化项目' |
| customer | VARCHAR(200) | 客户名称 | 'XX教育集团' |
| industry | VARCHAR(100) | 所属行业 | '教育' |
| stage | VARCHAR(50) | 当前阶段 | '方案确认' |
| amount | NUMERIC(18,2) | 项目金额（万元） | 350.00 |
| overdue_days | INTEGER | 超期天数 | 35 |
| risk_level | VARCHAR(10) | 风险等级 | '严重' |
| issues | TEXT | 存在问题（JSON数组） | '["超期35天..."]' |
| probability | NUMERIC(5,2) | 成功概率（%） | 20.00 |
| suggestion | TEXT | 建议 | '立即安排高层拜访...' |
| action_plan | TEXT | 行动计划 | '紧急拜访 \| 竞品分析...' |
| priority | VARCHAR(10) | 优先级 | '高' |
| created_at | TIMESTAMP | 创建时间 | 2024-03-15 10:00:00 |
| updated_at | TIMESTAMP | 更新时间 | 2024-03-15 10:00:00 |

**主键**：`id`

**索引**：
- `idx_dealer_project (dealer_id, project_id)`
- `idx_dealer_risk_level (dealer_id, risk_level)`

**关联页面**：ProjectRiskPanel 组件（关键项目预警）

---

## 🔗 表关系图

```
dealer_core_metrics (核心指标)
├── dealer_id (经销商ID)
├── period (时间周期)
└── year (年份)

dealer_monthly_sales (月度销售)
└── dealer_id → dealer_core_metrics

dealer_track_analysis (赛道分析)
├── dealer_id
├── period
└── year

dealer_subcategory_analysis (行业细分)
├── dealer_id
├── period
├── year
└── track_name → dealer_track_analysis

dealer_project_funnel (项目漏斗)
├── dealer_id
├── period
└── year

dealer_project_risk_stats (风险统计)
├── dealer_id
├── period
└── year

dealer_critical_projects (关键项目)
└── dealer_id
```

---

## 📝 SQL 建表语句

### 方式1：单独建表
```sql
-- 1. 核心指标表
CREATE TABLE dealer_core_metrics (
    dealer_id VARCHAR(50) NOT NULL,
    period VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    target_amount NUMERIC(18,2),
    completed_amount NUMERIC(18,2),
    forecast_amount NUMERIC(18,2),
    year_over_year_growth NUMERIC(5,2),
    completion_rate NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (dealer_id, period, year)
);

-- 2. 月度销售表
CREATE TABLE dealer_monthly_sales (
    id SERIAL PRIMARY KEY,
    dealer_id VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    target_amount NUMERIC(18,2),
    completed_amount NUMERIC(18,2),
    forecast_amount NUMERIC(18,2),
    completion_rate NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dealer_year_month ON dealer_monthly_sales(dealer_id, year, month);

-- 3. 赛道分析表
CREATE TABLE dealer_track_analysis (
    id SERIAL PRIMARY KEY,
    dealer_id VARCHAR(50) NOT NULL,
    period VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    track_name VARCHAR(100) NOT NULL,
    percentage NUMERIC(5,2),
    growth NUMERIC(5,2),
    health VARCHAR(20),
    health_score INTEGER,
    total_amount NUMERIC(18,2),
    margin NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dealer_period_year ON dealer_track_analysis(dealer_id, period, year);

-- 4. 行业细分表
CREATE TABLE dealer_subcategory_analysis (
    id SERIAL PRIMARY KEY,
    dealer_id VARCHAR(50) NOT NULL,
    period VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    track_name VARCHAR(100) NOT NULL,
    subcategory_name VARCHAR(100) NOT NULL,
    target_amount NUMERIC(18,2),
    actual_amount NUMERIC(18,2),
    completion_rate NUMERIC(5,2),
    margin NUMERIC(5,2),
    product_mix_premium NUMERIC(5,2),
    product_mix_standard NUMERIC(5,2),
    product_mix_budget NUMERIC(5,2),
    status VARCHAR(20),
    insight TEXT,
    actions TEXT,
    priority VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dealer_period_year_track ON dealer_subcategory_analysis(dealer_id, period, year, track_name);

-- 5. 项目漏斗表
CREATE TABLE dealer_project_funnel (
    id SERIAL PRIMARY KEY,
    dealer_id VARCHAR(50) NOT NULL,
    period VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    stage VARCHAR(50) NOT NULL,
    project_count INTEGER,
    conversion_rate NUMERIC(5,2),
    issues TEXT,
    risk_level VARCHAR(10),
    actions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dealer_period_year_1 ON dealer_project_funnel(dealer_id, period, year);

-- 6. 项目风险统计表
CREATE TABLE dealer_project_risk_stats (
    id SERIAL PRIMARY KEY,
    dealer_id VARCHAR(50) NOT NULL,
    period VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    risk_category VARCHAR(50) NOT NULL,
    project_count INTEGER,
    percentage NUMERIC(5,2),
    total_amount NUMERIC(18,2),
    avg_amount NUMERIC(18,2),
    issues TEXT,
    suggestions TEXT,
    impact TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dealer_period_year_2 ON dealer_project_risk_stats(dealer_id, period, year);

-- 7. 关键项目预警表
CREATE TABLE dealer_critical_projects (
    id SERIAL PRIMARY KEY,
    dealer_id VARCHAR(50) NOT NULL,
    project_id VARCHAR(50) NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    customer VARCHAR(200),
    industry VARCHAR(100),
    stage VARCHAR(50),
    amount NUMERIC(18,2),
    overdue_days INTEGER,
    risk_level VARCHAR(10),
    issues TEXT,
    probability NUMERIC(5,2),
    suggestion TEXT,
    action_plan TEXT,
    priority VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dealer_project ON dealer_critical_projects(dealer_id, project_id);
CREATE INDEX idx_dealer_risk_level ON dealer_critical_projects(dealer_id, risk_level);
```

### 方式2：完整建表脚本（推荐）
将以上SQL保存为 `create_tables.sql`，一次性执行：
```bash
psql $PGDATABASE_URL -f create_tables.sql
```

---

## 📊 示例数据

### 1. 核心指标示例
```sql
INSERT INTO dealer_core_metrics (dealer_id, period, year, target_amount, completed_amount, forecast_amount, year_over_year_growth, completion_rate)
VALUES
('DEALER001', 'current', 2024, 10000.00, 6800.00, 8500.00, 12.50, 68.00),
('DEALER001', 'quarter', 2024, 3600.00, 2880.00, 3150.00, 10.00, 80.00),
('DEALER001', 'year', 2024, 14400.00, 11520.00, 12600.00, 8.50, 80.00);
```

### 2. 月度销售示例
```sql
INSERT INTO dealer_monthly_sales (dealer_id, year, month, target_amount, completed_amount, forecast_amount, completion_rate)
VALUES
('DEALER001', 2024, 1, 1200.00, 960.00, 1050.00, 80.00),
('DEALER001', 2024, 2, 1200.00, 1100.00, 1150.00, 91.67),
('DEALER001', 2024, 3, 1200.00, 820.00, 1000.00, 68.33);
```

### 3. 赛道分析示例
```sql
INSERT INTO dealer_track_analysis (dealer_id, period, year, track_name, percentage, growth, health, health_score, total_amount, margin)
VALUES
('DEALER001', 'current', 2024, '教育', 35.00, 12.00, '良好', 85, 10000.00, 18.00),
('DEALER001', 'current', 2024, '企业', 30.00, -5.00, '需关注', 65, 8000.00, 22.00),
('DEALER001', 'current', 2024, '金融', 15.00, 25.00, '优秀', 92, 4500.00, 28.00),
('DEALER001', 'current', 2024, '医疗', 12.00, 8.00, '良好', 78, 3000.00, 24.00),
('DEALER001', 'current', 2024, '政府', 8.00, 3.00, '良好', 75, 2500.00, 15.00);
```

### 4. 行业细分示例
```sql
INSERT INTO dealer_subcategory_analysis (dealer_id, period, year, track_name, subcategory_name, target_amount, actual_amount, completion_rate, margin, product_mix_premium, product_mix_standard, product_mix_budget, status, insight, actions, priority)
VALUES
('DEALER001', 'current', 2024, '教育', '幼教', 2000.00, 960.00, 48.00, 16.00, 30.00, 50.00, 20.00, '需加强', '完成率仅48%，主要因为低价竞争激烈', '["减少预算型产品占比至10%","增加幼教特色增值服务"]', '高'),
('DEALER001', 'current', 2024, '教育', 'K12', 3000.00, 2720.00, 91.00, 19.00, 40.00, 45.00, 15.00, '良好', '完成率91%，表现良好', '["保持当前产品策略","拓展在线教育解决方案"]', '中');
```

### 5. 项目漏斗示例
```sql
INSERT INTO dealer_project_funnel (dealer_id, period, year, stage, project_count, conversion_rate, issues, risk_level, actions)
VALUES
('DEALER001', 'current', 2024, '初报备', 250, 100.00, '无', '低', '保持报备节奏'),
('DEALER001', 'current', 2024, '现场勘察', 180, 72.00, '客户配合度低', '中', '提前准备勘察清单'),
('DEALER001', 'current', 2024, '需求确认', 140, 56.00, '需求不明确', '高', '增加需求调研投入'),
('DEALER001', 'current', 2024, '方案提交', 95, 38.00, '方案定制化周期长', '中', '建立方案模板库'),
('DEALER001', 'current', 2024, '方案确认', 70, 28.00, '竞争对手方案更优', '高', '强化差异化优势'),
('DEALER001', 'current', 2024, '采购流程', 50, 20.00, '采购流程复杂', '中', '协助客户梳理流程'),
('DEALER001', 'current', 2024, '合同签约', 30, 12.00, '价格谈判僵持', '高', '明确折扣权限');
```

### 6. 风险统计示例
```sql
INSERT INTO dealer_project_risk_stats (dealer_id, period, year, risk_category, project_count, percentage, total_amount, avg_amount, issues, suggestions, impact)
VALUES
('DEALER001', 'current', 2024, '高风险项目', 28, 11.20, 2800.00, 100.00, '["超期超过30天","客户预算未确认"]', '["立即停止投入","重新评估项目价值"]', '释放报备资源28个'),
('DEALER001', 'current', 2024, '中风险项目', 65, 26.00, 5200.00, 80.00, '["项目周期过长","决策流程复杂"]', '["明确项目优先级","简化报价方案"]', '预计可挽回35个项目');
```

### 7. 关键项目示例
```sql
INSERT INTO dealer_critical_projects (dealer_id, project_id, project_name, customer, industry, stage, amount, overdue_days, risk_level, issues, probability, suggestion, action_plan, priority)
VALUES
('DEALER001', 'P001', 'XX学校净化项目', 'XX教育集团', '教育', '方案确认', 350.00, 35, '严重', '["超期35天，客户态度冷淡","竞争对手已提交第二轮方案"]', 20.00, '立即安排高层拜访，了解真实情况', '紧急拜访 | 竞品分析 | 预算确认', '高'),
('DEALER001', 'P002', 'XX医院净化系统', 'XX医疗中心', '医疗', '采购流程', 480.00, 28, '高', '["采购流程停滞","客户可能更换供应商"]', 50.00, '技术人员上门沟通，解决技术疑虑', '技术支持 | 采购跟进 | 竞品监控', '高');
```

---

## 🔄 数据查询示例

### 查询核心指标
```sql
SELECT * FROM dealer_core_metrics
WHERE dealer_id = 'DEALER001' AND period = 'current' AND year = 2024;
```

### 查询月度趋势
```sql
SELECT year, month, target_amount, completed_amount, forecast_amount, completion_rate
FROM dealer_monthly_sales
WHERE dealer_id = 'DEALER001' AND year = 2024
ORDER BY month;
```

### 查询赛道数据
```sql
SELECT * FROM dealer_track_analysis
WHERE dealer_id = 'DEALER001' AND period = 'current' AND year = 2024
ORDER BY percentage DESC;
```

### 查询细分行业（按赛道）
```sql
SELECT * FROM dealer_subcategory_analysis
WHERE dealer_id = 'DEALER001' AND period = 'current' AND year = 2024 AND track_name = '教育'
ORDER BY completion_rate DESC;
```

### 查询项目漏斗
```sql
SELECT stage, project_count, conversion_rate, issues, risk_level
FROM dealer_project_funnel
WHERE dealer_id = 'DEALER001' AND period = 'current' AND year = 2024
ORDER BY conversion_rate DESC;
```

### 查询高风险项目
```sql
SELECT * FROM dealer_critical_projects
WHERE dealer_id = 'DEALER001' AND risk_level IN ('严重', '高')
ORDER BY overdue_days DESC, amount DESC;
```

---

## 📌 注意事项

1. **时间周期说明**：
   - `current`：当前月度数据（如3月数据）
   - `quarter`：当季度累计数据（1-3月累计）
   - `year`：当年累计数据（1-12月累计）

2. **数据更新频率**：
   - 核心指标、赛道、项目漏斗等：每月更新一次
   - 月度销售：每月更新，当月数据为已完成数据
   - 关键项目：实时更新

3. **金额单位**：所有金额字段统一为**万元**

4. **百分比字段**：保留2位小数，如 `12.50` 表示 12.5%

5. **JSON 字段处理**：
   - `actions`、`issues` 等字段存储 JSON 数组
   - 查询时需要使用 `json_array_elements()` 或应用层解析

6. **索引优化**：
   - 所有查询都使用 `dealer_id` + `period/year` 组合
   - 已创建必要的索引，确保查询性能

---

## ✅ 下一步

**您需要做：**
1. 根据上述表结构，从您的业务系统拉取真实数据
2. 将数据整理成上述格式（7张表）
3. 提供给我：
   - 完整的表结构（如果有所调整）
   - 数据库连接信息（`PGDATABASE_URL`）
   - 示例数据（可选，用于测试）

**我会做：**
1. 更新 Drizzle ORM Schema 文件
2. 更新 Manager 层的数据库操作代码
3. 修改6个前端组件，从API获取真实数据
4. 提供测试和部署指导
