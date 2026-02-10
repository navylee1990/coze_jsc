# SQL 快速参考卡

## 📋 数据表说明

| 表名 | 用途 | 主键 |
|-----|------|------|
| dealer_core_metrics | 核心指标 | id |
| dealer_monthly_sales | 月度销售 | (dealer_id, year, month) |
| dealer_track_data | 赛道分析 | (dealer_id, track_name, period) |
| dealer_subcategory_data | 行业细分 | (dealer_id, subcategory_name, period) |
| dealer_project_funnel | 项目漏斗 | (dealer_id, stage, period) |
| dealer_project_risk | 项目风险 | (dealer_id, category, period) |
| dealer_critical_project | 关键项目 | id |

---

## 🔥 常用查询

### 1. 查看所有表
```sql
\dt
```

### 2. 查看表结构
```sql
\d dealer_core_metrics
```

### 3. 查询核心指标
```sql
SELECT * FROM dealer_core_metrics
WHERE dealer_id = 'default' AND period = 'current';
```

### 4. 查询月度销售
```sql
SELECT * FROM dealer_monthly_sales
WHERE dealer_id = 'default' AND period = 'current'
ORDER BY year, month;
```

### 5. 查询赛道数据
```sql
SELECT track_name, percentage, growth_rate, total_amount, margin_rate
FROM dealer_track_data
WHERE dealer_id = 'default' AND period = 'current';
```

### 6. 查询行业细分
```sql
SELECT * FROM dealer_subcategory_data
WHERE dealer_id = 'default' AND period = 'current'
ORDER BY actual_amount DESC;
```

### 7. 查询项目漏斗
```sql
SELECT * FROM dealer_project_funnel
WHERE dealer_id = 'default' AND period = 'current';
```

### 8. 查询高风险项目
```sql
SELECT * FROM dealer_critical_project
WHERE dealer_id = 'default' AND period = 'current'
  AND (risk_level = '严重' OR risk_level = '高')
ORDER BY overdue_days DESC;
```

---

## 📝 快速插入模板

### 核心指标
```sql
INSERT INTO dealer_core_metrics (
  dealer_id, period, target_amount, completed_amount,
  forecast_amount, year_over_year_growth, completion_rate
) VALUES (
  'D001', 'current', 10000, 6800, 8500, 12.5, 68.0
) ON CONFLICT (dealer_id, period) DO UPDATE SET
  completed_amount = EXCLUDED.completed_amount,
  forecast_amount = EXCLUDED.forecast_amount,
  completion_rate = EXCLUDED.completion_rate;
```

### 月度销售
```sql
INSERT INTO dealer_monthly_sales (
  dealer_id, year, month, target_amount, completed_amount,
  forecast_amount, period
) VALUES (
  'D001', 2024, 1, 800, 600, 750, 'current'
) ON CONFLICT (dealer_id, year, month) DO UPDATE SET
  completed_amount = EXCLUDED.completed_amount,
  forecast_amount = EXCLUDED.forecast_amount;
```

### 赛道数据
```sql
INSERT INTO dealer_track_data (
  dealer_id, track_name, period, percentage, growth_rate,
  health_score, health_status, total_amount, margin_rate
) VALUES (
  'D001', '教育', 'current', 35.0, 12.0, 85, '良好', 3500, 18.0
) ON CONFLICT (dealer_id, track_name, period) DO UPDATE SET
  percentage = EXCLUDED.percentage,
  total_amount = EXCLUDED.total_amount;
```

### 行业细分
```sql
INSERT INTO dealer_subcategory_data (
  dealer_id, track_name, subcategory_name, period,
  target_amount, actual_amount, completion_rate, margin_rate,
  status, product_mix, insight, actions, priority
) VALUES (
  'D001', '教育', '幼教', 'current',
  2000, 960, 48.0, 16.0,
  '需加强',
  '{"premium": 30, "standard": 50, "budget": 20}'::jsonb,
  '完成率仅48%',
  ARRAY['减少预算型产品占比'],
  '高'
) ON CONFLICT (dealer_id, subcategory_name, period) DO UPDATE SET
  actual_amount = EXCLUDED.actual_amount,
  completion_rate = EXCLUDED.completion_rate;
```

### 项目漏斗
```sql
INSERT INTO dealer_project_funnel (
  dealer_id, stage, period, project_count,
  conversion_rate, issues, risk_level, actions
) VALUES (
  'D001', '初报备', 'current', 250, 100.0,
  '无', '低', '保持报备节奏'
) ON CONFLICT (dealer_id, stage, period) DO UPDATE SET
  project_count = EXCLUDED.project_count;
```

