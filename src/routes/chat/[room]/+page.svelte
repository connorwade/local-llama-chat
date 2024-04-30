<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { page } from '$app/stores';

	export let data: PageServerData;

	let { history, name } = data;
	let loading = false;

	let streamResult: string[] = [];
	let streaming = false;
	let chatWindow: HTMLDivElement;

	const subscribe = async (roomId: string) => {
		try {
			const response = await fetch(`/chat/${roomId}`);
			if (!response.ok) {
				console.error('Failed to fetch');
				return;
			}

			if (response.body === null) {
				console.error('Response body is null');
				return;
			}

			const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

			if (!reader) {
				console.error('Failed to get reader');
				return;
			}

			streaming = true;

			while (true) {
				const { done, value } = await reader?.read();

				if (done) {
					break;
				}

				streamResult = streamResult.concat(value);
				chatWindow.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
			}
			streaming = false;
			history = history.concat({ role: 'assistant', content: streamResult.join('') });
			streamResult = [];
		} catch (error) {
			console.error('FETCHERROR:', error);
		}
	};

	onMount(() => {
		chatWindow.lastElementChild?.scrollIntoView();
	});

	const handleSubmit = async (e: Event) => {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const message = formData.get('message')?.toString();
		const roomId = $page.params.room;

		loading = true;
		const response = await fetch(`/chat/${roomId}`, {
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

		const resJson = await response.json();

		history = resJson.history;

		await subscribe(roomId);

		loading = false;

		form.reset();
	};
</script>

<main class="p-3 flex flex-col h-full">
	<h1 class="text-3xl mb-2">{name}</h1>
	<a class="btn btn-info w-fit" href="/chat">
		<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
			><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" /></svg
		> Back</a
	>
	<div
		bind:this={chatWindow}
		class="overflow-y-auto h-5/6 m-3 mb-8 p-1 border-primary rounded-md shadow-lg shadow-info"
	>
		{#each history as message}
			<div
				class="chat p-3"
				class:chat-start={message.role === 'user'}
				class:chat-end={message.role === 'assistant'}
			>
				<div
					class:chat-bubble-primary={message.role === 'assistant'}
					class:chat-bubble-info={message.role === 'user'}
					class="chat-bubble whitespace-pre-line"
				>
					{message.content}
				</div>
			</div>
		{:else}
			<h2 class="text-3xl">Let's start the conversation</h2>
		{/each}
		{#if streaming}
			<div class="chat p-3 chat-end">
				<div class="chat-bubble chat-bubble-primary whitespace-pre-line">
					{#each streamResult as chunk}
						<span>{chunk}</span>
					{/each}
				</div>
			</div>
		{/if}
		{#if loading && !streaming}
			<div>
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{/if}
	</div>

	<form class="w-full" on:submit|preventDefault={handleSubmit}>
		<textarea
			class="textarea w-full h-16 mb-3 max-w-full resize-none transition-shadow focus-within:outline-none focus-within:shadow-md focus-within:shadow-primary bg-base-200"
			disabled={loading}
			name="message"
		/>
		<button disabled={loading} class="btn btn-primary rounder-r-full" type="submit">Send</button>
	</form>
</main>
