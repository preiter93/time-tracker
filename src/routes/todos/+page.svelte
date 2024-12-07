<script>
	import { flip } from "svelte/animate";
	import { dndzone } from "svelte-dnd-action";
	import { TodoStore } from "$lib/todos_store.js";
	import { AddButton, CancelButton } from "$lib/components/buttons";
	import { blurOnEnter, blurOnEscape } from "$lib/utils";

	const flipDurationMs = 100;
	const dropTargetStyle = {
		"background-color": "none",
	};

	/**
	 * @typedef {Object} Props
	 * @property {import('$lib/types').PageData<import('$lib/types').TodoItem[]>} data
	 */

	/** @type {Props} */
	let { data } = $props();

	/**
	 * The todo items store
	 */
	let store = new TodoStore();

	/**
	 * Todo items
	 * @type {import('$lib/types').TodoItem[]}
	 */
	let todos = $state(data.items.data ?? []);

	/**
	 * Creates a todo.
	 */
	function createTodo() {
		let newTodos = store.create();
		if (newTodos !== null) {
			todos = newTodos;
		}
	}

	/**
	 * Whether an input is focused
	 */
	let isInputFocused = $state(false);

	/**
	 * Change the content of a todo
	 * @param {string} id
	 * @param {string} content
	 */
	function updateContent(id, content) {
		console.log("update content " + id);
		let newTodos = store.updateContent(id, content);
		if (newTodos !== null) {
			todos = newTodos;
		}
	}

	/**
	 * Delete a todo item
	 * @param {string} id
	 */
	function deleteTodo(id) {
		let newTodos = store.delete(id);
		if (newTodos !== null) {
			todos = newTodos;
		}
	}

	/**
	 * @param {{ detail: { items: import('$lib/types.js').TodoItem[]; } }} e
	 */
	function handleDndConsider(e) {
		todos = e.detail.items;
	}
	/**
	 * @param {{ detail: { items: import('$lib/types.js').TodoItem[]; } }} e
	 */
	function handleDndFinalize(e) {
		todos = e.detail.items;

		let ids = new Array(e.detail.items.length);
		for (const i in e.detail.items) {
			ids[i] = e.detail.items[i].id;
		}
		store.sortByIds(ids);
	}
</script>

<div
	class="todo-list"
	use:dndzone={{
		items: todos,
		flipDurationMs,
		dropTargetStyle,
		dragDisabled: isInputFocused ? true : false,
	}}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
>
	{#each todos as item (item.id)}
		<div class="todo-item" animate:flip={{ duration: flipDurationMs }}>
			<input
				type="text"
				class="todo-input"
				onblur={() => {
					updateContent(item.id, item.content);
					isInputFocused = false;
				}}
				onfocus={() => {
					isInputFocused = true;
				}}
				use:blurOnEnter
				use:blurOnEscape
				bind:value={item.content}
			/>
			<CancelButton onclick={() => deleteTodo(item.id)} />
		</div>
	{/each}
	<div class="todo-add">
		<AddButton onclick={createTodo} text="Add todo" />
	</div>
</div>

<style>
	.todo-list {
		display: block;
	}
	.todo-item {
		padding: 1em 0.25em 1em 1em;
		margin: 0.4em 0.4em;
		border: 2px solid black;
		color: var(--text-primary);
		font-size: 20px;
		line-height: 0.2;
		display: flex;
		justify-content: space-between;
	}
	.todo-input {
		font-size: 20px;
		background-color: transparent;
		border: none;
		width: 50%;
		min-width: 200px;
	}
	.todo-add {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
	}
</style>
