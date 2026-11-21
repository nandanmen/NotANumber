/**
 * Resolves a Tailwind v4 class name to its CSS property declarations.
 *
 * Covers: layout (display, flex, grid) and spacing (padding, margin, gap).
 * --spacing = 0.25rem (4px) per the compiled out.css theme.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type CSSDeclaration = { prop: string; value: string };

// ── Spacing scale ─────────────────────────────────────────────────────────────

const SPACING = 4; // px per unit

/**
 * Convert a scale token to a px value string.
 * e.g. "4" → "16px", "0.5" → "2px", "px" → "1px"
 */
function spacingValue(token: string): string | null {
  if (token === "px") return "1px";
  if (token === "auto") return "auto";
  if (token === "full") return "100%";
  const n = Number.parseFloat(token);
  if (isNaN(n)) return null;
  const px = n * SPACING;
  return `${Number.parseFloat(px.toFixed(4))}px`;
}

/**
 * Parse an arbitrary value token like "[400px]" → "400px",
 * "[1rem]" → "1rem", "[var(--foo)]" → "var(--foo)".
 */
function parseArbitrary(token: string): string | null {
  if (token.startsWith("[") && token.endsWith("]")) {
    return token.slice(1, -1).replace(/_/g, " ");
  }
  return null;
}

/**
 * Resolve a spacing suffix (scale number, "px", "auto", or arbitrary) to a
 * CSS value string. Returns null if unrecognised.
 */
function resolveSpacing(suffix: string): string | null {
  return parseArbitrary(suffix) ?? spacingValue(suffix);
}

// ── Static maps ───────────────────────────────────────────────────────────────

// display
const DISPLAY: Record<string, string> = {
  block: "block",
  contents: "contents",
  flex: "flex",
  grid: "grid",
  hidden: "none",
  inline: "inline",
  "inline-block": "inline-block",
  "inline-flex": "inline-flex",
  "inline-grid": "inline-grid",
  "inline-table": "inline-table",
  "list-item": "list-item",
  table: "table",
  "table-caption": "table-caption",
  "table-cell": "table-cell",
  "table-column": "table-column",
  "table-column-group": "table-column-group",
  "table-footer-group": "table-footer-group",
  "table-header-group": "table-header-group",
  "table-row": "table-row",
  "table-row-group": "table-row-group",
  "flow-root": "flow-root",
};

// flex-direction
const FLEX_DIRECTION: Record<string, string> = {
  "flex-row": "row",
  "flex-row-reverse": "row-reverse",
  "flex-col": "column",
  "flex-col-reverse": "column-reverse",
};

// flex-wrap
const FLEX_WRAP: Record<string, string> = {
  "flex-wrap": "wrap",
  "flex-nowrap": "nowrap",
  "flex-wrap-reverse": "wrap-reverse",
};

// flex shorthand
const FLEX_SHORTHAND: Record<string, string> = {
  "flex-1": "1 1 0%",
  "flex-auto": "1 1 auto",
  "flex-initial": "0 1 auto",
  "flex-none": "none",
};

// align-items
const ITEMS: Record<string, string> = {
  "items-start": "flex-start",
  "items-end": "flex-end",
  "items-center": "center",
  "items-baseline": "baseline",
  "items-stretch": "stretch",
};

// justify-content
const JUSTIFY: Record<string, string> = {
  "justify-start": "flex-start",
  "justify-end": "flex-end",
  "justify-center": "center",
  "justify-between": "space-between",
  "justify-around": "space-around",
  "justify-evenly": "space-evenly",
};

// justify-items
const JUSTIFY_ITEMS: Record<string, string> = {
  "justify-items-start": "start",
  "justify-items-end": "end",
  "justify-items-center": "center",
  "justify-items-stretch": "stretch",
};

// align-self
const SELF: Record<string, string> = {
  "self-auto": "auto",
  "self-start": "flex-start",
  "self-end": "flex-end",
  "self-center": "center",
  "self-stretch": "stretch",
  "self-baseline": "baseline",
};

// align-content
const CONTENT: Record<string, string> = {
  "content-center": "center",
  "content-start": "flex-start",
  "content-end": "flex-end",
  "content-between": "space-between",
  "content-around": "space-around",
  "content-evenly": "space-evenly",
  "content-baseline": "baseline",
};

// place-items / place-content
const PLACE_ITEMS: Record<string, string> = {
  "place-items-start": "start",
  "place-items-end": "end",
  "place-items-center": "center",
  "place-items-stretch": "stretch",
};

const PLACE_CONTENT: Record<string, string> = {
  "place-content-center": "center",
  "place-content-start": "start",
  "place-content-end": "end",
  "place-content-between": "space-between",
  "place-content-around": "space-around",
  "place-content-evenly": "space-evenly",
};

