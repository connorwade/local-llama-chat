import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';
// @ts-ignore
import Database from 'better-sqlite3';

const sqlite = new Database(':memory:');
export const db = drizzle(sqlite, { schema });

// We have to migrate in code for temporary :memory: use
migrate(db, { migrationsFolder: 'drizzle-dev' });
