# 快速接入数据库指南

本指南帮助您快速接入真实数据库并编写SQL查询语句。

---

## 🚀 5步快速接入数据库

### 第1步：配置数据库连接

编辑项目根目录的 `.env` 文件：

```env
# 替换为您的真实数据库连接信息
PGDATABASE_URL=postgresql://用户名:密码@数据库地址:端口/数据库名?sslmode=require
```

**示例：**
```env
PGDATABASE_URL=postgresql://dealer_admin:SecurePass123@rds.aliyuncs.com:3432/dealer_prod?sslmode=require
```

---

### 第2步：测试数据库连接

```bash
# 在项目目录下执行
psql $PGDATABASE_URL -c "SELECT version();"

# 如果成功，会显示 PostgreSQL 版本信息
```

**如果失败，检查：**
1. 数据库地址是否正确
2. 用户名和密码是否正确
3. 数据库服务器是否允许您的IP连接（白名单/安全组）

---

### 第3步：创建数据表（如果还没有）

```bash
# 使用项目提供的SQL脚本
psql $PGDATABASE_URL -f init-sample-data.sql

# 或者只创建表结构
psql $PGDATABASE_URL << EOF
-- 表结构定义见 schema.ts 或 init-sample-data.sql
EOF
```

---

### 第4步：验证表已创建

```bash
# 查看所有表
psql $PGDATABASE_URL -c "\dt"

# 应该看到以下7张表：
# dealer_core_metrics
# dealer_monthly_sales
# dealer_track_data
# dealer_subcategory_data
# dealer_project_funnel
# dealer_project_risk
# dealer_critical_project
```

---

### 第5步：测试API

```bash
# 启动应用
bash deploy.sh

# 测试API
curl "http://localhost:5000/api/dealer/data?dealerId=default&period=current"
```

---

## 📊 SQL查询示例

### 示例1：查询核心指标

```sql
-- 查询指定经销商的核心指标
SELECT
  dealer_id,
  period,
  target_amount::numeric,
  completed_amount::numeric,
  forecast_amount::numeric,
  year_over_year_growth::numeric,
  completion_rate::numeric,
  created_at,
  updated_at
FROM dealer_core_metrics
WHERE dealer_id = 'default'
  AND period = 'current';
```

**结果示例：**
```
 dealer_id | period | target_amount | completed_amount | forecast_amount | year_over_year_growth | completion_rate | created_at | updated_at
-----------+--------+---------------+------------------+----------------+-----------------------+-----------------+------------+------------
 default   | current | 10000         | 6800             | 8500           | 12.50                 | 68.00           | 2024-01-01 | 2024-01-01
```

---

### 示例2：查询月度销售趋势

```sql
-- 查询指定经销商的月度销售数据
SELECT
  year,
  month,
  target_amount::numeric,
  completed_amount::numeric,
  forecast_amount::numeric,
  period
FROM dealer_monthly_sales
WHERE dealer_id = 'default'
  AND period = 'current'
ORDER BY year, month;
```

**结果示例：**
```
 year | month | target_amount | completed_amount | forecast_amount | period
------+-------+---------------+------------------+----------------+--------
 2024 |     1 | 800           | 600              | 750            | current
 2024 |     2 | 800           | 700              | 800            | current
 2024 |     3 | 900           | 800              | 900            | current
```

---

### 示例3：查询赛道定位分析

```sql
-- 查询指定经销商的赛道数据
SELECT
  track_name,
  percentage::numeric,
  growth_rate::numeric,
  health_score,
  health_status,
  total_amount::numeric,
  margin_rate::numeric,
  subcategory_count
FROM dealer_track_data
WHERE dealer_id = 'default'
  AND period = 'current'
ORDER BY total_amount DESC;
```

---

### 示例4：查询行业细分数据

```sql
-- 查询指定赛道下的细分行业数据
SELECT
  track_name,
  subcategory_name,
  target_amount::numeric,
  actual_amount::numeric,
  completion_rate::numeric,
  margin_rate::numeric,
  status,
  insight,
  actions,
  priority
FROM dealer_subcategory_data
WHERE dealer_id = 'default'
  AND period = 'current'
  AND track_name = '教育'
ORDER BY actual_amount DESC;
```

**结果示例：**
```
 track_name | subcategory_name | target_amount | actual_amount | completion_rate | margin_rate | status | insight | actions | priority
------------+------------------+---------------+---------------+-----------------+-------------+--------+---------+---------+----------
 教育       | 高校含BOT        | 5000          | 4100          | 82.00           | 20.00       | 良好   | 大客户...| {...}   | 低
 教育       | K12             | 3000          | 2720          | 91.00           | 19.00       | 良好   | 表现良好| {...}   | 中
 教育       | 幼教            | 2000          | 960           | 48.00           | 16.00       | 需加强 | 完成率...| {...}   | 高
```

