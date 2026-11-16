import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

const main = "routes/(main)";
const articleGrid = `${main}/(article-grid)`;
const svgPaths = "routes/svg-paths";

export default [
  layout(`${main}/layout.tsx`, [
    index(`${main}/page.tsx`),
    layout(`${articleGrid}/layout.tsx`, [
      route("database", `${articleGrid}/database/route.tsx`),
      route("how-computers-talk", `${articleGrid}/how-computers-talk/route.tsx`),
      route("keys-in-framer-motion", `${articleGrid}/keys-in-framer-motion/route.tsx`),
      route("magic-motion", `${articleGrid}/magic-motion/route.tsx`),
      route("tokenizer", `${articleGrid}/tokenizer/route.tsx`),
    ]),
    layout(`${main}/(content)/layout.tsx`, [
      route("path-animations", `${main}/(content)/path-animations/route.tsx`),
    ]),
  ]),

  layout(`${svgPaths}/layout.tsx`, [
    route("svg-paths", `${svgPaths}/(index)/route.tsx`),
    route("svg-paths/cursors", `${svgPaths}/cursors/route.tsx`),
    route("svg-paths/lines", `${svgPaths}/lines/route.tsx`),
    route("svg-paths/bezier-curves", `${svgPaths}/bezier-curves/route.tsx`),
    route("svg-paths/cubic-curves", `${svgPaths}/cubic-curves/route.tsx`),
    route("svg-paths/arcs", `${svgPaths}/arcs/route.tsx`),
    route("svg-paths/challenge", `${svgPaths}/challenge/route.tsx`),
  ]),

  layout("routes/notes/(content)/layout.tsx", [
    route("notes/diagram", "routes/notes/(content)/diagram/route.tsx"),
  ]),

  route("experiments/family-browser-icon", "routes/experiments/family-browser-icon/page.tsx"),

  // Pages that used to live in the Next.js pages router.
  layout("routes/legacy-layout.tsx", [
    route("experiments/bezier-curves", "routes/experiments/bezier-curves.tsx"),
    route("experiments/cards", "routes/experiments/cards.tsx"),
    route("experiments/family-input", "routes/experiments/family-input.tsx"),
    route("experiments/heavy-square", "routes/experiments/heavy-square.tsx"),
    route("experiments/safari-scroll", "routes/experiments/safari-scroll.tsx"),
    route("experiments/scrambled-text", "routes/experiments/scrambled-text.tsx"),
    route("stack-overflow", "routes/stack-overflow/route.tsx"),
  ]),

  // API
  route("api/subscribe", "routes/api/subscribe/route.ts"),
  route("api/verify", "routes/api/verify/route.ts"),
  route("api/comments", "routes/api/comments/route.ts"),
  route("api/auth/signin/github", "routes/api/auth/signin.ts"),
  route("api/auth/callback/github", "routes/api/auth/callback.ts"),
  route("api/auth/session", "routes/api/auth/session.ts"),
  route("api/auth/signout", "routes/api/auth/signout.ts"),

  // Archived posts (previously `redirects` in next.config.js).
  route("how-arrays-work", "routes/archive-redirect.ts", { id: "archive-how-arrays-work" }),
  route("debugger", "routes/archive-redirect.ts", { id: "archive-debugger" }),
  route("sliding-window", "routes/archive-redirect.ts", { id: "archive-sliding-window" }),
] satisfies RouteConfig;
