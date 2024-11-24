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
	 * @typedef Props
	 * @property {string} id
	 * @property {string} name
	 * @property {number} offsetDuration
	 * @property {number} duration
	 * @property {boolean} isRunning
	 * @property {boolean} requestFocus
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
		offsetDuration = $bindable(0),
		duration = $bindable(0),
		isRunning = $bindable(false),
		requestFocus = false,
		isExpanded = $bindable(false),
		notes = $bindable(""),
		isInputFocused = $bindable(false),
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

	function changeDuration() {
		let duration = parseTime(totalDuration.display);
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
		class="timer-name"
		onfocus={handleFocus}
		onblur={() => {
			handleBlur();
			onChangeName(name);
		}}
		bind:value={name}
		use:blurOnEnter
		use:focusOnInit
	/>
	<div class="inner-row">
		<input
			class="timer-time"
			type="text"
			disabled={isRunning}
			onfocus={handleFocus}
			onblur={() => {
				handleBlur();
				changeDuration();
			}}
			bind:value={totalDuration.display}
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
	.timer-item {
		margin: 10px 0;
		align-items: center;
		display: flex;
	}
	.timer-name {
		font-size: 20px;
		width: 100%;
		border: none;
		background-color: transparent;
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
		height: 28px;
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
