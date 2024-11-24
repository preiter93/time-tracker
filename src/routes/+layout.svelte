<script>
	import { toggleThemeStorage, getInitialTheme } from "$lib/theme.js";
	import { fade } from "svelte/transition";
	import { onMount } from "svelte";
	import { DarkIcon, LightIcon } from "$lib/components/icons";

	let { children } = $props();

	/**
	 * @type {string}
	 * The theme (light/dark)
	 */
	let theme = $state("");

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
</script>

<div class="header">
	<!-- <nav> -->
	<!-- 	<a href="/">Timers</a> -->
	<!-- 	<a href="/todos">Todos</a> -->
	<!-- </nav> -->
	<h1 class="title">Time Tracker</h1>
	<button onclick={toggleTheme} class="theme-btn">
		<div class="icon" in:fade>
			{#if theme === "dark"}
				<LightIcon />
			{:else}
				<DarkIcon />
			{/if}
		</div>
	</button>
</div>
{@render children()}
<svelte:head>
	<style>
		@import url("https://fonts.googleapis.com/css?family=Raleway&display=swap");
	</style>
</svelte:head>

<style>
	:root {
		--light-purple: #913175;
		--light-gray: #e9e8e8;
		--gray: #d1d0d0;
		--dark-gray: #1e293b;
		--black: #020617;
		--white: #f1f5f9;
		--dark-blue: #1e293b;
	}
	:global(h1, p, input[type="text"], textarea) {
		font-family: "Raleway", sans-serif;
	}
	:global(body) {
		background-color: var(--bg-primary);
		margin: 0;
		padding: 0;
	}

	:global(p, input[type="text"], textarea) {
		color: var(--text-primary);
	}

	:global(.light) {
		--bg-header: var(--dark-blue);
		--text-header: var(--white);
		--bg-primary: var(--white);
		--bg-secondary: var(--black);
		--text-primary: var(--black);
		--btn-primary: var(--black);
		--btn-secondary: var(--white);
		--btn-action: var(--dark-blue);
	}

	:global(.dark) {
		--bg-header: var(--black);
		--text-header: var(--gray);
		--bg-primary: var(--dark-gray);
		--bg-secondary: var(--dark);
		--text-primary: var(--light-gray);
		--btn-primary: var(--gray);
		--btn-secondary: var(--black);
		--btn-action: var(--light-gray);
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
