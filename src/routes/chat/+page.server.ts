import { fail, redirect, type Actions } from '@sveltejs/kit';
import * as llama from '$lib/server/ollama';
import * as logic from '$lib/server/logic';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const rooms = await logic.getRooms();
	return {
		rooms
	};
};

export const actions: Actions = {
	create: async () => {
		try {
			const newRoom = await logic.createEmptyRoom();
			console.log(newRoom[0]);
			redirect(301, `/chat/${newRoom[0].id}`);
		} catch (e) {
			fail(500);
		}
	}
};
