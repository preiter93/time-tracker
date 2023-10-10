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
