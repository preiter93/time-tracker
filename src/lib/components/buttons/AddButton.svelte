<script>
	import { AddIcon } from "$lib/components/icons";
</script>

<button on:click class="add-button">
	<div class="row">
		<div class="center">
			<AddIcon />
		</div>
		<p class="text">Add timer</p>
	</div>
</button>

<style>
	button {
		border: none;
		background: none;
		width: 150px;
		height: 40px;
		font-size: 1.2rem;
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
		font-size: 16px;
		margin-left: 10px;
	}
	.center {
		display: flex;
		justify-content: center;
		color: var(--btn-primary);
	}
</style>
