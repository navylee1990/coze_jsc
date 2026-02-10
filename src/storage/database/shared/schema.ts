import { pgTable, text, varchar, numeric, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

// ============================================
// 经销商核心指标表
// ============================================
export const dealerCoreMetrics = pgTable(
  "dealer_core_metrics",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    dealerId: varchar("dealer_id", { length: 50 }).notNull(),
    period: varchar("period", { length: 20 }).notNull(), // current, quarter, year
    targetAmount: numeric("target_amount", { precision: 15, scale: 2 }).notNull().default("0"),
    completedAmount: numeric("completed_amount", { precision: 15, scale: 2 }).notNull().default("0"),
    forecastAmount: numeric("forecast_amount", { precision: 15, scale: 2 }).notNull().default("0"),
    yearOverYearGrowth: numeric("year_over_year_growth", { precision: 5, scale: 2 }).notNull().default("0"),
    completionRate: numeric("completion_rate", { precision: 5, scale: 2 }).notNull().default("0"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    dealerPeriodIdx: index("dealer_core_metrics_dealer_period_idx").on(table.dealerId, table.period),
  })
);

// ============================================
// 经销商月度销售趋势表
// ============================================
export const dealerMonthlySales = pgTable(
  "dealer_monthly_sales",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    dealerId: varchar("dealer_id", { length: 50 }).notNull(),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    targetAmount: numeric("target_amount", { precision: 15, scale: 2 }).notNull().default("0"),
    completedAmount: numeric("completed_amount", { precision: 15, scale: 2 }).notNull().default("0"),
    forecastAmount: numeric("forecast_amount", { precision: 15, scale: 2 }).notNull().default("0"),
    period: varchar("period", { length: 20 }).notNull(), // current, quarter, year
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    dealerYearMonthIdx: index("dealer_monthly_sales_dealer_year_month_idx").on(table.dealerId, table.year, table.month),
  })
);

// ============================================
// 赛道定位分析表
// ============================================
export const dealerTrackData = pgTable(
  "dealer_track_data",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    dealerId: varchar("dealer_id", { length: 50 }).notNull(),
    trackName: varchar("track_name", { length: 50 }).notNull(), // 教育、企业、金融、医疗、政府
    period: varchar("period", { length: 20 }).notNull(),
    percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull().default("0"), // 占比
    growthRate: numeric("growth_rate", { precision: 5, scale: 2 }).notNull().default("0"), // 增长率
    healthScore: integer("health_score").notNull().default(0), // 健康度评分
    healthStatus: varchar("health_status", { length: 20 }).notNull(), // 优秀、良好、需关注、风险
    totalAmount: numeric("total_amount", { precision: 15, scale: 2 }).notNull().default("0"),
    marginRate: numeric("margin_rate", { precision: 5, scale: 2 }).notNull().default("0"), // 毛利率
    subcategoryCount: integer("subcategory_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    dealerTrackPeriodIdx: index("dealer_track_data_dealer_track_period_idx").on(table.dealerId, table.trackName, table.period),
  })
);

// ============================================
// 行业细分数据表
// ============================================
export const dealerSubcategoryData = pgTable(
  "dealer_subcategory_data",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    dealerId: varchar("dealer_id", { length: 50 }).notNull(),
    trackName: varchar("track_name", { length: 50 }).notNull(), // 所属赛道
    subcategoryName: varchar("subcategory_name", { length: 50 }).notNull(), // 幼教、K12、国央企等
    period: varchar("period", { length: 20 }).notNull(),
    targetAmount: numeric("target_amount", { precision: 15, scale: 2 }).notNull().default("0"),
    actualAmount: numeric("actual_amount", { precision: 15, scale: 2 }).notNull().default("0"),
    completionRate: numeric("completion_rate", { precision: 5, scale: 2 }).notNull().default("0"),
    marginRate: numeric("margin_rate", { precision: 5, scale: 2 }).notNull().default("0"),
    status: varchar("status", { length: 20 }).notNull(), // 优秀、良好、需关注、需加强
    productMix: jsonb("product_mix"), // { premium: 30, standard: 50, budget: 20 }
    insight: text("insight"), // 洞察
    actions: jsonb("actions"), // 行动建议数组
    priority: varchar("priority", { length: 10 }), // 优先级
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    dealerSubcategoryPeriodIdx: index("dealer_subcategory_data_dealer_subcategory_period_idx").on(table.dealerId, table.subcategoryName, table.period),
  })
);

