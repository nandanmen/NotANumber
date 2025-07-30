import { parseAlgorithm } from "~/lib/parse-algorithm";
import { BalancedTreeClient } from "./client";

const addToTree = parseAlgorithm(`function addToTree(tree, key) {
  let current = tree;
  let parent = null;
  let isLeftChild = false;

  while (current) {
    debugger;
    if (current.key === key) {
      return tree; // Key already exists, no need to add
    }
    parent = current;
    if (key < current.key) {
      isLeftChild = true;
      current = current.left;
    } else {
      isLeftChild = false;
      current = current.right;
    }
  }
  const newNode = { key, left: null, right: null };
  if (!parent) {
    return newNode; // Tree was empty, new node is the root
  }
  if (isLeftChild) {
    parent.left = newNode;
  } else {
    parent.right = newNode;
  }
  debugger;
  return tree;
}`);

export function BalancedTree() {
  return <BalancedTreeClient program={addToTree} />;
}
