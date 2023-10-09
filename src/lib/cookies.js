const cookieKey = 'items';

export class TimerCookie {
	constructor() { }

	list() {
		/** @type {TimerItem[]} */
		let items = getItemsFromCookie();
		return items.map(
			(timer) => {
				return convertTimerItem(timer);
			}
		);
	}

	create() {
		/** @type {TimerItem[]} */
		let items = getItemsFromCookie();
		let id = generateRandomID();
		let newTimer = new TimerItem(id, "My Timer", 0, null);
		items.push(newTimer);
		setCookie(JSON.stringify(items));
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
	delete(id) {
		/** @type {TimerItem[]} */
		let items = getItemsFromCookie();
		items = items.filter(item => item.id !== id);
		setCookie(JSON.stringify(items));
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
		return updateItemInCookies(id, (item) => {
			item.started_at = new Date();
			return item;
		})
	}

	/**
	 * @param {string} id
	 * The timer id.
	 */
	pause(id) {
		return updateItemInCookies(id, (item) => {
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
		return updateItemInCookies(id, (item) => {
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
		return updateItemInCookies(id, (item) => {
			item.name = name;
			return item;
		})
	}


}

function getItemsFromCookie() {
	const cookieValue = getCookie();
	if (cookieValue !== null) {
		const timerListJson = cookieValue.split('=')[1];
		return JSON.parse(timerListJson);
	}
	return [];
}

/**
 * @param {string} id
 * @param {TimerItem[]} items
 */
function findItemInCookies(id, items) {
	const index = items.findIndex(
		(item) => item.id === id
	);
	if (index !== -1) {
		return index;
	}
	return null;
}

/**
 * @param {string} id
 * @param {function(TimerItem): TimerItem} cb
 */
function updateItemInCookies(id, cb) {
	/** @type {TimerItem[]} */
	let items = getItemsFromCookie();
	let index = findItemInCookies(id, items);
	if (index !== null) {
		items[index] = cb(items[index]);
		setCookie(JSON.stringify(items));
		return items.map(
			(timer) => {
				return convertTimerItem(timer);
			}
		);
	}
	return null;
}
/**
 * @param {string} value
 */
function setCookie(value) {
	document.cookie = cookieKey + "=" + value + ";";
}

function getCookie() {
	const cookieValue = document.cookie.split('; ').find(row => row.startsWith(`${cookieKey}=`));
	if (cookieValue) {
		return cookieValue;
	}
	return null;
}


class TimerItem {
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
	for (let i = 0; i < 4; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}
	return result;
}

/**
 * @param {TimerItem} timer
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
