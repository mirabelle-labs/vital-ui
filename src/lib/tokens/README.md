# Design tokens

The whole visual language of the kit, as CSS. Tailwind v4 turns every `@theme` variable into utilities, so a token is also a class: `--color-surface` is `bg-surface`, `--radius-control` is `rounded-control`.

This is the only place CSS lives. Components write utilities; they never write a value.

## Files

Imported by `index.css` in this order (each file can rely on the ones above it):

| File            | Defines                                                                                                                         | Utilities                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `variants.css`  | `@custom-variant dark` bound to `[data-theme=dark]`                                                                             | `dark:*`                                           |
| `fonts.css`     | `--font-sans` Inter, `--font-mono` JetBrains Mono, `--font-hand` Caveat                                                         | `font-sans`, `font-mono`, `font-hand`              |
| `scale.css`     | spacing `4xs`…`4xl`, `control-xs`…`xl` heights, `--text-2xs`, `--text-md`, `--radius-2xs`, `max-w-container-*`, compact density | `p-md`, `gap-2xs`, `h-control-md`, `text-2xs`      |
| `palette.css`   | ten colour ramps: primary (indigo), secondary (teal), gray, success, warning, danger, info, important, violet, orange           | `bg-primary-600`, `text-success-700`               |
| `semantic.css`  | roles: surfaces, text, lines, states, soft tones; redefined for dark                                                            | `bg-surface`, `text-fg-muted`, `border-field-line` |
| `base.css`      | body background, colour and font, selection, pointer cursors, disabled rules, `disabled-surface`                                |                                                    |
| `radius.css`    | `inline` 6 · `control` 8 · `surface` 12 · `overlay` 16 · `pill`                                                                 | `rounded-control`                                  |
| `layers.css`    | `raised` 10 · `nav` 30 · `dropdown` 40 · `overlay` 50 · `toast` 60                                                              | `z-dropdown`                                       |
| `motion.css`    | `fast` 120 · `base` 180 · `slow` 320 ms, `standard` / `out` / `in` easings, reduced motion                                      | `duration-base`, `ease-out`                        |
| `focus.css`     | `focus-ring`, `focus-ring-inset`, `focus-ring-within`, `peer-focus-ring`, `focus-field*`                                        |                                                    |
| `elevation.css` | `raised` · `lifted` · `overlay` · `floating` · `sunken`, deeper in dark                                                         | `shadow-overlay`                                   |
| `code.css`      | `--color-code-*` for `CodeBlock` and `CodeWindow`                                                                               | `text-code-keyword`                                |
| `scrollbar.css` | themed thin scrollbars and `scrollbar-dark`                                                                                     |                                                    |

## Semantic colour roles

Three layers, every token redefined under `[data-theme='dark']`, so a component writes one class for both themes.

| Layer                 | Tokens                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surfaces, text, lines | `page`, `canvas`, `surface`, `surface-2`, `fg`, `fg-muted`, `fg-subtle`, `fg-disabled`, `line`, `line-strong`, `field-line`, `link`, `primary-fg`, `selection`                  |
| Interaction           | `surface-hover` (the hover fill of the whole kit), `surface-active`, `track` (groove of a progress, slider or segmented control), `backdrop`, `inverse` / `inverse-fg`, `night` |
| Soft tones            | for `primary success warning danger info neutral`: `-soft`, `-soft-hover`, `-soft-line`, `-soft-fg`                                                                             |

Which one to reach for:

| Need                                  | Token                                                   |
| ------------------------------------- | ------------------------------------------------------- |
| a card or panel                       | `bg-surface`, header `bg-surface-2`, edge `border-line` |
| a divider                             | `border-line`; `border-line-strong` when it must read   |
| the edge of an input, checkbox, radio | `border-field-line`                                     |
| indigo text or a stroke on a surface  | `text-primary-fg`                                       |
| a hover fill                          | `bg-surface-hover` (pressed: `bg-surface-active`)       |
| a tinted message, tag, selected row   | the `*-soft` set of its colour                          |
| a block that is dark in both themes   | `bg-night`                                              |

## Light and dark

Light is the reference. Dark is its own design: neutrals are an ink tinted toward the primary hue at low chroma, layers step by a few percent of lightness, text is an off-white, and lines sit close to their surface so the fill carries the separation. A dark tint is an alpha of the `-500` hue, which keeps its colour on `surface`, `surface-2` and `page` alike. The `theme-audit` skill measures contrast and describes how to change it.

## Rules

- A new semantic token is defined in `@theme` and redefined under `[data-theme='dark']`, in the same change.
- Sizes use the named scale where an exact token exists, otherwise Tailwind's numeric scale. No `max-w-md`: `max-w-container-md`.
- Seven axes are lint-enforced (spacing, radius, layer, elevation, duration, focus, max-width). A new axis that has to hold gets a gate of the same shape.
- `/demo/tokens` lists every token straight from these files, so documentation cannot drift from them.
