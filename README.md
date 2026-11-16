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
- `app/routes/api/` holds the newsletter, comments and GitHub sign-in endpoints.
- `workers/app.ts` is the Worker entry; `wrangler.json` configures it.

See `migration.md` for how to add an article.

## Secrets

The API routes need these secrets. For local development copy `.dev.vars.example` to `.dev.vars` and fill it in; in production set each with `wrangler secret put <NAME>`.

| Name | Used by |
|------|---------|
| `LOOPS_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Newsletter sign-up (`/api/subscribe`, `/api/verify`) |
| `POSTGRES_URL` | SVG paths comments (`/api/comments`) |
| `GITHUB_ID`, `GITHUB_SECRET`, `AUTH_SECRET` | GitHub sign-in for comments (`/api/auth/*`). The GitHub OAuth app's callback URL is `https://nan.fyi/api/auth/callback/github`. |

## Scripts

| Script | |
|------|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Build, then serve the built Worker locally |
| `pnpm deploy` | Deploy to Cloudflare (`wrangler deploy`) |
| `pnpm typecheck` | Generate types and run `tsc` |
| `pnpm test` | Vitest |