// grow / shrink
const GROW_SHRINK: Record<string, CSSDeclaration[]> = {
  grow: [{ prop: "flex-grow", value: "1" }],
  "grow-0": [{ prop: "flex-grow", value: "0" }],
  shrink: [{ prop: "flex-shrink", value: "1" }],
  "shrink-0": [{ prop: "flex-shrink", value: "0" }],
};

// grid-flow
const GRID_FLOW: Record<string, string> = {
  "grid-flow-row": "row",
  "grid-flow-col": "column",
  "grid-flow-dense": "dense",
  "grid-flow-row-dense": "row dense",
  "grid-flow-col-dense": "column dense",
};

// ── Dynamic prefix resolvers ──────────────────────────────────────────────────

type Resolver = (suffix: string) => CSSDeclaration[] | null;

const PREFIX_RESOLVERS: Array<{ prefix: string; resolve: Resolver }> = [
  // padding
  {
    prefix: "p",
    resolve: (s) => apply(resolveSpacing(s), [{ prop: "padding", v: "$" }]),
  },
  {
    prefix: "px",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "padding-inline", v: "$" }]),
  },
  {
    prefix: "py",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "padding-block", v: "$" }]),
  },
  {
    prefix: "pt",
    resolve: (s) => apply(resolveSpacing(s), [{ prop: "padding-top", v: "$" }]),
  },
  {
    prefix: "pr",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "padding-right", v: "$" }]),
  },
  {
    prefix: "pb",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "padding-bottom", v: "$" }]),
  },
  {
    prefix: "pl",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "padding-left", v: "$" }]),
  },
  {
    prefix: "ps",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "padding-inline-start", v: "$" }]),
  },
  {
    prefix: "pe",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "padding-inline-end", v: "$" }]),
  },

  // margin
  {
    prefix: "m",
    resolve: (s) => apply(resolveSpacing(s), [{ prop: "margin", v: "$" }]),
  },
  {
    prefix: "mx",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "margin-inline", v: "$" }]),
  },
  {
    prefix: "my",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "margin-block", v: "$" }]),
  },
  {
    prefix: "mt",
    resolve: (s) => apply(resolveSpacing(s), [{ prop: "margin-top", v: "$" }]),
  },
  {
    prefix: "mr",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "margin-right", v: "$" }]),
  },
  {
    prefix: "mb",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "margin-bottom", v: "$" }]),
  },
  {
    prefix: "ml",
    resolve: (s) => apply(resolveSpacing(s), [{ prop: "margin-left", v: "$" }]),
  },
  {
    prefix: "ms",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "margin-inline-start", v: "$" }]),
  },
  {
    prefix: "me",
    resolve: (s) =>
      apply(resolveSpacing(s), [{ prop: "margin-inline-end", v: "$" }]),
  },

  // gap
  {
    prefix: "gap",
    resolve: (s) => apply(resolveSpacing(s), [{ prop: "gap", v: "$" }]),
  },
  {
    prefix: "gap-x",
    resolve: (s) => apply(resolveSpacing(s), [{ prop: "column-gap", v: "$" }]),
  },
  {
    prefix: "gap-y",
    resolve: (s) => apply(resolveSpacing(s), [{ prop: "row-gap", v: "$" }]),
  },

  // flex-basis
  {
    prefix: "basis",
    resolve: (s) => {
      const val =
        resolveSpacing(s) ??
        parseArbitrary(s) ??
        {
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          full: "100%",
          auto: "auto",
        }[s] ??
        null;
      return val ? [{ prop: "flex-basis", value: val }] : null;
    },
  },

  // flex-grow / flex-shrink numeric
  { prefix: "grow", resolve: (s) => [{ prop: "flex-grow", value: s }] },
  { prefix: "shrink", resolve: (s) => [{ prop: "flex-shrink", value: s }] },

  // order
  {
    prefix: "order",
    resolve: (s) => {
      if (s === "first") return [{ prop: "order", value: "-9999" }];
      if (s === "last") return [{ prop: "order", value: "9999" }];
      if (s === "none") return [{ prop: "order", value: "0" }];
      const n = Number.parseInt(s, 10);
      return isNaN(n) ? null : [{ prop: "order", value: String(n) }];
    },
  },

  // grid-cols / grid-rows
  {
    prefix: "grid-cols",
    resolve: (s) => {
      const val =
        parseArbitrary(s) ??
        {
          "1": "repeat(1, minmax(0, 1fr))",
          "2": "repeat(2, minmax(0, 1fr))",
          "3": "repeat(3, minmax(0, 1fr))",
          "4": "repeat(4, minmax(0, 1fr))",
          "5": "repeat(5, minmax(0, 1fr))",
          "6": "repeat(6, minmax(0, 1fr))",
          "7": "repeat(7, minmax(0, 1fr))",
          "8": "repeat(8, minmax(0, 1fr))",
          "9": "repeat(9, minmax(0, 1fr))",
          "10": "repeat(10, minmax(0, 1fr))",
          "11": "repeat(11, minmax(0, 1fr))",
          "12": "repeat(12, minmax(0, 1fr))",
          none: "none",
          subgrid: "subgrid",
        }[s] ??
        null;
      return val ? [{ prop: "grid-template-columns", value: val }] : null;
    },
  },
  {
    prefix: "grid-rows",
    resolve: (s) => {
      const val =
        parseArbitrary(s) ??
        {
          "1": "repeat(1, minmax(0, 1fr))",
          "2": "repeat(2, minmax(0, 1fr))",
          "3": "repeat(3, minmax(0, 1fr))",
          "4": "repeat(4, minmax(0, 1fr))",
          "5": "repeat(5, minmax(0, 1fr))",
          "6": "repeat(6, minmax(0, 1fr))",
          none: "none",
          subgrid: "subgrid",
        }[s] ??
        null;
      return val ? [{ prop: "grid-template-rows", value: val }] : null;
    },
  },

  // col-span / row-span
  {
    prefix: "col-span",
    resolve: (s) => {
      const val =
        s === "full"
          ? "1 / -1"
          : (parseArbitrary(s) ?? (isNaN(+s) ? null : `span ${s} / span ${s}`));
      return val ? [{ prop: "grid-column", value: val }] : null;
    },
  },
  {
    prefix: "row-span",
    resolve: (s) => {
      const val =
        s === "full"
          ? "1 / -1"
          : (parseArbitrary(s) ?? (isNaN(+s) ? null : `span ${s} / span ${s}`));
      return val ? [{ prop: "grid-row", value: val }] : null;
    },
  },
];

