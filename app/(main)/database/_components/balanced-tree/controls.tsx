"use client";

import { atom, useAtom } from "jotai";
import { ResetButton, ToggleButton } from "../toggle-button";
import produce from "immer";
import { pick, randomUnique } from "../utils";
import { CommandList } from "../mutable-database";
import { useEffect, useRef, useState } from "react";
import { useInterval } from "~/lib/use-interval";
import { useIsSectionActive } from "~/components/mdx/scroll-group";

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

export type TreeAnimationState =
  | { type: "idle" }
  | {
      type: "adding";
      snapshots: TreeSnapshot[];
      result: Tree;
      index: number;
    }
  | {
      type: "searching";
      snapshots: TreeSnapshot[];
      result: Tree | null;
      index: number;
    };

export const treeAtom = atom(buildTree([10, 7, 13]));
export const stateAtom = atom<TreeAnimationState>({ type: "idle" });

export function TreeControls({
  mode = "add",
  initialValues,
}: {
  mode?: "add" | "find";
  initialValues: number[];
}) {
  const isSectionActive = useIsSectionActive();
  const [tree, setTree] = useAtom(treeAtom);
  const [state, setState] = useAtom(stateAtom);
  const [commands, setCommands] = useState([]);

  useEffect(() => {
    if (!initialValues.length || !isSectionActive) return;
    setTree(buildTree(initialValues));
  }, [initialValues, setTree, isSectionActive]);

  useInterval(
    () => {
      if (state.type === "idle") return;
      if (state.index === state.snapshots.length - 1) {
        if (state.type === "adding") {
          setTree(state.result);
        }
        setState({ type: "idle" });
      } else {
        setState((s) => ({
          ...s,
          index: state.index + 1,
        }));
      }
    },
    {
      delay: state.type === "idle" ? null : 500,
    },
  );

  const values = getValues(tree);
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {mode === "add" && (
          <ToggleButton
            onClick={() => {
              const key = randomUnique(0, 20, Array.from(values));
              const snapshots = [];
              const result = insertKey(tree, key, (args) =>
                snapshots.push(args),
              );
              setState({
                type: "adding",
                snapshots,
                index: 0,
                result,
              });
              setCommands((prev) => [...prev, { type: "add", key }]);
            }}
            disabled={values.size >= 10}
          >
            Add key
          </ToggleButton>
        )}
        {mode === "find" && (
          <ToggleButton
            onClick={() => {
              const key = pick(
                Array.from(values),
                new Set(commands.map((c) => c.key)),
              );
              const snapshots = [];
              const result = insertKey(tree, key, (args) =>
                snapshots.push(args),
              );
              setState({
                type: "searching",
                snapshots,
                index: 0,
                result,
              });
              setCommands((prev) => [...prev, { type: "get", key }]);
            }}
            disabled={values.size >= 10}
          >
            Find key
          </ToggleButton>
        )}

        <ResetButton
          onClick={() => {
            setTree(buildTree(initialValues));
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
