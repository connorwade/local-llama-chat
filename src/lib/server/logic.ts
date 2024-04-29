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

export async function createRoom({ history }: { history: ChatHistory }) {
	return await db
		.insert(rooms)
		.values({ history })
		.returning({ id: rooms.id, history: rooms.history })
		.execute();
}

export async function createEmptyRoom() {
	return await db
		.insert(rooms)
		.values({ history: [] })
		.returning({ id: rooms.id, history: rooms.history })
		.execute();
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
