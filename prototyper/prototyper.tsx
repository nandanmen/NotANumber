"use client";

import { useCallback, useEffect, useState } from "react";
import { DOMPanel } from "./dom-panel";
import { ElementHighlighter } from "./element-highlighter";
import { getComponent } from "./get-component";
import { Positioner } from "./positioner";
import { StylePanel } from "./style-panel";
import { resolveClass } from "./tailwindClassMap";
import { Toolbar } from "./toolbar";
import type { InspectedElement } from "./types";

// ── Style property groups shown in the inspector panel ───────────────────────

type StyleGroup = { title: string; props: string[] };

const VISIBLE_PROPS = [
  "display",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
];

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

// ── Helpers ──────────────────────────────────────────────────────────────────

type UtilityDeclaration = { prop: string; value: string };

/** Tailwind (or other) utilities expanded to declarations; later classes win per property. */
function getUtilityDeclarations(el: Element): UtilityDeclaration[] {
  const classes =
    typeof el.className === "string"
      ? el.className.trim().split(/\s+/).filter(Boolean)
      : [];

  const styles: Record<string, string> = {};
  for (const cls of classes) {
    const decls = resolveClass(cls);
    if (!decls || decls.length === 0) continue;
    for (const d of decls) {
      styles[d.prop] = d.value;
    }
  }
  return Object.entries(styles).map(([prop, value]) => ({ prop, value }));
}

/** Merges utility-expanded CSS with `getComputedStyle` for tracked properties (computed wins). */
function getMergedStyles(el: Element): Record<string, string> {
  const styles: Record<string, string> = {};
  for (const { prop, value } of getUtilityDeclarations(el)) {
    styles[prop] = value;
  }
  const computed = getComputedStyle(el);
  for (const group of STYLE_GROUPS) {
    for (const prop of group.props) {
      const value = computed.getPropertyValue(prop).trim();
      if (value) styles[prop] = value;
    }
  }
  return styles;
}

function inspectElement(el: Element): InspectedElement {
  const fromReact =
    el instanceof HTMLElement
      ? getComponent(el)
      : { componentName: "", filePath: "" };
  return {
    componentName: fromReact.componentName,
    filePath: fromReact.filePath,
    styles: getMergedStyles(el),
  };
}

// ── State machine ───────────────────────────────────────────────────────────

type PrototyperPhase =
  | { kind: "start" }
  | { kind: "inspect"; hover: HTMLElement | null }
  | {
      kind: "editing";
      element: HTMLElement;
      /** Merged styles reflecting the element after local edits. */
      styles: Record<string, string>;
      /** Snapshot of merged styles when editing began (before inline edits). */
      initialStyles: Record<string, string>;
      componentName: string;
      activeProp: string | null;
    };

// ── Component ───────────────────────────────────────────────────────────────

