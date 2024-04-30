import { eq, sql } from 'drizzle-orm';
import { db } from './db';
import { rooms, type Room } from './schema';
import type { ChatHistory } from './ollama';

export async function getRooms(): Promise<Room[]> {
	return await db.select().from(rooms).execute();
}

export async function getRoom(id: number) {
	return await db.select().from(rooms).where(eq(rooms.id, id)).execute();
}

export async function createRoom(name: string, history: ChatHistory) {
	return await db
		.insert(rooms)
		.values({ history, name })
		.returning({ id: rooms.id, history: rooms.history })
		.execute();
}

export async function createEmptyRoom(name: string) {
	return await db
		.insert(rooms)
		.values({ history: [], name })
		.returning({ id: rooms.id, history: rooms.history })
		.execute();
}

export async function deleteRoom(id: number) {
	return await db.delete(rooms).where(eq(rooms.id, id)).execute();
}

export async function addHistory(id: number, history: ChatHistory) {
	//get current history
	const room = await getRoom(id);
	const currentHistory = room[0].history ?? [];

	//add new history
	currentHistory.push(...history);

	return await db
		.update(rooms)
		.set({ history: currentHistory })
		.where(eq(rooms.id, id))
		.returning({ id: rooms.id, history: rooms.history })
		.execute();
}
