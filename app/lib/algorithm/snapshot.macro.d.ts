import type { Fn, SnapshottedAlgorithm } from "./types";

export default function snapshot<Algorithm extends Fn>(
  algorithm: Algorithm
): SnapshottedAlgorithm<Algorithm>;
