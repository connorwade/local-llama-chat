import type { RequestHandler } from './$types';
import * as llama from '$lib/server/ollama';
import * as logic from '$lib/server/logic';
import { error, json } from '@sveltejs/kit';

// Get response from Ollama?
// const GET: RequestHandler = async ({ params }) => {
// 	const { room } = params;
// };

export const GET: RequestHandler = async ({ params }) => {
	const roomId = Number(params.room);

	const room = await logic.getRoom(roomId);
	const history = room[0].history;

	if (!history) {
		error(404, 'Room not found');
	}

	const response = await llama.getResponse(history);

	await logic.addHistory(roomId, [
		{
			role: 'assistant',
			content: response.message.content
		}
	]);

	if (!response) {
		error(500, 'Failed to get response from Ollama');
	}

	return json(response);
};
