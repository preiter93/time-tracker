<script>
	import TimerItem from "$lib/components/TimerItem.svelte";
	import { TimerStore } from "$lib/store.js";
	import { CreateButton } from "$lib/components/buttons";
	import { slide } from "svelte/transition";

	/** @type {import('./$types').PageData} */
	export let data;

	/**
	 * The timer items store
	 */
	let store = new TimerStore();

	/**
	 * Tracking items
	 * @type {import('$lib/types.js').TimerItem[]}
	 */
	let timerItems = data.items.data;

	async function onCreate() {
		let newItem = store.create();
		newItem.requestFocus = true;
		timerItems = [...timerItems, newItem];
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	async function onDelete(id) {
		timerItems = store.delete(id);
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	async function onStart(id) {
		let updatedItems = store.start(id);
		if (updatedItems !== null) {
			timerItems = updatedItems;
		}
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	async function onPause(id) {
		let updatedItems = store.pause(id);
		if (updatedItems !== null) {
			timerItems = updatedItems;
		}
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	async function onReset(id) {
		let updatedItems = store.reset(id);
		if (updatedItems !== null) {
			timerItems = updatedItems;
		}
	}

	/**
	 * @param {string} id
	 * @param {string} name
	 * The timer id.
	 */
	async function onChanged(id, name) {
		let updatedItems = store.updateName(id, name);
		if (updatedItems !== null) {
			timerItems = updatedItems;
		}
	}
</script>

<div class="div-title">
	<h1>Time Tracker</h1>
</div>
<div>
	<hr class="divider" />
	{#each timerItems as item (item.id)}
		<div class="timer-item" transition:slide>
			<TimerItem
				name={item.name}
				duration={item.duration}
				offsetDuration={item.offsetDuration}
				isRunning={item.isRunning}
				requestFocus={item.requestFocus}
				onDelete={() => onDelete(item.id)}
				onStart={() => onStart(item.id)}
				onPause={() => onPause(item.id)}
				onReset={() => onReset(item.id)}
				onChanged={(newName) =>
					onChanged(item.id, newName)}
			/>
		</div>
		<hr class="divider" />
	{/each}
	<div class="row">
		<CreateButton on:click={onCreate} />
		<p>Add timer</p>
	</div>
</div>

<style>
	.div-title {
		color: white;
		background-color: #1f7a8c;
		padding: 1px 5px 1px 5px;
	}
	.timer-item {
		color: black;
		background-color: #fff;
		padding: 1px 0px 1px 0px;
	}
	h1 {
		text-align: center;
		font-size: 38px;
	}
	hr.divider {
		border-width: 1px;
		margin: 0em 0;
		height: 1px;
		border: 0;
		border-top: 1px solid #ccc;
		display: block;
		border-color: black;
		background-color: black;
	}
	.row {
		margin-top: 10px;
		display: flex;
		align-items: center;
		text-align: center;
	}
</style>
