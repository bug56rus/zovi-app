import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:dev@localhost:5432/eventapp' });
export const db = drizzle(pool, { schema });
export * from './schema';
