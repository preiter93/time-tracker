import { TodoStore } from "$lib/todos_store";

/** 
 * @type {import('./$types').PageLoad} 
 * @returns {{ items: {data: import('$lib/types.js').TodoItem[]|null} }}
 */
export function load() {
	const data = new TodoStore().list();
	return {
		items: { data }
	};
}
