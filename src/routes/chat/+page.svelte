<script lang="ts">
	export let data;
</script>

<main class="p-3">
	<form action="?/create" method="post">
		<input class="input input-bordered" type="text" name="name" id="name" required />
		<button class="btn btn-primary" type="submit">Create a new room</button>
	</form>

	{#if data.rooms.length}
		<ul class="menu min-w-[300px] w-1/2 bg-base-300">
			{#each data.rooms as room}
				<li class="flex-row items-center justify-between w-full">
					<a class="p-3 text-2xl flex-1 h-full" href="/chat/{room.id}">{room.name}</a>
					<form class="mb-0" action="?/delete" method="post">
						<input type="hidden" name="id" value={room.id} />
						<button class="btn btn-error" type="submit"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 -960 960 960"
								width="24"
								><path
									d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
								/></svg
							></button
						>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</main>
