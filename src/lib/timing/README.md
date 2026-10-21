# Timing

Timers that clean up after themselves and never run on the server. Entry point: `@mirabelle-labs/vital-ui/timing`.

| Export               | Does                                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `delay(ms, signal?)` | a promise that resolves after `ms`; with a signal it rejects with an `AbortError` as soon as it aborts, so a fake request inside `createAction` stops cleanly |
| `debounce(fn, ms)`   | trailing debounce, with `cancel()`, `flush()` and `pending`                                                                                                   |
| `throttle(fn, ms)`   | leading + trailing throttle: the first call runs at once, calls in the window collapse into one trailing call                                                 |
| `after(ms, fn)`      | a one-shot timer that returns its canceller                                                                                                                   |
| `every(ms, fn)`      | an interval that returns its canceller                                                                                                                        |
| `isBrowser`          | `true` when `window` and `document` exist                                                                                                                     |

Prefer these to raw `setTimeout` / `setInterval`: the cancellers fit `$effect` cleanup and `onDestroy`, so nothing leaks on unmount, and `isBrowser` keeps DOM-only code out of SSR.

Tests live in `timing.test.ts`.
