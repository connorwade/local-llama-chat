import type { RequestHandler } from './$types';
import * as logic from '$lib/server/logic';
import { error, json } from '@sveltejs/kit';

// user write to history
export const POST: RequestHandler = async ({ params, request }) => {
	const roomId = Number(params.room);
	const { content } = await request.json();

	if (!content) {
		error(400, 'Missing content');
	}

	const room = await logic.addHistory(roomId, [{ role: 'user', content }]);
	// might need, let's see
	let history = room[0].history;
	console.log('USER POST ROOM AFTER ADD', room);

	return json({ success: true, history });
};
