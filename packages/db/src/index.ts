import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';

export const db = drizzle(process.env.DATABASE_URL as string, { schema });
export * from './schema';
export * from 'drizzle-orm';
