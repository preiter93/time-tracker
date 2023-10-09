/**
 * @type {Object.<string, string>}
 */
const themeMap = {
	dark: "light",
	light: "dark",
};

const bodyClass = document.body.classList;
const theme = localStorage.getItem('theme');
if (theme === null) {
	let tmp = Object.keys(themeMap)[0];
	localStorage.setItem('theme', tmp);
	bodyClass.add(tmp)
} else {
	bodyClass.add(theme);
}


/**
 * @return {string|null}
 */
export function toggleThemeStorage() {
	const current = localStorage.getItem('theme');
	if (current !== null) {
		const next = themeMap[current];
		bodyClass.replace(current, next);
		localStorage.setItem('theme', next);
		return next;
	}
	return null;

}
