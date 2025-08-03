import { atom } from "jotai";

export type Tree = {
  key: number;
  parent: Tree | null;
  left: Tree | null;
  right: Tree | null;
};

export class BST {
  tree: Tree | null = null;

  constructor(items: number[]) {
    for (const item of items) {
      this.insert(item);
    }
  }

  insert(key: number) {
    let current = this.tree;
    let parent = null;
    let isLeftChild = false;

    while (current) {
      if (current.key === key) return current;
      parent = current;
      if (key < current.key) {
        isLeftChild = true;
        current = current.left;
      } else {
        isLeftChild = false;
        current = current.right;
      }
    }
    const newNode = { key, left: null, right: null, parent };
    if (!parent) {
      this.tree = newNode;
      return newNode;
    }
    if (isLeftChild) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
    return newNode;
  }
}

export const treeAtom = atom(new BST([4, 1, 7, 3, 9, 2, 8, 5]));
