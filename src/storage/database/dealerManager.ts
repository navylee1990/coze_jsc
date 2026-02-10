/**
 * 经销商数据管理器
 * 封装经销商销售预测相关的数据库操作
 */

import { eq, and, desc, asc, sql } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import * as schema from "./shared/schema";
import {
  dealerCoreMetrics,
  dealerMonthlySales,
  dealerTrackData,
  dealerSubcategoryData,
  dealerProjectFunnel,
  dealerProjectRisk,
  dealerCriticalProject,
  type DealerCoreMetrics,
  type InsertDealerCoreMetrics,
  type DealerMonthlySales,
  type InsertDealerMonthlySales,
  type DealerTrackData,
  type InsertDealerTrackData,
  type DealerSubcategoryData,
  type InsertDealerSubcategoryData,
  type DealerProjectFunnel,
  type InsertDealerProjectFunnel,
  type DealerProjectRisk,
  type InsertDealerProjectRisk,
  type DealerCriticalProject,
  type InsertDealerCriticalProject,
} from "./shared/schema";

export class DealerManager {
  private db = null as any;

  private async getDb() {
    if (!this.db) {
      this.db = await getDb(schema);
    }
    return this.db;
  }

  // ============================================
  // 核心指标管理
  // ============================================
  async getCoreMetrics(dealerId: string, period: string): Promise<DealerCoreMetrics | null> {
    try {
      const db = await this.getDb();
      const metrics = await db.query.dealerCoreMetrics.findFirst({
        where: and(
          eq(dealerCoreMetrics.dealerId, dealerId),
          eq(dealerCoreMetrics.period, period)
        ),
      });
      return metrics || null;
    } catch (error) {
      console.error('getCoreMetrics error:', error);
      throw error;
    }
  }

  async createCoreMetrics(data: InsertDealerCoreMetrics): Promise<DealerCoreMetrics> {
    try {
      const db = await this.getDb();
      const [metrics] = await db.insert(dealerCoreMetrics).values(data).returning();
      return metrics;
    } catch (error) {
      console.error('createCoreMetrics error:', error);
      throw error;
    }
  }

  async updateCoreMetrics(dealerId: string, period: string, data: Partial<InsertDealerCoreMetrics>): Promise<DealerCoreMetrics> {
    try {
      const db = await this.getDb();
      const [metrics] = await db
        .update(dealerCoreMetrics)
        .set({ ...data, updatedAt: new Date() })
        .where(
          and(
            eq(dealerCoreMetrics.dealerId, dealerId),
            eq(dealerCoreMetrics.period, period)
          )
        )
        .returning();
      return metrics;
    } catch (error) {
      console.error('updateCoreMetrics error:', error);
      throw error;
    }
  }

  // ============================================
  // 月度销售趋势管理
  // ============================================
  async getMonthlySales(dealerId: string, period: string, year?: number): Promise<DealerMonthlySales[]> {
    try {
      const db = await this.getDb();
      const conditions = [
        eq(dealerMonthlySales.dealerId, dealerId),
        eq(dealerMonthlySales.period, period),
      ];
      if (year) {
        conditions.push(eq(dealerMonthlySales.year, year));
      }

      return db.query.dealerMonthlySales.findMany({
        where: and(...conditions),
        orderBy: [asc(dealerMonthlySales.year), asc(dealerMonthlySales.month)],
      });
    } catch (error) {
      console.error('getMonthlySales error:', error);
      throw error;
    }
  }

  async createMonthlySales(data: InsertDealerMonthlySales): Promise<DealerMonthlySales> {
    try {
      const db = await this.getDb();
      const [sales] = await db.insert(dealerMonthlySales).values(data).returning();
      return sales;
    } catch (error) {
      console.error('createMonthlySales error:', error);
      throw error;
    }
  }

  async batchCreateMonthlySales(dataArray: InsertDealerMonthlySales[]): Promise<DealerMonthlySales[]> {
    try {
      const db = await this.getDb();
      return db.insert(dealerMonthlySales).values(dataArray).returning();
    } catch (error) {
      console.error('batchCreateMonthlySales error:', error);
      throw error;
    }
  }

