import { drizzle } from 'drizzle-orm/neon-serverless';

export const db = drizzle(process.env.DATABASE_URL as string);
export * from './schema';
export * from 'drizzle-orm';
