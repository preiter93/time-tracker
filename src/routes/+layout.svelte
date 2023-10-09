<slot />
<svelte:head>
	<style>
		@import url("https://fonts.googleapis.com/css?family=Raleway&display=swap");
		h1,
		p,
		input[type="text"] {
			font-family: "Raleway", sans-serif;
		}
	</style>
</svelte:head>

<style>
	:global(:root) {
		--bg-primary: red;
		--bg-secondary: green;
		--bg-header: #1f7a8c;
		--text-primary: blue;
		--text-header: yellow;
		--btn-primary: blue;
		--btn-secondary: purple;
		--btn-action: #e5383b;
	}
	:global(body) {
		color: var(--bg-primary);
		background-color: var(--bg-secondary);
		margin: 0;
		padding: 0;
	}
	:global(p, input[type="text"]) {
		color: var(--text-primary);
	}
</style>
