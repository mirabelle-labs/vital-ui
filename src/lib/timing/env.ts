/** True in a browser, false during SSR and in Node. */
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