export const Prototyper = () => {
  const [phase, setPhase] = useState<PrototyperPhase>({ kind: "start" });
  const [domPanelHover, setDomPanelHover] = useState<HTMLElement | null>(null);

  const isPrototyperEl = useCallback((el: EventTarget | null): boolean => {
    if (!(el instanceof Element)) return false;
    return !!el.closest("[data-prototyper]");
  }, []);

  const enterInspect = useCallback(() => {
    setPhase({ kind: "inspect", hover: null });
    document.body.style.cursor = "crosshair";
  }, []);

  const goToStart = useCallback(() => {
    setPhase({ kind: "start" });
    document.body.style.cursor = "";
  }, []);

  const enterEditing = useCallback((el: HTMLElement) => {
    const { componentName, styles } = inspectElement(el);
    setPhase({
      kind: "editing",
      element: el,
      styles,
      initialStyles: { ...styles },
      componentName,
      activeProp: null,
    });
    document.body.style.cursor = "";
  }, []);

  // Attach / detach document-level listeners for inspect mode
  useEffect(() => {
    if (phase.kind !== "inspect") return;

    const onMouseOver = (e: MouseEvent) => {
      if (isPrototyperEl(e.target)) {
        setPhase((p) => (p.kind === "inspect" ? { ...p, hover: null } : p));
        return;
      }
      if (e.target instanceof HTMLElement) {
        setPhase((p) =>
          p.kind === "inspect" ? { ...p, hover: e.target as HTMLElement } : p,
        );
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (isPrototyperEl(e.relatedTarget)) {
        setPhase((p) => (p.kind === "inspect" ? { ...p, hover: null } : p));
      }
    };

    const onClick = (e: MouseEvent) => {
      if (isPrototyperEl(e.target)) return;
      e.preventDefault();
      e.stopPropagation();

      if (e.target instanceof HTMLElement) {
        enterEditing(e.target);
      }
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("click", onClick, true);
    };
  }, [phase.kind, isPrototyperEl, enterEditing]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "i" || e.key === "I") {
        if (phase.kind === "inspect") {
          goToStart();
        } else {
          enterInspect();
        }
      }

      if (e.key === "Escape") {
        goToStart();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [phase.kind, goToStart, enterInspect]);

  useEffect(() => {
    if (phase.kind !== "editing") setDomPanelHover(null);
  }, [phase.kind]);

  const handleToolbarClick = useCallback(
    (tool: "add" | "inspect") => {
      if (tool === "inspect") {
        if (phase.kind === "inspect") {
          goToStart();
        } else {
          enterInspect();
        }
      }
    },
    [phase.kind, goToStart, enterInspect],
  );

  const handleStyleChange = useCallback((prop: string, value: string) => {
    setPhase((prev) => {
      if (prev.kind !== "editing") return prev;
      prev.element.style.setProperty(prop, value);
      const { componentName, styles } = inspectElement(prev.element);
      return { ...prev, componentName, styles };
    });
  }, []);

  const selectElementFromDomPanel = useCallback((el: HTMLElement) => {
    setDomPanelHover(null);
    enterEditing(el);
  }, [enterEditing]);

  return (
    <>
      <Toolbar
        activeTool={phase.kind === "start" ? null : "inspect"}
        onClick={handleToolbarClick}
      />
      {phase.kind === "inspect" && phase.hover && (
        <ElementHighlighter
          selectedElement={phase.hover}
          activeProp={null}
        />
      )}
      {phase.kind === "editing" && (
        <>
          <ElementHighlighter
            selectedElement={phase.element}
            activeProp={phase.activeProp}
          />
          {domPanelHover && domPanelHover !== phase.element && (
            <ElementHighlighter
              selectedElement={domPanelHover}
              activeProp={null}
              variant="dom-hover"
            />
          )}
        </>
      )}
      {phase.kind === "editing" && (
        <Positioner
          referenceElement={phase.element}
          className="z-[99998] flex flex-col"
        >
          <div className="rounded-xl ring-1 ring-black/15 dark:ring-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl text-sm overflow-y-auto m-4 mb-[88px] grow grid grid-rows-[min-content_1fr_1fr] divide-y divide-neutral-200">
            <div className="px-3.5 py-2 font-mono">
              {phase.componentName ? `<${phase.componentName} />` : "—"}
            </div>
            <StylePanel
              styles={Object.fromEntries(
                Object.entries(phase.styles).filter(([prop]) =>
                  VISIBLE_PROPS.includes(prop),
                ),
              )}
              onStyleChange={handleStyleChange}
              activeProp={phase.activeProp}
              onActivePropChange={(next) =>
                setPhase((p) =>
                  p.kind === "editing" ? { ...p, activeProp: next } : p,
                )
              }
            />
            <DOMPanel
              element={phase.element}
              onHoverElement={setDomPanelHover}
              onSelectElement={selectElementFromDomPanel}
            />
          </div>
        </Positioner>
      )}
    </>
  );
};