// ============================================
// 项目漏斗分析表
// ============================================
export const dealerProjectFunnel = pgTable(
  "dealer_project_funnel",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    dealerId: varchar("dealer_id", { length: 50 }).notNull(),
    stage: varchar("stage", { length: 50 }).notNull(), // 初报备、现场勘察、需求确认等
    period: varchar("period", { length: 20 }).notNull(),
    projectCount: integer("project_count").notNull().default(0),
    conversionRate: numeric("conversion_rate", { precision: 5, scale: 2 }).notNull().default("0"),
    issues: text("issues"), // 问题描述
    riskLevel: varchar("risk_level", { length: 10 }), // 低、中、高
    actions: text("actions"), // 改进措施
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    dealerStagePeriodIdx: index("dealer_project_funnel_dealer_stage_period_idx").on(table.dealerId, table.stage, table.period),
  })
);

// ============================================
// 项目风险分析表
// ============================================
export const dealerProjectRisk = pgTable(
  "dealer_project_risk",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    dealerId: varchar("dealer_id", { length: 50 }).notNull(),
    category: varchar("category", { length: 50 }).notNull(), // 高风险、中风险、低风险、高价值、即将成交
    period: varchar("period", { length: 20 }).notNull(),
    projectCount: integer("project_count").notNull().default(0),
    percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull().default("0"),
    totalAmount: numeric("total_amount", { precision: 15, scale: 2 }).notNull().default("0"),
    avgAmount: numeric("avg_amount", { precision: 15, scale: 2 }).notNull().default("0"),
    issues: jsonb("issues"), // 问题描述数组
    suggestions: jsonb("suggestions"), // 建议数组
    impact: text("impact"), // 预期收益
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    dealerCategoryPeriodIdx: index("dealer_project_risk_dealer_category_period_idx").on(table.dealerId, table.category, table.period),
  })
);

// ============================================
// 关键项目预警表
// ============================================
export const dealerCriticalProject = pgTable(
  "dealer_critical_project",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    dealerId: varchar("dealer_id", { length: 50 }).notNull(),
    projectName: varchar("project_name", { length: 200 }).notNull(),
    customerName: varchar("customer_name", { length: 200 }).notNull(),
    industry: varchar("industry", { length: 50 }).notNull(),
    stage: varchar("stage", { length: 50 }).notNull(),
    amount: numeric("amount", { precision: 15, scale: 2 }).notNull().default("0"),
    overdueDays: integer("overdue_days").notNull().default(0),
    riskLevel: varchar("risk_level", { length: 20 }).notNull(), // 严重、高、中、低
    issues: jsonb("issues"), // 问题数组
    probability: integer("probability").notNull().default(0), // 成功率
    suggestion: text("suggestion"), // 建议
    actions: text("actions"), // 行动措施
    priority: varchar("priority", { length: 10 }), // 优先级
    period: varchar("period", { length: 20 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    dealerProjectPeriodIdx: index("dealer_critical_project_dealer_project_period_idx").on(table.dealerId, table.period),
    riskLevelIdx: index("dealer_critical_project_risk_level_idx").on(table.riskLevel),
  })
);

// ============================================
// Zod Schemas (使用 createSchemaFactory 处理 timestamp)
// ============================================
const { createInsertSchema: createCoercedInsertSchema, createUpdateSchema: createCoercedUpdateSchema } = createSchemaFactory({
  coerce: { date: true },
});

