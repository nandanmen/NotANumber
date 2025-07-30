"use client";

import { useMemo } from "react";
import { exec } from "~/lib/algorithm";

type Tree = {
  key: number;
  left: Tree | null;
  right: Tree | null;
};

export function BalancedTreeClient({ program }: { program: string }) {
  const addToTree = useMemo(() => eval(program).entryPoint, [program]);
  const snapshots = exec(addToTree, [
    {
      key: 4,
      left: {
        key: 1,
        left: null,
        right: null,
      },
      right: {
        key: 7,
        left: null,
        right: null,
      },
    },
    3,
  ]);
  return (
    <Tree
      tree={{
        key: 4,
        left: {
          key: 1,
          left: null,
          right: null,
        },
        right: {
          key: 7,
          left: null,
          right: null,
        },
      }}
    />
  );
}

function Tree({ tree }: { tree: Tree }) {
  if (!tree) return null;

  const levels = useMemo(() => {
    const levels: Tree[][] = [];
    const queue: Tree[] = [tree];
    while (queue.length > 0) {
      const level = [];
      const queueSize = queue.length;
      for (let i = 0; i < queueSize; i++) {
        const node = queue.shift();
        if (node) {
          level.push(node);
          queue.push(node.left, node.right);
        }
      }
      levels.push(level);
    }
    return levels;
  }, [tree]);

  return (
    <div>
      {levels.map((level, i) => (
        <div className="flex" key={i}>
          {level.map((node) => (
            <div key={node.key}>{node.key}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
