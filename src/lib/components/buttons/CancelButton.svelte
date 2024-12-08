<script>
	import { CancelIcon } from "$lib/components/icons";

	/**
	 * @typedef Props
	 * @property {function():void} onclick
	 */
	/** @type {Props} */
	let { onclick } = $props();
</script>

<button {onclick}>
	<div class="center">
		<CancelIcon />
	</div></button
>

<style>
	button {
		border: none;
		background: none;
		width: var(--icon-size-medium);
		height: var(--icon-size-medium);
	}
	@media (hover: hover) {
		button:hover {
			cursor: pointer;
			transform: scale(0.85);
		}
	}
	.center {
		display: flex;
		justify-content: center;
		color: var(--btn-primary);
	}
</style>
