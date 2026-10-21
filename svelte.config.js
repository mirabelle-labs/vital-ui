import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		// The example pages switch views client-side, so their in-page anchors have no target at build time.
		prerender: {
			handleMissingId: ({ path, message }) => {
				if (!path.startsWith('/demo/pages/')) {
					throw new Error(message);
				}
			}
		},
		// The demo site's own infrastructure lives outside src/lib so `svelte-package` never ships it.
		alias: { $demo: 'src/demo' }
	}
};

export default config;
