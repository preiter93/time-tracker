<script>
	import { flip } from "svelte/animate";
	import { dragHandleZone, dragHandle } from "svelte-dnd-action";
	import { TodoStore } from "$lib/todos_store.js";
	import { AddButton, CancelButton } from "$lib/components/buttons";
	import { blurOnEnter, blurOnEscape } from "$lib/utils";
	import DragHandleIcon from "$lib/components/icons/DragHandleIcon.svelte";

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
	 * Whether drag is disabled
	 */
	let dragDisabled = $state(false);

	/**
	 * Change the content of a todo
	 * @param {string} id
	 * @param {string} content
	 */
	function updateContent(id, content) {
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
	use:dragHandleZone={{
		items: todos,
		flipDurationMs,
		dropTargetStyle,
		dragDisabled: dragDisabled,
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
			<div class="todo-actions">
				<div class="delete-button">
					<CancelButton onclick={() => deleteTodo(item.id)} />
				</div>
				<div
					class="drag-handle"
					use:dragHandle
					aria-label="drag-handle"
				>
					<DragHandleIcon />
				</div>
			</div>
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
		padding: 1em 0.25em;
		margin: 0.4em 0.4em;
		border: 2px solid var(--bg-secondary);
		color: var(--text-primary);
		font-size: var(--font-size-medium);
		display: flex;
		justify-content: space-between;
	}
	.todo-input {
		font-size: var(--font-size-medium);
		background-color: transparent;
		border: none;
		width: 90%;
		min-width: 200px;
	}
	.todo-actions {
		display: flex;
	}
	.todo-add {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
	}
	.drag-handle {
		width: var(--icon-size-medium);
		height: var(--icon-size-medium);
		align-items: center;
		justify-content: center;
		display: flex;
		margin: 0;
	}
</style>
