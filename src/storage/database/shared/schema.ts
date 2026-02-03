/**
 * 数据库表结构定义
 * 使用 Drizzle ORM 定义所有数据库表
 */

import { pgTable, varchar, timestamp, decimal, integer, text, boolean, index } from "drizzle-orm/pg-core";

// ==================== 用户表 ====================
/**
 * 用户表
 * 存储企业微信用户信息
 */
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  weworkUserId: varchar("wework_user_id", { length: 64 }).unique().notNull(), // 企业微信用户ID
  name: varchar("name", { length: 128 }).notNull(), // 姓名
  mobile: varchar("mobile", { length: 20 }), // 手机号
  department: text("department"), // 部门（JSON字符串，支持多个部门）
  position: varchar("position", { length: 128 }), // 职位
  avatar: varchar("avatar", { length: 500 }), // 头像URL
  isActive: boolean("is_active").default(true).notNull(), // 是否激活
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  weworkUserIdIdx: index("users_wework_user_id_idx").on(table.weworkUserId),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== 项目表 ====================
/**
 * 项目表
 * 存储所有项目信息
 */
export const projects = pgTable("projects", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  projectCode: varchar("project_code", { length: 50 }), // 项目编号
  name: varchar("name", { length: 256 }).notNull(), // 项目名称
  industry: varchar("industry", { length: 128 }), // 行业
  channel: varchar("channel", { length: 128 }), // 渠道
  region: varchar("region", { length: 128 }).notNull(), // 大区
  owner: varchar("owner", { length: 128 }).notNull(), // 负责人

  // 金额相关（单位：元）
  amount: decimal("amount", { precision: 18, scale: 2 }), // 项目金额
  currentAmount: decimal("current_amount", { precision: 18, scale: 2 }), // 当前金额
  targetAmount: decimal("target_amount", { precision: 18, scale: 2 }), // 目标金额
  gapAmount: decimal("gap_amount", { precision: 18, scale: 2 }), // 缺口金额

  // 预测相关（单位：元）
  currentForecast: decimal("current_forecast", { precision: 18, scale: 2 }), // 当前预测金额
  targetForecast: decimal("target_forecast", { precision: 18, scale: 2 }), // 目标预测金额
  predictionAmount: decimal("prediction_amount", { precision: 18, scale: 2 }), // 当月预测金额

  // 转化相关
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 4 }), // 转化率（0-1）
  predictionRatio: decimal("prediction_ratio", { precision: 5, scale: 4 }), // 预测占比

  // 项目信息
  grade: varchar("grade", { length: 32 }), // 项目等级
  status: varchar("status", { length: 32 }).notNull(), // 状态
  riskLevel: varchar("risk_level", { length: 32 }), // 风险等级（normal/highRisk/critical）
  currentNode: varchar("current_node", { length: 128 }), // 当前节点
  projectType: varchar("project_type", { length: 64 }), // 项目类型（租赁/买断）
  projectPhase: varchar("project_phase", { length: 64 }), // 项目阶段

  // 成交概率
  probability: varchar("probability", { length: 20 }), // 成交概率（high/medium/low）

  // 时间相关
  plannedDate: varchar("planned_date", { length: 20 }), // 计划完成日期（YYYY-MM格式）
  actualDate: varchar("actual_date", { length: 20 }), // 实际完成日期（YYYY-MM格式）
  expectedOrderDate: varchar("expected_order_date", { length: 20 }), // 预计下单日期

  // 延迟天数
  delayDays: integer("delay_days").default(0), // 延迟天数

  // 详细信息
  detail: text("detail"), // 项目详情
  riskReason: text("risk_reason"), // 风险原因
  feedback: text("feedback"), // 情况反馈

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  regionIdx: index("projects_region_idx").on(table.region),
  ownerIdx: index("projects_owner_idx").on(table.owner),
  statusIdx: index("projects_status_idx").on(table.status),
  plannedDateIdx: index("projects_planned_date_idx").on(table.plannedDate),
}));

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// ==================== 风险识别表 ====================
/**
 * 风险识别表
 * 存储风险识别记录
 */
export const riskIdentifications = pgTable("risk_identifications", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  projectId: varchar("project_id", { length: 36 }).notNull(), // 关联项目ID
  type: varchar("type", { length: 32 }).notNull(), // 风险类型（prediction/urge/report/conversion/dependency/stagnation）
  // 类型说明：
  // - prediction: 预测不足
  // - urge: 未按计划下单
  // - report: 报备不足
  // - conversion: 转化不足
  // - dependency: 大项目依赖
  // - stagnation: 阶段停滞

  description: text("description"), // 描述
  messageTemplate: text("message_template"), // 消息模板
  status: varchar("status", { length: 32 }).default("pending").notNull(), // 状态（pending/sent/completed）

  // 发送信息
  sentAt: timestamp("sent_at"), // 发送时间
  sentTo: varchar("sent_to", { length: 128 }), // 发送给谁

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  projectIdIdx: index("risk_identifications_project_id_idx").on(table.projectId),
  typeIdx: index("risk_identifications_type_idx").on(table.type),
  statusIdx: index("risk_identifications_status_idx").on(table.status),
}));

