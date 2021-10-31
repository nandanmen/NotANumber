import React from 'react'

import exec from '../exec'
import usePlayer, { PlayerOptions } from '../usePlayer'

type AlgorithmOptions = {
  slice: [number, number]
} & PlayerOptions

export function useAlgorithmSteps<StateType>({
  algorithm,
  inputs = [],
  options = {} as Partial<AlgorithmOptions>,
}) {
  const steps = React.useMemo(
    () => exec(algorithm.entryPoint, inputs),
    [algorithm, inputs]
  )

  const { slice = [] } = options
  const [start, end] = slice

  return usePlayer<StateType>(steps.slice(start, end), options)
}
