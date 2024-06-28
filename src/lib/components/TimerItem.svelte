<script>
	import { onDestroy, onMount } from "svelte";
	import { ControlButton, CancelButton } from "$lib/components/buttons";
	import { formatDuration, parseTime } from "$lib/utils";
	import { durationsStore } from "$lib/store";
	import { slide } from "svelte/transition";

	/**
	 * @type {number | null} timer
	 */
	let timer = null;

	/**
	 * @type {string}
	 * The timer id.
	 */
	export let id;

	/**
	 * @type {string}
	 * The display name.
	 */
	export let name;

	/**
	 * @type {number}
	 * The duration offset in sec.
	 */
	export let offsetDuration = 0;

	/**
	 * @type {number}
	 * The duration in sec.
	 */
	export let duration = 0;

	/**
	 * @type {boolean}
	 */
	export let isRunning = false;

	/**
	 * @type {boolean}
	 * Request focus of the input form.
	 */
	export let requestFocus = false;

	/**
	 * @type {boolean}
	 * Whether the item is expanded.
	 */
	export let isExpanded = false;

	/**
	 * @type {string}
	 * The timers notes.
	 */
	export let notes = "";

	/**
	 * @type {number}
	 * The total duration
	 */
	$: totalDuration = duration + offsetDuration;

	/**
	 * @type {string}
	 * The displayed time.
	 */
	$: displayedTime = formatDuration(totalDuration);

	/**
	 * @type {function():void}
	 * Callback invoked on delete.
	 */
	export let onDelete;

	/**
	 * @type {function():void}
	 * Callback invoked on start.
	 */
	export let onStart;

	/**
	 * @type {function():void}
	 * Callback invoked on pause.
	 */
	export let onPause;

	/**
	 * @type {function():void}
	 * Callback invoked on reset.
	 */
	export let onReset;

	/**
	 * @type {function(string):void}
	 * Callback invoked on name changes
	 */
	export let onChangeName;

	/**
	 * @type {function(number):void}
	 * Callback invoked on time change
	 */
	export let onChangeDuration;

	/**
	 * @type {function(string):void}
	 * Callback invoked on notes changes
	 */
	export let onChangeNotes;

	/**
	 * @type {function():void}
	 * Callback invoked when the expanded button is togglend
	 */
	export let onToggleExpanded;

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

	function changeDuration() {
		let duration = parseTime(displayedTime);
		if (duration !== null) {
			onChangeDuration(duration);
		}
	}

	function startTimer() {
		timer = setInterval(() => {
			durationsStore.update((value) => {
				return value.set(id, totalDuration + 1);
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

	/**
	 * Blurs the node when Enter is pressed
	 * @param {HTMLElement} node
	 */
	export function blurOnEnter(node) {
		/**
		 * Event handler for the keydown event.
		 * @param {KeyboardEvent} event
		 */
		function handleKey(event) {
			if (
				event.key === "Enter" &&
				node &&
				typeof node.blur === "function"
			)
				node.blur();
		}

		node.addEventListener("keydown", handleKey);

		return {
			destroy() {
				node.removeEventListener("keydown", handleKey);
			},
		};
	}

	/**
	 * @type {boolean}
	 * Is true if either the name or the time input field is focused.
	 */
	export let isInputFocused = false;

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

<div class="timer">
	<button onclick={onToggleExpanded} class="chevron">
		<div class="center">
			<svg
				class="chevron {isExpanded ? 'up' : 'down'}"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
			>
				<path d="M12 15L6 9H18L12 15Z" fill="currentColor" />
				>
			</svg>
		</div>
	</button>
	<div class="timerTitle">
		<input
			type="text"
			class="timerInput"
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
	<div class="row">
		<input
			class="timerTime"
			type="text"
			disabled={isRunning}
			onfocus={handleFocus}
			onblur={() => {
				handleBlur();
				changeDuration();
			}}
			bind:value={displayedTime}
			use:blurOnEnter
			use:focusOnInit
		/>
		<ControlButton
			on:click={isRunning ? pause : start}
			symbol={isRunning ? "pause" : "play"}
			cls={isRunning ? "action" : "default"}
			margin="0 10px"
		/>
		<ControlButton on:click={reset} symbol={"stop"} margin="0 5px 0 0" />
		<CancelButton on:click={onDelete} margin="0 5px 0 0" />
	</div>
</div>

{#if isExpanded}
	<div class="notes" transition:slide={{ duration: 300 }}>
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

<style>
	.timer {
		margin: 10px 0;
		padding: 0px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	input[type="text"] {
		font-size: 20px;
		border: none;
		background-color: transparent;
	}
	.timerTitle {
		width: 100%;
		margin-left: 0px;
	}
	.timerTime {
		width: 90px;
		text-align: right;
	}
	.row {
		display: flex;
		align-items: center;
	}
	.notes {
		padding: 0px 10px 10px 10px;
		display: flex;
		flex-direction: column;
	}
	.notes.textarea {
		padding: 5px;
		width: 100%;
		height: 100px;
		box-sizing: border-box;
		resize: vertical;
		font-size: 14px;
		background-color: var(--bg-primary);
		border-color: var(--bg-secondary);
	}
	.chevron {
		align-items: center;
		justify-content: center;
		display: flex;
		width: 28px;
		height: 28px;
		fill: currentColor;
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
	.center {
		display: flex;
		justify-content: center;
	}
</style>
