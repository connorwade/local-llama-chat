<script lang="ts">
	export let data;
</script>

{#each data.rooms as room}
	<a href="/chat/{room.id}">Room #{room.id}</a>
{/each}

<form action="?/create" method="post">
	<button type="submit">Create a new room</button>
</form>
