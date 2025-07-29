import { exec } from "~/lib/algorithm";
import { parseAlgorithm } from "~/lib/parse-algorithm";

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
const { entryPoint } = eval(addToTree);

export function BalancedTree() {
  const snapshots = exec(entryPoint, [
    {
      key: 1,
      left: null,
      right: {
        key: 2,
        left: null,
        right: null,
      },
    },
    3,
  ]);
  return (
    <div>
      {snapshots.map((s, i) => (
        <pre key={i}>{JSON.stringify(s, null, 2)}</pre>
      ))}
    </div>
  );
}
