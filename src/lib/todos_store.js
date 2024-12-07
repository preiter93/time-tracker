const storeKey = 'todos';

export class TodoStore {
	/**
	 * Creates a TodoStore instance
	 */
	constructor() { }

	/**
	 * @returns {Array<import('$lib/types.js').TodoItem>|null}
	 */
	list() {
		let items = fetchTodoItemsFromStore();
		return items;
	}

	/**
	 * @returns {Array<import('$lib/types.js').TodoItem>|null}
	 */
	create() {
		let items = fetchTodoItemsFromStore();
		let id = generateRandomID();
		let newItem = {
			id: id,
			content: `TODO ${items.length + 1}`,
		};
		items.push(newItem);
		setItems(items);
		return items;
	}

	/**
	 * @param {string} id
	 * @returns {Array<import('$lib/types.js').TodoItem>|null}
	 */
	delete(id) {
		let items = fetchTodoItemsFromStore();
		items = items.filter(item => item.id !== id);
		setItems(items);
		return items;
	}

	/**
	 * @param {string} id
	 * @param {string} content
	 */
	updateContent(id, content) {
		return updateTodoItemInStore(id, (item) => {
			item.content = content;
			return item;
		})
	}

	/**
	 * Sort timers by ids. 
	 * @param {Array<string>} ids
	 */
	sortByIds(ids) {
		console.log("sort by ids" + ids);
		let storeItems = fetchTodoItemsFromStore();
		console.log("storeItems" + storeItems);
		if (ids.length != storeItems.length) {
			console.log("sortByIds len mismatch detected")
			return
		}
		let sortedItems = new Array(ids.length)
		for (const i in ids) {
			const index = storeItems.findIndex(
				(item) => item.id === ids[i]
			);
			sortedItems[i] = storeItems[index]
		}
		console.log("sortedItems" + sortedItems);
		setItems(sortedItems);
	}
}

/**
 * @returns {import('$lib/types.js').TodoItem[]}
 */
function fetchTodoItemsFromStore() {
	let items = getItems();
	if (items !== null) {
		return JSON.parse(items);
	}
	return [];
}

/**
 * Retrieve the timer items from local storage
 */
function getItems() {
	return localStorage.getItem(storeKey);
}

/**
 * Store the timer items in local storage
 * @param {import('$lib/types.js').TodoItem[]} items
 */
function setItems(items) {
	localStorage.setItem(storeKey, JSON.stringify(items));
}

/**
 * @param {string} id
 * @param {function(import('$lib/types.js').TodoItem): import('$lib/types.js').TodoItem} cb
 * @returns {import('$lib/types.js').TodoItem[]|null}
 */
function updateTodoItemInStore(id, cb) {
	let items = fetchTodoItemsFromStore();
	const index = items.findIndex(
		(item) => item.id === id
	);
	console.log("index" + index)
	if (index !== -1) {
		items[index] = cb(items[index]);
		setItems(items);
		return items;
	}
	return null;
}

/**
 * Generates a random sequence of numbers and characters
 * @returns {String}
 */
function generateRandomID() {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 8; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}
	return result;
}
