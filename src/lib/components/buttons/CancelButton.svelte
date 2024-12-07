<script>
	import { CancelIcon } from "$lib/components/icons";

	/**
	 * @typedef Props
	 * @property {string} [margin]
	 * @property {function():void} onclick
	 */
	/** @type {Props} */
	let { margin = "0", onclick } = $props();
</script>

<button
	{onclick}
	ontouchend={onclick}
	class="cancel-button"
	style="margin: {margin};"
>
	<div class="center">
		<CancelIcon />
	</div></button
>

<style>
	button {
		border: none;
		background: none;
		width: 40px;
		height: 40px;
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
