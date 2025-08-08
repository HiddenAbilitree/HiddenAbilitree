import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const projects = pgTable(`projects`, {
  full_name: varchar().notNull(),
  id: integer().notNull().primaryKey(),
  stargazers_count: integer().notNull(),
});
