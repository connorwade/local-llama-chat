import type { Actions } from '@sveltejs/kit';
import * as llama from '$lib/server/ollama';
import * as logic from '$lib/server/logic';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const roomId = Number(params.room);
	const room = await logic.getRoom(roomId);
	if (!room[0]?.history) {
		return {
			name: room[0].name,
			history: []
		};
	}

	return {
		name: room[0].name,
		history: room[0].history
	};
};
