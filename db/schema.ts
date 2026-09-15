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
    answersJson: text('answers_json'),
  },
  (table) => [
    index('idx_attempts_completed_at').on(table.completedAt),
    index('idx_attempts_employee_name').on(table.employeeName, table.completedAt),
  ],
);

export const teamMembers = sqliteTable(
  'team_members',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    active: integer('active').notNull().default(1),
    pinHash: text('pin_hash'),
    createdAt: text('created_at').notNull(),
  },
  (table) => [index('idx_team_members_active_name').on(table.active, table.name)],
);

export const categoryDeadlines = sqliteTable('category_deadlines', {
  categoryId: text('category_id').primaryKey(),
  dueDate: text('due_date').notNull(),
});
