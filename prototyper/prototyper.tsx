"use client";

import { flip, offset, shift, size, useFloating } from "@floating-ui/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "~/lib/cn";
import { type CSSDeclaration, resolveClass } from "./tailwindClassMap";

// ── Spacing consolidation (padding + margin) ──────────────────────────────────

type SpacingSides = {
  top: string;
  right: string;
  bottom: string;
  left: string;
};

const PADDING_PROPS = new Set([
  "padding",
  "padding-block",
  "padding-inline",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "padding-block-start",
  "padding-block-end",
  "padding-inline-start",
  "padding-inline-end",
]);

const MARGIN_PROPS = new Set([
  "margin",
  "margin-block",
  "margin-inline",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "margin-block-start",
  "margin-block-end",
  "margin-inline-start",
  "margin-inline-end",
]);

function consolidateSpacing(
  decls: CSSDeclaration[],
  prefix: "padding" | "margin",
): SpacingSides {
  const sides: SpacingSides = { top: "—", right: "—", bottom: "—", left: "—" };
  const p = prefix;
  for (const { prop, value } of decls) {
    switch (prop) {
      case p:
        sides.top = sides.right = sides.bottom = sides.left = value;
        break;
      case `${p}-block`:
      case `${p}-block-start`:
        sides.top = sides.bottom = value;
        break;
      case `${p}-inline`:
      case `${p}-inline-start`:
        sides.left = sides.right = value;
        break;
      case `${p}-block-end`:
        sides.bottom = value;
        break;
      case `${p}-inline-end`:
        sides.right = value;
        break;
      case `${p}-top`:
        sides.top = value;
        break;
      case `${p}-right`:
        sides.right = value;
        break;
      case `${p}-bottom`:
        sides.bottom = value;
        break;
      case `${p}-left`:
        sides.left = value;
        break;
    }
  }
  return sides;
}

// ── Spacing scale + drag scrub ────────────────────────────────────────────────

// Tailwind spacing scale values in px (--spacing = 4px/unit)
const SPACING_SCALE_PX = [
  0, 1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44,
  48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240, 256, 288,
  320, 384,
];

/** Find the nearest scale index for a px value (e.g. "16px" → index of 16). */
function scaleIndexForPx(pxStr: string): number {
  const px = Number.parseFloat(pxStr);
  if (isNaN(px)) return 0;
  // Find closest
  let best = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  for (let i = 0; i < SPACING_SCALE_PX.length; i++) {
    const dist = Math.abs(SPACING_SCALE_PX[i] - px);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

/**
 * Returns a mousedown handler that, while dragging, steps through
 * SPACING_SCALE_PX and calls `onStep(pxValue)` each time the step changes.
 */
function useDragScrub(currentValue: string, onStep: (px: string) => void) {
  return useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startIndex = scaleIndexForPx(currentValue);
      let lastStep = 0;

      const onMouseMove = (mv: MouseEvent) => {
        const step = Math.round((mv.clientX - startX) / 20);
        if (step === lastStep) return;
        lastStep = step;
        const newIndex = Math.max(
          0,
          Math.min(SPACING_SCALE_PX.length - 1, startIndex + step),
        );
        onStep(`${SPACING_SCALE_PX[newIndex]}px`);
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
      };

      document.body.style.cursor = "ew-resize";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [currentValue, onStep],
  );
}

// ── Editable value ────────────────────────────────────────────────────────────

type EditableSide = "top" | "right" | "bottom" | "left";

/** Parse a user-entered value: bare numbers are treated as px. */
function parseSpacingInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // Bare number → append px
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
  // Already has a unit or is 'auto' etc.
  return trimmed;
}

function EditableValue({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (value: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        const parsed = parseSpacingInput(next);
        if (parsed) onCommit(parsed);
      }}
      className="w-full bg-transparent rounded-md border-0 px-1.5 text-left text-neutral-900 dark:text-neutral-100 outline-none text-xs h-6"
    />
  );
}

