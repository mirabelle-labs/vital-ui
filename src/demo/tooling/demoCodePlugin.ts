import type { Plugin } from 'vite';
import { transformDemo } from './transformDemo';

/** The file itself, not a `?raw` or `?url` view of it. */
const DEMO_FILE = /\.demo\.svelte$/;

/**
 * Derives the code a demo page shows from the demo's own markup, so it is never written twice.
 * It runs before Svelte compiles the file: the template is read with the compiler's parser (an
 * attribute may hold a `>`, a component may nest in itself), and the result is two attributes
 * written next to the ones the author typed.
 */
export function demoCodePlugin(): Plugin {
	return {
		name: 'vital-ui:demo-code',
		enforce: 'pre',

		transform(source, id) {
			if (!DEMO_FILE.test(id)) {
				return null;
			}
			const code = transformDemo(source);

			return code === null ? null : { code, map: null };
		}
	};
}
