# Feedback

Alerts, progress, loading states and status indicators. 11 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                                   | What it is                                                                                 | Parts                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| [`Alert`](./Alert)                       | Inline message with icon, title, body and dismiss.                                         | —                                                               |
| [`Banner`](./Banner)                     | Full-width page-level message bar.                                                         | —                                                               |
| [`Callout`](./Callout)                   | Left-accented note block.                                                                  | —                                                               |
| [`Result`](./Result)                     | What a container shows instead of content: empty, no match, nothing selected, error, done. | —                                                               |
| [`Dot`](./Dot)                           | Tiny status dot, optionally pulsing or ringed.                                             | —                                                               |
| [`LatencyIndicator`](./LatencyIndicator) | Signal-strength bars for connection quality.                                               | —                                                               |
| [`Progress`](./Progress)                 | Horizontal progress bar.                                                                   | —                                                               |
| [`ProgressRing`](./ProgressRing)         | Circular progress with a centered label.                                                   | —                                                               |
| [`Skeleton`](./Skeleton)                 | Pulsing placeholders: shapes, text, cards, lists and tables.                               | `SkeletonText`, `SkeletonCard`, `SkeletonList`, `SkeletonTable` |
| [`Spinner`](./Spinner)                   | Rotating loading indicator.                                                                | —                                                               |
| [`StatusPill`](./StatusPill)             | Bordered pill with a status dot.                                                           | —                                                               |

## Layout of a family

```
Feedback/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/feedback/<family>` (props panel, generated markup) and a demo in `src/demos/feedback/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
