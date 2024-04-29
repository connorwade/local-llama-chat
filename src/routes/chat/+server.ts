import type { RequestHandler } from './$types';
import * as logic from '$lib/server/logic';
import { json } from '@sveltejs/kit';

// create new room
export const POST: RequestHandler = async () => {
	const newRoom = await logic.createRoom({ history: [] });

	return json(newRoom[0]);
};
