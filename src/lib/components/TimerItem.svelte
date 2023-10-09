<script>
	import { onDestroy, onMount } from "svelte";
	import { ControlButton, CancelButton } from "$lib/components/buttons";

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
	 * @type {function():Promise<void>}
	 * Callback invoked on delete.
	 */
	export let onDelete;

	/**
	 * @type {function():Promise<void>}
	 * Callback invoked on start.
	 */
	export let onStart;

	/**
	 * @type {function():Promise<void>}
	 * Callback invoked on pause.
	 */
	export let onPause;

	/**
	 * @type {function():Promise<void>}
	 * Callback invoked on reset.
	 */
	export let onReset;

	/**
	 * @type {function(string):Promise<void>}
	 * Callback invoked on changed.
	 */
	export let onChanged;

	/**
	 * @type {number | null} timer
	 */
	let timer = null;

	async function start() {
		await onStart();
		timer = setInterval(() => {
			duration += 1;
		}, 1000);
	}

	async function pause() {
		await onPause();
		resetInterval();
	}

	async function reset() {
		await onReset();
		resetInterval();
	}

	function resetInterval() {
		if (timer !== null) {
			clearInterval(timer);
			timer = null;
		}
	}

	async function remove() {
		await onDelete();
	}

	onMount(() => {
		if (isRunning && timer === null) {
			timer = setInterval(() => {
				duration += 1;
			}, 1000);
		}
	});

	onDestroy(() => {
		if (timer !== null) {
			clearInterval(timer);
			timer = null;
		}
	});

	/**
	 * @param {number} seconds
	 */
	function formatDuration(seconds) {
		/**
		 * @param {number} number
		 */
		function fmt(number) {
			return String(number).padStart(2, "0");
		}
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = Math.floor(seconds % 60);
		return `${fmt(h)}:${fmt(m)}:${fmt(s)}`;
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
</script>

<div class="outer">
	<div>
		<input
			class="name"
			name="timerName"
			type="text"
			on:blur={() => onChanged(name)}
			bind:value={name}
			use:blurOnEnter
			use:focusOnInit
		/>
	</div>
	<div class="row">
		<p class="time">
			{formatDuration(duration + offsetDuration)}
		</p>
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
	.time {
		font-size: 20px;
		margin: 0 20px 0 0;
		width: 64px;
	}
	.name {
		font-size: 20px;
		border: none;
		background-color: transparent;
		width: 95%;
		max-width: 400px;
		margin-left: 5px;
	}
	.row {
		display: flex;
		align-items: center;
	}
</style>
