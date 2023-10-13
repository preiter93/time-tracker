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
	 * Timer items
	 * @type {import('$lib/types.js').TimerItem[]}
	 */
	let timers = data.items.data ?? [];

	/**
	 * @type {string}
	 * The theme (light/dark)
	 */
	let theme;

	/**
	 * Creates a timer.
	 */
	function createTimer() {
		let newTimers = store.create();
		if (newTimers !== null) {
			timers = newTimers;
		}
	}

	/**
	 * @param {string} id
	 * Deletes a timer
	 */
	function deleteTimer(id) {
		let newTimers = store.delete(id);
		if (newTimers !== null) {
			timers = newTimers;
		}
	}

	/**
	 * @param {string} id
	 * Starts a timer.
	 */
	function startTimer(id) {
		let newTimers = store.start(id);
		if (newTimers !== null) {
			timers = newTimers;
		}
	}

	/**
	 * @param {string} id
	 * Pauses a timer.
	 */
	function pauseTimer(id) {
		let newTimers = store.pause(id);
		if (newTimers !== null) {
			timers = newTimers;
		}
	}

	/**
	 * @param {string} id
	 * Resets a timer.
	 */
	function resetTimer(id) {
		let newTimers = store.reset(id);
		if (newTimers !== null) {
			timers = newTimers;
		}
	}

	/**
	 * @param {string} id
	 * @param {string} name
	 * Invoked on name change.
	 */
	function updateName(id, name) {
		let newTimers = store.updateName(id, name);
		if (newTimers !== null) {
			timers = newTimers;
		}
	}
	/**
	 * @param {string} id
	 * @param {number} duration
	 * Updates the duration in the local storage.
	 */
	function updateDuration(id, duration) {
		let newTimers = store.updateDuration(id, duration);
		if (newTimers !== null) {
			timers = newTimers;
		}
	}

	/**
	 * A map from id to duration to keep book of
	 * the total timer duration.
	 * @type {{ id: string; duration: number; }[]}
	 */
	$: durationsMap = timers.map((timer) => {
		return {
			id: timer.id,
			duration: timer.offsetDuration,
		};
	});

	/**
	 * @param {string} id
	 * @param {number} duration
	 * Updates the duration in the durationsMap, not
	 * in the local storage.
	 */
	function updateDurationsMap(id, duration) {
		const index = durationsMap.findIndex((item) => item.id === id);
		if (index !== -1) {
			durationsMap[index].duration = duration;
		}
	}

	/**
	 * @type {number}
	 */
	$: totalTime = durationsMap.reduce(
		(sum, item) => sum + item.duration,
		0
	);

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
	 * @type {number|null}
	 */
	let draggingIndex = null;

	/**
	 * @param {number} index
	 */
	function swapTimers(index) {
		if (draggingIndex != null && index != draggingIndex) {
			// swap
			timers = store.swap(draggingIndex, index);

			// balance
			draggingIndex = index;
		}
	}

	/**
	 * Set default theme to light.
	 */
	onMount(() => {
		let defaultTheme = "dark";
		document.body.className = defaultTheme;
		theme = defaultTheme;

		/**
		 * We need to resynchronize the timers with the
		 * local storage after the browser has been
		 * hidden for a while.
		 */
		const onVisibilityChange = () => {
			let state = document.visibilityState;
			if (state == "visible") {
				let newTimers = store.list();
				if (newTimers !== null) {
					timers = newTimers;
				}
			}
		};
		document.addEventListener(
			"visibilitychange",
			onVisibilityChange
		);
	});

	/**
	 * @param {boolean} childInputFocus
	 * Whether an input field is being focused. Used
	 * to disable drag and drop.
	 */
	let isInputFocused = false;

	/**
	 * Handles drag start
	 * @param {DragEvent} event
	 * @param {number} index
	 */
	function handleDragStart(event, index) {
		draggingIndex = index;
		// Necessary for drag & drop to work on touch screens
		let dataTransfer = event.dataTransfer;
		if (dataTransfer !== null) {
			let data = JSON.stringify({
				index: index,
			});
			dataTransfer.setData("text/plain", data);
		}
	}

	/**
	 * Handles drag end
	 */
	function handleDragEnd() {
		draggingIndex = null;
	}

	/**
	 * Handles drag enter
	 * @param {number} index
	 */
	function handleDragEnter(index) {
		swapTimers(index);
	}
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
	{#each timers as item, index (item.id)}
		<div
			role="listitem"
			draggable={!isInputFocused}
			on:dragstart={(event) => handleDragStart(event, index)}
			on:dragend={() => handleDragEnd()}
			on:dragenter={() => handleDragEnter(index)}
			on:dragover|preventDefault
			on:drop|preventDefault
		>
			<hr class="divider" />
			<div class="timer-item" transition:slide>
				<TimerItem
					name={item.name}
					duration={item.duration}
					offsetDuration={item.offsetDuration}
					isRunning={item.isRunning}
					requestFocus={item.requestFocus}
					onDelete={() => deleteTimer(item.id)}
					onStart={() => startTimer(item.id)}
					onPause={() => pauseTimer(item.id)}
					onReset={() => resetTimer(item.id)}
					onUpdateName={(name) =>
						updateName(item.id, name)}
					onUpdateDuration={(d) =>
						updateDuration(item.id, d)}
					onIntervall={(d) =>
						updateDurationsMap(item.id, d)}
					bind:isInputFocused
				/>
			</div>
			<hr class="divider" />
		</div>
	{/each}
	<hr class="divider" />
	<div class="spacer" />
	<div class="row">
		<AddButton on:click={createTimer} />
		<p class="text-total-timer">
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
		padding: 1px 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.title {
		text-align: center;
		font-size: 2.4em;
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
		padding: 1px 0px;
	}
	hr.divider {
		margin: 0;
		border: 0;
		border-top: 1px solid #ccc;
		display: block;
		border-color: var(--bg-secondary);
		background-color: var(--bg-secondary);
	}
	div.spacer {
		margin-top: 10px;
	}
	.text-total-timer {
		font-size: 1em;
		margin-right: 10px;
	}
	.fixed-width {
		display: inline-block;
		width: 4.1em;
		text-align: right;
	}
</style>