---

### 示例5：查询项目漏斗分析

```sql
-- 查询项目漏斗数据
SELECT
  stage,
  project_count,
  conversion_rate::numeric,
  issues,
  risk_level,
  actions
FROM dealer_project_funnel
WHERE dealer_id = 'default'
  AND period = 'current'
ORDER BY
  CASE stage
    WHEN '初报备' THEN 1
    WHEN '现场勘察' THEN 2
    WHEN '需求确认' THEN 3
    WHEN '方案提交' THEN 4
    WHEN '方案确认' THEN 5
    WHEN '采购流程' THEN 6
    WHEN '合同签约' THEN 7
  END;
```

---

### 示例6：查询项目风险分析

```sql
-- 查询项目风险分类数据
SELECT
  category,
  project_count,
  percentage::numeric,
  total_amount::numeric,
  avg_amount::numeric,
  issues,
  suggestions,
  impact
FROM dealer_project_risk
WHERE dealer_id = 'default'
  AND period = 'current'
ORDER BY total_amount DESC;
```

---

### 示例7：查询关键项目预警

```sql
-- 查询高风险项目
SELECT
  id,
  project_name,
  customer_name,
  industry,
  stage,
  amount::numeric,
  overdue_days,
  risk_level,
  probability,
  suggestion,
  actions,
  priority
FROM dealer_critical_project
WHERE dealer_id = 'default'
  AND period = 'current'
  AND (risk_level = '严重' OR risk_level = '高')
ORDER BY overdue_days DESC, amount DESC;
```

---

## 📝 实用SQL查询模板

### 模板1：插入核心指标数据

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
  'DEALER001',
  'current',
  10000,
  6800,
  8500,
  12.5,
  68.0
)
ON CONFLICT (dealer_id, period) DO UPDATE SET
  target_amount = EXCLUDED.target_amount,
  completed_amount = EXCLUDED.completed_amount,
  forecast_amount = EXCLUDED.forecast_amount,
  year_over_year_growth = EXCLUDED.year_over_year_growth,
  completion_rate = EXCLUDED.completion_rate,
  updated_at = NOW();
```

---

### 模板2：插入月度销售数据（批量）

```sql
INSERT INTO dealer_monthly_sales (
  dealer_id,
  year,
  month,
  target_amount,
  completed_amount,
  forecast_amount,
  period
) VALUES
  ('DEALER001', 2024, 1, 800, 600, 750, 'current'),
  ('DEALER001', 2024, 2, 800, 700, 800, 'current'),
  ('DEALER001', 2024, 3, 900, 800, 900, 'current'),
  ('DEALER001', 2024, 4, 850, 650, 780, 'current'),
  ('DEALER001', 2024, 5, 900, 720, 820, 'current'),
  ('DEALER001', 2024, 6, 1000, 750, 900, 'current')
ON CONFLICT (dealer_id, year, month) DO UPDATE SET
  target_amount = EXCLUDED.target_amount,
  completed_amount = EXCLUDED.completed_amount,
  forecast_amount = EXCLUDED.forecast_amount,
  updated_at = NOW();
```

---

### 模板3：插入赛道数据

```sql
INSERT INTO dealer_track_data (
  dealer_id,
  track_name,
  period,
  percentage,
  growth_rate,
  health_score,
  health_status,
  total_amount,
  margin_rate,
  subcategory_count
) VALUES (
  'DEALER001',
  '教育',
  'current',
  35.0,
  12.0,
  85,
  '良好',
  3500,
  18.0,
  3
),
(
  'DEALER001',
  '企业',
  'current',
  30.0,
  -5.0,
  65,
  '需关注',
  3000,
  22.0,
  4
),
(
  'DEALER001',
  '金融',
  'current',
  15.0,
  25.0,
  92,
  '优秀',
  1500,
  28.0,
  3
)
ON CONFLICT (dealer_id, track_name, period) DO UPDATE SET
  percentage = EXCLUDED.percentage,
  growth_rate = EXCLUDED.growth_rate,
  health_score = EXCLUDED.health_score,
  health_status = EXCLUDED.health_status,
  total_amount = EXCLUDED.total_amount,
  margin_rate = EXCLUDED.margin_rate,
  subcategory_count = EXCLUDED.subcategory_count,
  updated_at = NOW();
