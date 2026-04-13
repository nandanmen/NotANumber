import { type ReactNode, useCallback, useState } from "react";
import { cn } from "~/lib/cn";

// ── Spacing consolidation (padding + margin) ──────────────────────────────────

type SpacingSides = {
  top: string;
  right: string;
  bottom: string;
  left: string;
};

export const PADDING_PROPS = new Set([
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

export const MARGIN_PROPS = new Set([
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

type CSSDeclaration = { prop: string; value: string };

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

const SPACING_SCALE_PX = [
  0, 1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44,
  48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240, 256, 288,
  320, 384,
];

function scaleIndexForPx(pxStr: string): number {
  const px = Number.parseFloat(pxStr);
  if (isNaN(px)) return 0;
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

function parseSpacingInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
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
}: {
  label: string;
  sides: SpacingSides;
  onEdit: (side: EditableSide, value: string) => void;
}) {
  return (
    <li className="border-b border-neutral-200 dark:border-neutral-700 px-3.5 py-2.5 space-y-1.5">
      <div className="flex items-center justify-between gap-2 font-sans">
        <span className="text-xs font-medium capitalize text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
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

// ── Style property constants ────────────────────────────────────────────────

const COLOR_PROPS = new Set([
  "color",
  "background-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
]);

const TRANSPARENT = new Set(["transparent", "rgba(0, 0, 0, 0)", ""]);

// ── StylePanel ──────────────────────────────────────────────────────────────

type StylePanelProps = {
  className?: string;
  styles: Record<string, string>;
  onStyleChange: (prop: string, value: string) => void;
  activeProp: string | null;
  onActivePropChange: (prop: string | null) => void;
};

export function StylePanel({
  className,
  styles,
  onStyleChange,
}: StylePanelProps) {
  const makeEditor =
    (prefix: "padding" | "margin") => (side: EditableSide, value: string) => {
      onStyleChange(`${prefix}-${side}`, value);
    };

  const display = styles.display ?? "";
  const isFlex = display === "flex" || display === "inline-flex";
  const isGrid = display === "grid" || display === "inline-grid";
  const isFlexOrGrid = isFlex || isGrid;

  const displayGroupProps = new Set([
    "display",
    ...(isFlex ? [...FLEX_LAYOUT_PROPS] : []),
    ...(isGrid ? [...GRID_LAYOUT_PROPS] : []),
    ...(isFlexOrGrid ? [...GAP_PROPS] : []),
  ]);

  const displayDecls: CSSDeclaration[] = [...displayGroupProps]
    .map((prop) => ({ prop, value: styles[prop] ?? "" }))
    .filter((d) => d.value);

  const otherRows = Object.entries(styles)
    .filter(
      ([prop]) =>
        !displayGroupProps.has(prop) &&
        !PADDING_PROPS.has(prop) &&
        !MARGIN_PROPS.has(prop),
    )
    .map(([prop, value]) => ({ prop, value }))
    .sort((a, b) => a.prop.localeCompare(b.prop));

  const paddingSides = consolidateSpacing(
    Object.entries(styles)
      .filter(([prop]) => PADDING_PROPS.has(prop))
      .map(([prop, value]) => ({ prop, value })),
    "padding",
  );
  const marginSides = consolidateSpacing(
    Object.entries(styles)
      .filter(([prop]) => MARGIN_PROPS.has(prop))
      .map(([prop, value]) => ({ prop, value })),
    "margin",
  );

  return (
    <ul className={cn("overflow-y-auto grow", className)}>
      <li>
        <div className="sticky top-0 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-2 font-medium text-neutral-500 dark:text-neutral-400">
          Styles
        </div>
        <ul className="ml-0 font-mono">
          {displayDecls.length > 0 && <DisplayBlock decls={displayDecls} />}
          <SpacingBlock
            label="padding"
            sides={paddingSides}
            onEdit={makeEditor("padding")}
          />
          <SpacingBlock
            label="margin"
            sides={marginSides}
            onEdit={makeEditor("margin")}
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
                {COLOR_PROPS.has(prop) && !TRANSPARENT.has(value) && (
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
      </li>
    </ul>
  );
}
