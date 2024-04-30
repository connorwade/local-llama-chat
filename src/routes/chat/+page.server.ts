import { fail, json, redirect, type Actions } from '@sveltejs/kit';
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
	create: async ({ request }) => {
		try {
			const formData = await request.formData();
			const name = formData.get('name');
			if (!name) {
				return fail(400);
			}
			const newRoom = await logic.createEmptyRoom(name.toString());
			redirect(301, `/chat/${newRoom[0].id}`);
		} catch (e) {
			return fail(500);
		}
	},
	delete: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id');
			if (!id) {
				return fail(400);
			}
			await logic.deleteRoom(Number(id));
		} catch (e) {
			return fail(500);
		}
	}
};
