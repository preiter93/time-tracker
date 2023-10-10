<script>
</script>

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
	:root {
		--dark-purple: #691c52;
		--light-purple: #913175;
		--light-gray: #e9e8e8;
		--dark-gray: #20262e;
		--action-red: #c30101;
		--turquoise: #1f7a8c;
	}
	:global(body) {
		background-color: var(--bg-primary);
		margin: 0;
		padding: 0;
	}

	:global(p, input[type="text"]) {
		color: var(--text-primary);
	}

	:global(.light) {
		--bg-header: var(--turquoise);
		--text-header: white;
		--bg-primary: white;
		--bg-secondary: black;
		--text-primary: black;
		--btn-primary: black;
		--btn-secondary: white;
		--btn-action: var(--action-red);
	}

	:global(.dark) {
		--bg-header: black;
		--text-header: var(--dark-purple);
		--bg-primary: var(--dark-gray);
		--bg-secondary: var(--dark-purple);
		--text-primary: var(--light-gray);
		--btn-primary: var(--light-gray);
		--btn-secondary: var(--dark-purple);
		--btn-action: var(--light-gray);
	}
</style>
