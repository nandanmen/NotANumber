import React from 'react'

import exec from '../exec'
import usePlayer, { PlayerOptions } from '../usePlayer'

type AlgorithmOptions<StateType> = {
  slice: [number, number]
  filterState: (state: StateType) => boolean
} & PlayerOptions

export function useAlgorithmSteps<StateType>({
  algorithm,
  inputs = [],
  options = {} as Partial<AlgorithmOptions<StateType>>,
}) {
  const steps = React.useMemo(
    () => exec(algorithm.entryPoint, inputs),
    [algorithm, inputs]
  )

  const { filterState = () => true } = options
  return usePlayer<StateType>(steps.filter(filterState), options)
}
