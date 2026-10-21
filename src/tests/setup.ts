import '@testing-library/svelte/vitest';

// jsdom has no Web Animations API; Svelte transitions call element.animate().
if (typeof Element !== 'undefined' && typeof Element.prototype.animate !== 'function') {
	Element.prototype.animate = function animate(): Animation {
		const animation = {
			cancel() {},
			finish() {},
			pause() {},
			play() {},
			reverse() {},
			finished: Promise.resolve(),
			onfinish: null,
			oncancel: null
		};
		// Only the subset Svelte touches is implemented; the cast documents that.
		return animation as unknown as Animation;
	};
}
