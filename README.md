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
- `src/styles/custom.css` — the Kyber brand theme (cyan `#4ECDDB` on a GitHub-dark neutral scale)
- **All docs pages are mirrored, not authored here.** `scripts/sync-docs.mjs`
  (run automatically by `npm run dev` / `npm run build`) pulls
  [`matty-v/kyber/docs/product`](https://github.com/matty-v/kyber/tree/main/docs/product)
  and generates `src/content/docs/{getting-started,capabilities,use-cases,project}/`
  plus the sidebar (`src/generated/sidebar.json`) from that tree's
  `manifest.json`. To change docs content, PR the kyber repo, not this one.
- For a local docs loop against a kyber checkout:
  `KYBER_DOCS_DIR=~/dev/kyber npm run dev`.

## CI/CD

- `test.yml` — build on PRs and main
- `preview.yml` — PRs get a temporary Firebase preview channel (7 days)
- `deploy.yml` — deploys to the live channel on: push to main, a
  `kyber-docs-updated` repository dispatch (fired by the kyber repo's
  `notify-site.yml` when `docs/product/` changes on its main), a 6-hourly
  scheduled safety net, and manual dispatch

Deploys need the `FIREBASE_SERVICE_ACCOUNT` repo secret. One-time setup lives in
[`scripts/bootstrap-firebase.sh`](scripts/bootstrap-firebase.sh); run it anywhere
`gcloud` (as the project owner) and `gh` are logged in.
