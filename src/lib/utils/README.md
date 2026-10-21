# Utils

Small primitives shared by components. Exported from `@mirabelle-labs/vital-ui` (and `@mirabelle-labs/vital-ui/utils`).

| Export                                    | What it does                                                                                                                                                         |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cn(...classes)`                          | `clsx` + `tailwind-merge`. Every component ends its class list with `cn(cva(...), className)` so a caller's class wins                                               |
| `setVariantContext` / `getVariantContext` | the plumbing behind `VariantProvider`: set `variant`, `size`, `color` and `radius` for a subtree (`VariantProvider` also takes `density`, which sets `data-density`) |
| `fromContext(own, ctx, options)`          | resolves a prop: the component's own value, else the provider's if it is a valid option, else the CVA default                                                        |
| `dismissable`                             | Svelte action: close on outside click and Escape. For Popover, Menu, Select, Combobox, MultiSelect                                                                   |
| `overlay`                                 | Svelte action: Escape, scroll lock, focus trap and focus restore. For Dialog, AlertDialog, Drawer, CommandPalette                                                    |
| `flyFromEdge`                             | a Svelte transition that flies in from the edge of the screen                                                                                                        |

## The two actions

```svelte
<div use:dismissable={{ enabled: open, onclose: () => (open = false) }}>…</div>
<div role="dialog" use:overlay={{ enabled: open, onclose, trapFocus: true, lockScroll: true }}>
	…
</div>
```

Both are no-ops on the server, unsubscribe on destroy and nest correctly: the page only unlocks when the last overlay closes. A component that floats or detaches uses them instead of adding another listener pair.
