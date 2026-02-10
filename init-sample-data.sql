-- 经销商销售预测系统 - 初始化数据脚本
-- 使用方法: psql $PGDATABASE_URL -f init-sample-data.sql

-- 清空现有数据（慎用！）
-- TRUNCATE TABLE dealer_critical_project CASCADE;
-- TRUNCATE TABLE dealer_project_risk CASCADE;
-- TRUNCATE TABLE dealer_project_funnel CASCADE;
-- TRUNCATE TABLE dealer_subcategory_data CASCADE;
-- TRUNCATE TABLE dealer_track_data CASCADE;
-- TRUNCATE TABLE dealer_monthly_sales CASCADE;
-- TRUNCATE TABLE dealer_core_metrics CASCADE;

-- ============================================
-- 1. 核心指标数据
-- ============================================
INSERT INTO dealer_core_metrics (dealer_id, period, target_amount, completed_amount, forecast_amount, year_over_year_growth, completion_rate)
VALUES
  ('default', 'current', 10000, 6800, 8500, 12.5, 68.0)
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. 月度销售趋势数据
-- ============================================
INSERT INTO dealer_monthly_sales (dealer_id, year, month, target_amount, completed_amount, forecast_amount, period)
VALUES
  ('default', 2024, 1, 800, 600, 750, 'current'),
  ('default', 2024, 2, 800, 700, 800, 'current'),
  ('default', 2024, 3, 900, 800, 900, 'current'),
  ('default', 2024, 4, 850, 650, 780, 'current'),
  ('default', 2024, 5, 900, 720, 820, 'current'),
  ('default', 2024, 6, 1000, 750, 900, 'current'),
  ('default', 2024, 7, 950, 700, 850, 'current'),
  ('default', 2024, 8, 1000, 780, 920, 'current'),
  ('default', 2024, 9, 1100, 850, 980, 'current'),
  ('default', 2024, 10, 950, 650, 780, 'current'),
  ('default', 2024, 11, 1000, 700, 850, 'current'),
  ('default', 2024, 12, 950, 0, 750, 'current')
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. 赛道定位分析数据
-- ============================================
INSERT INTO dealer_track_data (dealer_id, track_name, period, percentage, growth_rate, health_score, health_status, total_amount, margin_rate, subcategory_count)
VALUES
  ('default', '教育', 'current', 35.0, 12.0, 85, '良好', 3500, 18.0, 3),
  ('default', '企业', 'current', 30.0, -5.0, 65, '需关注', 3000, 22.0, 4),
  ('default', '金融', 'current', 15.0, 25.0, 92, '优秀', 1500, 28.0, 3),
  ('default', '医疗', 'current', 12.0, 8.0, 78, '良好', 1200, 24.0, 3),
  ('default', '政府', 'current', 8.0, -10.0, 55, '风险', 800, 15.0, 1)
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. 行业细分数据
-- ============================================
INSERT INTO dealer_subcategory_data (dealer_id, track_name, subcategory_name, period, target_amount, actual_amount, completion_rate, margin_rate, status, product_mix, insight, actions, priority)
VALUES
  -- 教育赛道
  ('default', '教育', '幼教', 'current', 2000, 960, 48.0, 16.0, '需加强', '{"premium": 30, "standard": 50, "budget": 20}', '完成率仅48%，主要因为低价竞争激烈。产品配置中预算型产品占比20%，拉低了整体利润。', ARRAY['减少预算型产品占比至10%', '增加幼教特色增值服务', '提升标准化产品销售效率'], '高'),
  ('default', '教育', 'K12', 'current', 3000, 2720, 91.0, 19.0, '良好', '{"premium": 40, "standard": 45, "budget": 15}', '完成率91%，表现良好。高价值产品占比40%，产品配置合理。', ARRAY['保持当前产品策略', '拓展在线教育解决方案'], '中'),
  ('default', '教育', '高校含BOT', 'current', 5000, 4100, 82.0, 20.0, '良好', '{"premium": 60, "standard": 30, "budget": 10}', '大客户策略有效，高价值产品占比60%。但项目周期长影响回款。', ARRAY['优化项目回款周期', '增加融资服务支持'], '低'),

  -- 企业赛道
  ('default', '企业', '国央企', 'current', 4000, 3400, 85.0, 24.0, '良好', '{"premium": 50, "standard": 40, "budget": 10}', '稳定客户，毛利率高。产品配置合理，高价值产品占比50%。', ARRAY['扩大国央企覆盖范围', '提供定制化解决方案'], '中'),
  ('default', '企业', '外资', 'current', 2500, 2620, 105.0, 26.0, '优秀', '{"premium": 70, "standard": 25, "budget": 5}', '超额完成！高价值产品占比70%，客户接受度高，是利润主要来源。', ARRAY['保持高端定位', '增加外资客户投入'], '低'),
  ('default', '企业', '民营', 'current', 3500, 2800, 80.0, 18.0, '需关注', '{"premium": 20, "standard": 50, "budget": 30}', '完成率刚好达标，但利润偏低。预算型产品占比30%，价格敏感度高。', ARRAY['减少预算型产品占比', '聚焦中高价值民营企业', '提升服务差异化'], '高'),
  ('default', '企业', '水处理', 'current', 1500, 900, 60.0, 12.0, '需加强', '{"premium": 10, "standard": 30, "budget": 60}', '完成率仅60%，毛利率最低（12%）。预算型产品占比60%，几乎不赚钱。', ARRAY['大幅减少水处理业务', '提高报价门槛', '或转向高端水处理解决方案'], '高'),

  -- 金融赛道
  ('default', '金融', '银行', 'current', 2500, 2500, 100.0, 28.0, '优秀', '{"premium": 65, "standard": 30, "budget": 5}', '完美达成！毛利率最高（28%），高价值产品占比65%。', ARRAY['扩大金融行业投入', '培养金融行业专家团队'], '低'),
  ('default', '金融', '保险', 'current', 1000, 950, 95.0, 27.0, '优秀', '{"premium": 60, "standard": 35, "budget": 5}', '表现优秀，高价值产品占比60%，客户接受度高。', ARRAY['保持当前策略', '拓展保险行业覆盖'], '低'),
  ('default', '金融', '证券', 'current', 1000, 1050, 105.0, 29.0, '优秀', '{"premium": 70, "standard": 25, "budget": 5}', '超额完成！高价值产品占比70%，盈利能力最强。', ARRAY['加大证券行业投入', '提供高端定制方案'], '低'),

  -- 医疗赛道
  ('default', '医疗', '医院', 'current', 2000, 1780, 89.0, 24.0, '良好', '{"premium": 55, "standard": 35, "budget": 10}', '表现良好，产品配置合理。但项目周期较长。', ARRAY['优化项目交付效率', '标准化医疗行业解决方案'], '中'),
  ('default', '医疗', '诊所', 'current', 500, 560, 112.0, 22.0, '优秀', '{"premium": 45, "standard": 40, "budget": 15}', '超额完成！市场潜力大，可进一步拓展。', ARRAY['扩大诊所市场覆盖', '标准化解决方案'], '低'),
  ('default', '医疗', '体检中心', 'current', 500, 660, 132.0, 26.0, '优秀', '{"premium": 50, "standard": 40, "budget": 10}', '超额完成32%！高价值产品占比50%，市场反应热烈。', ARRAY['加大体检中心投入', '复制成功经验'], '低'),

  -- 政府赛道
  ('default', '政府', '政府机关', 'current', 3000, 2550, 85.0, 15.0, '需关注', '{"premium": 15, "standard": 45, "budget": 40}', '虽然完成率85%，但毛利率低（15%）。预算型产品占比40%，利润微薄。', ARRAY['降低政府业务占比', '提升政府项目报价', '转向智慧政府高价值方案'], '高')
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. 项目漏斗分析数据
-- ============================================
INSERT INTO dealer_project_funnel (dealer_id, stage, period, project_count, conversion_rate, issues, risk_level, actions)
VALUES
  ('default', '初报备', 'current', 250, 100.0, '无', '低', '保持报备节奏'),
  ('default', '现场勘察', 'current', 180, 72.0, '客户配合度低', '中', '提前准备勘察清单，减少等待时间'),
  ('default', '需求确认', 'current', 140, 56.0, '需求不明确', '高', '增加需求调研投入，使用标准化问卷'),
  ('default', '方案提交', 'current', 95, 38.0, '方案定制化周期长', '中', '建立方案模板库，提升效率'),
  ('default', '方案确认', 'current', 70, 28.0, '竞争对手方案更优', '高', '分析竞品方案，强化差异化优势'),
  ('default', '采购流程', 'current', 50, 20.0, '采购流程复杂', '中', '协助客户梳理采购流程，提供支持'),
  ('default', '合同签约', 'current', 30, 12.0, '价格谈判僵持', '高', '明确折扣权限，快速决策')
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. 项目风险分析数据
-- ============================================
INSERT INTO dealer_project_risk (dealer_id, category, period, project_count, percentage, total_amount, avg_amount, issues, suggestions, impact)
VALUES
  ('default', '高风险项目', 'current', 28, 11.2, 2800, 100, ARRAY['超期超过30天', '客户预算未确认', '竞争对手强势'], ARRAY['立即停止投入', '重新评估项目价值', '清理报备资源'], '释放报备资源28个，可报备新项目'),
  ('default', '中风险项目', 'current', 65, 26.0, 5200, 80, ARRAY['项目周期过长', '决策流程复杂', '价格敏感度高'], ARRAY['明确项目优先级', '简化报价方案', '定期跟进节奏'], '预计可挽回35个项目，减少资源浪费'),
  ('default', '低风险项目', 'current', 95, 38.0, 7600, 80, ARRAY[]::text[], ARRAY['保持跟进频率', '优化服务体验', '提升转化效率'], '保持正常推进，预计转化率25%'),
  ('default', '高价值项目', 'current', 18, 7.2, 3600, 200, ARRAY[]::text[], ARRAY['投入最优资源', '快速响应需求', '缩短成交周期'], '每个项目成功可贡献200万，应重点关注'),
  ('default', '即将成交项目', 'current', 12, 4.8, 1800, 150, ARRAY[]::text[], ARRAY['加速合同流程', '确保资源到位', '防范临时变卦'], '预计本月可签约1800万')
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. 关键项目预警数据
-- ============================================
INSERT INTO dealer_critical_project (id, dealer_id, project_name, customer_name, industry, stage, amount, overdue_days, risk_level, issues, probability, suggestion, actions, priority, period)
VALUES
  ('P001', 'default', 'XX学校净化项目', 'XX教育集团', '教育', '方案确认', 350, 35, '严重', ARRAY['超期35天，客户态度冷淡', '竞争对手已提交第二轮方案', '客户预算可能缩减'], 20, '立即安排高层拜访，了解真实情况，评估是否值得继续投入', '紧急拜访 | 竞品分析 | 预算确认', '高', 'current'),
  ('P002', 'default', 'XX医院净化系统', 'XX医疗中心', '医疗', '采购流程', 480, 28, '高', ARRAY['采购流程停滞', '客户可能更换供应商', '技术参数被质疑'], 50, '技术人员上门沟通，解决技术疑虑，同时了解采购进展', '技术支持 | 采购跟进 | 竞品监控', '高', 'current'),
  ('P003', 'default', 'XX金融办公楼', 'XX银行', '金融', '方案提交', 520, 15, '中', ARRAY['方案评审周期长', '客户内部存在反对声音'], 70, '保持适度跟进，等待方案评审结果，准备应对反对意见', '定期跟进 | 方案优化 | 关系维护', '中', 'current'),
  ('P004', 'default', 'XX企业园区项目', 'XX科技公司', '企业', '合同流程', 280, 10, '低', ARRAY['合同条款细节协商中'], 85, '加快合同条款谈判，争取本周内完成签约', '合同谈判 | 流程加速 | 防范变卦', '中', 'current')
ON CONFLICT DO NOTHING;

-- 完成提示
SELECT '初始化数据完成！' AS status;
SELECT COUNT(*) AS core_metrics_count FROM dealer_core_metrics WHERE dealer_id = 'default';
SELECT COUNT(*) AS monthly_sales_count FROM dealer_monthly_sales WHERE dealer_id = 'default';
SELECT COUNT(*) AS track_data_count FROM dealer_track_data WHERE dealer_id = 'default';
SELECT COUNT(*) AS subcategory_data_count FROM dealer_subcategory_data WHERE dealer_id = 'default';
SELECT COUNT(*) AS project_funnel_count FROM dealer_project_funnel WHERE dealer_id = 'default';
SELECT COUNT(*) AS project_risk_count FROM dealer_project_risk WHERE dealer_id = 'default';
SELECT COUNT(*) AS critical_project_count FROM dealer_critical_project WHERE dealer_id = 'default';
