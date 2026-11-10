import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  dialect: 'postgresql',
  schema: './packages/db/src/schema.ts',
  out: './packages/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:dev@localhost:5432/eventapp',
  },
});