  // ============================================
  // 赛道定位分析管理
  // ============================================
  async getTrackData(dealerId: string, period: string): Promise<DealerTrackData[]> {
    try {
      const db = await this.getDb();
      return db.query.dealerTrackData.findMany({
        where: and(
          eq(dealerTrackData.dealerId, dealerId),
          eq(dealerTrackData.period, period)
        ),
        orderBy: desc(dealerTrackData.totalAmount),
      });
    } catch (error) {
      console.error('getTrackData error:', error);
      throw error;
    }
  }

  async createTrackData(data: InsertDealerTrackData): Promise<DealerTrackData> {
    try {
      const db = await this.getDb();
      const [track] = await db.insert(dealerTrackData).values(data).returning();
      return track;
    } catch (error) {
      console.error('createTrackData error:', error);
      throw error;
    }
  }

  async batchCreateTrackData(dataArray: InsertDealerTrackData[]): Promise<DealerTrackData[]> {
    try {
      const db = await this.getDb();
      return db.insert(dealerTrackData).values(dataArray).returning();
    } catch (error) {
      console.error('batchCreateTrackData error:', error);
      throw error;
    }
  }

  // ============================================
  // 行业细分数据管理
  // ============================================
  async getSubcategoryData(dealerId: string, period: string, trackName?: string): Promise<DealerSubcategoryData[]> {
    try {
      const db = await this.getDb();
      const conditions = [
        eq(dealerSubcategoryData.dealerId, dealerId),
        eq(dealerSubcategoryData.period, period),
      ];
      if (trackName) {
        conditions.push(eq(dealerSubcategoryData.trackName, trackName));
      }

      return db.query.dealerSubcategoryData.findMany({
        where: and(...conditions),
        orderBy: desc(dealerSubcategoryData.actualAmount),
      });
    } catch (error) {
      console.error('getSubcategoryData error:', error);
      throw error;
    }
  }

  async createSubcategoryData(data: InsertDealerSubcategoryData): Promise<DealerSubcategoryData> {
    try {
      const db = await this.getDb();
      const [subcategory] = await db.insert(dealerSubcategoryData).values(data).returning();
      return subcategory;
    } catch (error) {
      console.error('createSubcategoryData error:', error);
      throw error;
    }
  }

  async batchCreateSubcategoryData(dataArray: InsertDealerSubcategoryData[]): Promise<DealerSubcategoryData[]> {
    try {
      const db = await this.getDb();
      return db.insert(dealerSubcategoryData).values(dataArray).returning();
    } catch (error) {
      console.error('batchCreateSubcategoryData error:', error);
      throw error;
    }
  }

  // ============================================
  // 项目漏斗分析管理
  // ============================================
  async getProjectFunnel(dealerId: string, period: string): Promise<DealerProjectFunnel[]> {
    try {
      const db = await this.getDb();
      return db.query.dealerProjectFunnel.findMany({
        where: and(
          eq(dealerProjectFunnel.dealerId, dealerId),
          eq(dealerProjectFunnel.period, period)
        ),
        orderBy: [
          sql`CASE
            WHEN ${dealerProjectFunnel.stage} = '初报备' THEN 1
            WHEN ${dealerProjectFunnel.stage} = '现场勘察' THEN 2
            WHEN ${dealerProjectFunnel.stage} = '需求确认' THEN 3
            WHEN ${dealerProjectFunnel.stage} = '方案提交' THEN 4
            WHEN ${dealerProjectFunnel.stage} = '方案确认' THEN 5
            WHEN ${dealerProjectFunnel.stage} = '采购流程' THEN 6
            WHEN ${dealerProjectFunnel.stage} = '合同签约' THEN 7
            ELSE 8
          END`
        ],
      });
    } catch (error) {
      console.error('getProjectFunnel error:', error);
      throw error;
    }
  }

  async createProjectFunnel(data: InsertDealerProjectFunnel): Promise<DealerProjectFunnel> {
    try {
      const db = await this.getDb();
      const [funnel] = await db.insert(dealerProjectFunnel).values(data).returning();
      return funnel;
    } catch (error) {
      console.error('createProjectFunnel error:', error);
      throw error;
    }
  }

