<script>
	import TimerItem from "$lib/components/TimerItem.svelte";
	import { TimerStore } from "$lib/store.js";
	import { toggleThemeStorage } from "$lib/theme.js";
	import { AddButton } from "$lib/components/buttons";
	import { fade, slide } from "svelte/transition";
	import { onMount } from "svelte";
	import { DarkIcon, LightIcon } from "$lib/components/icons";
	import { formatDuration } from "$lib/utils";

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
	 * The timer i d.
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
	 * Invoked on name change.
	 */
	async function onChanged(id, name) {
		let updatedItems = store.updateName(id, name);
		if (updatedItems !== null) {
			timerItems = updatedItems;
		}
	}

	/**
	 * A map from id to duration to keep book of
	 * the total timer duration.
	 * @type {{ id: string; duration: number; }[]}
	 */
	let durationsMap = data.items.data.map((timer) => {
		return {
			id: timer.id,
			duration: timer.offsetDuration,
		};
	});

	/**
	 * @param {string} id
	 * @param {number} duration
	 */
	async function onTick(id, duration) {
		const index = durationsMap.findIndex((item) => item.id === id);
		if (index !== -1) {
			durationsMap[index].duration = duration;
		}
	}

	/**
	 * @type {string}
	 */
	let theme;

	/**
	 * @type {number}
	 */
	let totalTime = 0;
	$: {
		totalTime = durationsMap.reduce(
			(sum, item) => sum + item.duration,
			0
		);
	}

	/**
	 * Toggle the theme.
	 */
	function toggleTheme() {
		let newTheme = toggleThemeStorage();
		if (newTheme !== null) {
			theme = newTheme;
		}
	}

	/**
	 * Set default theme to light.
	 */
	onMount(() => {
		document.body.className = "dark";
		theme = "dark";

		/**
		 * We need to resynchronize the timers with the
		 * local storage after the browser has been
		 * hidden for a while.
		 */
		const onVisibilityChange = () => {
			let state = document.visibilityState;
			if (state == "visible") {
				timerItems = store.list();
			}
		};
		document.addEventListener(
			"visibilitychange",
			onVisibilityChange
		);
	});
</script>

<div class="header">
	<h1 class="title">Time Tracker</h1>
	<button on:click={toggleTheme} class="theme-btn">
		<div class="center" in:fade>
			{#if theme === "dark"}
				<LightIcon />
			{:else}
				<DarkIcon />
			{/if}
		</div>
	</button>
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
				onTick={(duration) => onTick(item.id, duration)}
			/>
		</div>
		<hr class="divider" />
	{/each}
	<div class="spacer" />
	<div class="row">
		<AddButton on:click={onCreate} />
		<p class="text-total">
			Total time:<span class="fixed-width"
				>{formatDuration(totalTime)}</span
			>
		</p>
	</div>
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
	}
	.header {
		color: var(--text-header);
		background-color: var(--bg-header);
		padding: 1px 5px 1px 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.title {
		text-align: center;
		font-size: 34px;
		flex: 1;
		margin-left: 20px;
	}
	.theme-btn {
		padding: 0;
		height: 45px;
		width: 45px;
		border: none;
		background: var(--bg-primary);
		color: var(--bg-secondary);
		border-radius: 2rem;
		margin-right: 10px;
	}
	@media (hover: hover) {
		.theme-btn:hover {
			cursor: pointer;
			transform: scale(0.85);
		}
	}
	.center {
		display: flex;
		justify-content: center;
	}
	.timer-item {
		background-color: var(--bg-primary);
		padding: 1px 0px 1px 0px;
	}
	hr.divider {
		border-width: 1px;
		margin: 0 0;
		height: 1px;
		border: 0;
		border-top: 1px solid #ccc;
		display: block;
		border-color: var(--bg-secondary);
		background-color: var(--bg-secondary);
	}
	div.spacer {
		margin-top: 10px;
	}
	.text-total {
		font-size: 16px;
		margin-right: 10px;
	}
	.fixed-width {
		display: inline-block;
		width: 4em;
		text-align: right;
	}
</style>
