import type { Attachment } from 'svelte/attachments';

export interface SizeReadout {
	/** Border-box size of the element it is attached to, in whole pixels. */
	readonly box: { readonly width: number; readonly height: number };
	/** Use as `<div {@attach readout.attach}>`. */
	readonly attach: Attachment<HTMLElement>;
}

/** Keeps a live width and height for one element, including while its resize handle is dragged. */
export function createSizeReadout(): SizeReadout {
	let width = $state(0);
	let height = $state(0);

	return {
		get box() {
			return { width, height };
		},
		attach(element) {
			if (typeof ResizeObserver === 'undefined') {
				return;
			}
			const measure = () => {
				width = element.offsetWidth;
				height = element.offsetHeight;
			};
			const observer = new ResizeObserver(measure);

			measure();
			observer.observe(element, { box: 'border-box' });

			return () => {
				observer.disconnect();
			};
		}
	};
}
