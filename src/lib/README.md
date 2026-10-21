# src/lib

The published package. Everything here ships in `dist/`; nothing else in the repository does.

| Path                        | What it is                                                                | Import                                                        |
| --------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [`components/`](components) | 103 component families in 15 categories                                   | `@mirabelle-labs/vital-ui`                                    |
| [`tokens/`](tokens)         | the design system, split CSS                                              | `@mirabelle-labs/vital-ui/styles`                             |
| [`utils/`](utils)           | `cn`, `VariantProvider` plumbing, the `dismissable` and `overlay` actions | `@mirabelle-labs/vital-ui` / `@mirabelle-labs/vital-ui/utils` |
| [`state/`](state)           | rune helpers: collections, forms, list views, overlays, actions, logs     | `@mirabelle-labs/vital-ui/state`                              |
| [`validation/`](validation) | field rules and schema validation                                         | `@mirabelle-labs/vital-ui/validation`                         |
| [`format/`](format)         | numbers, money, sizes, dates                                              | `@mirabelle-labs/vital-ui/format`                             |
| [`data/`](data)             | aggregates, status tones, ids                                             | `@mirabelle-labs/vital-ui/data`                               |
| [`timing/`](timing)         | delay, debounce, throttle, timers                                         | `@mirabelle-labs/vital-ui/timing`                             |
| [`code/`](code)             | the `highlight()` tokenizer and the `Highlighter` contract                | `@mirabelle-labs/vital-ui/code`                               |
| `index.ts`                  | the barrel: every component category plus `utils`                         | `@mirabelle-labs/vital-ui`                                    |
| `styles.css`                | the public stylesheet entry: imports `tokens/index.css`                   | `@mirabelle-labs/vital-ui/styles`                             |

## Rules of the folder

- **The barrel holds components and `utils` only.** A helper never goes through `src/lib/index.ts`, so a consumer who only wants a Button never loads form state or the code highlighter. Each helper group is its own entry point, mapped in `package.json` `exports`.
- **Nothing here imports from `src/demo` or `src/demos`.** The demo site depends on the library, never the reverse.
- **Pure helpers are plain `.ts` and SSR-safe.** Rune helpers are `*.svelte.ts` and return objects with accessors.
- **Every helper group has a vitest file next to it.**
- **Inside the repository**, the same entry points are the aliases `$lib`, `$lib/state`, `$lib/format`…

A new helper group needs its folder, an `index.ts`, a test, an `exports` entry in `package.json`, and a row in the helpers tables of the README and `CLAUDE.md`.
