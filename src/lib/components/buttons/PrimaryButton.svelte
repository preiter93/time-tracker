<script>
	/**
	 * @type {string}
	 */
	export let symbol;
</script>

<button on:click>
	{symbol}
</button>

<style>
	button {
		border: none;
		border: 0.1px solid #5c5d5c;
		width: 40px;
		height: 40px;
		font-size: 1.4rem;
		border-radius: 0.2rem;
		color: var(--color, #fff);
		background-color: var(--background-color, #000);
		margin: var(--margin, "0 0");
		box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2),
			inset 0px -2px 3px rgba(0, 0, 0, 0.2);
	}
	button:hover {
		cursor: pointer;
		transform: scale(0.975);
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
	}
</style>
