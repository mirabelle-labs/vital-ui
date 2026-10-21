# Workflows

Automation for the repository. This README lives here, not in `.github/`, because GitHub shows `.github/README.md` instead of the root one.

| Workflow                     | Runs on                  | Does                                                                                                                                                      |
| ---------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`ci.yml`](ci.yml)           | push to `main`, every PR | `check`, `lint`, `test:run`, `audit:variants`, `package`, `publint`, `build`. On `main` it then deploys the demo site.                                    |
| [`release.yml`](release.yml) | a `vX.Y.Z` tag           | checks the tag matches `package.json`, runs the gates, publishes `@mirabelle-labs/vital-ui` to npm with provenance, through trusted publishing (no token) |

## Secrets

Set them in the repository: Settings → Secrets and variables → Actions.

| Secret                  | Used by  | Value                                            |
| ----------------------- | -------- | ------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`  | `ci.yml` | an API token with **Cloudflare Pages: Edit**     |
| `CLOUDFLARE_ACCOUNT_ID` | `ci.yml` | the account id shown in the Cloudflare dashboard |

## npm

Publishing uses npm trusted publishing: the workflow proves its identity with `id-token: write`, so no npm token is stored. Configure it once on npmjs.com: the package → Settings → Trusted publishing → GitHub Actions, organization `mirabelle-labs`, repository `vital-ui`, workflow `release.yml`. It needs npm 11.5.1 or later, hence Node 24 in the job.

## Demo site

The site is prerendered with `@sveltejs/adapter-static` into `build/` and published to the Cloudflare Pages project `vital-ui`. Every route is prerendered; `404.html` is the fallback for unknown URLs.

## Releasing

```bash
npm version patch          # bumps package.json and tags vX.Y.Z
git push --follow-tags
```
