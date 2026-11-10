import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: "postgresql://postgres:guV6b2rYBRVQhBo@postgres:5432/postgres" });
export const db = drizzle(pool, { schema });
export * from './schema';
