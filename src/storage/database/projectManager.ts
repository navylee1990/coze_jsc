/**
 * 项目管理器
 * 封装项目相关的数据库操作
 */

import { eq, and, desc, sql, like, or, gt, gte, lte } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import { projects } from "./shared/schema";
import type { Project, InsertProject } from "./shared/schema";

export interface ProjectQueryParams {
  industry?: string;
  channel?: string;
  region?: string;
  owner?: string;
  grade?: string;
  status?: string;
  riskLevel?: string;
  page?: number;
  pageSize?: number;
}

export class ProjectManager {
  /**
   * 获取项目列表（支持分页和过滤）
   */
  async getProjects(params?: ProjectQueryParams): Promise<{
    data: Project[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const db = await getDb();
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;

      // 构建过滤条件
      const conditions = [];
      if (params?.industry) {
        conditions.push(eq(projects.industry, params.industry));
      }
      if (params?.channel) {
        conditions.push(eq(projects.channel, params.channel));
      }
      if (params?.region) {
        conditions.push(eq(projects.region, params.region));
      }
      if (params?.owner) {
        conditions.push(eq(projects.owner, params.owner));
      }
      if (params?.grade) {
        conditions.push(eq(projects.grade, params.grade));
      }
      if (params?.status) {
        conditions.push(eq(projects.status, params.status));
      }
      if (params?.riskLevel) {
        conditions.push(eq(projects.riskLevel, params.riskLevel));
      }

      // 构建查询（使用条件表达式）
      const baseQuery = db.select().from(projects);
      const query = conditions.length > 0
        ? baseQuery.where(and(...conditions)).orderBy(desc(projects.updatedAt))
        : baseQuery.orderBy(desc(projects.updatedAt));

      // 获取总数
      const allResults = await query;
      const total = allResults.length;

      // 获取分页数据
      const data = await query.limit(pageSize).offset((page - 1) * pageSize);

      return { data, total, page, pageSize };
    } catch (error) {
      console.error('getProjects error:', error);
      throw error;
    }
  }

