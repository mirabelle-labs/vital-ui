# Data

Tables, KPI tiles, lists and timelines. 8 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                                 | What it is                                                            | Parts                              |
| -------------------------------------- | --------------------------------------------------------------------- | ---------------------------------- |
| [`DataTable`](./DataTable)             | Table with sorting, selection, loading and empty states.              | —                                  |
| [`List`](./List)                       | Rows with a leading slot, title, description, meta and actions.       | `ListItem`                         |
| [`Table`](./Table)                     | Table primitives: rows, header cells, cells and a bordered container. | `Tr`, `Th`, `Td`, `TableContainer` |
| [`Stat`](./Stat)                       | KPI tile with delta and footer slot.                                  | —                                  |
| [`Sparkline`](./Sparkline)             | Tiny inline line chart.                                               | —                                  |
| [`DescriptionList`](./DescriptionList) | Key/value rows.                                                       | `DescriptionItem`                  |
| [`Timeline`](./Timeline)               | Vertical activity feed.                                               | `TimelineItem`                     |
| [`SortableList`](./SortableList)       | Drag-to-reorder list with keyboard support.                           | —                                  |

## Layout of a family

```
Data/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/data/<family>` (props panel, generated markup) and a demo in `src/demos/data/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
