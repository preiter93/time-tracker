<script>
	import { onDestroy, onMount } from "svelte";
	import { ControlButton, CancelButton } from "$lib/components/buttons";
	import { formatDuration, parseTime } from "$lib/utils";
	import { durationsStore } from "$lib/store";
	import { slide } from "svelte/transition";
	import { blurOnEnter } from "$lib/utils";

	/**
	 * @type {number | null} timer
	 */
	let timer = null;

	/**
	 * @typedef Props
	 * @property {string} id
	 * @property {string} name
	 * @property {number} offsetDuration
	 * @property {number} duration
	 * @property {boolean} isRunning
	 * @property {boolean | undefined} requestFocus
	 * @property {boolean} isExpanded
	 * @property {boolean} isInputFocused
	 * @property {string} notes
	 * @property {function():void} onDelete
	 * @property {function():void} onStart
	 * @property {function():void} onReset
	 * @property {function():void} onPause
	 * @property {function(string):void} onChangeNotes
	 * @property {function(string):void} onChangeName
	 * @property {function(number):void} onChangeDuration
	 * @property {function():void} onToggleExpanded
	 */

	/** @type {Props} */
	let {
		id,
		name = $bindable(),
		offsetDuration = $bindable(),
		duration = $bindable(),
		isRunning = $bindable(),
		requestFocus = false,
		isExpanded = $bindable(),
		notes = $bindable(),
		isInputFocused = $bindable(),
		onDelete,
		onStart,
		onReset,
		onPause,
		onChangeDuration,
		onChangeNotes,
		onChangeName,
		onToggleExpanded,
	} = $props();

	/**
	 * @typedef {Object} TotalDuration
	 * @property {number} value - the total duration in seconds.
	 * @property {string} display - a formatted string of the duration.
	 */
	/** @type {TotalDuration} */
	let totalDuration = $derived({
		value: duration + offsetDuration,
		get display() {
			return formatDuration(this.value);
		},
	});

	function start() {
		startTimer();
		onStart();
	}

	function pause() {
		if (timer !== null) {
			clearInterval(timer);
		}
		onPause();
	}

	function reset() {
		if (timer !== null) {
			clearInterval(timer);
		}
		onReset();
	}

	/**
	 * @param {string} value
	 */
	function changeDuration(value) {
		let duration = parseTime(value);
		if (duration !== null) {
			onChangeDuration(duration);
		}
	}

	function startTimer() {
		timer = setInterval(() => {
			durationsStore.update((value) => {
				return value.set(id, totalDuration.value + 1);
			});
			duration += 1;
		}, 1000);
	}

	/**
	 * Focuses the input form when an item is created
	 * @param {HTMLElement} node
	 */
	function focusOnInit(node) {
		if (requestFocus) {
			node.focus();
			requestFocus = false;
		}
	}

	function handleFocus() {
		isInputFocused = true;
	}

	function handleBlur() {
		isInputFocused = false;
	}

	onMount(() => {
		if (isRunning && timer === null) {
			startTimer();
		}
	});

	onDestroy(() => {
		if (timer !== null) {
			clearInterval(timer);
			timer = null;
		}
	});
</script>

<div class="timer-item">
	<div class="timer-item-content">
		<div class="timer-name-row">
			<button onclick={onToggleExpanded} class="chevron">
				<div>
					<svg
						class="chevron {isExpanded ? 'up' : 'down'}"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path
							class="chevron path"
							d="M12 15L6 9H18L12 15Z"
							fill="currentColor"
						/>
						>
					</svg>
				</div>
			</button>
			<input
				type="text"
				class="timer-name-input"
				onfocus={handleFocus}
				onblur={() => {
					handleBlur();
					onChangeName(name);
				}}
				bind:value={name}
				use:blurOnEnter
				use:focusOnInit
			/>
		</div>
		<div class="inner-row">
			<input
				class="timer-time"
				type="text"
				disabled={isRunning}
				onfocus={handleFocus}
				onblur={(
					/** @type {{ target: { value: string; }; }} */ event,
				) => {
					handleBlur();
					changeDuration(event.target.value);
				}}
				value={totalDuration.display}
				use:blurOnEnter
				use:focusOnInit
			/>
			<ControlButton
				onclick={isRunning ? pause : start}
				symbol={isRunning ? "pause" : "play"}
				cls={isRunning ? "action" : "default"}
				margin="0 10px"
			/>
			<ControlButton onclick={reset} symbol={"stop"} margin="0 5px 0 0" />
			<CancelButton onclick={onDelete} margin="0 5px 0 0" />
		</div>
	</div>
	{#if isExpanded}
		<div class="notes" transition:slide={{ duration: 500 }}>
			<textarea
				class="notes textarea"
				bind:value={notes}
				placeholder="Enter some text"
				onfocus={handleFocus}
				onblur={() => {
					handleBlur();
					onChangeNotes(notes);
				}}
			></textarea>
		</div>
	{/if}
</div>

<style>
	.timer-item {
		border: 2px solid black;
		color: var(--text-primary);
		font-size: 20px;
	}
	.timer-item-content {
		padding: 1em 0.2em;
		margin: 0.4em 0;
		color: var(--text-primary);
		font-size: 20px;
		line-height: 0.2;
		display: flex;
		justify-content: space-between;
	}
	.timer-name-row {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	.timer-name-input {
		font-size: 20px;
		border: none;
		background-color: transparent;
		width: 100%;
	}
	.inner-row {
		display: flex;
	}
	.timer-time {
		width: 90px;
		text-align: right;
		font-size: 20px;
		border: none;
		background-color: transparent;
	}
	.notes {
		padding: 0px 10px 10px 10px;
	}
	.notes.textarea {
		padding: 5px;
		width: 100%;
		height: 100px;
		box-sizing: border-box;
		resize: vertical;
		font-size: 16px;
		background-color: var(--bg-primary);
		border-color: var(--bg-secondary);
	}
	.chevron {
		align-items: center;
		justify-content: center;
		display: flex;
		width: 28px;
		height: 40px;
		fill: var(--text-primary);
		transition: transform 0.3s ease;
		margin: 0px 5px 0px 5px;
		background-color: transparent;
		border: none;
	}
	.chevron.down {
		transform: rotate(0deg);
	}
	.chevron.up {
		transform: rotate(180deg);
	}
</style>
