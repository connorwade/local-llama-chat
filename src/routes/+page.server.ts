import type { Actions } from '@sveltejs/kit';
import * as llama from '$lib/server/ollama';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const history = await llama.getHistory();
	return {
		history
	};
};
