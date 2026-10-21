# Navigation

Tabs, accordions, steppers, breadcrumbs and pagination. 6 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                         | What it is                                     | Parts                        |
| ------------------------------ | ---------------------------------------------- | ---------------------------- |
| [`Tabs`](./Tabs)               | Tab list + panels driven by a bound value.     | `TabList`, `Tab`, `TabPanel` |
| [`Accordion`](./Accordion)     | Single-open disclosure list.                   | `AccordionItem`              |
| [`Collapsible`](./Collapsible) | Standalone disclosure with a stateful trigger. | —                            |
| [`Stepper`](./Stepper)         | Horizontal progress through numbered steps.    | `Step`                       |
| [`Breadcrumb`](./Breadcrumb)   | Hierarchical path with a current page.         | `BreadcrumbItem`             |
| [`Pagination`](./Pagination)   | Page buttons with siblings and ellipses.       | —                            |

## Layout of a family

```
Navigation/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/nav/<family>` (props panel, generated markup) and a demo in `src/demos/nav/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
