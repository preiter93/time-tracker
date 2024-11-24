<script>
	import Timers from "$lib/TimerPage.svelte";

	/**
	 * @typedef Props
	 * @property {import('./$types').PageData} data
	 */

	/** @type {Props} */
	let { data } = $props();
</script>

<Timers {data} />
