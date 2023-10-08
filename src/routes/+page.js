import { TimerCookie } from "$lib/cookies";

/** @type {import('./$types').PageLoad} */
export async function load() {
	const data = new TimerCookie().list();
	return {
		items: { data }
	};
}
