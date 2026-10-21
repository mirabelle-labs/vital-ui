# .claude

How Claude Code works on this repository. [`CLAUDE.md`](../CLAUDE.md) at the root is the contract; this folder holds the specialists and the procedures built on top of it.

## Agents

Each agent is a reviewer or builder with one point of view and a clear boundary. Run one when you want a read that is not anchored on the main conversation.

| Agent | Question it answers | Does not do |
| --- | --- | --- |
| [`vitalui`](agents/vitalui.md) | Build this page out of library components only | create library components, touch tokens |
| [`visual`](agents/visual.md) | Are two things that should look identical really identical? (tokens bypassed, radius, elevation, states, themes) | judge comfort or structure |
| [`a11y`](agents/a11y.md) | Can everyone use it? (keyboard, focus, ARIA, contrast, reduced motion) | judge taste |
| [`ux`](agents/ux.md) | Is the person comfortable? (hierarchy, spacing, colour, friction) | audit exclusion or wording |
| [`attention`](agents/attention.md) | What do these words cost the reader? (load, memory, tone, density) | persuade |
| [`copywriter`](agents/copywriter.md) | Does this sell without overselling? (copy, conversion, pricing) | audit cognitive cost |
| [`coherence`](agents/coherence.md) | Does each file live where it should, and is the same thing done the same way everywhere? | judge whether it works |
| [`surgeon`](agents/surgeon.md) | What is broken now, proven? | speculate, give opinions |
| [`gardener`](agents/gardener.md) | What will cost the next developer in six months? | prove acute defects |

`surgeon` and `gardener` are a deliberate pair with opposite temperaments over the same ground. Run them on the same scope: what both find is real, what only the surgeon finds is acute, what only the gardener finds is chronic, and where they disagree is a decision nobody has made yet.

### Which one?

| Question | Agent |
| --- | --- |
| Where should this file live? Which way do imports go? | `coherence` |
| Do these two files do the same thing the same way? | `coherence` |
| Are these two visuals really identical? | `visual` |
| Does it break, now? | `surgeon` |
| Will it be expensive in six months? | `gardener` |
| Can the person use the interface at all? | `a11y` |
| Is the person comfortable in it? | `ux` |
| Can the person understand the words? | `attention` |
| Do the words make the person act? | `copywriter` |

## Skills

Repeatable procedures, loaded on demand.

| Skill | Use it to |
| --- | --- |
| [`add-component`](skills/add-component/SKILL.md) | add a family end to end: variants, component, exports, demo, registry, gates |
| [`token-audit`](skills/token-audit/SKILL.md) | sweep for token violations without false positives, and prove the lint gates work |
| [`theme-audit`](skills/theme-audit/SKILL.md) | measure contrast in both themes and decide which tokens to split or make vary |
| [`visual-verify`](skills/visual-verify/SKILL.md) | screenshot a page in light and dark, with hover and focus, before calling a visual change done |

`theme-audit` ships `contrast.mjs` and `visual-verify` ships `shot.mjs`; both run from the repository root with plain Node.
