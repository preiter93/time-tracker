<script>
	import TimerItem from "$lib/components/TimerItem.svelte";
	import { TimerStore, durationsStore } from "$lib/store.js";
	import { AddButton } from "$lib/components/buttons";
	import { slide } from "svelte/transition";
	import { onDestroy, onMount } from "svelte";
	import { formatDuration } from "$lib/utils";

	/**
	 * @typedef {Object} Props
	 * @property {import('../routes/$types').PageData} data
	 */

	/** @type {Props} */
	let { data } = $props();

	/**
	 * The timer items store
	 */
	let store = new TimerStore();

	/**
	 * Timer items
	 * @type {import('$lib/types.js').TimerItem[]}
	 */
	let timers = $state(data.items.data ?? []);

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
	let totalTime = $state(0);
	const unsubscribe = durationsStore.subscribe((durations) => {
		totalTime = Array.from(durations.values()).reduce(
			(sum, duration) => sum + duration,
			0,
		);
	});

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
	 * We need to resynchronize the timers with the
	 * local storage after the browser has been
	 * hidden for a while.
	 */
	onMount(() => {
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
	let isInputFocused = $state(false);

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

	/**
	 * @param {(this: any, event: Event) => void} fn
	 * @returns {(this: any, event: Event) => void}
	 */
	const preventDefault = (fn) => {
		return function (event) {
			event.preventDefault();
			fn.call(this, event);
		};
	};
</script>

<div>
	<hr class="divider" />
	{#each timers as item, index (item.id)}
		<div
			role="listitem"
			draggable={!isInputFocused}
			ondragstart={(event) => handleDragStart(event, index)}
			ondragend={() => handleDragEnd()}
			ondragenter={() => handleDragEnter(index)}
			ondragover={preventDefault((_) => {})}
			ondrop={() => handleDragEnd()}
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
		<AddButton onclick={createTimer} />
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
