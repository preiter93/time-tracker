<script>
	import { page } from '$app/stores';
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

	const sections = [
		{ name: '⏱  Timers', href: '/time-tracker' },
		{ name: '✔ Todos', href: '/time-tracker/todos' }
	];

	const basePath = 'time-tracker';
	$effect(() => console.log("base path" + basePath));
</script>

<div class="header">
	<div>
		<nav class="navbar">
			<div class="sections">
				{#each sections as section}
					<a 
						href={section.href}
						class={`section ${$page.url.pathname === section.href ? 'active' : 'inactive'}`}
					>
						{section.name}
					</a>
				{/each}
			</div>
		</nav>
	</div>
	<!-- <h1 class="title">Time Tracker</h1> -->
	<div class="theme-button">
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
</div>
{@render children()}
<svelte:head>
	<style>
		@import url("https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap");
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
	:global(a, p, input[type="text"], textarea) {
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
		padding: 5px 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;
	}
	.title {
		text-align: center;
		font-size: 2em;
		flex: 1;
		margin-left: 20px;
	}
	.theme-button {
		display: flex;
		justify-content: flex-end;
		text-align: right;
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

	.navbar {
		display: flex;
        gap: 1rem;
        padding: 1rem;
	}

	.sections {
		display: flex;
		gap: 2.0rem;
	}

	.section {
		display: inline-block;
        text-decoration: none;
        color: var(--fg-header);
        padding: 0.3rem 0.2rem;
		font-size: 18px;
	}

	.section.active {
		font-weight: 700;
		border-bottom: 2px solid var(--white);
	}

	@media (hover: hover) {
		.section.inactive:hover {
			cursor: pointer;
			transform: scale(0.85);
		}
	}
</style>