### 关键项目
```sql
INSERT INTO dealer_critical_project (
  id, dealer_id, project_name, customer_name, industry,
  stage, amount, overdue_days, risk_level, issues,
  probability, suggestion, actions, priority, period
) VALUES (
  'P001', 'D001', 'XX学校净化项目', 'XX教育集团', '教育',
  '方案确认', 350, 35, '严重',
  ARRAY['超期35天'],
  20, '立即安排高层拜访', '紧急拜访', '高', 'current'
) ON CONFLICT (id) DO UPDATE SET
  overdue_days = EXCLUDED.overdue_days,
  risk_level = EXCLUDED.risk_level;
```

---

## 🔧 常用更新

### 更新核心指标
```sql
UPDATE dealer_core_metrics
SET completed_amount = 7500, forecast_amount = 9000, completion_rate = 75.0
WHERE dealer_id = 'D001' AND period = 'current';
```

### 更新月度数据
```sql
UPDATE dealer_monthly_sales
SET completed_amount = 780, forecast_amount = 850
WHERE dealer_id = 'D001' AND year = 2024 AND month = 6;
```

### 更新项目超期天数
```sql
UPDATE dealer_critical_project
SET overdue_days = DATEDIFF('day', expected_order_date, CURRENT_DATE)
WHERE dealer_id = 'D001' AND period = 'current';
```

---

## 📊 统计查询

### 整体完成率
```sql
SELECT
  target_amount::numeric,
  completed_amount::numeric,
  (completed_amount / target_amount * 100)::numeric(10,2) as rate
FROM dealer_core_metrics
WHERE dealer_id = 'D001' AND period = 'current';
```

### 各赛道占比
```sql
SELECT
  track_name,
  percentage::numeric,
  total_amount::numeric,
  margin_rate::numeric,
  growth_rate::numeric
FROM dealer_track_data
WHERE dealer_id = 'D001' AND period = 'current'
ORDER BY total_amount DESC;
```

### 项目风险统计
```sql
SELECT
  risk_level,
  COUNT(*) as count,
  SUM(amount)::numeric as total
FROM dealer_critical_project
WHERE dealer_id = 'D001' AND period = 'current'
GROUP BY risk_level;
```

---

## 🗑️ 删除数据

### 删除单条数据
```sql
DELETE FROM dealer_critical_project WHERE id = 'P001';
```

### 删除指定经销商的所有数据
```sql
BEGIN;
DELETE FROM dealer_critical_project WHERE dealer_id = 'D001';
DELETE FROM dealer_project_risk WHERE dealer_id = 'D001';
DELETE FROM dealer_project_funnel WHERE dealer_id = 'D001';
DELETE FROM dealer_subcategory_data WHERE dealer_id = 'D001';
DELETE FROM dealer_track_data WHERE dealer_id = 'D001';
DELETE FROM dealer_monthly_sales WHERE dealer_id = 'D001';
DELETE FROM dealer_core_metrics WHERE dealer_id = 'D001';
COMMIT;
```

### 清空所有数据（⚠️ 慎用）
```sql
TRUNCATE TABLE dealer_critical_project CASCADE;
TRUNCATE TABLE dealer_project_risk CASCADE;
TRUNCATE TABLE dealer_project_funnel CASCADE;
TRUNCATE TABLE dealer_subcategory_data CASCADE;
TRUNCATE TABLE dealer_track_data CASCADE;
TRUNCATE TABLE dealer_monthly_sales CASCADE;
TRUNCATE TABLE dealer_core_metrics CASCADE;
```

---

## 💡 技巧

### 1. JSONB 类型操作
```sql
-- 插入 JSON 数据
INSERT INTO dealer_subcategory_data (product_mix)
VALUES ('{"premium": 30, "standard": 50, "budget": 20}'::jsonb);

-- 查询 JSON 字段
SELECT product_mix->'premium' FROM dealer_subcategory_data;

-- 更新 JSON 字段
UPDATE dealer_subcategory_data
SET product_mix = jsonb_set(product_mix, '{premium}', '40')
WHERE subcategory_name = '幼教';
```

### 2. 数组操作
```sql
-- 查询数组包含某个值
SELECT * FROM dealer_critical_project
WHERE '超期35天' = ANY(issues);

-- 添加数组元素
UPDATE dealer_critical_project
SET issues = array_append(issues, '新问题')
WHERE id = 'P001';
```

### 3. 日期计算
```sql
-- 当前日期
SELECT CURRENT_DATE;

-- 日期差（天数）
SELECT DATEDIFF('day', created_at, CURRENT_DATE) FROM dealer_core_metrics;

-- 月份开始
SELECT DATE_TRUNC('month', CURRENT_DATE);

-- 月份结束
SELECT DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day';
```

---

## 🚀 快速命令

### 连接数据库
```bash
psql $PGDATABASE_URL
```

### 执行SQL文件
```bash
psql $PGDATABASE_URL -f init-sample-data.sql
```

### 导出数据
```bash
pg_dump $PGDATABASE_URL > backup.sql
```

### 导入数据
```bash
psql $PGDATABASE_URL < backup.sql
```

---

**将此页面收藏，随时查阅！** 📌
