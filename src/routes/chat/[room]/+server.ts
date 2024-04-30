import type { RequestHandler } from './$types';
import * as llama from '$lib/server/ollama';
import * as logic from '$lib/server/logic';
import { error, json } from '@sveltejs/kit';

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

	console.log()

	if (!response) {
		error(500, 'Failed to get response from Ollama');
	}

	return json(response);
};
