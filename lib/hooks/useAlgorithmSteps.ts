import React from 'react'

import exec from '../exec'
import usePlayer from '../usePlayer'

export function useAlgorithmSteps<StateType>({
  algorithm,
  inputs = [],
  options = {},
}) {
  const steps = React.useMemo(
    () => exec(algorithm.entryPoint, inputs),
    [algorithm, inputs]
  )
  return usePlayer<StateType>(steps, options)
}
