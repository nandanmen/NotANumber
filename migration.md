# Migration playbooks (this repo)

This document holds **two playbooks** for agents migrating content here:

1. **Article under (article-grid)** — adding or moving an interactive article into [`app/routes/(main)/(article-grid)/`](app/routes/(main)/(article-grid)/) with MDX, metadata, and colocated demos (see the next major section).
2. **Stitches → Tailwind** — replacing `@stitches/react` with Tailwind in article demos and components (see [Stitches → Tailwind migration](#stitches--tailwind-migration)).

The site runs on **React Router 7 (framework mode) + MDX + Vite**, deployed to **Cloudflare Workers** (same stack as the `nan` repo). Routes are listed explicitly in [`app/routes.ts`](app/routes.ts); there is no file-system routing.

---

## Article under (article-grid)

How to add or move a post under the article-grid layout (pattern proven with **magic-motion**; references **keys-in-framer-motion**, **database**).

### Route layout and files

Create a folder at `app/routes/(main)/(article-grid)/<slug>/` and register it in [`app/routes.ts`](app/routes.ts) inside the `(article-grid)` layout: `route("<slug>", `${articleGrid}/<slug>/route.tsx`)`.

| File | Role |
|------|------|
| [`route.tsx`](app/routes/(main)/(article-grid)/keys-in-framer-motion/route.tsx) | The route module. `meta()` returns `toMeta(metadata, { image: ogImage, themeColor: "#ededed" })` using the `Metadata` shape from [`~/lib/meta`](app/lib/meta.ts) (title, description, authors, `twitter`, `openGraph` with `url: https://nan.fyi/<slug>`). The default export renders [`ArticleTitle`](app/routes/(main)/(article-grid)/article-title.tsx) with the same title/description, then `<MDXContent />` imported from `./page.mdx`. |
| [`page.mdx`](app/routes/(main)/(article-grid)/keys-in-framer-motion/page.mdx) | Article body: imports + prose + embedded components. **No YAML frontmatter** — metadata lives only in `route.tsx`. |
| `opengraph-image.png` | Optional. Import it in `route.tsx` and pass it to `toMeta` as `image`; otherwise use `../../opengraph-image.png` (the site default). |
| `_components/` | Post-specific interactive demos, colocated with the page. |

Parent shell: [`app/routes/(main)/(article-grid)/layout.tsx`](app/routes/(main)/(article-grid)/layout.tsx) supplies the grid shell, [`Navbar`](app/routes/(main)/(article-grid)/nav.tsx), and `GridSizeProvider`, and renders the article through `<Outlet />`.

### MDX components

Global MDX components (headings, `pre` → `CodeBlock`, `Aside`, `Wide`, `ScrollGroup`, …) are defined in [`app/mdx-components.tsx`](app/mdx-components.tsx) and provided to every MDX page through `MDXProvider` in [`app/root.tsx`](app/root.tsx). Imports in `.mdx` files can use the `~/` alias (it points at `app/`).

### Everything renders on the server and the client

There are no server components: every component renders during SSR (in the Workers runtime) and again in the browser. So:

- **No `async` components** and no Node APIs (`fs`, `process.env`) in components. Code blocks are highlighted synchronously ([`code-block.tsx`](app/components/mdx/code-block.tsx) uses a sync Shiki highlighter with a fixed set of languages — add a language there if a post needs one).
- **No crypto randomness, timers or I/O at module scope** (e.g. `const items = [{ id: nanoid() }]`). Workers reject them outside a request. Use `nanoid/non-secure`, or create the values inside a component/effect.
- **Browser-only libraries** that run code on import (Sandpack) must be loaded lazily on the client; see [`components/Sandbox/Sandbox.tsx`](app/components/Sandbox/Sandbox.tsx).
- `"use client"` directives are not needed.
- Use `Link` from `react-router` (`to=`, not `href=`) and `useLocation()` instead of `next/link` / `usePathname`.

### MDX and compound `Quiz` components

The MDX toolchain may not treat **`Quiz.Option`** as defined even when `Quiz.Option` is assigned on the `Quiz` object. **Fix:** use **named** exports from [`components/Quiz/Quiz.tsx`](app/components/Quiz/Quiz.tsx) — `QuizQuestion`, `QuizOption`, `QuizOptions`, `QuizTip`, `QuizSpoiler` — and write `<QuizOption>` in MDX instead of `<Quiz.Option>`. Keep `Quiz` as the root wrapper.

### Full-bleed figures in the grid

Prefer **[`Wide`](app/components/mdx/Wide.tsx)** (`~/components/mdx/Wide`) over [`FullWidth`](app/components/FullWidth.tsx) for figures inside article-grid content so width and padding align with the grid.

### Cross-article shared UI

If a demo imports another post's code (e.g. **TokenList** from tokenizer), use a stable path such as **`~/routes/(main)/(article-grid)/tokenizer/_components/TokenList`**.

### Verification (article-grid)

- **`pnpm build`**, then **`pnpm preview`** (runs the built worker locally).
- Open `/<slug>` and spot-check interactive blocks and layout chrome.

### Visualizer and buttons (FYI)

Many article demos use **`~/components/Visualizer`** (`ToggleButton`, `IconButton`, `PlayButton`, `UndoButton`, etc.). Those re-use shared **[`components/Button.tsx`](app/components/Button.tsx)** under the hood. When changing control styling, prefer updating **`Button`** / Visualizer wrappers rather than forking one-off buttons in the post.

---

## Stitches → Tailwind migration

The following sections summarize how the **magic-motion** article demos were migrated from `@stitches/react` to Tailwind. Use them when migrating other routes or components for styling only.

### Goals

- Remove `styled`, `css`, `keyframes`, and `darkTheme` usage from the target scope.
- Prefer **Tailwind utility classes** and **`cn()`** for conditional styling.
- Keep **Framer Motion** (`motion.*`, `layout`, `animate`, `transition`) where it implements interactive demos—not as a replacement for every Stitches style, but do not strip motion-driven behavior unless the product asks for it.

### Project conventions

- **Merge classes** with [`lib/cn.ts`](app/lib/cn.ts): `cn` = `clsx` + `tailwind-merge`. Use it whenever classes are conditional or passed from props.
- **Colors**: the `@theme` block in [`app/app.css`](app/app.css) defines the Radix palettes (`gray`, `blue`, etc.) as Tailwind colors (Tailwind 4; there is no `tailwind.config.js`). Map Stitches tokens like `$blue8` → `blue8`, `$gray11` → `gray11` (typically `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*`).
- **Radii**: Stitches `radii.base` (6px) aligns with Tailwind `rounded-md` in practice; confirm visually when porting.

### Constraints we used (adjust per task)

- **Light mode only**: Drop `[.darkTheme &]` blocks and `darkTheme` imports. Do not add Tailwind `dark:` variants or extend Tailwind with dark palettes unless the site-wide theme story changes.
- **No Stitches/CSS keyframe animations**: Remove Stitches `keyframes` and CSS `animation*` properties; use a **static** final look (e.g. `opacity-100`). Do **not** remove Framer Motion `animate` / `layout` / `transition` unless the task explicitly says to kill motion demos.
- **Box shadow**: Where Stitches used `boxShadow: "$sm"`, use Tailwind **`shadow-sm`**. For SVG filters that used Stitches drop shadows, use **`drop-shadow-sm`** (or `filter-none` when removing shadow).

### Pattern cheat sheet

| Stitches | Tailwind / React |
|----------|------------------|
| `styled("div", { ... })` | `<div className={cn(...)} />` |
| `styled(motion.div, { ... })` | `<motion.div className={cn(...)} />` |
| `variants: { foo: { true: { ... } } }` | `cn(base, foo && "...")` or small helpers |
| `$space$8`, `$4` | `p-8`, `gap-4`, `p-4` (Stitches space scale matches Tailwind spacing in most cases—spot-check rem values) |
| `@md` in Stitches | Tailwind `md:` (both use 768px here) |
| `boxShadow: "$sm"` | `shadow-sm` |
| SVG `filter: drop-shadow(...)` | `drop-shadow-sm` or `filter-none` |
| Compound selectors (`&:after`, `&:before`) | Tailwind `after:*` / `before:*` with `content-['']` where needed, or a thin `@layer` rule in [`app/app.css`](app/app.css) if the markup becomes unmaintainable |
| `css={{ ... }}` prop (Stitches on components) | `style={{ ... }}` and/or `className` |

### Suggested order of work

1. **Leaf / shared primitives first** (things imported by many demos): small presentational components, rulers, shared SVG shapes, etc.
2. **Feature components** that only compose primitives.
3. **Grep gate**: from the target folder, `stitches` / `~/stitches.config` should disappear for files in scope.

### SVG notes

- Tailwind **`fill-*`** / **`stroke-*`** / **`stroke-2`** work on SVG elements when applied via `className`.
- Prefer SVG attributes (`r`, `rx`, `x`, `y`) for geometry; don’t rely on Tailwind for `r`—set `r={6}` (or similar) on `<circle>` / `<rect>`.
- **Biome** may require accessible SVGs: for decorative diagrams, either add **`role="img"` + `aria-label="..."`** or a proper `<title>`—match what we did under `magic-motion` after migration.

### Framer Motion gotchas

- `styled(motion.x)` becomes **`motion.x` + `className`**; ref types stay on the DOM element (`SVGLineElement`, etc.).
- When replacing Stitches `css={{ width, height }}` on a host component, merge into **`style`** or explicit Tailwind if sizes are fixed.
- **`useLayoutEffect` without a dependency array** runs every render (legacy pattern in at least one demo). Preserve behavior unless you intentionally fix the effect model.

### Verification (Stitches → Tailwind)

- **Search**: `rg stitches app/(path)/` (or the target tree)—no hits in migrated files.
- **Lint**: `pnpm exec biome check <path>`.
- **Build**: `pnpm run build` (the build doesn't type-check; run `pnpm typecheck` to see type errors).

### Out of scope by default

- Global [`stitches.config.ts`](app/stitches.config.ts) and unrelated packages still on Stitches (e.g. `components/Visualizer`, MDX helpers) unless the migration ticket explicitly includes them.

### Theme / `dark:` (FYI)

- Only the experiment pages (the old pages-router pages, under [`routes/legacy-layout.tsx`](app/routes/legacy-layout.tsx)) have a theme toggle. It maps dark mode to **`darkTheme.className`** from Stitches, not the string `"dark"`, via the small [`ThemeProvider`](app/components/theme.tsx). If you reintroduce dark mode elsewhere, align Tailwind's `dark:` variant with whatever class actually lands on `<html>`—that is separate from "delete dark branches" migrations.
