import React from 'react'

import exec from '../exec'
import usePlayer, { PlayerOptions } from '../usePlayer'

type AlgorithmOptions = {
  slice: [number, number]
} & PlayerOptions

type AlgorithmStepOptions<T> = {
  algorithm: any
  inputs?: any[]
  filterState?: (state: T) => boolean
  options?: Partial<AlgorithmOptions>
}

export function useAlgorithmSteps<StateType>({
  algorithm,
  inputs = [],
  filterState = () => true,
  options = {},
}: AlgorithmStepOptions<StateType>) {
  const steps = React.useMemo(
    () => exec(algorithm.entryPoint, inputs),
    [algorithm, inputs]
  )

  return usePlayer<StateType>(steps.filter(filterState), options)
}
