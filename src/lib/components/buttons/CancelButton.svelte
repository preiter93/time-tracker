<script>
	import { CancelIcon } from "$lib/components/icons";
</script>

<button on:click class="cancel-button">
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
		color: black;
		margin: var(--margin, "0 0");
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
	}
</style>
