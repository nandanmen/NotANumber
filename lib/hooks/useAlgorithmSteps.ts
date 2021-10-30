import React from 'react'

import exec from '../exec'
import usePlayer from '../usePlayer'

export function useAlgorithmSteps({ algorithm, inputs, options = {} }) {
  const steps = React.useMemo(
    () => exec(algorithm.entryPoint, inputs),
    [algorithm, inputs]
  )
  return usePlayer(steps, options)
}