```

---

### 模板4：插入行业细分数据

```sql
INSERT INTO dealer_subcategory_data (
  dealer_id,
  track_name,
  subcategory_name,
  period,
  target_amount,
  actual_amount,
  completion_rate,
  margin_rate,
  status,
  product_mix,
  insight,
  actions,
  priority
) VALUES (
  'DEALER001',
  '教育',
  '幼教',
  'current',
  2000,
  960,
  48.0,
  16.0,
  '需加强',
  '{"premium": 30, "standard": 50, "budget": 20}'::jsonb,
  '完成率仅48%，主要因为低价竞争激烈',
  ARRAY['减少预算型产品占比至10%', '增加幼教特色增值服务', '提升标准化产品销售效率'],
  '高'
)
ON CONFLICT (dealer_id, subcategory_name, period) DO UPDATE SET
  target_amount = EXCLUDED.target_amount,
  actual_amount = EXCLUDED.actual_amount,
  completion_rate = EXCLUDED.completion_rate,
  margin_rate = EXCLUDED.margin_rate,
  status = EXCLUDED.status,
  product_mix = EXCLUDED.product_mix,
  insight = EXCLUDED.insight,
  actions = EXCLUDED.actions,
  priority = EXCLUDED.priority,
  updated_at = NOW();
```

---

### 模板5：插入项目漏斗数据

```sql
INSERT INTO dealer_project_funnel (
  dealer_id,
  stage,
  period,
  project_count,
  conversion_rate,
  issues,
  risk_level,
  actions
) VALUES
  ('DEALER001', '初报备', 'current', 250, 100.0, '无', '低', '保持报备节奏'),
  ('DEALER001', '现场勘察', 'current', 180, 72.0, '客户配合度低', '中', '提前准备勘察清单'),
  ('DEALER001', '需求确认', 'current', 140, 56.0, '需求不明确', '高', '增加需求调研投入'),
  ('DEALER001', '方案提交', 'current', 95, 38.0, '方案定制化周期长', '中', '建立方案模板库'),
  ('DEALER001', '方案确认', 'current', 70, 28.0, '竞争对手方案更优', '高', '分析竞品方案'),
  ('DEALER001', '采购流程', 'current', 50, 20.0, '采购流程复杂', '中', '协助客户梳理流程'),
  ('DEALER001', '合同签约', 'current', 30, 12.0, '价格谈判僵持', '高', '明确折扣权限')
ON CONFLICT (dealer_id, stage, period) DO UPDATE SET
  project_count = EXCLUDED.project_count,
  conversion_rate = EXCLUDED.conversion_rate,
  issues = EXCLUDED.issues,
  risk_level = EXCLUDED.risk_level,
  actions = EXCLUDED.actions,
  updated_at = NOW();
```

---

### 模板6：插入关键项目预警数据

```sql
INSERT INTO dealer_critical_project (
  id,
  dealer_id,
  project_name,
  customer_name,
  industry,
  stage,
  amount,
  overdue_days,
  risk_level,
  issues,
  probability,
  suggestion,
  actions,
  priority,
  period
) VALUES (
  'P001',
  'DEALER001',
  'XX学校净化项目',
  'XX教育集团',
  '教育',
  '方案确认',
  350,
  35,
  '严重',
  ARRAY['超期35天，客户态度冷淡', '竞争对手已提交第二轮方案', '客户预算可能缩减'],
  20,
  '立即安排高层拜访，了解真实情况',
  '紧急拜访 | 竞品分析 | 预算确认',
  '高',
  'current'
)
ON CONFLICT (id) DO UPDATE SET
  project_name = EXCLUDED.project_name,
  customer_name = EXCLUDED.customer_name,
  industry = EXCLUDED.industry,
  stage = EXCLUDED.stage,
  amount = EXCLUDED.amount,
  overdue_days = EXCLUDED.overdue_days,
  risk_level = EXCLUDED.risk_level,
  issues = EXCLUDED.issues,
  probability = EXCLUDED.probability,
  suggestion = EXCLUDED.suggestion,
  actions = EXCLUDED.actions,
  priority = EXCLUDED.priority,
  updated_at = NOW();
```

---

## 🔧 数据更新SQL

### 更新核心指标

```sql
UPDATE dealer_core_metrics
SET
  completed_amount = 7500,
  forecast_amount = 9000,
  completion_rate = 75.0,
  updated_at = NOW()
WHERE dealer_id = 'default'
  AND period = 'current';
```

### 更新单月数据

```sql
UPDATE dealer_monthly_sales
SET
  completed_amount = 780,
  forecast_amount = 850,
  updated_at = NOW()
