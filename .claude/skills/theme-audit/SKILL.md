---
name: theme-audit
description: Audit the semantic colour tokens in light and dark for contrast, role overlap and per-theme gaps, then decide what to split or make vary by theme. Use when touching src/lib/tokens, when a dark surface looks off, or when a component needs a `dark:` class to be readable.
---

# Theme audit

Dark mode is a design of its own, not the light palette turned over. This skill is the method used to build the current dark palette, so the next change follows the same reasoning.

## 1. Measure

```bash
node .claude/skills/theme-audit/contrast.mjs          # failures and the informational ladder
node .claude/skills/theme-audit/contrast.mjs --all    # every pair
```

It reads `palette.css` and `semantic.css`, composites alpha tokens over `surface` and `page`, and prints WCAG ratios for text pairs (4.5), UI boundaries (3) and the layer ladder (informational).

Read the numbers against the light theme, which is the reference. A dark ratio does not have to equal the light one, but a role that is subtle in light must not become loud in dark, and the reverse.

## 2. Look

Numbers miss character. Take both themes with the `visual-verify` skill and compare at 2x (`--clip`): hue, saturation and rim weight are things a ratio cannot see.

Mistakes already made once:

- **Matching contrast but not nature.** Light `field-line` is `gray-300`, nearly neutral. A dark equivalent with the same ratio but a strong violet tint reads as a glowing outline. Match chroma as well as lightness.
- **Rims on every box.** In light, a card edge is almost invisible and the shadow draws the card. In dark, a `line` lighter than the fill outlines every box like a wireframe. Keep dark lines close to the surface, and let the fill step carry the separation.
- **Translucent series colours.** `primary-500/50` works on white and lets the page through on dark. Use an opaque step for chart bars and strokes.
- **Links inside coloured bars.** `text-link` on a solid banner disappears. Parts inside a filled background take `text-current`.

## 3. Decide: split, vary, or leave

A token that serves two jobs is a candidate to split. Check each:

| Signal | Action |
| --- | --- |
| A component needs `x dark:y` for the same role in several places | add a semantic token (`primary-fg` replaced ten copies of `text-primary-600 dark:text-primary-300`) |
| One token is used for a divider and for a control edge | split by role (`line-strong` for dividers, `field-line` for inputs) |
| A token is identical in both themes but looks wrong in one | make it vary (`backdrop`, `selection`) |
| A value is hard-coded in `base.css` or a component | promote it to a token |
| A colour is always dark whatever the theme (code window, dark section) | one token the same in both themes (`night`) |
| Two roles collapse to the same value in light | check they are not meant to differ in dark before merging |

Never add a token for a single use, and never reach for a raw palette step in a component when a role exists.

## 4. Change and re-check

1. Edit the light block first only if the light theme is wrong; otherwise leave it alone. The light palette is the reference.
2. Every new semantic token is defined in the `@theme` block and redefined under `[data-theme='dark']`.
3. Run the contrast script again, then the screenshots, then `pnpm check && pnpm lint && pnpm test:run`. `/demo/tokens` lists new tokens automatically.
4. Update the token table in `CLAUDE.md` §3 and the README token table in the same change.
