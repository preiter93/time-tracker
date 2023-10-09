const storeKey = 'items';

export class TimerStore {
	constructor() { }

	list() {
		let items = fetchTimerItemsFromStore();
		return items.map(
			(timer) => {
				return convertTimerItem(timer);
			}
		);
	}

	create() {
		let items = fetchTimerItemsFromStore();
		let id = generateRandomID();
		let newTimer = new TimerItemValue(id, `Timer ${items.length + 1}`, 0, null);
		items.push(newTimer);
		setItems(JSON.stringify(items));
		return convertTimerItem(newTimer);
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	delete(id) {
		let items = fetchTimerItemsFromStore();
		items = items.filter(item => item.id !== id);
		setItems(JSON.stringify(items));
		return items.map(
			(timer) => {
				return convertTimerItem(timer);
			}
		);
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	start(id) {
		return updateTimerItemInStore(id, (item) => {
			item.started_at = new Date();
			return item;
		})
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	pause(id) {
		return updateTimerItemInStore(id, (item) => {
			if (item.started_at !== null) {
				item.duration += (new Date().getTime() - new Date(item.started_at).getTime()) / 1000;
			}
			item.started_at = null;
			return item;
		})
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	reset(id) {
		return updateTimerItemInStore(id, (item) => {
			item.started_at = null;
			item.duration = 0;
			return item;
		})
	}

	/**
	 * @param {string} id
	 * @param {string} name
	 */
	updateName(id, name) {
		return updateTimerItemInStore(id, (item) => {
			item.name = name;
			return item;
		})
	}


}

/**
 * Store the timer items in local storage
 * @param {string} items
 */
function setItems(items) {
	localStorage.setItem(storeKey, items);
}

/**
 * Retrieve the timer items from local storage
 */
function getItems() {
	return localStorage.getItem(storeKey);
}

/**
 * @returns {TimerItemValue[]}
 */
function fetchTimerItemsFromStore() {
	let items = getItems();
	if (items !== null) {
		return JSON.parse(items);
	}
	return [];
}

/**
 * @param {string} id
 * @param {function(TimerItemValue): TimerItemValue} cb
 * @returns {import('$lib/types.js').TimerItem[]|null}
 */
function updateTimerItemInStore(id, cb) {
	let items = fetchTimerItemsFromStore();
	const index = items.findIndex(
		(item) => item.id === id
	);
	if (index !== -1) {
		items[index] = cb(items[index]);
		setItems(JSON.stringify(items));
		return items.map(
			(timer) => {
				return convertTimerItem(timer);
			}
		);
	}
	return null;
}


class TimerItemValue {
	/**
	 * @param {string} id
	 * @param {string} name
	 * @param {number} duration
	 * @param {Date|null} started_at
	 */
	constructor(id, name, duration, started_at) {
		this.id = id;
		this.name = name;
		this.duration = duration;
		this.started_at = started_at;
	}
}

function generateRandomID() {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 8; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}
	return result;
}

/**
 * @param {TimerItemValue} timer
 * @returns {import('$lib/types.js').TimerItem}
 */
function convertTimerItem(timer) {
	const isRunning =
		timer.started_at !==
		null;
	const sinceStarted = timer.started_at !==
		null
		? (new Date().getTime() -
			new Date(
				timer.started_at
			).getTime()) /
		1000
		: 0;
	return {
		id: timer.id,
		name: timer.name,
		isRunning: isRunning,
		duration: 0,
		offsetDuration:
			timer.duration +
			sinceStarted,
	};
}
