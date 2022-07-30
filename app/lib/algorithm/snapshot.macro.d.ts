import type { Pushable, Fn } from "./types";

export type SnapshottedAlgorithm<Algorithm extends Fn> = {
  entryPoint: (snapshots: Pushable) => Algorithm;
  params: string;
  code: string;
};

export default function snapshot<Algorithm extends Fn>(
  algorithm: Algorithm
): SnapshottedAlgorithm<Algorithm>;
