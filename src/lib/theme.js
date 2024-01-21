/**
 * @type {Object.<string, string>}
 */
const themeMap = {
	dark: "light",
	light: "dark",
};

/**
 * @return {string|null}
 */
export function getInitialTheme() {
	const bodyClass = document.body.classList;
	const theme = localStorage.getItem('theme');
	if (theme === null) {
		let tmp = Object.keys(themeMap)[0];
		localStorage.setItem('theme', tmp);
		bodyClass.add(tmp)
		return tmp;
	} else {
		bodyClass.add(theme);
		return theme;
	}
}
/**
 * @return {string|null}
 */
export function toggleThemeStorage() {
	const bodyClass = document.body.classList;
	const current = localStorage.getItem('theme');
	if (current !== null) {
		const next = themeMap[current];
		bodyClass.replace(current, next);
		localStorage.setItem('theme', next);
		return next;
	}
	return null;
}
