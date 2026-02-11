// Database Schema
// Please define your tables here using Drizzle ORM
//
// Example:
// import { pgTable, text, varchar, numeric, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
// import { sql } from "drizzle-orm";
//
// export const users = pgTable(
//   "users",
//   {
//     id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
//     name: varchar("name", { length: 100 }).notNull(),
//     email: varchar("email", { length: 255 }).notNull().unique(),
//     createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
//   },
//   (table) => ({
//     emailIdx: index("users_email_idx").on(table.email),
//   })
// );
