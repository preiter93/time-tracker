<script>
	import TimerItem from "$lib/components/TimerItem.svelte";
	import { TimerStore, durationsStore } from "$lib/store.js";
	import { AddButton } from "$lib/components/buttons";
	import { onDestroy, onMount } from "svelte";
	import { formatDuration } from "$lib/utils";
	import { dndzone } from "svelte-dnd-action";
	import { flip } from "svelte/animate";

	const flipDurationMs = 100;
	const dropTargetStyle = {
		"background-color": "none",
	};

	/**
	 * @typedef {Object} Props
	 * @property {import('$lib/types').PageData<import('$lib/types').TimerItem[]>} data
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
	 * @param {{ detail: { items: import('$lib/types.js').TimerItem[]; } }} e
	 */
	function handleDndConsider(e) {
		timers = e.detail.items;
	}
	/**
	 * @param {{ detail: { items: import('$lib/types.js').TimerItem[]; } }} e
	 */
	function handleDndFinalize(e) {
		timers = e.detail.items;

		let ids = new Array(e.detail.items.length);
		for (const i in e.detail.items) {
			ids[i] = e.detail.items[i].id;
		}
		store.sortByIds(ids);
	}

	onDestroy(unsubscribe);
</script>

<div
	class="timer-list"
	use:dndzone={{
		items: timers,
		flipDurationMs,
		dropTargetStyle,
		dragDisabled: isInputFocused ? true : false,
	}}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
>
	{#each timers as item (item.id)}
		<div role="listitem" animate:flip={{ duration: flipDurationMs }}>
			<div class="timer">
				<TimerItem
					id={item.id}
					bind:name={item.name}
					bind:duration={item.duration}
					bind:offsetDuration={item.offsetDuration}
					bind:isRunning={item.isRunning}
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
		</div>
	{/each}
	<div class="row">
		<AddButton onclick={createTimer} text="Add timer" />
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
		display: block;
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
