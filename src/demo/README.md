# Demo infrastructure

Everything the demo site needs that is not a component demo. Alias `$demo`. It lives outside `src/lib`, so `svelte-package` never ships it, and library code never imports it.

```ts
import { Playground, DemoSection, defineControls } from '$demo';
```

| Folder        | Holds                                                                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/` | `Playground`, `PropsPanel`, `CodePreview`, `DemoSection`, `PreviewCanvas`, `CanvasSwitch`, `ComponentGrid`, `TokenTable`, each with its `variants.ts` |
| `controls/`   | `defineControls` and the control types and values behind the props panel                                                                              |
| `codegen/`    | `generateMarkup` and `withImports`: the code printed under a preview                                                                                  |
| `tooling/`    | the build-time walker (`demoCodePlugin`, a Vite plugin) that derives each demo's code from its own markup                                             |
| `template/`   | the template that walker writes and the renderer that prints it                                                                                       |
| `registry/`   | the categories (the registry data), lookups, hrefs, demo-file loaders and the sidebar filter                                                          |
| `canvas/`     | the preview ground store: dot grid and surface, persisted                                                                                             |
| `theme/`      | the theme store and its `data-theme` handling                                                                                                         |
| `seo/`        | `<Seo>` (title, description, canonical, Open Graph, Twitter card, JSON-LD), the site constants and the structured-data builders                       |
| `toaster/`    | the shell Toaster position store                                                                                                                      |
| `tokens/`     | reads `src/lib/tokens/*.css` into families for `/demo/tokens`                                                                                         |
| `utils/`      | `copyFeedback`, `elementSize`, `safeStorage`                                                                                                          |

## Conventions

- **camelCase** for every file and folder that is not a component (`elementSize.svelte.ts`, `components/canvasSwitch/`); PascalCase for `.svelte` components.
- **Each folder has an `index.ts`**, and imports across folders go through it. `src/demo/index.ts` is the public barrel for demo files and routes; the parsers and scanners inside stay private.
- **The shell dogfoods the library**: Sidebar, Breadcrumb, Drawer, CommandPalette, Toaster, IconButton.
- The registry is the source of truth: it drives the sidebar, breadcrumbs, the ⌘K palette and the 404s.
