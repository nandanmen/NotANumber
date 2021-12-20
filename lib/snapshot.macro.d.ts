export type SnapshottedAlgorithm<Algorithm extends Function> = {
  entryPoint: Algorithm
  params: string
  code: string
}

export default function snapshot<Algorithm extends Function>(
  algorithm: Algorithm
): SnapshottedAlgorithm<Algorithm>
