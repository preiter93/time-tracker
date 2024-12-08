<script>
	import { AddIcon } from "$lib/components/icons";

	/**
	 * @typedef Props
	 * @property {function():void} onclick
	 * @property {string} text
	 */
	/** @type {Props} */
	let { onclick, text } = $props();
</script>

<button {onclick} class="add-button">
	<div class="row">
		<div class="center">
			<AddIcon />
		</div>
		<p class="text">{text}</p>
	</div>
</button>

<style>
	button {
		border: none;
		background: none;
		width: 150px;
		height: var(--icon-size-medium);
		color: var(--btn-primary);
	}
	@media (hover: hover) {
		button:hover {
			cursor: pointer;
			transform: scale(0.92);
		}
	}
	.row {
		display: flex;
		align-items: center;
		text-align: center;
		height: 100%;
	}
	.text {
		font-size: var(--font-size-small);
		margin-left: 8px;
	}
	.center {
		display: flex;
		justify-content: center;
		color: var(--btn-primary);
	}
</style>
