---
name: visual-verify
description: Screenshot a page or component of the running demo site in light and dark, optionally hovering or focusing an element, to check a styling change with your own eyes. Use after any change to tokens, variants.ts or a demo, and before saying a visual fix works.
---

# Visual verification

A passing `pnpm check` says nothing about how a colour, a border or a hover looks. Look at it, in both themes, before reporting a visual change as done.

No Playwright or chromium CLI is assumed. `shot.mjs` next to this file drives headless Chrome over the DevTools protocol (Node 22+ has a built-in `WebSocket`) and needs nothing installed.

## Procedure

1. Start the dev server in the background: `pnpm dev --port 5199`.
2. Take the shot in both themes:

   ```bash
   node .claude/skills/visual-verify/shot.mjs http://localhost:5199/demo/form/input light out/input-light.png
   node .claude/skills/visual-verify/shot.mjs http://localhost:5199/demo/form/input dark  out/input-dark.png
   ```

3. Read the images. Compare light against dark: the point is whether the two themes tell the same story, not whether dark looks plausible alone.
4. Write the images outside the repository (a scratch directory), unless they are meant to be committed under `docs/screenshots/`.

## Options

| Flag | Use |
| --- | --- |
| `--w 1400 --h 900` | viewport size |
| `--full` | grow the viewport to the whole page (capped at 6000 px) |
| `--hover '<selector>'` | scroll to the element and put the mouse on it: hover states |
| `--js '<code>'` | run code first: `document.querySelectorAll('input')[1].focus()` for a focus ring, or scroll a container |
| `--clip x,y,w,h` | capture a rectangle at 2x: borders, radii and 1px lines only show up zoomed |
| `--wait 5000` | hydration grace period |

## What to look at

- **Borders and lines**: zoom with `--clip`. A rim lighter than its fill reads as a wireframe in dark.
- **States**: rest, hover, focus, invalid, disabled, selected. Hover and focus need `--hover` / `--js`.
- **Translucent fills**: an alpha colour that works on one surface can disappear on another (a chart bar at `/50` in dark).
- **Text on solid fills**: a link inside a solid banner, a ghost button on a coloured card.
- **Canvas**: demos render on a dotted canvas. Check the component against `page`, `surface` and `surface-2`, not only the canvas.

## Traps

- **Hydration**: the server-rendered HTML shows before Svelte hydrates, and a page full of grey skeleton blocks means the shot was taken too early. Raise `--wait`. Never trust `innerText` as proof of hydration.
- **Chrome minimum width**: headless Chrome will not render below roughly 500 px wide through `--window-size`. The script uses device metrics emulation, which does.
- **Routes**: component slugs are lowercase and category-scoped: `/demo/<category>/<slug>` (`/demo/form/toggle`, `/demo/surface/card`). A wrong path renders the 404 page, which looks like a styling bug.
- **Port**: kill a leftover dev server by command line (`Get-CimInstance Win32_Process | Where CommandLine -like '*5199*'`), since `netstat` misses Vite's IPv6 bind on Windows.
- **Failed probes**: `document.querySelector` returning `null` throws inside `evaluate`. Wrap probes so one miss does not abort the rest.
