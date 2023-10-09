<script>
	import { CancelIcon } from "$lib/components/icons";

	/**
	 * @type {string}
	 */
	export let margin = "0";
</script>

<button on:click class="cancel-button" style="margin: {margin};">
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
