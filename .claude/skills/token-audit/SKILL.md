---
name: token-audit
description: Find and fix design-token violations in src (raw palette classes, physical properties, default radii, bare z-index, raw shadows, hand-written focus) and verify the ESLint token gates still catch what they should. Use for a sweep after a large change, when adding a token axis, or when a gate seems to let something through.
---

# Token audit

The rules are in `CLAUDE.md` §3 and §6. This skill is about checking them reliably: what to scan with, which hits are false positives, and how to prove a gate works.

## Scan by token, not by prefix

A grep for `pl-` or `left-` is wrong in both directions: `pl-3xs` reads as `pl-3`, `left-1/2` matches `left-1`, `ml-auto` slips past `ml-<digit>`. Split every line on `[\s"'`{}()=,;<>[\]]+` and test each whole token: a prefix counts only when it is the entire token or is followed by `-`.

Physical-property prefixes to flag: `pl- pr- ml- mr- left- right- text-left text-right border-l border-r rounded-l rounded-r`. Logical replacements: `ps- pe- ms- me- start- end- text-start text-end border-s border-e rounded-s rounded-e`.

## False positives to exclude

1. `border-line`, `border-line-strong`, `border-line/60`: colour tokens caught by `border-l`.
2. `fa-*` icon names: `fa-arrow-up-right-from-square` contains `right-`.
3. `space-y-*` and `divide-y`: block axis, direction-independent.
4. Prose in demo copy (`left-aligned`, `left-accented`).
5. `left-1/2 -translate-x-1/2`: the centring idiom, symmetric, correct in RTL (`CLAUDE.md` §3 exempts it).

And one fact that stops a wrong "fix": Tailwind v4 already compiles `space-x-*` to `margin-inline-*` and `divide-x` to `border-inline-*`. They are logical. `space-x` is also the only way to get a negative step (`gap` cannot be negative), which the avatar stack relies on.

## The seven lint-enforced axes

`TOKEN_RULES` in `eslint.config.js` covers spacing, radius, layer, elevation, duration, focus and max-width. Each rule is tripled across the three nodes a class string can be: `Literal` (`.ts`), `SvelteLiteral` (`.svelte` attribute) and `TemplateElement` (template literal), scoped to `src/**`. Test files are exempt, because a test holds class strings as input.

Pattern rules that decide whether a gate is right:

- Anchor on `[^-\w]`, never `[^\w]` and never `\b`. A hyphen in front means the token belongs to another utility: `drop-shadow-md` is a filter, `translate-z-10` is a transform (`translate-z`, `scale-z` and `rotate-z` are real Tailwind utilities).
- Add `-?` after the anchor only where a real negative form exists (`-z-10`, `-outline-offset-2`).
- Radius: all fourteen corner groups (`ss|se|es|ee|tl|tr|bl|br|t|r|b|l|s|e`), and the test is the kind of name, not the pixel value. The eight Tailwind default names (`xs` to `4xl`) are banned; `rounded-2xs` is a kit token and stays.
- Elevation needs a `[` branch so `shadow-[0_10px_15px_rgba(…)]` is caught.
- A regex over literals cannot tell a class list from prose that names one. Known and accepted.
- `outline-none` is load-bearing in a few places and stays allowed; `rounded-none` is a legitimate removal.

## Prove a gate works

A scanner that reports zero is indistinguishable from a broken one. Plant a canary.

1. Write two scratch files in scope, a `.ts` and a `.svelte`, containing known violations and their logical counterparts, so both selectors are exercised.
2. Run `pnpm exec eslint -f json <files>`. It exits 1 whenever it reports anything, so catch the error and parse `stdout`.
3. Assert **per file**, never over a merged map: both files contain the same classes, and a shared map lets one half overwrite the other.
4. Locate hits by `column` / `endColumn` slicing the source line, never by line number.
5. Delete the canaries in a `finally`.

A gate that fires on a valid class (a false positive) is as much a bug as one that misses.

## Adding a token axis

Add the token file under `src/lib/tokens/`, import it in `index.css`, write the `no-restricted-syntax` pattern with its message in `TOKEN_RULES`, canary it, then document it in `CLAUDE.md` §3 and §6 and in the README table. A rule that has to hold gets a gate, not a paragraph.

## Beyond lint

`pnpm audit:variants` cross-checks every `variants.ts` against its siblings (size to height, control text and padding, defaults, axis names, colour, states). A finding is either fixed or recorded with a reason in `scripts/audit/baseline.json`.
