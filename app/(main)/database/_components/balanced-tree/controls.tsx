"use client";

import { atom, useAtom } from "jotai";
import { ResetButton, ToggleButton } from "../toggle-button";
import produce from "immer";
import { randomUnique } from "../utils";
import { CommandList } from "../mutable-database";
import { useRef, useState } from "react";
import { useInterval } from "~/lib/use-interval";

export type Tree = {
  key: number;
  parent: Tree | null;
  left: Tree | null;
  right: Tree | null;
};

function buildTree(items: number[]) {
  let tree: Tree | null = null;
  for (const item of items) {
    tree = insertKey(tree, item);
  }
  return tree;
}

function getValues(tree: Tree | null): Set<number> {
  const values = new Set<number>();
  const queue: Tree[] = [tree];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      values.add(node.key);
    }
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return values;
}

export type TreeSnapshot = {
  current: number | null;
  key: number;
};

function insertKey(
  tree: Tree | null,
  key: number,
  snapshot?: (args: TreeSnapshot) => void,
) {
  return produce(tree, (draft) => {
    let current = draft;
    let parent = null;
    let isLeftChild = false;

    while (current) {
      snapshot?.({ current: current.key, key });
      if (current.key === key) return;
      parent = current;
      if (key < current.key) {
        isLeftChild = true;
        current = current.left;
      } else {
        isLeftChild = false;
        current = current.right;
      }
    }

    const newNode = { key, left: null, right: null, parent, metadata: {} };
    if (!parent) {
      return newNode;
    }
    if (isLeftChild) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
  });
}

export const treeAtom = atom(buildTree([10, 7, 13]));
export const stateAtom = atom<
  | { type: "idle" }
  | {
      type: "searching";
      snapshots: TreeSnapshot[];
      index: number;
    }
>({ type: "idle" });

export function TreeControls() {
  const [tree, setTree] = useAtom(treeAtom);
  const [state, setState] = useAtom(stateAtom);
  const returnValueRef = useRef<Tree | null>(null);
  const [commands, setCommands] = useState([]);

  useInterval(
    () => {
      if (state.type !== "searching") return;
      if (state.index === state.snapshots.length - 1) {
        setState({ type: "idle" });
        setTree(returnValueRef.current);
      } else {
        setState({
          type: "searching",
          snapshots: state.snapshots,
          index: state.index + 1,
        });
      }
    },
    {
      delay: state.type === "searching" ? 500 : null,
    },
  );

  const values = getValues(tree);
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <ToggleButton
          onClick={() => {
            const key = randomUnique(0, 20, Array.from(values));
            const snapshots = [];
            const result = insertKey(tree, key, (args) => snapshots.push(args));
            returnValueRef.current = result;
            setState({
              type: "searching",
              snapshots,
              index: 0,
            });
            setCommands((prev) => [...prev, { type: "add", key }]);
          }}
          disabled={values.size >= 10}
        >
          Add key
        </ToggleButton>
        <ResetButton
          onClick={() => {
            setTree(buildTree([10, 7, 13]));
            setCommands([]);
          }}
        />
      </div>
      <CommandList
        commands={commands}
        showAll={false}
        prefix="tree"
        empty={<p className="text-gray10 italic">$ waiting for commands...</p>}
      />
    </div>
  );
}
