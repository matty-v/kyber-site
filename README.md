# kyber-site

Marketing and documentation site for [Kyber](https://github.com/matty-v/kyber),
live at [kyber.voget.io](https://kyber.voget.io).

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).
Deployed to Firebase Hosting (project `kinetic-object-322814`, site `kyber-voget-io`).

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
```

## Structure

- `src/content/docs/index.mdx` — the landing page (Starlight splash template + custom components in `src/components/`)
- `src/content/docs/docs/` — the docs section (`/docs/*`)
- `src/content/docs/use-cases/` — use-case pages (`/use-cases/*`)
- `src/styles/custom.css` — the Kyber brand theme (cyan `#4ECDDB` on a GitHub-dark neutral scale)
- Docs pages are curated summaries; the deep guides stay canonical in
  [`matty-v/kyber/docs`](https://github.com/matty-v/kyber/tree/main/docs) and are
  linked from every page, so the two sets do not drift.

## CI/CD

- `test.yml` — build on PRs and main
- `preview.yml` — PRs get a temporary Firebase preview channel (7 days)
- `deploy.yml` — push to main deploys to the live channel

Deploys need the `FIREBASE_SERVICE_ACCOUNT` repo secret. One-time setup lives in
[`scripts/bootstrap-firebase.sh`](scripts/bootstrap-firebase.sh); run it anywhere
`gcloud` (as the project owner) and `gh` are logged in.
