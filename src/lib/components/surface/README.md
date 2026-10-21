# Surface

Cards composed from header, bars, body and footer. 2 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                 | What it is                                                          | Parts                                             |
| ---------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| [`Card`](./Card)       | Bordered surface with optional header, body padding and footer bar. | `CardHeader`, `CardBody`, `CardFooter`, `CardBar` |
| [`CardBar`](./CardBar) | Control row attached to the top or the bottom of a Card.            | —                                                 |

## Layout of a family

```
Surface/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/surface/<family>` (props panel, generated markup) and a demo in `src/demos/surface/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