  /**
   * 根据ID查询项目
   */
  async getProjectById(id: string): Promise<Project | null> {
    try {
      const db = await getDb();
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id));
      return project || null;
    } catch (error) {
      console.error('getProjectById error:', error);
      throw error;
    }
  }

  /**
   * 创建项目
   */
  async createProject(data: InsertProject): Promise<Project> {
    try {
      const db = await getDb();
      const [project] = await db.insert(projects).values(data).returning();
      return project;
    } catch (error) {
      console.error('createProject error:', error);
      throw error;
    }
  }

  /**
   * 更新项目
   */
  async updateProject(id: string, data: Partial<InsertProject>): Promise<Project> {
    try {
      const db = await getDb();
      const [project] = await db
        .update(projects)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      return project;
    } catch (error) {
      console.error('updateProject error:', error);
      throw error;
    }
  }

  /**
   * 删除项目
   */
  async deleteProject(id: string): Promise<boolean> {
    try {
      const db = await getDb();
      const result = await db
        .delete(projects)
        .where(eq(projects.id, id));
      return true;
    } catch (error) {
      console.error('deleteProject error:', error);
      throw error;
    }
  }

  /**
   * 获取预测不足的项目
   * 条件：currentForecast < targetForecast * 0.8
   */
  async getPredictionGaps(): Promise<Project[]> {
    try {
      const db = await getDb();
      const result = await db
        .select()
        .from(projects)
        .where(
          and(
            sql`${projects.currentForecast} < ${projects.targetForecast} * 0.8`,
            sql`${projects.status} = 'in_progress'`
          )
        )
        .orderBy(desc(projects.gapAmount))
        .limit(100);
      return result;
    } catch (error) {
      console.error('getPredictionGaps error:', error);
      throw error;
    }
  }

  /**
   * 获取未按计划下单的项目
   * 条件：expectedOrderDate < 当前日期 且未下单
   */
  async getUnorderedProjects(): Promise<Project[]> {
    try {
      const db = await getDb();
      const result = await db
        .select()
        .from(projects)
        .where(
          and(
            sql`${projects.expectedOrderDate} IS NOT NULL`,
            sql`${projects.status} = 'in_progress'`,
            sql`${projects.delayDays} > 0`
          )
        )
        .orderBy(desc(projects.delayDays))
        .limit(100);
      return result;
    } catch (error) {
      console.error('getUnorderedProjects error:', error);
      throw error;
    }
  }

  /**
   * 获取大项目依赖
   * 条件：amount > 100万
   */
  async getLargeProjectDependencies(): Promise<Project[]> {
    try {
      const db = await getDb();
      const result = await db
        .select()
        .from(projects)
        .where(gte(projects.amount, "1000000"))
        .orderBy(desc(projects.amount))
        .limit(100);
      return result;
    } catch (error) {
      console.error('getLargeProjectDependencies error:', error);
      throw error;
    }
  }

  /**
   * 获取报备不足的项目统计
   * 条件：status = 'insufficient_report'
   */
  async getInsufficientReports(): Promise<Project[]> {
    try {
      const db = await getDb();
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.status, 'insufficient_report'))
        .orderBy(desc(projects.updatedAt))
        .limit(100);
      return result;
    } catch (error) {
      console.error('getInsufficientReports error:', error);
      throw error;
    }
  }

  /**
   * 获取转化不足的项目
   * 条件：conversionRate < 0.2
   */
  async getInsufficientConversions(): Promise<Project[]> {
    try {
      const db = await getDb();
      const result = await db
        .select()
        .from(projects)
        .where(lte(projects.conversionRate, "0.2"))
        .orderBy(projects.conversionRate)
        .limit(100);
      return result;
    } catch (error) {
      console.error('getInsufficientConversions error:', error);
      throw error;
    }
  }

  /**
   * 获取阶段停滞的项目
   * 条件：updated_at < 30天前 且 status = 'in_progress'
   */
  async getPhaseStagnations(): Promise<Project[]> {
    try {
      const db = await getDb();
      const result = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.status, 'in_progress'),
            sql`${projects.updatedAt} < NOW() - INTERVAL '30 days'`
          )
        )
        .orderBy(projects.updatedAt)
        .limit(100);
      return result;
    } catch (error) {
      console.error('getPhaseStagnations error:', error);
      throw error;
    }
  }

  /**
   * 获取驾驶舱汇总数据
   */
  async getDashboardSummary(): Promise<{
    totalProjects: number;
    totalAmount: number;
    conversionRate: number;
    riskProjects: number;
    stagnantProjects: number;
    inProgressProjects: number;
    completedProjects: number;
  }> {
    try {
      const db = await getDb();

      // 项目总数
      const [{ count: totalProjects }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(projects);

      // 总金额（元）
      const [{ total: totalAmount }] = await db
        .select({ total: sql<number>`COALESCE(sum(amount), 0)::numeric` })
        .from(projects);

      // 转化率
      const [{ avg: conversionRate }] = await db
        .select({ avg: sql<number>`COALESCE(avg(conversion_rate), 0)::numeric` })
        .from(projects);

      // 风险项目数
      const [{ count: riskProjects }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(projects)
        .where(sql`risk_level IN ('highRisk', 'critical')`);

      // 停滞项目数（超过30天未更新）
      const [{ count: stagnantProjects }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(projects)
        .where(sql`updated_at < NOW() - INTERVAL '30 days'`);

      // 进行中项目数
      const [{ count: inProgressProjects }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(projects)
        .where(eq(projects.status, 'in_progress'));

      // 已完成项目数
      const [{ count: completedProjects }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(projects)
        .where(eq(projects.status, 'completed'));

      return {
        totalProjects,
        totalAmount: Number(totalAmount),
        conversionRate: Number(conversionRate),
        riskProjects,
        stagnantProjects,
        inProgressProjects,
        completedProjects,
      };
    } catch (error) {
      console.error('getDashboardSummary error:', error);
      throw error;
    }
  }
}

// 导出单例
export const projectManager = new ProjectManager();
