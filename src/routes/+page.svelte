<script>
	import TimerItem from "$lib/components/TimerItem.svelte";
	import { TimerStore, durationsStore } from "$lib/store.js";
	import { toggleThemeStorage, getInitialTheme } from "$lib/theme.js";
	import { AddButton } from "$lib/components/buttons";
	import { fade, slide } from "svelte/transition";
	import { onDestroy, onMount } from "svelte";
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
	 * @param {string} id
	 * @param {string} notes
	 * Invoked on notes change.
	 */
	function updateNotes(id, notes) {
		let newTimers = store.updateNotes(id, notes);
		if (newTimers !== null) {
			timers = newTimers;
		}
	}

	/**
	 * @param {string} id
	 * Invoked when the item gets expanded
	 */
	function toggleExpanded(id) {
		let newTimers = store.toggleExpanded(id);
		if (newTimers !== null) {
			timers = newTimers;
		}
	}

	/**
	 * @type {number} the total time
	 */
	let totalTime;
	const unsubscribe = durationsStore.subscribe((durations) => {
		totalTime = Array.from(durations.values()).reduce(
			(sum, duration) => sum + duration,
			0,
		);
	});

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
		theme = getInitialTheme() ?? "dark";

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
		document.addEventListener("visibilitychange", onVisibilityChange);
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

	onDestroy(unsubscribe);
</script>

<div class="header">
	<h1 class="title">Time Tracker</h1>
	<button on:click={toggleTheme} class="theme-btn">
		<div class="icon" in:fade>
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
			<div class="timer" transition:slide>
				<TimerItem
					id={item.id}
					bind:name={item.name}
					bind:duration={item.duration}
					bind:offsetDuration={item.offsetDuration}
					bind:isRunning={item.isRunning}
					bind:isExpanded={item.isExpanded}
					bind:notes={item.notes}
					requestFocus={item.requestFocus}
					onDelete={() => deleteTimer(item.id)}
					onStart={() => startTimer(item.id)}
					onPause={() => pauseTimer(item.id)}
					onReset={() => resetTimer(item.id)}
					onChangeName={(name) => updateName(item.id, name)}
					onChangeDuration={(d) => updateDuration(item.id, d)}
					onChangeNotes={(notes) => updateNotes(item.id, notes)}
					onToggleExpanded={() => toggleExpanded(item.id)}
					bind:isInputFocused
				/>
			</div>
			<hr class="divider" />
		</div>
	{/each}
	<hr class="divider" />
	<div class="spacer"></div>
	<div class="row">
		<AddButton on:click={createTimer} />
		<p class="total-time">
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
		background: var(--bg-header);
		color: var(--text-header);
		border-radius: 2rem;
		margin-right: 10px;
	}
	@media (hover: hover) {
		.theme-btn:hover {
			cursor: pointer;
			transform: scale(0.85);
		}
	}
	.icon {
		display: flex;
		justify-content: center;
	}
	.timer {
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
	.total-time {
		font-size: 1em;
		margin-right: 10px;
	}
	.fixed-width {
		display: inline-block;
		width: 4.1em;
		text-align: right;
	}
</style>
