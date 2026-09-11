import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const attempts = sqliteTable(
  'attempts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    employeeName: text('employee_name').notNull(),
    categoryId: text('category_id').notNull(),
    categoryTitle: text('category_title').notNull(),
    score: integer('score').notNull(),
    total: integer('total').notNull(),
    passed: integer('passed').notNull(),
    completedAt: text('completed_at').notNull(),
  },
  (table) => [
    index('idx_attempts_completed_at').on(table.completedAt),
    index('idx_attempts_employee_name').on(table.employeeName, table.completedAt),
  ],
);
