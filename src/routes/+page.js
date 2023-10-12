import { TimerStore } from "$lib/store";

/** @type {import('./$types').PageLoad} */
export function load() {
	const data = new TimerStore().list();
	return {
		items: { data }
	};
}
