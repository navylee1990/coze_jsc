/**
 * 用户管理器
 * 封装用户相关的数据库操作
 * 注意：已移除企业微信集成相关方法
 */

import { eq } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import { users } from "./shared/schema";
import type { User, InsertUser } from "./shared/schema";

export class UserManager {
  /**
   * 根据ID查询用户
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const db = await getDb();
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
      return user || null;
    } catch (error) {
      console.error('getUserById error:', error);
      throw error;
    }
  }

  /**
   * 创建用户
   */
  async createUser(data: InsertUser): Promise<User> {
    try {
      const db = await getDb();
      const [user] = await db.insert(users).values(data).returning();
      return user;
    } catch (error) {
      console.error('createUser error:', error);
      throw error;
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(id: string, data: Partial<InsertUser>): Promise<User> {
    try {
      const db = await getDb();
      const [user] = await db
        .update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      console.error('updateUser error:', error);
      throw error;
    }
  }

  /**
   * 获取所有用户
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const db = await getDb();
      return db.select().from(users);
    } catch (error) {
      console.error('getAllUsers error:', error);
      throw error;
    }
  }
}

// 导出单例
export const userManager = new UserManager();
