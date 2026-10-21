import { isBrowser } from '$lib/timing';
import { readStored, writeStored } from '../utils';
import { DEFAULT_SURFACE, isCanvasSurface, type CanvasSurface } from './canvasSurfaces';

const GRID_KEY = 'vital-ui-demo:canvas-grid';
const SURFACE_KEY = 'vital-ui-demo:canvas-surface';

/** A stored grid flag: anything but an explicit "off" keeps the dots. */
export function parseGrid(stored: string | null): boolean {
	return stored !== 'off';
}

export function parseSurface(stored: string | null): CanvasSurface {
	return isCanvasSurface(stored) ? stored : DEFAULT_SURFACE;
}

let showGrid = $state(true);
let ground = $state<CanvasSurface>(DEFAULT_SURFACE);

function saveGrid() {
	writeStored(GRID_KEY, showGrid ? 'on' : 'off');
}

function saveSurface() {
	writeStored(SURFACE_KEY, ground);
}

/**
 * The ground behind every preview on the page. One store feeds all of them, so the playground
 * and each section change together and a page never switches ground halfway down.
 */
export const canvasBackground = {
	get grid(): boolean {
		return showGrid;
	},
	get surface(): CanvasSurface {
		return ground;
	},
	/** Picks the visitor's last choice back up; the demo shell calls it once on mount. */
	restore() {
		if (isBrowser) {
			showGrid = parseGrid(readStored(GRID_KEY));
			ground = parseSurface(readStored(SURFACE_KEY));
		}
	},
	toggleGrid() {
		showGrid = !showGrid;
		saveGrid();
	},
	setSurface(surface: CanvasSurface) {
		ground = surface;
		saveSurface();
	}
};
