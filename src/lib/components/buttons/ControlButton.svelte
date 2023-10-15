<script>
	import {
		PlayIcon,
		PauseIcon,
		StopIcon,
		CancelIcon,
	} from "$lib/components/icons";

	/**
	 * @type {any}
	 */
	export let symbol;

	/**
	 * @type {string}
	 */
	export let cls = "default";
	/**
	 * @type {string}
	 */
	export let margin = "0";
</script>

<button on:click class={cls} style="margin: {margin};" data-testid={symbol}>
	<div class="center">
		{#if symbol === "play"}
			<PlayIcon />
		{:else if symbol === "pause"}
			<PauseIcon />
		{:else if symbol === "stop"}
			<StopIcon />
		{:else if symbol === "cancel"}
			<CancelIcon />
		{/if}
	</div></button
>

<style>
	.default {
		color: var(--btn-primary);
		background-color: var(--btn-secondary);
	}
	.action {
		color: var(--btn-secondary);
		background-color: var(--btn-action);
	}
	button {
		width: 40px;
		height: 40px;
		border: 0.1px solid var(--dark-gray);
		font-size: 1.4rem;
		border-radius: 0.2rem;
		align-items: center;
		justify-content: center;
		display: flex;
		box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2),
			inset 0px -2px 3px rgba(0, 0, 0, 0.2);
	}
	@media (hover: hover) {
		button:hover {
			cursor: pointer;
			transform: scale(0.975);
			box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
		}
	}
	.center {
		display: flex;
		justify-content: center;
	}
</style>
