<script>
	import TimerItem from "$lib/components/TimerItem.svelte";
	import { TimerCookie } from "$lib/cookies.js";
	import { PlainButton } from "$lib/components/buttons";

	/** @type {import('./$types').PageData} */
	export let data;

	/**
	 * The cookie fetcher class
	 */
	let cookie = new TimerCookie();

	/**
	 * Tracking items
	 * @type {import('$lib/types.js').TimerItemType[]}
	 */
	let timerItems = data.items.data;

	async function onCreate() {
		timerItems = cookie.create();
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	async function onDelete(id) {
		timerItems = cookie.delete(id);
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	async function onStart(id) {
		let updatedItems = cookie.start(id);
		if (updatedItems !== null) {
			timerItems = updatedItems;
		}
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	async function onPause(id) {
		let updatedItems = cookie.pause(id);
		if (updatedItems !== null) {
			timerItems = updatedItems;
		}
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	async function onReset(id) {
		let updatedItems = cookie.reset(id);
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
		let updatedItems = cookie.updateName(id, name);
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
		<div class="timer-item">
			<TimerItem
				name={item.name}
				duration={item.duration}
				offsetDuration={item.offsetDuration}
				isRunning={item.isRunning}
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
		<PlainButton on:click={onCreate} />
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
		padding: 1px 5px 1px 5px;
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