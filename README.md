# Not a Number

Interactive blog posts on computer science and web development, at [nan.fyi](https://nan.fyi).

Built with [React Router](https://reactrouter.com) (framework mode), [MDX](https://mdxjs.com) and Tailwind CSS, and deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/) — the same stack as the `nan` repo.

```sh
pnpm install
pnpm dev
```

## Layout

- `app/routes.ts` lists every route. Pages live under `app/routes/`, each with a `route.tsx` (meta + layout) and usually a `page.mdx` (the post).
- `app/mdx-components.tsx` maps the components every MDX page can use.
- `app/routes/api/` holds the newsletter endpoints.
- `workers/app.ts` is the Worker entry; `wrangler.json` configures it.

See `migration.md` for how to add an article.

## Secrets and bindings

The newsletter sign-up (`/api/subscribe`, `/api/verify`) needs one secret, `LOOPS_API_KEY`. For local development copy `.dev.vars.example` to `.dev.vars` and fill it in; in production set it with `wrangler secret put LOOPS_API_KEY`.

Confirmation tokens are stored in the `SUBSCRIBE_TOKENS` Workers KV namespace (see `wrangler.json`). Wrangler creates the namespace on the first deploy; local dev uses a local KV store.

## Scripts

| Script | |
|------|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Build, then serve the built Worker locally |
| `pnpm deploy` | Deploy to Cloudflare (`wrangler deploy`) |
| `pnpm typecheck` | Generate types and run `tsc` |
| `pnpm test` | Vitest |
