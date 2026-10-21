# Format

Pure formatters, locale-aware, SSR-safe. Entry point: `@mirabelle-labs/vital-ui/format`. Replaces the `format.ts` every project ends up with.

| Export                                                        | Example                                                                                               |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `money(amount, { currency, locale, whole })`                  | `money(349)` → `$349.00`; `whole: true` → `$349`; `{ currency: 'EUR', locale: 'fr-FR' }` → `349,00 €` |
| `compact(value)`                                              | `12400` → `12.4K`, `1900000` → `1.9M`                                                                 |
| `percent(value, { digits, ofHundred, locale })`               | `percent(0.421)` → `42%`; `ofHundred: true` reads `42.1` as a percentage                              |
| `bytes(size)`                                                 | `6.4 GB`                                                                                              |
| `plural(count, 'file')`                                       | `1 file`, `3 files`; a third argument for irregular plurals                                           |
| `age(seconds)`                                                | Kubernetes-style: `45s`, `14m`, `2h`, `3d`                                                            |
| `relativeTime(value, options)`                                | `2 hours ago`, `in 3 days`, `just now`                                                                |
| `shortDate(value, locale?)` / `shortDateTime(value, locale?)` | `Oct 24, 2026`                                                                                        |
| `nowIso()`                                                    | the current time as an ISO string, so `new Date()` never becomes reactive state                       |
| `imageFallback(seed, w, h)` / `onImageError(seed)`            | a deterministic placeholder image and the `onerror` handler that swaps it in                          |

Tests live in `format.test.ts`.
