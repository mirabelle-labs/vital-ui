# Misc

Icons, keyboard hints, toolbars and primitives. 5 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                                 | What it is                                             | Parts                                               |
| -------------------------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| [`Icon`](./Icon)                       | Font Awesome glyph in a square footprint.              | —                                                   |
| [`Kbd`](./Kbd)                         | Keyboard key cap.                                      | —                                                   |
| [`Toolbar`](./Toolbar)                 | Control bar with buttons, groups and separators.       | `ToolbarButton`, `ToolbarGroup`, `ToolbarSeparator` |
| [`Polymorphic`](./Polymorphic)         | Renders any tag via the "as" prop.                     | —                                                   |
| [`VariantProvider`](./VariantProvider) | Propagates variant/size/color defaults to descendants. | —                                                   |

## Layout of a family

```
Misc/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/misc/<family>` (props panel, generated markup) and a demo in `src/demos/misc/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
