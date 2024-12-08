<script>
	import {
		PlayIcon,
		PauseIcon,
		StopIcon,
		CancelIcon,
	} from "$lib/components/icons";

	/**
	 * @typedef Props
	 * @property {any} symbol
	 * @property {string} [cls="default"]
	 * @property {function():void} onclick
	 */
	/** @type {Props} */
	let { symbol, cls = "default", onclick } = $props();
</script>

<button {onclick} class={cls} data-testid={symbol}>
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
		width: var(--icon-size-medium);
		height: var(--icon-size-medium);
		border: 0.1px solid var(--dark-gray);
		font-size: 1.4rem;
		border-radius: 0.2rem;
		align-items: center;
		justify-content: center;
		display: flex;
		box-shadow:
			0px 1px 1px rgba(0, 0, 0, 0.2),
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