function Input({
  icon,
  children,
  onIconDrag,
}: {
  icon: ReactNode;
  children: ReactNode;
  onIconDrag?: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="flex bg-neutral-100 dark:bg-neutral-800 h-6 rounded px-1 focus-within:ring-1 focus-within:ring-blue-500 gap-0.5">
      <span
        className="flex items-center justify-center shrink-0 text-neutral-400"
        style={{ cursor: onIconDrag ? "ew-resize" : undefined }}
        onMouseDown={onIconDrag}
      >
        {icon}
      </span>
      {children}
    </div>
  );
}

function SpacingInput({
  icon,
  value,
  onCommit,
}: {
  icon: ReactNode;
  value: string;
  onCommit: (v: string) => void;
}) {
  const [currentValue, setCurrentValue] = useState(value);

  const handleUpdate = useCallback(
    (nextValue: string) => {
      onCommit(nextValue);
      setCurrentValue(nextValue);
    },
    [onCommit],
  );

  const onIconDrag = useDragScrub(value, handleUpdate);
  return (
    <Input icon={icon} onIconDrag={onIconDrag}>
      <EditableValue value={currentValue} onCommit={handleUpdate} />
    </Input>
  );
}

function SpacingBlock({
  label,
  sides,
  onEdit,
  tailwindClasses,
}: {
  label: string;
  sides: SpacingSides;
  onEdit: (side: EditableSide, value: string) => void;
  tailwindClasses?: string[];
}) {
  return (
    <li className="border-b border-neutral-200 dark:border-neutral-700 px-3.5 py-2.5 space-y-1.5">
      <div className="flex items-center justify-between gap-2 font-sans">
        <span className="text-xs font-medium capitalize text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
        {tailwindClasses && tailwindClasses.length > 0 && (
          <span className="flex flex-wrap justify-end gap-1">
            {tailwindClasses.map((cls) => (
              <span
                key={cls}
                className="rounded font-mono text-[10px] text-neutral-500 dark:text-neutral-400"
              >
                {cls}
              </span>
            ))}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-1.5">
        <SpacingInput
          value={sides.left}
          onCommit={(v) => onEdit("left", v)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.16143 3H16.8385C17.3657 2.99998 17.8205 2.99997 18.195 3.03057C18.5904 3.06287 18.9836 3.13419 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C20.8658 5.01641 20.9371 5.40963 20.9694 5.80497C21 6.17954 21 6.6343 21 7.16144V16.8386C21 17.3657 21 17.8205 20.9694 18.195C20.9371 18.5904 20.8658 18.9836 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.9836 20.8658 18.5904 20.9371 18.195 20.9694C17.8205 21 17.3657 21 16.8386 21H7.16144C6.6343 21 6.17954 21 5.80497 20.9694C5.40963 20.9371 5.01641 20.8658 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3.13419 18.9836 3.06287 18.5904 3.03057 18.195C2.99997 17.8205 2.99998 17.3657 3 16.8386V7.16145C2.99998 6.63432 2.99997 6.17954 3.03057 5.80497C3.06287 5.40963 3.13419 5.01641 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.01641 3.13419 5.40963 3.06287 5.80497 3.03057C6.17954 2.99997 6.63429 2.99998 7.16143 3ZM9 8C9 7.44772 8.55229 7 8 7C7.44772 7 7 7.44772 7 8L7 16C7 16.5523 7.44772 17 8 17C8.55229 17 9 16.5523 9 16L9 8Z"
                fill="currentColor"
              />
            </svg>
          }
        />
        <SpacingInput
          value={sides.top}
          onCommit={(v) => onEdit("top", v)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.16143 3H16.8385C17.3657 2.99998 17.8205 2.99997 18.195 3.03057C18.5904 3.06287 18.9836 3.13419 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C20.8658 5.01641 20.9371 5.40963 20.9694 5.80497C21 6.17954 21 6.6343 21 7.16144V16.8386C21 17.3657 21 17.8205 20.9694 18.195C20.9371 18.5904 20.8658 18.9836 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.9836 20.8658 18.5904 20.9371 18.195 20.9694C17.8205 21 17.3657 21 16.8386 21H7.16144C6.6343 21 6.17954 21 5.80497 20.9694C5.40963 20.9371 5.01641 20.8658 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3.13419 18.9836 3.06287 18.5904 3.03057 18.195C2.99997 17.8205 2.99998 17.3657 3 16.8386V7.16145C2.99998 6.63432 2.99997 6.17954 3.03057 5.80497C3.06287 5.40963 3.13419 5.01641 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.01641 3.13419 5.40963 3.06287 5.80497 3.03057C6.17954 2.99997 6.63429 2.99998 7.16143 3ZM8 7C7.44772 7 7 7.44772 7 8C7 8.55229 7.44772 9 8 9H16C16.5523 9 17 8.55229 17 8C17 7.44772 16.5523 7 16 7H8Z"
                fill="currentColor"
              />
            </svg>
          }
        />
        <SpacingInput
          value={sides.right}
          onCommit={(v) => onEdit("right", v)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.16143 3H16.8385C17.3657 2.99998 17.8205 2.99997 18.195 3.03057C18.5904 3.06287 18.9836 3.13419 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C20.8658 5.01641 20.9371 5.40963 20.9694 5.80497C21 6.17954 21 6.6343 21 7.16144V16.8386C21 17.3657 21 17.8205 20.9694 18.195C20.9371 18.5904 20.8658 18.9836 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.9836 20.8658 18.5904 20.9371 18.195 20.9694C17.8205 21 17.3657 21 16.8386 21H7.16144C6.6343 21 6.17954 21 5.80497 20.9694C5.40963 20.9371 5.01641 20.8658 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3.13419 18.9836 3.06287 18.5904 3.03057 18.195C2.99997 17.8205 2.99998 17.3657 3 16.8386V7.16145C2.99998 6.63432 2.99997 6.17954 3.03057 5.80497C3.06287 5.40963 3.13419 5.01641 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.01641 3.13419 5.40963 3.06287 5.80497 3.03057C6.17954 2.99997 6.63429 2.99998 7.16143 3ZM15 16C15 16.5523 15.4477 17 16 17C16.5523 17 17 16.5523 17 16V8C17 7.44772 16.5523 7 16 7C15.4477 7 15 7.44772 15 8V16Z"
                fill="currentColor"
              />
            </svg>
          }
        />
        <SpacingInput
          value={sides.bottom}
          onCommit={(v) => onEdit("bottom", v)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.16143 3H16.8385C17.3657 2.99998 17.8205 2.99997 18.195 3.03057C18.5904 3.06287 18.9836 3.13419 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C20.8658 5.01641 20.9371 5.40963 20.9694 5.80497C21 6.17954 21 6.6343 21 7.16144V16.8386C21 17.3657 21 17.8205 20.9694 18.195C20.9371 18.5904 20.8658 18.9836 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.9836 20.8658 18.5904 20.9371 18.195 20.9694C17.8205 21 17.3657 21 16.8386 21H7.16144C6.6343 21 6.17954 21 5.80497 20.9694C5.40963 20.9371 5.01641 20.8658 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3.13419 18.9836 3.06287 18.5904 3.03057 18.195C2.99997 17.8205 2.99998 17.3657 3 16.8386V7.16145C2.99998 6.63432 2.99997 6.17954 3.03057 5.80497C3.06287 5.40963 3.13419 5.01641 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.01641 3.13419 5.40963 3.06287 5.80497 3.03057C6.17954 2.99997 6.63429 2.99998 7.16143 3ZM8 15C7.44772 15 7 15.4477 7 16C7 16.5523 7.44772 17 8 17H16C16.5523 17 17 16.5523 17 16C17 15.4477 16.5523 15 16 15H8Z"
                fill="currentColor"
              />
            </svg>
          }
        />
      </div>
    </li>
  );
}

// ── Display consolidation ─────────────────────────────────────────────────────

const FLEX_LAYOUT_PROPS = new Set(["align-items", "justify-content"]);
const GRID_LAYOUT_PROPS = new Set([
  "grid-template-columns",
  "grid-template-rows",
]);
const GAP_PROPS = new Set(["gap", "column-gap", "row-gap"]);

function DisplayBlock({ decls }: { decls: CSSDeclaration[] }) {
  const displayDecl = decls.find((d) => d.prop === "display");
  const display = displayDecl?.value ?? "—";
  const isFlex = display === "flex" || display === "inline-flex";
  const isGrid = display === "grid" || display === "inline-grid";

  const get = (prop: string) =>
    decls.find((d) => d.prop === prop)?.value ?? "—";

  const gapX = get("column-gap") !== "—" ? get("column-gap") : get("gap");
  const gapY = get("row-gap") !== "—" ? get("row-gap") : get("gap");

  const lbl =
    "text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400";

  return (
    <li className="border-b border-neutral-200 dark:border-neutral-700 px-3.5 py-2 font-mono text-[11px]">
      <div className={cn(lbl, "mb-1.5")}>display</div>
      <div className="mb-1.5 text-neutral-900 dark:text-neutral-100">
        {display}
      </div>

      {(isFlex || isGrid) && (
        <div className="flex flex-col gap-1 mt-2">
          {isFlex && (
            <>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">
                  align-items
                </span>
                <span>{get("align-items")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">
                  justify-content
                </span>
                <span>{get("justify-content")}</span>
              </div>
            </>
          )}
          {isGrid && (
            <>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">
                  grid-template-columns
                </span>
                <span className="break-all text-right ml-2">
                  {get("grid-template-columns")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">
                  grid-template-rows
                </span>
                <span className="break-all text-right ml-2">
                  {get("grid-template-rows")}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">gap</span>
            <span>{gapX === gapY ? gapX : `${gapX} / ${gapY}`}</span>
          </div>
        </div>
      )}
    </li>
  );
}

type Rect = { top: number; left: number; width: number; height: number };

// ── Style property groups shown in the inspector panel ───────────────────────

type StyleGroup = { title: string; props: string[] };

const STYLE_GROUPS: StyleGroup[] = [
  {
    title: "Typography",
    props: [
      "font-family",
      "font-size",
      "font-weight",
      "font-style",
      "line-height",
      "letter-spacing",
      "text-align",
      "text-decoration",
      "text-transform",
      "color",
    ],
  },
  {
    title: "Spacing",
    props: [
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
    ],
  },
  {
    title: "Sizing",
    props: [
      "width",
      "height",
      "min-width",
      "min-height",
      "max-width",
      "max-height",
    ],
  },
  {
    title: "Background",
    props: [
      "background-color",
      "background-image",
      "background-size",
      "background-position",
    ],
  },
  {
    title: "Border",
    props: [
      "border-top-width",
      "border-right-width",
      "border-bottom-width",
      "border-left-width",
      "border-top-color",
      "border-right-color",
      "border-bottom-color",
      "border-left-color",
      "border-style",
      "border-radius",
      "border-top-left-radius",
      "border-top-right-radius",
      "border-bottom-right-radius",
      "border-bottom-left-radius",
    ],
  },
  {
    title: "Layout",
    props: [
      "display",
      "position",
      "top",
      "right",
      "bottom",
      "left",
      "flex-direction",
      "flex-wrap",
      "align-items",
      "justify-content",
      "align-self",
      "flex-grow",
      "flex-shrink",
      "flex-basis",
      "gap",
      "grid-template-columns",
      "grid-template-rows",
      "overflow",
      "overflow-x",
      "overflow-y",
      "z-index",
      "opacity",
      "box-shadow",
      "cursor",
      "pointer-events",
    ],
  },
];

const COLOR_PROPS = new Set([
  "color",
  "background-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
]);

const TRANSPARENT = new Set(["transparent", "rgba(0, 0, 0, 0)", ""]);

// ── Types ────────────────────────────────────────────────────────────────────

type StyleRow = { prop: string; value: string };

type InspectedElement = {
  tailwindStyles: Array<{ className: string; rows: StyleRow[] }>;
  computedStyles: Array<{ group: string; rows: StyleRow[] }>;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTailwindStyles(el: Element): InspectedElement["tailwindStyles"] {
  const classes =
    typeof el.className === "string"
      ? el.className.trim().split(/\s+/).filter(Boolean)
      : [];

  return classes
    .map((cls) => {
      const decls = resolveClass(cls);
      if (!decls || decls.length === 0) return null;
      return {
        className: cls,
        rows: decls.map((d) => ({ prop: d.prop, value: d.value })),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

function getComputedStyles(el: Element): InspectedElement["computedStyles"] {
  const computed = getComputedStyle(el);
  return STYLE_GROUPS.map((group) => ({
    group: group.title,
    rows: group.props
      .map((prop) => ({ prop, value: computed.getPropertyValue(prop).trim() }))
      .filter((r) => r.value),
  })).filter((g) => g.rows.length > 0);
}

function inspectElement(el: Element): InspectedElement {
  return {
    tailwindStyles: getTailwindStyles(el),
    computedStyles: getComputedStyles(el),
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export const Prototyper = () => {
  const [inspectMode, setInspectMode] = useState(false);
  const [inspected, setInspected] = useState<InspectedElement | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hoverRect, setHoverRect] = useState<Rect | null>(null);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);

  const toolbarRef = useRef<HTMLDivElement>(null);
  // Holds the actual DOM element being inspected so we can write back styles
  const inspectedElRef = useRef<HTMLElement | null>(null);

  // Floating UI — virtual element anchored to the hoverRect
  const { refs, floatingStyles, update } = useFloating({
    placement: "left",
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableHeight, availableWidth }) {
          setMaxHeight(availableHeight);
          setMaxWidth(availableWidth);
        },
      }),
    ],
  });

  // Keep the virtual reference in sync with hoverRect
  useEffect(() => {
    if (!hoverRect) return;
    refs.setReference({
      getBoundingClientRect: () => ({
        ...hoverRect,
        x: hoverRect.left,
        y: hoverRect.top,
        right: hoverRect.left + hoverRect.width,
        bottom: hoverRect.top + hoverRect.height,
        toJSON: () => ({}),
      }),
    });
    update();
  }, [hoverRect, refs, update]);

  const isPrototyperEl = useCallback(
    (el: EventTarget | null): boolean => {
      if (!(el instanceof Element)) return false;
      return (
        (toolbarRef.current?.contains(el) ?? false) ||
        (refs.floating.current?.contains(el) ?? false)
      );
    },
    [refs.floating],
  );

  const exitInspectMode = useCallback(() => {
    setInspectMode(false);
    document.body.style.cursor = "";
  }, []);

  // Attach / detach document-level listeners based on inspect mode
  useEffect(() => {
    if (!inspectMode) return;

    document.body.style.cursor = "crosshair";

    const onMouseOver = (e: MouseEvent) => {
      if (isPrototyperEl(e.target)) {
        setHoverRect(null);
        return;
      }
      if (e.target instanceof Element) {
        const r = e.target.getBoundingClientRect();
        setHoverRect({
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (isPrototyperEl(e.relatedTarget)) {
        setHoverRect(null);
      }
    };

    const onClick = (e: MouseEvent) => {
      if (isPrototyperEl(e.target)) return;
      e.preventDefault();
      e.stopPropagation();

      if (e.target instanceof HTMLElement) {
        inspectedElRef.current = e.target;
        setInspected(inspectElement(e.target));
        setPanelOpen(true);
      }

      exitInspectMode();
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("click", onClick, true);
      document.body.style.cursor = "";
    };
  }, [inspectMode, isPrototyperEl, exitInspectMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "i" || e.key === "I") {
        setInspectMode((prev) => {
          if (prev) {
            document.body.style.cursor = "";
          } else {
            setPanelOpen(false);
          }
          return !prev;
        });
      }

      if (e.key === "Escape") {
        exitInspectMode();
        setPanelOpen(false);
        setHoverRect(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [exitInspectMode]);

  return (
    <>
      {/* Hover/selection highlight overlay — portaled to document.body, persists after click */}
      {hoverRect &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: hoverRect.top,
              left: hoverRect.left,
              width: hoverRect.width,
              height: hoverRect.height,
              outline: "2px solid rgb(37 99 235)",
              pointerEvents: "none",
              zIndex: 99997,
            }}
          />,
          document.body,
        )}

      {/* Inspector panel */}
      {panelOpen && inspected && (
        <div
          ref={refs.setFloating}
          className="z-[99998] overflow-hidden flex flex-col rounded-xl ring-1 ring-black/15 dark:ring-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl text-sm"
          style={{
            ...floatingStyles,
            width: 320,
            maxWidth: maxWidth,
            maxHeight: Math.min(maxHeight ?? 480, 480),
          }}
        >
          <ul className="overflow-y-auto grow ml-0">
            {/* Tailwind classes — grouped under a single "Tailwind" header */}
            <li>
              <div className="sticky top-0 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-2 font-medium text-neutral-500 dark:text-neutral-400">
                Tailwind
              </div>
              <ul className="ml-0 font-mono">
                {(() => {
                  const allRows = inspected.tailwindStyles.flatMap(
                    ({ rows }) => rows,
                  );

                  const displayDecl = allRows.find((r) => r.prop === "display");
                  const display = displayDecl?.value ?? "";
                  const isFlex =
                    display === "flex" || display === "inline-flex";
                  const isGrid =
                    display === "grid" || display === "inline-grid";
                  const isFlexOrGrid = isFlex || isGrid;

                  const displayGroupProps = new Set([
                    "display",
                    ...(isFlex ? [...FLEX_LAYOUT_PROPS] : []),
                    ...(isGrid ? [...GRID_LAYOUT_PROPS] : []),
                    ...(isFlexOrGrid ? [...GAP_PROPS] : []),
                  ]);
                  const displayDecls = allRows.filter((r) =>
                    displayGroupProps.has(r.prop),
                  );
                  const otherRows = allRows.filter(
                    (r) =>
                      !displayGroupProps.has(r.prop) &&
                      !PADDING_PROPS.has(r.prop) &&
                      !MARGIN_PROPS.has(r.prop),
                  );

                  // Spacing always comes from computed styles
                  const computedSpacing =
                    inspected.computedStyles.find((g) => g.group === "Spacing")
                      ?.rows ?? [];
                  const paddingSides = consolidateSpacing(
                    computedSpacing.filter((r) => PADDING_PROPS.has(r.prop)),
                    "padding",
                  );
                  const marginSides = consolidateSpacing(
                    computedSpacing.filter((r) => MARGIN_PROPS.has(r.prop)),
                    "margin",
                  );

                  // Tailwind class names that contribute padding/margin props
                  const paddingClasses = inspected.tailwindStyles
                    .filter(({ rows }) =>
                      rows.some((r) => PADDING_PROPS.has(r.prop)),
                    )
                    .map(({ className }) => className);
                  const marginClasses = inspected.tailwindStyles
                    .filter(({ rows }) =>
                      rows.some((r) => MARGIN_PROPS.has(r.prop)),
                    )
                    .map(({ className }) => className);

                  const makeEditor =
                    (prefix: "padding" | "margin") =>
                    (side: EditableSide, value: string) => {
                      const el = inspectedElRef.current;
                      if (!el) return;
                      el.style.setProperty(`${prefix}-${side}`, value);
                      setInspected(inspectElement(el));
                    };

                  return (
                    <>
                      {displayDecls.length > 0 && (
                        <DisplayBlock decls={displayDecls} />
                      )}
                      <SpacingBlock
                        label="padding"
                        sides={paddingSides}
                        onEdit={makeEditor("padding")}
                        tailwindClasses={paddingClasses}
                      />
                      <SpacingBlock
                        label="margin"
                        sides={marginSides}
                        onEdit={makeEditor("margin")}
                        tailwindClasses={marginClasses}
                      />
                      {otherRows.map(({ prop, value }) => (
                        <li
                          key={prop}
                          className="flex flex-wrap border-b border-neutral-200 dark:border-neutral-700 px-3.5 py-2"
                        >
                          <span className="text-neutral-500 dark:text-neutral-400 flex-grow min-w-1/2">
                            {prop}
                          </span>
                          <span className="flex min-w-1/2 shrink-0 items-center justify-end gap-1 break-all">
                            {COLOR_PROPS.has(prop) &&
                              !TRANSPARENT.has(value) && (
                                <span
                                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm border border-neutral-200 dark:border-neutral-700"
                                  style={{ background: value }}
                                />
                              )}
                            {value}
                          </span>
                        </li>
                      ))}
                    </>
                  );
                })()}
              </ul>
            </li>

            {/* Computed styles — collapsible */}
            {inspected.computedStyles.length > 0 && (
              <li>
                <details>
                  <summary className="sticky top-0 cursor-pointer border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-2 font-medium text-neutral-500 dark:text-neutral-400 list-none flex items-center justify-between">
                    Computed
                    <span className="normal-case font-normal tracking-normal text-neutral-500 dark:text-neutral-400">
                      {inspected.computedStyles.reduce(
                        (n, g) =>
                          n +
                          g.rows.filter(
                            (r) =>
                              !PADDING_PROPS.has(r.prop) &&
                              !MARGIN_PROPS.has(r.prop),
                          ).length,
                        0,
                      )}{" "}
                      properties
                    </span>
                  </summary>
                  {inspected.computedStyles.map(({ group, rows }) => {
                    const filteredRows = rows.filter(
                      (r) =>
                        !PADDING_PROPS.has(r.prop) && !MARGIN_PROPS.has(r.prop),
                    );
                    if (filteredRows.length === 0) return null;
                    return (
                      <div key={group}>
                        <div className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-2 font-medium text-neutral-500 dark:text-neutral-400">
                          {group}
                        </div>
                        <ul className="ml-0 font-mono">
                          {filteredRows.map(({ prop, value }) => (
                            <li
                              key={prop}
                              className="grid border-b border-neutral-200 dark:border-neutral-700 px-3.5 py-2"
                              style={{ gridTemplateColumns: "1fr 1fr" }}
                            >
                              <span className="text-neutral-500 dark:text-neutral-400">
                                {prop}
                              </span>
                              <span className="flex items-center justify-end gap-1 break-all text-right">
                                {COLOR_PROPS.has(prop) &&
                                  !TRANSPARENT.has(value) && (
                                    <span
                                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm border border-neutral-200 dark:border-neutral-700"
                                      style={{ background: value }}
                                    />
                                  )}
                                {value}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </details>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Toolbar */}
      <div
        ref={toolbarRef}
        className="fixed bottom-6 right-6 z-[99999] flex select-none items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 px-3 py-2 shadow-2xl"
      >
        <button
          type="button"
          onClick={() =>
            setInspectMode((prev) => {
              if (!prev) setPanelOpen(false);
              else document.body.style.cursor = "";
              return !prev;
            })
          }
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
            inspectMode
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-neutral-200 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800",
          )}
          title="Toggle inspect mode (I)"
        >
          Inspect
        </button>
      </div>
    </>
  );
};