// Helper: produce declarations by substituting '$' with `val`
function apply(
  val: string | null,
  defs: Array<{ prop: string; v: string }>,
): CSSDeclaration[] | null {
  if (val === null) return null;
  return defs.map((d) => ({ prop: d.prop, value: d.v.replace("$", val) }));
}

// ── Main resolver ─────────────────────────────────────────────────────────────

/**
 * Resolve a Tailwind class name to its CSS declarations.
 * Strips a leading `!` (important modifier) and a leading `-` (negative values).
 * Returns null for unrecognised classes.
 */
export function resolveClass(className: string): CSSDeclaration[] | null {
  // Strip important modifier prefix variants: `!foo` or `foo!`
  let cls = className.replace(/^!/, "").replace(/!$/, "");

  // Handle negative spacing: `-mt-4` → prefix `mt`, suffix `-4`
  const negative = cls.startsWith("-");
  if (negative) cls = cls.slice(1);

  // ── Static lookup ──────────────────────────────────────────────────────────

  if (cls in DISPLAY) return [{ prop: "display", value: DISPLAY[cls] }];
  if (cls in FLEX_DIRECTION)
    return [{ prop: "flex-direction", value: FLEX_DIRECTION[cls] }];
  if (cls in FLEX_WRAP) return [{ prop: "flex-wrap", value: FLEX_WRAP[cls] }];
  if (cls in FLEX_SHORTHAND)
    return [{ prop: "flex", value: FLEX_SHORTHAND[cls] }];
  if (cls in ITEMS) return [{ prop: "align-items", value: ITEMS[cls] }];
  if (cls in JUSTIFY) return [{ prop: "justify-content", value: JUSTIFY[cls] }];
  if (cls in JUSTIFY_ITEMS)
    return [{ prop: "justify-items", value: JUSTIFY_ITEMS[cls] }];
  if (cls in SELF) return [{ prop: "align-self", value: SELF[cls] }];
  if (cls in CONTENT) return [{ prop: "align-content", value: CONTENT[cls] }];
  if (cls in PLACE_ITEMS)
    return [{ prop: "place-items", value: PLACE_ITEMS[cls] }];
  if (cls in PLACE_CONTENT)
    return [{ prop: "place-content", value: PLACE_CONTENT[cls] }];
  if (cls in GROW_SHRINK) return GROW_SHRINK[cls];
  if (cls in GRID_FLOW)
    return [{ prop: "grid-auto-flow", value: GRID_FLOW[cls] }];

  // ── Prefix-based dynamic lookup ────────────────────────────────────────────

  // Sort by descending prefix length so `gap-x` is tried before `gap`
  const sorted = [...PREFIX_RESOLVERS].sort(
    (a, b) => b.prefix.length - a.prefix.length,
  );

  for (const { prefix, resolve } of sorted) {
    const p = `${prefix}-`;
    if (!cls.startsWith(p)) continue;

    let suffix = cls.slice(p.length);
    if (negative) suffix = `-${suffix}`;

    const result = resolve(suffix);
    if (result) return result;
  }

  return null;
}
