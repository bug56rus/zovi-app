import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config(); // Загружаем переменные из .env

export default defineConfig({
  dialect: 'postgresql',
  schema: './packages/db/src/schema.ts',
  out: './packages/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});