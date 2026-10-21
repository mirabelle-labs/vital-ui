# Routes

The SvelteKit routes of the demo site. Everything here is built from library components.

| Route                          | File                          | What it is                                                                                                                                                          |
| ------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                            | `+page.svelte`, `landing.ts`  | the presentation page: hero, principles, tokens, entry points, links to everything. Components only, no bespoke markup beyond the documented `Polymorphic` wrappers |
| `/demo`                        | `demo/+page.svelte`           | overview of the 15 categories                                                                                                                                       |
| `/demo/<category>`             | `demo/[category]`             | gallery of a category's families                                                                                                                                    |
| `/demo/<category>/<component>` | `demo/[category]/[component]` | the playground of one family                                                                                                                                        |
| `/demo/tokens`                 | `demo/tokens`                 | every design token, read from the stylesheets                                                                                                                       |
| `/demo/helpers`                | `demo/helpers`                | every helper, live, with its snippet                                                                                                                                |
| `/demo/pages`                  | `demo/pages`                  | complete pages that use nothing but the kit                                                                                                                         |

Routes are dynamic: the registry in `src/demo/registry` drives the sidebar, the breadcrumb, the ⌘K palette and the 404s.

## Complete pages

Under `demo/pages/(full)`, each in a layout that drops the demo shell and shows only a return pill.

| Page                | Slug       | Shows                                                                                          |
| ------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| Orbit, SaaS landing | `saas`     | sticky navbar, hero with a live dashboard, features, pricing toggle, FAQ, footer               |
| Aurel Store, shop   | `shop`     | filtered listing, product gallery, cart drawer, four-step checkout with OTP                    |
| Acme, client portal | `extranet` | sidebar app with overview, projects, invoices, tickets and documents; command palette, drawers |
| Kubernetes console  | `k8s`      | cluster admin: node sidebar, gauges, apps, YAML, dialogs                                       |

These pages are the reference recipes for the helpers: every list is a `createListView`, every dialog a `createOverlay`, every form a `createForm`. Each page keeps a `tones.ts` (a `toneMap` plus label records) instead of per-view pill functions.
