import { pgTable, text, uuid, boolean, timestamp, index, uniqueIndex, check } from 'drizzle-orm/pg-core';
import { sql, InferSelectModel } from 'drizzle-orm';

export const events = pgTable('events', {
  id: uuid('id').primaryKey(),
  adminToken: text('admin_token').notNull().unique(),
  publicToken: text('public_token').notNull().unique(),
  title: text('title').notNull(),
  dateTime: timestamp('date_time', { withTimezone: true }).notNull(),
  location: text('location'),
  description: text('description'),
  templateId: text('template_id').notNull().default('classic'),
  showGuests: boolean('show_guests').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const invites = pgTable('invites', {
  id: uuid('id').primaryKey(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  inviteToken: text('invite_token').notNull().unique(),
  status: text('status'),
  magicToken: text('magic_token'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  eventCreatedIdx: index('invites_event_created_idx').on(table.eventId, table.createdAt),
  magicTokenUniq: uniqueIndex('invites_event_magic_uniq')
    .on(table.eventId, table.magicToken)
    .where(sql`magic_token IS NOT NULL`),
  statusCheck: check('invites_status_check', sql`${table.status} IN ('going', 'maybe', 'not_going')`),
}));

export type Event = InferSelectModel<typeof events>;
export type Invite = InferSelectModel<typeof invites>;
