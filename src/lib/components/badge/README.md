# Badges

Status labels and removable tags. 2 families, all exported from `@mirabelle-labs/vital-ui`.

| Family             | What it is                                                        | Parts |
| ------------------ | ----------------------------------------------------------------- | ----- |
| [`Badge`](./Badge) | Subtle or solid label with six colors and an optional status dot. | —     |
| [`Tag`](./Tag)     | Rounded pill, optionally removable.                               | —     |

## Layout of a family

```
Badges/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/badge/<family>` (props panel, generated markup) and a demo in `src/demos/badge/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
