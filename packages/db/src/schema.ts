import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: integer().notNull().primaryKey(),
  full_name: varchar().notNull(),
  stargazers_count: integer().notNull(),
});
