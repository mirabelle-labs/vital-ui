# Buttons

Actions, icon buttons, groups and decorative tiles. 6 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                           | What it is                                                              | Parts |
| -------------------------------- | ----------------------------------------------------------------------- | ----- |
| [`Button`](./Button)             | Primary action with nine variants, five sizes, loading and block modes. | —     |
| [`IconButton`](./IconButton)     | Square or round icon-only button.                                       | —     |
| [`ButtonGroup`](./ButtonGroup)   | Attaches buttons into one segmented control.                            | —     |
| [`SplitButton`](./SplitButton)   | Main action attached to a dropdown caret.                               | —     |
| [`ActiveButton`](./ActiveButton) | Toggle button for filters, sorts and view switches.                     | —     |
| [`IconBlock`](./IconBlock)       | Decorative icon tile for feature cards and list rows.                   | —     |

## Layout of a family

```
Buttons/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/button/<family>` (props panel, generated markup) and a demo in `src/demos/button/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
