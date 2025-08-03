"use client";

import { useAtomValue } from "jotai";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type Tree as TreeType, treeAtom } from "./controls";

export function BalancedTree() {
  const bst = useAtomValue(treeAtom);
  return <Tree tree={bst.tree} />;
}

const NODE_WIDTH = 56;
const SVG_HEIGHT = 64;

type TreeWithIndex = Omit<TreeType, "parent"> & {
  index?: number;
  parent: TreeWithIndex | null;
};

function Tree({ tree }: { tree: TreeType }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [nodePositions, setNodePositions] = useState<Record<number, number>>(
    {},
  );

  useEffect(() => {
    if (!wrapperRef.current) return;
    const update = () => {
      const wrapperBox = wrapperRef.current.getBoundingClientRect();
      setWrapperWidth(wrapperBox.width);
      const nodes =
        wrapperRef.current.querySelectorAll<HTMLDivElement>("[data-tree-node]");
      const positions = {};
      for (const node of nodes) {
        const nodeBox = node.getBoundingClientRect();
        positions[node.dataset.treeNode] = nodeBox.x - wrapperBox.x;
      }
      setNodePositions(positions);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const levels = useMemo(() => {
    if (!tree) return [];
    const levels: TreeWithIndex[][] = [];
    const queue: TreeWithIndex[] = [tree];
    while (queue.length > 0) {
      const level = [];
      const queueSize = queue.length;
      for (let i = 0; i < queueSize; i++) {
        const node = queue.shift();
        if (node) {
          const parentStartingIndex = node.parent?.index
            ? 2 * node.parent.index
            : 0;
          node.index = node.parent
            ? node === node.parent.left
              ? parentStartingIndex
              : parentStartingIndex + 1
            : 0;
          level.push(node);
          queue.push(node.left, node.right);
        }
      }
      if (level.length > 0) {
        levels.push(level);
      }
    }
    return levels;
  }, [tree]);

  if (!tree) return null;

  return (
    <div ref={wrapperRef}>
      {levels.map((level, i) => {
        const levelBefore = levels[i - 1];
        return (
          <>
            {levelBefore && nodePositions && (
              <svg
                width="100%"
                height={SVG_HEIGHT + NODE_WIDTH}
                style={{
                  marginTop: -NODE_WIDTH / 2,
                  marginBottom: -NODE_WIDTH / 2,
                }}
                aria-hidden="true"
                className="text-gray8"
              >
                {level.map((node) => {
                  const nodePosition = nodePositions[node.key];
                  const parentPosition = node.parent
                    ? nodePositions[node.parent.key]
                    : wrapperWidth / 2;
                  const startX = parentPosition + NODE_WIDTH / 2;
                  const endX = nodePosition + NODE_WIDTH / 2;
                  return (
                    <path
                      key={node.key}
                      /* d={`M${startX} 0 V${SVG_HEIGHT / 2} H${endX} V${SVG_HEIGHT}`} */
                      d={`M${startX} 0 L${endX} ${SVG_HEIGHT + NODE_WIDTH}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            )}
            <div
              className="grid grid-cols-[repeat(var(--level-width),_minmax(0,_1fr))] justify-items-center"
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              style={
                {
                  "--level-width": 2 ** i,
                } as CSSProperties
              }
            >
              {level.map((node) => {
                return (
                  <>
                    <div
                      data-tree-node={node.key}
                      className="aspect-square rounded-xl bg-gray3 ring-1 ring-neutral-950/15 shadow flex items-center justify-center font-medium text-lg col-start-[--index] relative z-10"
                      key={node.key}
                      style={
                        {
                          width: NODE_WIDTH,
                          "--index": node.index + 1,
                        } as CSSProperties
                      }
                    >
                      {node.key}
                    </div>
                  </>
                );
              })}
            </div>
          </>
        );
      })}
    </div>
  );
}
