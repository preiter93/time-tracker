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
	:global(body) {
		background-color: var(--bg-primary);
		margin: 0;
		padding: 0;
	}

	:global(p, input[type="text"]) {
		color: var(--text-primary);
	}

	:global(.light) {
		--bg-header: #1f7a8c;
		--text-header: #fff;
		--bg-primary: #fff;
		--bg-secondary: #000;
		--text-primary: #000;
		--btn-primary: #000;
		--btn-secondary: #fff;
		--btn-action: #c30101;
	}

	:global(.dark) {
		--bg-header: #000;
		--text-header: #913175;
		--bg-primary: #20262e;
		--bg-secondary: #913175;
		--text-primary: #e9e8e8;
		--btn-primary: #e9e8e8;
		--btn-secondary: #913175;
		--btn-action: #e9e8e8;
	}
</style>
