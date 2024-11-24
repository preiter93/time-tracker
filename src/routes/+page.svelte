<script>
	import { durationsStore } from "$lib/store.js";
	import { toggleThemeStorage, getInitialTheme } from "$lib/theme.js";
	import { fade } from "svelte/transition";
	import { onDestroy, onMount } from "svelte";
	import { DarkIcon, LightIcon } from "$lib/components/icons";
	import Timers from "$lib/TimerTab.svelte";

	/** @type {import('./$types').PageData} */
	export let data;

	/**
	 * @type {string}
	 * The theme (light/dark)
	 */
	let theme;

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
	 * Set default theme to light.
	 */
	onMount(() => {
		theme = getInitialTheme() ?? "dark";
	});

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
<Timers {data} />

<style>
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
		font-size: 2em;
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
</style>
