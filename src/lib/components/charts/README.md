# Charts

Dependency-free SVG charts. 4 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                       | What it is                                | Parts |
| ---------------------------- | ----------------------------------------- | ----- |
| [`BarChart`](./BarChart)     | Vertical bars with a highlighted maximum. | —     |
| [`AreaChart`](./AreaChart)   | Time-series line with gradient fill.      | —     |
| [`DonutChart`](./DonutChart) | Donut with center label and legend.       | —     |
| [`BarList`](./BarList)       | Ranked horizontal bars.                   | —     |

## Layout of a family

```
Charts/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/charts/<family>` (props panel, generated markup) and a demo in `src/demos/charts/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
