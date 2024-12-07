/**
 * @param {number} seconds
 */
export function formatDuration(seconds) {
	/**
	 * @param {number} number
	 */
	function fmt(number) {
		return String(number).padStart(2, "0");
	}
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);
	return `${fmt(h)}:${fmt(m)}:${fmt(s)}`;
}

/**
 * @param {string} time
 * @return {number|null} duration
 */
export function parseTime(time) {
	let [hs, ms, ss] = time.split(":");
	let h = Number(hs);
	let m = Number(ms);
	let s = Number(ss);
	if (isNaN(h) || h < 0) {
		return null;
	}
	if (isNaN(m) || m < 0 || m >= 60) {
		return null;
	}
	if (isNaN(s) || s < 0 || s >= 60) {
		return null;
	}
	return h * 3600 + m * 60 + s;
}

/**
 * Blurs the node when Enter is pressed
 * @param {HTMLElement} node
 */
export function blurOnEnter(node) {
	/**
	 * Event handler for the keydown event.
	 * @param {KeyboardEvent} event
	 */
	function handleKey(event) {
		if (
			event.key === "Enter" &&
			node &&
			typeof node.blur === "function"
		)
			node.blur();
	}

	node.addEventListener("keydown", handleKey);

	return {
		destroy() {
			node.removeEventListener("keydown", handleKey);
		},
	};
}
