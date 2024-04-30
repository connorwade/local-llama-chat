import type { RequestHandler } from './$types';
import * as llama from '$lib/server/ollama';
import * as logic from '$lib/server/logic';
import { error, json } from '@sveltejs/kit';
import type { ChatResponse } from 'ollama';

// user write to history
export const POST: RequestHandler = async ({ params, request }) => {
	const roomId = Number(params.room);
	const { content } = await request.json();

	if (!content) {
		error(400, 'Missing content');
	}

	const room = await logic.addHistory(roomId, [{ role: 'user', content }]);

	let history = room[0].history;

	return json({ success: true, history });
};

// STREAMING RESPONSE
export const GET: RequestHandler = async ({ params }) => {
	const roomId = Number(params.room);

	const room = await logic.getRoom(roomId);
	const history = room[0].history;

	if (!history) {
		error(404, 'Room not found');
	}

	const response: AsyncGenerator<ChatResponse> = await llama.getResponse(history, true);

	if (!response) {
		error(500, 'Failed to get response from Ollama');
	}

	let content = '';

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			for await (const { message, done } of response) {
				if (done) {
					await logic.addHistory(roomId, [{ role: 'assistant', content }]);
					controller.close();
				} else {
					content += message.content;
					controller.enqueue(encoder.encode(message.content));
				}
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache'
		}
	});
};

// SIMPLE GET RESPONSE
// export const GET: RequestHandler = async ({ params }) => {
// 	const roomId = Number(params.room);

// 	const room = await logic.getRoom(roomId);
// 	const history = room[0].history;

// 	if (!history) {
// 		error(404, 'Room not found');
// 	}

// 	const response = await llama.getResponse(history);

// 	await logic.addHistory(roomId, [
// 		{
// 			role: 'assistant',
// 			content: response.message.content
// 		}
// 	]);

// 	console.log();

// 	if (!response) {
// 		error(500, 'Failed to get response from Ollama');
// 	}

// 	return json(response);
// };
