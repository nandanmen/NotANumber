# Migration playbooks (this repo)

This document holds **two playbooks** for agents migrating content here:

1. **App Router + article-grid** — moving an interactive article into [`app/(main)/(article-grid)/`](app/(main)/(article-grid)/) with MDX, metadata, and colocated demos (see the next major section).
2. **Stitches → Tailwind** — replacing `@stitches/react` with Tailwind in article demos and components (see [Stitches → Tailwind migration](#stitches--tailwind-migration)).

Use the section that matches the task. The legacy in-app `/_stories` browser and `*.stories.tsx` pipeline were removed from this repo; do not reintroduce them when migrating articles.

---

## App Router: article under (article-grid)

How to add or move a post to the App Router under the article-grid layout (pattern proven with **magic-motion**; references **keys-in-framer-motion**, **database**).

### Route layout and files

Create a segment at `app/(main)/(article-grid)/<slug>/`:

| File | Role |
|------|------|
| [`layout.tsx`](app/(main)/(article-grid)/keys-in-framer-motion/layout.tsx) | `export const metadata` (title, description, authors, `twitter`, `openGraph` with `url: https://nan.fyi/<slug>`). Render [`ArticleTitle`](app/(main)/(article-grid)/article-title.tsx) with the same title/description, then `{children}`. |
| [`page.mdx`](app/(main)/(article-grid)/keys-in-framer-motion/page.mdx) | Article body: imports + prose + embedded components. **No YAML frontmatter** — metadata lives only in `layout.tsx`. |
| `_components/` | Post-specific interactive demos, colocated with the page (same idea as keys-in-framer-motion / database / magic-motion). |

Parent shell: [`app/(main)/(article-grid)/layout.tsx`](app/(main)/(article-grid)/layout.tsx) supplies the grid shell, [`Navbar`](app/(main)/(article-grid)/nav.tsx), and `GridSizeProvider`.

### ArticleTitle import (critical)

In the route’s **`layout.tsx`**, import **`ArticleTitle`** from **[`../article-title`](app/(main)/(article-grid)/article-title.tsx)**.

**Do not** import `ArticleTitle` from [`how-computers-talk/header.tsx`](app/(main)/(article-grid)/how-computers-talk/header.tsx). That file re-exports the title helper in the same module as `PageHeader`, whose imports pull in **client** diagram code (`Connectors`, etc.). Loading that module while Next collects **layout configuration / RSC** for the segment can throw (e.g. `createContext`-style failures). [`article-title.tsx`](app/(main)/(article-grid)/article-title.tsx) is server-only markup.

**Check:** `rg 'ArticleTitle.*how-computers-talk/header'` on new layouts should return nothing.

### MDX and RSC boundaries

- **`"use client"`** on each interactive demo `.tsx` under `_components/` that uses hooks, **XState**, **`motion` / Framer Motion**, browser APIs, etc.
- If **`page.mdx`** stays a **server** component, any **shared** component it imports that behaves like a client component (hooks, Stitches + React context, etc.) may need **`"use client"`** on that shared module, or the client boundary must move to a child.
- **Function props cannot be serialized** from server MDX into client children. Patterns such as `<Demo from={(w, c) => ({ ... })} />` in MDX will fail at build/prerender. **Fix:** move that block into a dedicated **client** component that defines the callbacks inside the file (example: [`TransformOriginSection.tsx`](app/(main)/(article-grid)/magic-motion/_components/TransformOriginSection.tsx)).

### MDX and compound `Quiz` components

The MDX toolchain may not treat **`Quiz.Option`** as defined even when `Quiz.Option` is assigned on the `Quiz` object. **Fix:** use **named** exports from [`components/Quiz/Quiz.tsx`](components/Quiz/Quiz.tsx) — `QuizQuestion`, `QuizOption`, `QuizOptions`, `QuizTip`, `QuizSpoiler` — and write `<QuizOption>` in MDX instead of `<Quiz.Option>`. Keep `Quiz` as the root wrapper.

### Full-bleed figures in the grid

Prefer **[`Wide`](components/mdx/Wide.tsx)** (`~/components/mdx/Wide`) over [`FullWidth`](components/FullWidth.tsx) for figures inside article-grid content so width and padding align with the grid.

### Cross-article shared UI

If a demo imports another post’s code (e.g. **TokenList** from tokenizer), use a stable path such as **`~/content/tokenizer/components/TokenList`** until that post is migrated. If server MDX imports it, ensure that module is safe for the boundary (often **`"use client"`** on the shared file).

### Legacy `content/` + Pages router (FYI)

[`pages/[content].tsx`](pages/[content].tsx) and [`lib/content.server.ts`](lib/content.server.ts) still serve remaining **`content/**/index.mdx`** posts via **`_dist-content`** produced by **`pnpm build:content`** (Babel). Do not remove **`build:content`** from **`dev` / `build`** until every such post is migrated off the Pages router or `CONTENT_FOLDER` is repointed.

### Verification (article-grid)

- **`pnpm build`**
- Open `/<slug>` and spot-check interactive blocks and layout chrome.
- Confirm **`ArticleTitle`** is only imported from **`article-title.tsx`** in route layouts.

### Visualizer and buttons (FYI)

Many article demos use **`~/components/Visualizer`** (`ToggleButton`, `IconButton`, `PlayButton`, `UndoButton`, etc.). Those re-use shared **[`components/Button.tsx`](components/Button.tsx)** under the hood. When changing control styling, prefer updating **`Button`** / Visualizer wrappers rather than forking one-off buttons in the post.

---

## Stitches → Tailwind migration

The following sections summarize how the **magic-motion** article demos were migrated from `@stitches/react` to Tailwind. Use them when migrating other routes or components for styling only.

### Goals

- Remove `styled`, `css`, `keyframes`, and `darkTheme` usage from the target scope.
- Prefer **Tailwind utility classes** and **`cn()`** for conditional styling.
- Keep **Framer Motion** (`motion.*`, `layout`, `animate`, `transition`) where it implements interactive demos—not as a replacement for every Stitches style, but do not strip motion-driven behavior unless the product asks for it.

### Project conventions

- **Merge classes** with [`lib/cn.ts`](lib/cn.ts): `cn` = `clsx` + `tailwind-merge`. Use it whenever classes are conditional or passed from props.
- **Colors**: [`tailwind.config.js`](tailwind.config.js) already spreads Radix palettes (`gray`, `blue`, etc.). Map Stitches tokens like `$blue8` → `blue8`, `$gray11` → `gray11` (typically `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*`).
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
| Compound selectors (`&:after`, `&:before`) | Tailwind `after:*` / `before:*` with `content-['']` where needed, or a thin `@layer` rule in [`app/styles.css`](app/styles.css) if the markup becomes unmaintainable |
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
- **Build**: `pnpm run build` (Next may skip full `tsc`—fix obvious type errors locally).

### Out of scope by default

- Global [`stitches.config.ts`](stitches.config.ts) and unrelated packages still on Stitches (e.g. `components/Visualizer`, MDX helpers) unless the migration ticket explicitly includes them.

### Theme / `dark:` (FYI)

- Pages router [`pages/_app.tsx`](pages/_app.tsx) maps `next-themes` dark to **`darkTheme.className`** from Stitches, not the string `"dark"`. App-router layouts may not wrap `ThemeProvider` the same way. If you reintroduce dark mode later, align **Tailwind `darkMode`** with whatever class actually lands on `<html>`—that is separate from “delete dark branches” migrations.
