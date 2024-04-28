import * as llama from '$lib/server/ollama';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { content } = await request.json();

	if (!content) {
		error(400, 'Missing content');
	}

	await llama.writeToHistory('user', content);

	return json({ success: true });
};

export const GET: RequestHandler = async ({}) => {
	// const response = await llama.getStreamResponse();
	// const encoder = new TextEncoder();

	// if (!response) {
	// 	error(500, 'Failed to get response from Ollama');
	// }

	// let content = '';

	// const readableStream = new ReadableStream({
	// 	async start(controller) {
	// 		for await (const chunk of response) {
	// 			content += chunk.message.content;
	// 			controller.enqueue(encoder.encode(chunk.message.content));
	// 		}
	// 		controller.close();
	// 	}
	// });

	// llama.writeToHistory('assistant', content);

	// return new Response(readableStream, {
	// 	headers: {
	// 		'Content-Type': 'text/event-stream'
	// 	}
	// });

	const response = await llama.getResponse();

	llama.writeToHistory('assistant', response!.message.content);

	if (!response) {
		error(500, 'Failed to get response from Ollama');
	}

	return json(response);
};
