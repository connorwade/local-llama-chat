import ollama from 'ollama';
import * as paths from 'node:path';
import { readFile, readdir, writeFile } from 'node:fs/promises';

export type ChatHistory = {
	role: 'user' | 'assistant';
	content: string;
}[];

export async function getResponse(history: ChatHistory, stream: boolean = false) {
	const response = await ollama.chat({
		model: 'llama3',
		messages: history,
		//@ts-ignore ollama.js is dumb
		stream
	});
	return response;
}