  async batchCreateProjectFunnel(dataArray: InsertDealerProjectFunnel[]): Promise<DealerProjectFunnel[]> {
    try {
      const db = await this.getDb();
      return db.insert(dealerProjectFunnel).values(dataArray).returning();
    } catch (error) {
      console.error('batchCreateProjectFunnel error:', error);
      throw error;
    }
  }

  // ============================================
  // 项目风险分析管理
  // ============================================
  async getProjectRisk(dealerId: string, period: string): Promise<DealerProjectRisk[]> {
    try {
      const db = await this.getDb();
      return db.query.dealerProjectRisk.findMany({
        where: and(
          eq(dealerProjectRisk.dealerId, dealerId),
          eq(dealerProjectRisk.period, period)
        ),
        orderBy: desc(dealerProjectRisk.totalAmount),
      });
    } catch (error) {
      console.error('getProjectRisk error:', error);
      throw error;
    }
  }

  async createProjectRisk(data: InsertDealerProjectRisk): Promise<DealerProjectRisk> {
    try {
      const db = await this.getDb();
      const [risk] = await db.insert(dealerProjectRisk).values(data).returning();
      return risk;
    } catch (error) {
      console.error('createProjectRisk error:', error);
      throw error;
    }
  }

  async batchCreateProjectRisk(dataArray: InsertDealerProjectRisk[]): Promise<DealerProjectRisk[]> {
    try {
      const db = await this.getDb();
      return db.insert(dealerProjectRisk).values(dataArray).returning();
    } catch (error) {
      console.error('batchCreateProjectRisk error:', error);
      throw error;
    }
  }

  // ============================================
  // 关键项目预警管理
  // ============================================
  async getCriticalProjects(dealerId: string, period: string, riskLevel?: string): Promise<DealerCriticalProject[]> {
    try {
      const db = await this.getDb();
      const conditions = [
        eq(dealerCriticalProject.dealerId, dealerId),
        eq(dealerCriticalProject.period, period),
      ];
      if (riskLevel) {
        conditions.push(eq(dealerCriticalProject.riskLevel, riskLevel));
      }

      return db.query.dealerCriticalProject.findMany({
        where: and(...conditions),
        orderBy: [desc(dealerCriticalProject.overdueDays), desc(dealerCriticalProject.amount)],
      });
    } catch (error) {
      console.error('getCriticalProjects error:', error);
      throw error;
    }
  }

  async createCriticalProject(data: InsertDealerCriticalProject): Promise<DealerCriticalProject> {
    try {
      const db = await this.getDb();
      const [project] = await db.insert(dealerCriticalProject).values(data).returning();
      return project;
    } catch (error) {
      console.error('createCriticalProject error:', error);
      throw error;
    }
  }

  async batchCreateCriticalProjects(dataArray: InsertDealerCriticalProject[]): Promise<DealerCriticalProject[]> {
    try {
      const db = await this.getDb();
      return db.insert(dealerCriticalProject).values(dataArray).returning();
    } catch (error) {
      console.error('batchCreateCriticalProjects error:', error);
      throw error;
    }
  }

  // ============================================
  // 获取完整的经销商数据（所有模块）
  // ============================================
  async getFullDealerData(dealerId: string, period: string) {
    try {
      const [coreMetrics, monthlySales, trackData, subcategoryData, projectFunnel, projectRisk, criticalProjects] =
        await Promise.all([
          this.getCoreMetrics(dealerId, period),
          this.getMonthlySales(dealerId, period),
          this.getTrackData(dealerId, period),
          this.getSubcategoryData(dealerId, period),
          this.getProjectFunnel(dealerId, period),
          this.getProjectRisk(dealerId, period),
          this.getCriticalProjects(dealerId, period),
        ]);

      return {
        coreMetrics,
        monthlySales,
        trackData,
        subcategoryData,
        projectFunnel,
        projectRisk,
        criticalProjects,
      };
    } catch (error) {
      console.error('getFullDealerData error:', error);
      throw error;
    }
  }
}

// 导出单例
export const dealerManager = new DealerManager();
