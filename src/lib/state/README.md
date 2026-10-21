# State helpers

Reactive stores for the patterns every screen rebuilds by hand. Entry point: `@mirabelle-labs/vital-ui/state` (`$lib/state` inside the repo).

```ts
import {
	createCollection,
	createOverlay,
	createForm,
	createListView,
	createAction,
	createLog
} from '@mirabelle-labs/vital-ui/state';
```

| Helper                                                    | Holds                                                                                                                                                                               | Replaces                                                       |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------- |
| [`createCollection(seed, { key })`](collection.svelte.ts) | a keyed, reactive list: `items`, `get`, `has`, `first`, `where`, `count`, `sum`, `avg`, `add`, `update`, `upsert`, `remove`                                                         | a `$state` array with `find(x => x.id === id)`                 |
| [`createOverlay<T>()`](overlay.svelte.ts)                 | `open` (bindable), the subject `item`, `show(item)`, `hide()`, `toggle()`, `withItem(fn)`                                                                                           | the `selected` + `open` pair of a Dialog or Drawer             |
| [`createForm(initial, options)`](form.svelte.ts)          | `values`, `errors`, `valid`, `dirty`, `touched`, `submitting`, `error(name)`, `invalid(name)`, `touch()`, `set(patch)`, `submit()`, `reset()`; errors appear after the first submit | `touched` + `errors = $derived.by(…)` + a submit guard         |
| [`createListView(source, options)`](list-view.svelte.ts)  | `query`, `filters.x`, `sort`, `page`, `pageCount`, `filtered`, `visible`, `total`, `count`, `active`; any change returns to page 1                                                  | `filter(...).slice(...)` and an `$effect` that resets the page |
| [`createAction({ run, ... })`](action.svelte.ts)          | `loading`, `error`, `result`, `runs`, `run()`, `abort()`, `reset()`; `onSuccess` and `onError` get the result or error; `concurrent: 'ignore'                                       | 'restart'` decides what a second run does                      | `loading = true; setTimeout(...)` |
| [`createLog({ max })`](log.svelte.ts)                     | a bounded event feed: `items`, `size`, `push`, `remove`, `clear`, `max`, `seed`                                                                                                     | `[e, ...events].slice(0, n)`                                   |

## Rules

- **Read through the object, never destructure.** `view.visible` stays reactive; `const { visible } = view` does not.
- **No `$effect` inside a helper.** Derive instead (see how `createListView` anchors the page). An effect belongs to the component that owns the side effect.
- **They work at module level** (a store shared across pages) and inside a component.
- **A form toasts when a submit is blocked** ("Check the highlighted fields") unless `invalidMessage` is a custom string or `false`.
- **Toasts are objects**, one field per line: `toast.success({ title, description })`. A toast speaks to the person who just acted.

Tests live in `state.test.ts`. A live example of each helper is on `/demo/helpers`.
