"use client";

import { useAtomValue } from "jotai";
import {
  type CSSProperties,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type TreeAnimationState,
  type Tree as TreeType,
  stateAtom,
  treeAtom,
} from "./controls";
import { cn } from "~/lib/cn";
import { motion } from "motion/react";

const NODE_WIDTH = 56;
const SVG_HEIGHT = 64;

type TreeWithIndex = Omit<TreeType, "parent"> & {
  index?: number;
  parent: TreeWithIndex | null;
};

export function BalancedTree() {
  const tree = useAtomValue(treeAtom);
  const animationState = useAtomValue(stateAtom);
  return <BalancedTreeInner tree={tree} animationState={animationState} />;
}

function BalancedTreeInner({
  tree,
  animationState,
}: {
  tree: TreeType;
  animationState: TreeAnimationState;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [nodePositions, setNodePositions] = useState<Record<number, number>>(
    {},
  );

  const update = useCallback(() => {
    if (!wrapperRef.current) return;
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
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setTimeout(update, 1);
  }, [tree, update]);

  const levels = useMemo(() => {
    if (!tree) return [];
    const levels: { node: TreeWithIndex; index: number }[][] = [];
    const queue: TreeWithIndex[] = [tree];

    const indices = {};

    while (queue.length > 0) {
      const level = [];
      const queueSize = queue.length;
      for (let i = 0; i < queueSize; i++) {
        const node = queue.shift();
        if (node) {
          const parentIndex = indices[node.parent?.key];
          const parentStartingIndex = parentIndex ? 2 * parentIndex : 0;
          const index = node.parent
            ? node.key === node.parent.left?.key
              ? parentStartingIndex
              : parentStartingIndex + 1
            : 0;
          indices[node.key] = index;
          level.push({ node, index });
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

  const currentState =
    animationState.type !== "idle" &&
    animationState.snapshots[animationState.index];
  return (
    <div ref={wrapperRef}>
      {levels.map((level, i) => {
        const levelBefore = levels[i - 1];
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Fragment key={i}>
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
                {level.map(({ node }) => {
                  const nodePosition = nodePositions[node.key];
                  if (!nodePosition) return null;
                  const parentPosition = node.parent
                    ? nodePositions[node.parent.key]
                    : wrapperWidth / 2;
                  const startX = parentPosition + NODE_WIDTH / 2;
                  const endX = nodePosition + NODE_WIDTH / 2;
                  return (
                    <motion.path
                      key={node.key}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3 }}
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
              className="grid grid-cols-[repeat(var(--level-width),_minmax(0,_1fr))] justify-items-center font-mono"
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              style={
                {
                  "--level-width": 2 ** i,
                } as CSSProperties
              }
            >
              {level.map(({ node, index }) => {
                const isCurrent = currentState?.current === node.key;
                return (
                  <motion.div
                    data-tree-node={node.key}
                    key={node.key}
                    style={
                      {
                        width: NODE_WIDTH,
                        "--index": index + 1,
                      } as CSSProperties
                    }
                    className="aspect-square col-start-[--index] relative z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "rounded-xl h-full bg-gray3 ring-1 ring-neutral-950/15 shadow flex items-center justify-center font-medium text-lg transition-colors relative z-10",
                        isCurrent && "bg-black text-white",
                      )}
                    >
                      {node.key}
                    </motion.div>
                    <motion.p
                      animate={{
                        y: isCurrent ? 0 : -48,
                        scale: isCurrent ? 1 : 0.8,
                      }}
                      initial={{ y: -48, scale: 0.8 }}
                      className="text-white bg-blue9 absolute text-sm w-7 h-7 flex items-center justify-center ring-1 ring-blue10 shadow rounded left-[calc(50%-14px)] -bottom-9"
                    >
                      {currentState?.key}
                    </motion.p>
                  </motion.div>
                );
              })}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
