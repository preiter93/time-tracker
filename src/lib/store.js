import { writable } from "svelte/store";

const storeKey = 'items';

/**
 * Represents the timer as it is stored in the local
 * storage database
 */
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

export class TimerStore {
	/**
	 * Creates a TimerStore instance
	 */
	constructor() { }

	/**
	 * @returns {Array<import('$lib/types.js').TimerItem>|null}
	 */
	list() {
		let items = fetchTimerItemsFromStore();
		updateDurations(items);
		return items.map(
			(timer) => {
				return convertTimerItem(timer);
			}
		);
	}

	/**
	 * @returns {Array<import('$lib/types.js').TimerItem>|null}
	 */
	create() {
		let items = fetchTimerItemsFromStore();
		let id = generateRandomID();
		let newTimer = new TimerItemValue(id, `Timer ${items.length + 1}`, 0, null);
		items.push(newTimer);
		setItems(items);
		return items.map(
			(timer) => {
				return convertTimerItem(timer, timer.id === id);
			}
		);
	}

	/**
	 * @param {string} id
	 * @returns {Array<import('$lib/types.js').TimerItem>|null}
	 */
	delete(id) {
		let items = fetchTimerItemsFromStore();
		items = items.filter(item => item.id !== id);
		setItems(items);
		return items.map(
			(timer) => {
				return convertTimerItem(timer);
			}
		);
	}

	/**
	 * @param {string} id
	 * @returns {Array<import('$lib/types.js').TimerItem>|null}
	 */
	start(id) {
		return updateTimerItemInStore(id, (item) => {
			item.started_at = new Date();
			return item;
		})
	}

	/**
	 * @param {string} id
	 * @returns {Array<import('$lib/types.js').TimerItem>|null}
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

	/**
	 * @param {string} id
	 * @param {number} duration
	 */
	updateDuration(id, duration) {
		return updateTimerItemInStore(id, (item) => {
			item.duration = duration;
			return item;
		})
	}

	/**
	 * @param {number} index1
	 * @param {number} index2
	 * Swap two items
	 */
	swap(index1, index2) {
		let timers = fetchTimerItemsFromStore();
		const temp = timers[index1];
		timers[index1] = timers[index2];
		timers[index2] = temp;
		setItems(timers);
		return timers.map(
			(timer) => {
				return convertTimerItem(timer);
			}
		);
	}
}

/**
 * Store the timer items in local storage
 * @param {TimerItemValue[]} items
 */
function setItems(items) {
	localStorage.setItem(storeKey, JSON.stringify(items));
	updateDurations(items);
}

/**
 * Retrieve the timer items from local storage
 */
function getItems() {
	return localStorage.getItem(storeKey);
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
		setItems(items);
		return items.map(
			(timer) => {
				return convertTimerItem(timer);
			}
		);
	}
	return null;
}

/**
 * @param {TimerItemValue} timer
 * @param {boolean} [requestFocus=false]
 * @returns {import('$lib/types.js').TimerItem}
 */
function convertTimerItem(timer, requestFocus) {
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
	const offsetDuration =
		timer.duration +
		sinceStarted;
	return {
		id: timer.id,
		name: timer.name,
		isRunning: isRunning,
		duration: 0,
		offsetDuration: offsetDuration,
		requestFocus: requestFocus,
	};
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
 * @type {import("svelte/store").Writable<Map<String,Number>>}
 * Stores the current duration of each timer. Required to calculated
 * the total duration.
 */
export const durationsStore = writable(new Map());

/**
 * Updates the durations map
 * @param {TimerItemValue[]} items
 */
function updateDurations(items) {
	const durations = new Map(items.map((item) => [item.id, item.duration]));
	durationsStore.set(durations);
}

/**
 * Generates a random sequence of numbers and characters
 * @returns {String}
 */
function generateRandomID() {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; let result = '';
	for (let i = 0; i < 8; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}
	return result;
}
