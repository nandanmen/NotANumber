"use client";

import { flip, offset, shift, size, useFloating } from "@floating-ui/react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { ElementHighlighter } from "./element-highlighter";
import { getComponent } from "./get-component";
import { StylePanel } from "./style-panel";
import { resolveClass } from "./tailwindClassMap";
import { Toolbar } from "./toolbar";
import type { InspectedElement } from "./types";

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
  const fromReact =
    el instanceof HTMLElement
      ? getComponent(el)
      : { componentName: "", filePath: "" };
  return {
    componentName: fromReact.componentName,
    filePath: fromReact.filePath,
    tailwindStyles: getTailwindStyles(el),
    computedStyles: getComputedStyles(el),
  };
}

// ── State machine ───────────────────────────────────────────────────────────

type Mode = "start" | "inspect" | "editing";

// ── Positioner (floating UI anchor for panels) ──────────────────────────────

type PositionerProps = {
  referenceElement: HTMLElement;
  children: ReactNode;
};

function Positioner({ referenceElement, children }: PositionerProps) {
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);

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

  useEffect(() => {
    refs.setReference({
      getBoundingClientRect: () => referenceElement.getBoundingClientRect(),
    });
    update();
  }, [referenceElement, refs, update]);

  return (
    <div
      ref={refs.setFloating}
      data-prototyper
      className="z-[99998] overflow-hidden flex flex-col rounded-xl ring-1 ring-black/15 dark:ring-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl text-sm"
      style={{
        ...floatingStyles,
        width: 320,
        maxWidth: maxWidth,
        maxHeight: Math.min(maxHeight ?? 480, 480),
      }}
    >
      {children}
    </div>
  );
}

// ── Component ───────────────────────────────────────────────────────────────

export const Prototyper = () => {
  const [mode, setMode] = useState<Mode>("start");
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null,
  );
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null,
  );
  const [inspected, setInspected] = useState<InspectedElement | null>(null);
  const [activeProp, setActiveProp] = useState<string | null>(null);

  const isPrototyperEl = useCallback((el: EventTarget | null): boolean => {
    if (!(el instanceof Element)) return false;
    return !!el.closest("[data-prototyper]");
  }, []);

  const enterInspect = useCallback(() => {
    setMode("inspect");
    setHoveredElement(null);
    setSelectedElement(null);
    setInspected(null);
    setActiveProp(null);
    document.body.style.cursor = "crosshair";
  }, []);

  const goToStart = useCallback(() => {
    setMode("start");
    setHoveredElement(null);
    setSelectedElement(null);
    setInspected(null);
    setActiveProp(null);
    document.body.style.cursor = "";
  }, []);

  const enterEditing = useCallback((el: HTMLElement) => {
    setMode("editing");
    setSelectedElement(el);
    setInspected(inspectElement(el));
    setActiveProp(null);
    document.body.style.cursor = "";
  }, []);

  // Attach / detach document-level listeners for inspect mode
  useEffect(() => {
    if (mode !== "inspect") return;

    const onMouseOver = (e: MouseEvent) => {
      if (isPrototyperEl(e.target)) {
        setHoveredElement(null);
        return;
      }
      if (e.target instanceof HTMLElement) {
        setHoveredElement(e.target);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (isPrototyperEl(e.relatedTarget)) {
        setHoveredElement(null);
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
  }, [mode, isPrototyperEl, enterEditing]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "i" || e.key === "I") {
        if (mode === "inspect") {
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
  }, [mode, goToStart, enterInspect]);

  const handleToolbarClick = useCallback(
    (tool: "add" | "inspect") => {
      if (tool === "inspect") {
        if (mode === "inspect") {
          goToStart();
        } else {
          enterInspect();
        }
      }
    },
    [mode, goToStart, enterInspect],
  );

  const handleStyleChange = useCallback(
    (prop: string, value: string) => {
      if (!selectedElement) return;
      selectedElement.style.setProperty(prop, value);
      setInspected(inspectElement(selectedElement));
    },
    [selectedElement],
  );

  // Determine which element to highlight
  const highlightedElement =
    mode === "inspect"
      ? hoveredElement
      : mode === "editing"
        ? selectedElement
        : null;

  return (
    <>
      <Toolbar
        activeTool={mode === "start" ? null : "inspect"}
        onClick={handleToolbarClick}
      />
      {highlightedElement && (
        <ElementHighlighter
          selectedElement={highlightedElement}
          activeProp={activeProp}
        />
      )}
      {mode === "editing" && inspected && selectedElement && (
        <Positioner referenceElement={selectedElement}>
          <StylePanel
            inspected={inspected}
            onStyleChange={handleStyleChange}
            activeProp={activeProp}
            onActivePropChange={setActiveProp}
          />
        </Positioner>
      )}
    </>
  );
};
