# Scripts

## `audit/`: `pnpm audit:variants`

Cross-checks every `variants.ts` against its siblings and prints only the outliers. Static: no component is run and no model is involved.

| Check               | Catches                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `sizeMatchesHeight` | a size key that disagrees with its control height token (`md: 'h-control-sm'`)                     |
| `controlSizesAgree` | controls sharing a size key that set different text, padding, gap or radius: flags the odd one out |
| `defaultsAgree`     | a different `defaultVariants` for the same axis across families                                    |
| `axisNames`         | an axis named differently from its siblings                                                        |
| `colourMatchesName` | a `danger` variant that paints with `primary`, or a `success` one with `danger`                    |
| `stateCoverage`     | an axis where most values react to hover, active, disabled or focus and one does not               |

```bash
pnpm audit:variants                # print new findings
pnpm audit:variants -- --strict    # exit 1 on a finding not in the baseline (for CI)
pnpm audit:variants -- --baseline  # record today's new findings with a TODO reason
pnpm audit:variants -- --all       # include the baseline
```

A finding is either fixed or recorded in `audit/baseline.json` with the reason it is intentional. Files: `index.ts` (entry and reporting), `checks.ts` (the checks), `classes.ts` (class-string parsing), `parseVariants.ts` (reads every `cva()`).
