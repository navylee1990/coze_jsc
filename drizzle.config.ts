/**
 * Drizzle ORM 配置文件
 * 用于数据库迁移和代码生成
 */

import type { Config } from 'drizzle-kit';

export default {
  schema: './src/storage/database/shared/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.PGDATABASE_URL || '',
  },
} satisfies Config;