WHERE dealer_id = 'default'
  AND year = 2024
  AND month = 6;
```

### 批量更新赛道数据

```sql
UPDATE dealer_track_data
SET
  percentage = percentage + 5.0,
  updated_at = NOW()
WHERE dealer_id = 'default'
  AND period = 'current';
```

---

## 📊 统计查询SQL

### 查询整体完成率

```sql
SELECT
  target_amount::numeric,
  completed_amount::numeric,
  (completed_amount / target_amount * 100)::numeric(10,2) as completion_rate,
  year_over_year_growth::numeric
FROM dealer_core_metrics
WHERE dealer_id = 'default'
  AND period = 'current';
```

### 按赛道统计

```sql
SELECT
  track_name,
  total_amount::numeric,
  margin_rate::numeric,
  percentage::numeric,
  growth_rate::numeric,
  health_status
FROM dealer_track_data
WHERE dealer_id = 'default'
  AND period = 'current'
ORDER BY total_amount DESC;
```

### 按风险等级统计项目数量

```sql
SELECT
  risk_level,
  COUNT(*) as project_count,
  SUM(amount)::numeric as total_amount,
  AVG(overdue_days)::numeric(10,2) as avg_overdue_days
FROM dealer_critical_project
WHERE dealer_id = 'default'
  AND period = 'current'
GROUP BY risk_level
ORDER BY
  CASE risk_level
    WHEN '严重' THEN 1
    WHEN '高' THEN 2
    WHEN '中' THEN 3
    WHEN '低' THEN 4
  END;
```

---

## 🗑️ 数据清理SQL

### 删除指定经销商的所有数据

```sql
-- 注意：此操作会删除数据，请谨慎使用
BEGIN;

DELETE FROM dealer_critical_project WHERE dealer_id = 'DEALER001';
DELETE FROM dealer_project_risk WHERE dealer_id = 'DEALER001';
DELETE FROM dealer_project_funnel WHERE dealer_id = 'DEALER001';
DELETE FROM dealer_subcategory_data WHERE dealer_id = 'DEALER001';
DELETE FROM dealer_track_data WHERE dealer_id = 'DEALER001';
DELETE FROM dealer_monthly_sales WHERE dealer_id = 'DEALER001';
DELETE FROM dealer_core_metrics WHERE dealer_id = 'DEALER001';

COMMIT;
```

### 清空所有数据

```sql
-- ⚠️ 警告：此操作会清空所有数据，不可恢复！
TRUNCATE TABLE dealer_critical_project CASCADE;
TRUNCATE TABLE dealer_project_risk CASCADE;
TRUNCATE TABLE dealer_project_funnel CASCADE;
TRUNCATE TABLE dealer_subcategory_data CASCADE;
TRUNCATE TABLE dealer_track_data CASCADE;
TRUNCATE TABLE dealer_monthly_sales CASCADE;
TRUNCATE TABLE dealer_core_metrics CASCADE;
```

---

## 💡 最佳实践

### 1. 使用事务

```sql
BEGIN;

-- 多个SQL语句
INSERT INTO dealer_monthly_sales VALUES (...);
INSERT INTO dealer_track_data VALUES (...);

COMMIT; -- 提交
-- 或 ROLLBACK; -- 回滚
```

### 2. 批量插入

```sql
-- 使用 VALUES 一次插入多行
INSERT INTO dealer_monthly_sales (dealer_id, year, month, target_amount, completed_amount, forecast_amount, period)
VALUES
  ('D001', 2024, 1, 800, 600, 750, 'current'),
  ('D001', 2024, 2, 800, 700, 800, 'current'),
  ('D001', 2024, 3, 900, 800, 900, 'current');
```

### 3. 使用 ON CONFLICT 避免重复

```sql
INSERT INTO dealer_core_metrics (...)
VALUES (...)
ON CONFLICT (dealer_id, period) DO UPDATE SET ...;
```

### 4. 定期备份

```bash
# 备份数据库
pg_dump $PGDATABASE_URL > backup_$(date +%Y%m%d).sql
```

---

## 🚀 快速开始

### 1. 测试连接
```bash
psql $PGDATABASE_URL -c "SELECT version();"
```

### 2. 导入示例数据
```bash
psql $PGDATABASE_URL -f init-sample-data.sql
```

### 3. 验证数据
```bash
psql $PGDATABASE_URL -c "SELECT * FROM dealer_core_metrics WHERE dealer_id = 'default';"
```

### 4. 测试API
```bash
curl "http://localhost:5000/api/dealer/data?dealerId=default&period=current"
```

---

**现在您可以快速接入数据库并编写SQL查询了！** 🎉
