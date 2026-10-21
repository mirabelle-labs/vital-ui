/**
 * `localStorage` that never throws: private windows and blocked site data make the accessor
 * itself raise. A failed read answers `null`, a failed write is dropped, and the page simply
 * keeps its choice for the visit.
 */
export function readStored(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

export function writeStored(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {
		// Nothing to do: see above.
	}
}
