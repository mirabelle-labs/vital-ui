# App shell

The console frame, sidebar, navbar, user menu and footer. 5 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                   | What it is                                                     | Parts                           |
| ------------------------ | -------------------------------------------------------------- | ------------------------------- |
| [`AppShell`](./AppShell) | Console frame: sticky sidebar, sticky top bar, scrolling main. | —                               |
| [`Sidebar`](./Sidebar)   | App sidebar with sections and rows.                            | `SidebarSection`, `SidebarItem` |
| [`UserMenu`](./UserMenu) | Avatar + name trigger opening a menu.                          | —                               |
| [`Navbar`](./Navbar)     | Top bar with brand, links and actions.                         | `NavbarLink`                    |
| [`Footer`](./Footer)     | Site footer with brand, link columns and bottom bar.           | `FooterColumn`                  |

## Layout of a family

```
App shell/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/app/<family>` (props panel, generated markup) and a demo in `src/demos/app/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
