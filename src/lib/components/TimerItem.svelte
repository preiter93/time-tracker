<script>
	import { onDestroy, onMount } from "svelte";
	import { ControlButton, CancelButton } from "$lib/components/buttons";
	import { formatDuration, parseTime } from "$lib/utils";

	/**
	 * @type {number | null} timer
	 */
	let timer = null;

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
j	 */
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
	 * @type {string}
	 * The displayed time.
j	 */
	$: displayedTime = formatDuration(duration + offsetDuration);

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
	export let onUpdateName;

	/**
	 * @type {function(number):void}
	 * Callback invoked on time change
	 */
	export let onUpdateDuration;

	/**
	 * @type {function(number):void}
	 * Callback invoked on intervall tick
	 */
	export let onIntervall;

	function start() {
		onStart();
		startTimer();
	}

	function pause() {
		onPause();
		resetInterval();
	}

	function reset() {
		onReset();
		resetInterval();
	}

	function resetInterval() {
		if (timer !== null) {
			clearInterval(timer);
			timer = null;
		}
	}

	function remove() {
		onDelete();
	}

	function updateDuration() {
		let d = parseTime(displayedTime);
		if (d !== null) {
			onUpdateDuration(d);
		} else {
			displayedTime = formatDuration(
				duration + offsetDuration
			);
		}
	}

	onMount(() => {
		if (isRunning && timer === null) {
			startTimer();
		}
	});

	function startTimer() {
		timer = setInterval(() => {
			duration += 1;
			onIntervall(duration + offsetDuration);
		}, 1000);
	}

	onDestroy(() => {
		if (timer !== null) {
			clearInterval(timer);
			timer = null;
		}
	});

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
</script>

<div class="outer">
	<div>
		<input
			class="name"
			name="timerName"
			type="text"
			on:blur={() => onUpdateName(name)}
			bind:value={name}
			use:blurOnEnter
			use:focusOnInit
		/>
	</div>
	<div class="row">
		<input
			class="time"
			name="timerTime"
			type="text"
			on:blur={() => updateDuration()}
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
		<ControlButton
			on:click={reset}
			symbol={"stop"}
			margin="0 5px 0 0"
		/>
		<CancelButton on:click={remove} margin="0 5px 0 0" />
	</div>
</div>

<style>
	.outer {
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
	.name {
		width: 95%;
		max-width: 400px;
		margin-left: 5px;
	}
	.time {
		font-size: 20px;
		margin: 0 20px 0 0;
		width: 90px;
		text-align: right;
	}
	.row {
		display: flex;
		align-items: center;
	}
</style>
