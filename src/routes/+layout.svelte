<script>
</script>

<slot />
<svelte:head>
	<style>
		@import url("https://fonts.googleapis.com/css?family=Raleway&display=swap");
	</style>
</svelte:head>

<style>
	:root {
		--dark-purple-tw: #4a044e;
		--dark-purple: #691c52;
		--light-purple: #913175;
		--light-gray: #e9e8e8;
		--gray: #d1d0d0;
		--dark-gray: #1e293b;
		--black: #020617;
		--white: #f1f5f9;
		--dark-blue: #1e293b;
	}
	:global(h1, p, input[type="text"], textarea) {
		font-family: "Raleway", sans-serif;
	}
	:global(body) {
		background-color: var(--bg-primary);
		margin: 0;
		padding: 0;
	}

	:global(p, input[type="text"], textarea) {
		color: var(--text-primary);
	}

	:global(.light) {
		--bg-header: var(--dark-blue);
		--text-header: var(--white);
		--bg-primary: var(--white);
		--bg-secondary: var(--black);
		--text-primary: var(--black);
		--btn-primary: var(--black);
		--btn-secondary: var(--white);
		--btn-action: var(--dark-blue);
	}

	:global(.dark) {
		--bg-header: var(--black);
		--text-header: var(--gray);
		--bg-primary: var(--dark-gray);
		--bg-secondary: var(--dark);
		--text-primary: var(--light-gray);
		--btn-primary: var(--gray);
		--btn-secondary: var(--black);
		--btn-action: var(--light-gray);
	}
</style>
