import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import { demoCodePlugin } from './src/demo/tooling';

export default defineConfig({
	// The demo plugin runs ahead of Svelte's own: it reads the raw demo files.
	plugins: [tailwindcss(), demoCodePlugin(), sveltekit()],
	// Vitest runs in jsdom: resolve Svelte's browser build so components can mount.
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		// Vitest answers an empty string for any CSS import. The token stylesheets are read as text
		// (`?raw`) by the /demo/tokens page, so their text has to come through.
		css: { include: [/\/src\/lib\/tokens\/.*\.css\?raw$/] },
		setupFiles: ['./src/tests/setup.ts']
	}
});
