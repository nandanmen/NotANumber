import { useMemo, useState } from "react";
import { cn } from "~/lib/cn";

type DOMNode = {
  element: HTMLElement;
  tag: string;
  classes: string[];
  isSelected: boolean;
  isOnPath: boolean;
  hasChildren: boolean;
  children: DOMNode[];
};

function buildTree(target: HTMLElement): DOMNode {
  const ancestors = new Set<HTMLElement>();
  let current: HTMLElement | null = target;
  while (current && current !== document.body) {
    ancestors.add(current);
    current = current.parentElement;
  }

  function buildNode(el: HTMLElement): DOMNode {
    const children = Array.from(el.children)
      .filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          !child.hasAttribute("data-prototyper"),
      )
      .map((child) => buildNode(child));

    const classes =
      typeof el.className === "string"
        ? el.className.trim().split(/\s+/).filter(Boolean)
        : [];

    return {
      element: el,
      tag: el.tagName.toLowerCase(),
      classes,
      isSelected: el === target,
      isOnPath: ancestors.has(el),
      hasChildren: children.length > 0,
      children,
    };
  }

  // Find the topmost ancestor
  const path: HTMLElement[] = [];
  current = target;
  while (current && current !== document.body) {
    path.unshift(current);
    current = current.parentElement;
  }

  return path[0]
    ? buildNode(path[0])
    : {
        element: target,
        tag: target.tagName.toLowerCase(),
        classes:
          typeof target.className === "string"
            ? target.className.trim().split(/\s+/).filter(Boolean)
            : [],
        isSelected: true,
        isOnPath: true,
        hasChildren: false,
        children: [],
      };
}

function TreeNode({
  className,
  node,
  depth,
  onHoverElement,
  onSelectElement,
}: {
  className?: string;
  node: DOMNode;
  depth: number;
  onHoverElement: (el: HTMLElement | null) => void;
  onSelectElement: (el: HTMLElement) => void;
}) {
  const [open, setOpen] = useState(node.isOnPath);

  return (
    <div className={className}>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-0.5 font-mono text-xs w-full text-left rounded-sm",
          node.isSelected
            ? "bg-blue-500/10"
            : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        )}
        style={{ paddingLeft: depth * 16 + 8 }}
        onMouseEnter={() => onHoverElement(node.element)}
      >
        {node.hasChildren ? (
          <button
            type="button"
            className="shrink-0 w-3 text-center text-neutral-400 dark:text-neutral-500 select-none rounded-sm hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80"
            aria-expanded={open}
            aria-label={open ? "Collapse" : "Expand"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "▾" : "▸"}
          </button>
        ) : (
          <span className="shrink-0 w-3 text-center text-neutral-400 dark:text-neutral-500 select-none">
            ·
          </span>
        )}
        <button
          type="button"
          className={cn(
            "min-w-0 flex-1 text-left whitespace-nowrap rounded-sm py-0 -my-0.5",
            node.isSelected
              ? "text-blue-600 dark:text-blue-400 font-medium"
              : "text-neutral-900 dark:text-neutral-100",
          )}
          onClick={() => onSelectElement(node.element)}
        >
          {node.tag}
          <span className={cn(!node.isSelected && "text-gray10")}>
            {node.classes.map((cls) => `.${cls}`).join("")}
          </span>
        </button>
      </div>
      {open &&
        node.children.map((child, i) => (
          <TreeNode
            key={i}
            node={child}
            depth={depth + 1}
            onHoverElement={onHoverElement}
            onSelectElement={onSelectElement}
          />
        ))}
    </div>
  );
}

type DOMPanelProps = {
  element: HTMLElement;
  onHoverElement: (el: HTMLElement | null) => void;
  onSelectElement: (el: HTMLElement) => void;
};

export function DOMPanel({
  element,
  onHoverElement,
  onSelectElement,
}: DOMPanelProps) {
  const root = useMemo(() => buildTree(element), [element]);

  return (
    <div
      className="py-2 overflow-y-auto"
      onMouseLeave={() => onHoverElement(null)}
    >
      <TreeNode
        node={root}
        depth={0}
        className="w-max"
        onHoverElement={onHoverElement}
        onSelectElement={onSelectElement}
      />
    </div>
  );
}
