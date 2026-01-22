import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const projects = pgTable(
  `projects`,
  {
    ai_summary: text(),
    ai_tags: text().array(),
    commit_count: integer(),
    created_at: timestamp(),
    description: text(),
    full_name: varchar().notNull(),
    html_url: varchar().notNull(),
    id: integer().notNull().primaryKey(),
    is_fork: boolean().notNull().default(false),
    is_owner: boolean().notNull().default(true),
    language: varchar(),
    last_indexed_at: timestamp(),
    last_indexed_sha: varchar(),
    owner_login: varchar(),
    pushed_at: timestamp(),
    stargazers_count: integer().notNull(),
    topics: text().array(),
    updated_at: timestamp(),
  },
  (table) => [
    index(`projects_full_name_idx`).on(table.full_name),
    index(`projects_owner_login_idx`).on(table.owner_login),
    index(`projects_language_idx`).on(table.language),
  ],
);

export const codeFiles = pgTable(
  `code_files`,
  {
    content: text().notNull(),
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    language: varchar(),
    path: varchar().notNull(),
    project_id: integer()
      .notNull()
      .references(() => projects.id, { onDelete: `cascade` }),
  },
  (table) => [
    index(`code_files_project_id_idx`).on(table.project_id),
    index(`code_files_language_idx`).on(table.language),
    index(`code_files_path_idx`).on(table.path),
  ],
);

export const indexerMetadata = pgTable(`indexer_metadata`, {
  key: varchar().primaryKey(),
  value: varchar().notNull(),
});
