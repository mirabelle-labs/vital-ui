# Data

Aggregates, status-to-colour maps and id generators. Pure, SSR-safe. Entry point: `@mirabelle-labs/vital-ui/data`.

## Aggregates

| Export                             | Does                                                      |
| ---------------------------------- | --------------------------------------------------------- |
| `sumBy`, `avgBy`, `minBy`, `maxBy` | reduce a list by a field or a picker function             |
| `countBy(items, predicate)`        | how many match                                            |
| `groupBy(items, picker)`           | `Map` of key → items                                      |
| `tally(items, picker)`             | `{ label, value }[]` of counts per key, ready for a chart |
| `uniqueBy`, `sortBy`, `partition`  | the obvious                                               |
| `clamp`, `round`                   | number helpers                                            |

Use them instead of `reduce((s, x) => s + x.n, 0)` in getters.

## Tones

A **tone** is one of `neutral | primary | info | success | warning | danger`, the vocabulary every status-aware component shares (`Badge`, `Alert`, `StatusPill`, `Dot`…).

| Export                                                         | Does                                                                                                |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `toneMap({ Running: 'success', Failed: 'danger' }, 'neutral')` | a typed lookup with a fallback (the first tone in the map when omitted), replacing nested ternaries |
| `thresholdTone(pct, { warning, danger, invert?, ok? })`        | a number to a tone: gauges, quotas, latency; `invert` when low values are the bad ones              |
| `deltaTone(delta, invert?)`                                    | a change to a tone; `invert` when a drop is good (errors, cost)                                     |
| `TONES`                                                        | the list                                                                                            |

## Ids

| Export                       | Does                                                          |
| ---------------------------- | ------------------------------------------------------------- |
| `createSequence('T-', 2390)` | an incrementing id generator: `T-2391`, `T-2392`              |
| `uid(prefix?)`               | a short id unique for the session, such as `pod-k3f9a1-7`     |
| `hash(input, length?)`       | a deterministic short hash (djb2), handy for stable mock data |

Tests live in `data.test.ts`.