export type RiskIdentification = typeof riskIdentifications.$inferSelect;
export type InsertRiskIdentification = typeof riskIdentifications.$inferInsert;

// ==================== 数据快照表 ====================
/**
 * 数据快照表
 * 存储每日/每月/每季度的数据快照，用于历史数据查询
 */
export const dataSnapshots = pgTable("data_snapshots", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  snapshotDate: timestamp("snapshot_date").notNull(), // 快照日期
  snapshotType: varchar("snapshot_type", { length: 20 }).notNull(), // 快照类型（daily/monthly/quarterly）

  // 项目统计
  totalProjects: integer("total_projects").notNull(), // 总项目数
  inProgressProjects: integer("in_progress_projects"), // 进行中项目数
  completedProjects: integer("completed_projects"), // 已完成项目数
  cancelledProjects: integer("cancelled_projects"), // 已取消项目数

  // 金额统计（单位：元）
  totalAmount: decimal("total_amount", { precision: 18, scale: 2 }), // 总金额
  completedAmount: decimal("completed_amount", { precision: 18, scale: 2 }), // 已完成金额
  inProgressAmount: decimal("in_progress_amount", { precision: 18, scale: 2 }), // 进行中金额

  // 转化率
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 4 }), // 转化率

  // 风险统计
  riskProjects: integer("risk_projects"), // 风险项目数
  highRiskProjects: integer("high_risk_projects"), // 高风险项目数
  criticalRiskProjects: integer("critical_risk_projects"), // 严重风险项目数

  // 延迟统计
  delayedProjects: integer("delayed_projects"), // 延迟项目数
  stagnantProjects: integer("stagnant_projects"), // 停滞项目数

  // 大项目依赖
  largeProjectCount: integer("large_project_count"), // 大项目数量
  largeProjectAmount: decimal("large_project_amount", { precision: 18, scale: 2 }), // 大项目总金额

  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  snapshotDateIdx: index("data_snapshots_snapshot_date_idx").on(table.snapshotDate),
  snapshotTypeIdx: index("data_snapshots_snapshot_type_idx").on(table.snapshotType),
}));

export type DataSnapshot = typeof dataSnapshots.$inferSelect;
export type InsertDataSnapshot = typeof dataSnapshots.$inferInsert;

// ==================== 转化不足表 ====================
/**
 * 转化不足表
 * 存储未初步接洽的项目统计
 */
export const insufficientConversions = pgTable("insufficient_conversions", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  owner: varchar("owner", { length: 128 }).notNull(), // 负责人
  region: varchar("region", { length: 128 }).notNull(), // 大区
  uncontactedCount: integer("uncontacted_count").notNull(), // 未初步接洽项目数
  feedback: text("feedback"), // 情况反馈

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  ownerIdx: index("insufficient_conversions_owner_idx").on(table.owner),
  regionIdx: index("insufficient_conversions_region_idx").on(table.region),
}));

export type InsufficientConversion = typeof insufficientConversions.$inferSelect;
export type InsertInsufficientConversion = typeof insufficientConversions.$inferInsert;

// ==================== 报备不足表 ====================
/**
 * 报备不足表
 * 存储报备项目数不足的统计
 */
export const insufficientReports = pgTable("insufficient_reports", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  owner: varchar("owner", { length: 128 }).notNull(), // 负责人
  region: varchar("region", { length: 128 }).notNull(), // 大区
  newReportedCount: integer("new_reported_count").notNull(), // 新报备项目数
  gapCount: integer("gap_count").notNull(), // 缺口项目数
  feedback: text("feedback"), // 情况反馈

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  ownerIdx: index("insufficient_reports_owner_idx").on(table.owner),
  regionIdx: index("insufficient_reports_region_idx").on(table.region),
}));

export type InsufficientReport = typeof insufficientReports.$inferSelect;
export type InsertInsufficientReport = typeof insufficientReports.$inferInsert;

// ==================== 阶段停滞表 ====================
/**
 * 阶段停滞表
 * 存储在某个阶段停滞的项目统计
 */
export const phaseStagnations = pgTable("phase_stagnations", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  owner: varchar("owner", { length: 128 }).notNull(), // 负责人
  region: varchar("region", { length: 128 }).notNull(), // 大区
  stagnationCount: integer("stagnation_count").notNull(), // 停滞阶段项目数
  feedback: text("feedback"), // 情况反馈

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  ownerIdx: index("phase_stagnations_owner_idx").on(table.owner),
  regionIdx: index("phase_stagnations_region_idx").on(table.region),
}));

export type PhaseStagnation = typeof phaseStagnations.$inferSelect;
export type InsertPhaseStagnation = typeof phaseStagnations.$inferInsert;
