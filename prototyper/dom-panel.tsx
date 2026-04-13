import { useMemo, useState } from "react";
import { cn } from "~/lib/cn";

type DOMNode = {
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

function TreeNode({ node, depth }: { node: DOMNode; depth: number }) {
  const [open, setOpen] = useState(node.isOnPath);

  return (
    <div>
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 px-2 py-0.5 font-mono text-xs w-full text-left",
          node.isSelected
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
            : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800",
        )}
        style={{ paddingLeft: depth * 16 + 8 }}
        onClick={() => node.hasChildren && setOpen((o) => !o)}
      >
        <span className="text-neutral-400 dark:text-neutral-500 select-none w-3 text-center">
          {node.hasChildren ? (open ? "▾" : "▸") : "·"}
        </span>
        <span className="truncate">
          {node.tag}
          <span className={cn(!open && "text-gray10")}>
            {node.classes.map((cls) => `.${cls}`).join("")}
          </span>
        </span>
      </button>
      {open &&
        node.children.map((child, i) => (
          <TreeNode key={i} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

type DOMPanelProps = {
  element: HTMLElement;
};

export function DOMPanel({ element }: DOMPanelProps) {
  const root = useMemo(() => buildTree(element), [element]);

  return (
    <div className="py-2 overflow-y-auto">
      <TreeNode node={root} depth={0} />
    </div>
  );
}
