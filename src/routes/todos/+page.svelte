<script>
	import { flip } from "svelte/animate";
	import { dndzone } from "svelte-dnd-action";

	const flipDurationMs = 100;
	const dropTargetStyle = {
		"background-color": "none",
	};

	/**
	 * Represents an item in the todo list.
	 * @typedef {Object} Item
	 * @property {number} id - The identifier of the item.
	 * @property {string} content - The todo content of the item.
	 */

	/** @type {Item[]} */
	let items = [
		{ id: 11, content: "Item11" },
		{ id: 12, content: "Item12" },
		{ id: 13, content: "Item13" },
		{ id: 14, content: "Item14" },
		{ id: 15, content: "Item15" },
		{ id: 16, content: "Item16" },
		{ id: 17, content: "Item17" },
	];

	/**
	 * @param {{ detail: { items: Item[]; } }} e
	 */
	function handleDndConsider(e) {
		items = e.detail.items;
	}
	/**
	 * @param {{ detail: { items: Item[]; } }} e
	 */
	function handleDndFinalize(e) {
		items = e.detail.items;
	}
</script>

<div
	class="todo-list"
	use:dndzone={{ items, flipDurationMs, dropTargetStyle }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each items as item (item.id)}
		<div class="todo-item" animate:flip={{ duration: flipDurationMs }}>
			<p>
				{item.content}
			</p>
		</div>
	{/each}
</div>

<style>
	.todo-list {
		display: block;
		padding: 0.4em;
	}
	.todo-item {
		padding: 0.2em;
		margin: 0.4em 0;
		border: 2px solid black;
		color: var(--text-primary);
		font-size: 20px;
		line-height: 0.2;
	}
</style>
