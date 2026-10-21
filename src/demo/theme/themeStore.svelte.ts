import { isBrowser } from '$lib/timing';
import { writeStored } from '../utils';

export type Theme = 'light' | 'dark';

/** The key the inline script in `app.html` reads before hydration. */
const THEME_KEY = 'theme';

let active = $state<Theme>('light');

function select(theme: Theme) {
	active = theme;
	if (isBrowser) {
		document.documentElement.setAttribute('data-theme', theme);
		writeStored(THEME_KEY, theme);
	}
}

export const themeStore = {
	get value(): Theme {
		return active;
	},
	get isDark(): boolean {
		return active === 'dark';
	},
	/** Adopts the theme `app.html` already put on the page, so the first paint does not flash. */
	init() {
		if (isBrowser) {
			active = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
		}
	},
	set: select,
	toggle() {
		select(active === 'dark' ? 'light' : 'dark');
	}
};
