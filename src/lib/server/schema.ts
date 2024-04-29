import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import type { ChatHistory } from './ollama';

export const rooms = sqliteTable('rooms', {
	id: integer('id').primaryKey(),
	history: text('history', { mode: 'json' }).$type<ChatHistory>(),
	createdAt: integer('created_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
});

export type Rooms = typeof rooms.$inferSelect;
export type Room = typeof rooms.$inferInsert;
