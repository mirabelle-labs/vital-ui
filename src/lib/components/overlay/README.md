# Overlay

Tooltips, popovers, dialogs, drawers, menus, toasts and the command palette. 9 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                               | What it is                                  | Parts                         |
| ------------------------------------ | ------------------------------------------- | ----------------------------- |
| [`Tooltip`](./Tooltip)               | Hover label with four placements.           | —                             |
| [`Popover`](./Popover)               | Click-toggled floating panel.               | —                             |
| [`HoverCard`](./HoverCard)           | Hover-triggered preview card with delays.   | —                             |
| [`Dialog`](./Dialog)                 | Modal with title, body and footer.          | —                             |
| [`AlertDialog`](./AlertDialog)       | Confirmation modal with cancel/confirm.     | —                             |
| [`Drawer`](./Drawer)                 | Side sheet sliding from an edge.            | —                             |
| [`Menu`](./Menu)                     | Dropdown menu with items and separators.    | `MenuItem`, `MenuSeparator`   |
| [`Toaster`](./Toaster)               | Toast stack driven by the `toast()` helper. | —                             |
| [`CommandPalette`](./CommandPalette) | ⌘K palette with filtered groups and items.  | `CommandGroup`, `CommandItem` |

## Layout of a family

```
Overlay/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/overlay/<family>` (props panel, generated markup) and a demo in `src/demos/overlay/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
