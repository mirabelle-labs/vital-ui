# Media

Avatars, groups and anchored badges. 3 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                           | What it is                                                                | Parts         |
| -------------------------------- | ------------------------------------------------------------------------- | ------------- |
| [`Image`](./Image)               | Picture with a reserved ratio, a skeleton and a fallback.                 | —             |
| [`Avatar`](./Avatar)             | Image or initials with sizes, shapes, a presence dot, and stacked groups. | `AvatarGroup` |
| [`OverlayBadge`](./OverlayBadge) | Anchors a status dot or count to a corner of any child.                   | —             |

## Layout of a family

```
Media/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/media/<family>` (props panel, generated markup) and a demo in `src/demos/media/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
