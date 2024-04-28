import { pipeline } from 'node:stream/promises';
import ollama from 'ollama';

const history: {
	role: 'user' | 'assistant' | 'system';
	content: string;
}[] = [];

export async function writeToHistory(role: 'user' | 'assistant' | 'system', content: string) {
	history.push({
		role,
		content
	});
}

export async function getHistory() {
	return history;
}

export async function getStreamResponse() {
	try {
		const response = await ollama.chat({ model: 'llama3', messages: history, stream: true });
		return response;
	} catch (error) {
		console.error(error);
	}
}

export async function getResponse() {
	try {
		const response = await ollama.chat({ model: 'llama3', messages: history });
		return response;
	} catch (error) {
		console.error('LLAMA ERROR:', error);
	}
}