// 核心指标
export const insertDealerCoreMetricsSchema = createCoercedInsertSchema(dealerCoreMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDealerCoreMetricsSchema = createCoercedUpdateSchema(dealerCoreMetrics)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// 月度销售
export const insertDealerMonthlySalesSchema = createCoercedInsertSchema(dealerMonthlySales).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDealerMonthlySalesSchema = createCoercedUpdateSchema(dealerMonthlySales)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// 赛道数据
export const insertDealerTrackDataSchema = createCoercedInsertSchema(dealerTrackData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDealerTrackDataSchema = createCoercedUpdateSchema(dealerTrackData)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// 细分行业数据
export const insertDealerSubcategoryDataSchema = createCoercedInsertSchema(dealerSubcategoryData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  productMix: z.object({
    premium: z.number().optional(),
    standard: z.number().optional(),
    budget: z.number().optional(),
  }).optional(),
  actions: z.array(z.string()).optional(),
});

export const updateDealerSubcategoryDataSchema = createCoercedUpdateSchema(dealerSubcategoryData)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial()
  .extend({
    productMix: z.object({
      premium: z.number().optional(),
      standard: z.number().optional(),
      budget: z.number().optional(),
    }).optional(),
    actions: z.array(z.string()).optional(),
  });

// 项目漏斗
export const insertDealerProjectFunnelSchema = createCoercedInsertSchema(dealerProjectFunnel).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDealerProjectFunnelSchema = createCoercedUpdateSchema(dealerProjectFunnel)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// 项目风险
export const insertDealerProjectRiskSchema = createCoercedInsertSchema(dealerProjectRisk).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  issues: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional(),
});

export const updateDealerProjectRiskSchema = createCoercedUpdateSchema(dealerProjectRisk)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial()
  .extend({
  issues: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional(),
});

// 关键项目预警
export const insertDealerCriticalProjectSchema = createCoercedInsertSchema(dealerCriticalProject).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  issues: z.array(z.string()).optional(),
});

export const updateDealerCriticalProjectSchema = createCoercedUpdateSchema(dealerCriticalProject)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial()
  .extend({
  issues: z.array(z.string()).optional(),
});

// ============================================
// TypeScript Types
// ============================================
export type DealerCoreMetrics = typeof dealerCoreMetrics.$inferSelect;
export type InsertDealerCoreMetrics = z.infer<typeof insertDealerCoreMetricsSchema>;
export type UpdateDealerCoreMetrics = z.infer<typeof updateDealerCoreMetricsSchema>;

export type DealerMonthlySales = typeof dealerMonthlySales.$inferSelect;
export type InsertDealerMonthlySales = z.infer<typeof insertDealerMonthlySalesSchema>;
export type UpdateDealerMonthlySales = z.infer<typeof updateDealerMonthlySalesSchema>;

export type DealerTrackData = typeof dealerTrackData.$inferSelect;
export type InsertDealerTrackData = z.infer<typeof insertDealerTrackDataSchema>;
export type UpdateDealerTrackData = z.infer<typeof updateDealerTrackDataSchema>;

export type DealerSubcategoryData = typeof dealerSubcategoryData.$inferSelect;
export type InsertDealerSubcategoryData = z.infer<typeof insertDealerSubcategoryDataSchema>;
export type UpdateDealerSubcategoryData = z.infer<typeof updateDealerSubcategoryDataSchema>;

export type DealerProjectFunnel = typeof dealerProjectFunnel.$inferSelect;
export type InsertDealerProjectFunnel = z.infer<typeof insertDealerProjectFunnelSchema>;
export type UpdateDealerProjectFunnel = z.infer<typeof updateDealerProjectFunnelSchema>;

export type DealerProjectRisk = typeof dealerProjectRisk.$inferSelect;
export type InsertDealerProjectRisk = z.infer<typeof insertDealerProjectRiskSchema>;
export type UpdateDealerProjectRisk = z.infer<typeof updateDealerProjectRiskSchema>;

export type DealerCriticalProject = typeof dealerCriticalProject.$inferSelect;
export type InsertDealerCriticalProject = z.infer<typeof insertDealerCriticalProjectSchema>;
export type UpdateDealerCriticalProject = z.infer<typeof updateDealerCriticalProjectSchema>;
