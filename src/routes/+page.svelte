<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let { history } = data;
	let loading = false;

	console.log('history:', history);

	// interface ResultFromString {
	// 	chunks: string[];
	// 	clean: () => void;
	// }

	// let resultFromStream: ResultFromString = {
	// 	chunks: [],
	// 	clean: () => {
	// 		resultFromStream.chunks = [];
	// 	}
	// };

	// const subscribe = async () => {
	// 	try {
	// 		const response = await fetch('/chat');
	// 		if (!response.ok) {
	// 			console.error('Failed to fetch');
	// 			return;
	// 		}

	// 		if (response.body === null) {
	// 			console.error('Response body is null');
	// 			return;
	// 		}

	// 		const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

	// 		if (!reader) {
	// 			console.error('Failed to get reader');
	// 			return;
	// 		}

	// 		while (true) {
	// 			const { done, value } = await reader?.read();

	// 			if (done) {
	// 				console.log('DONE');
	// 				break;
	// 			}

	// 			console.log(value);
	// 			resultFromStream.chunks.push(value);
	// 			resultFromStream = { ...resultFromStream };
	// 		}
	// 	} catch (error) {
	// 		console.error('FETCHERROR:', error);
	// 	}
	// };

	// onMount(subscribe);

	const handleSubmit = async (e: Event) => {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const message = formData.get('message')?.toString();

		loading = true;
		const response = await fetch('/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content: message })
		});

		if (!response.ok) {
			console.error('Failed to send message');
			console.error(await response.json());
			return;
		}

		history = history.concat({
			role: 'user',
			content: message
		});

		const newMessage = await fetch('/chat');

		if (!newMessage.ok) {
			console.error('Failed to fetch new message');
			console.error(await newMessage.json());
			return;
		}

		const newMessageData = await newMessage.json();

		console.log(newMessageData.message.content);

		history = history.concat({
			role: 'assistant',
			content: newMessageData.message.content
		});
		loading = false;

		form.reset();
	};
</script>

<main class="p-3 flex flex-col h-full">
	<div class="overflow-y-auto h-5/6">
		{#each history as message}
			<div
				class="chat"
				class:chat-start={message.role === 'user'}
				class:chat-end={message.role === 'assistant'}
			>
				<div
					class:chat-bubble-primary={message.role === 'assistant'}
					class:chat-bubble-info={message.role === 'user'}
					class="chat-bubble"
				>
					{message.content}
				</div>
			</div>
		{/each}
		{#if loading}
			<span class="loading loading-spinner loading-lg"></span>
		{/if}
	</div>

	<form class="w-full" on:submit|preventDefault={handleSubmit}>
		<input
			class="input w-full h-16 mb-3 input-bordered max-w-full"
			disabled={loading}
			type="text"
			name="message"
		/>
		<button disabled={loading} class="btn btn-primary rounder-r-full" type="submit">Send</button>
	</form>
</main>

<!-- {#each resultFromStream.chunks as chunk}
	<span>{chunk}</span>
{:else}
	<span>Loading...</span>
{/each} -->
