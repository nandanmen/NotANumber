import React from 'react'
import rfdc from 'rfdc'

import snapshot from './snapshot'

const clone = rfdc()

export default function useAlgorithm(algorithm, initialArguments) {
  const [inputs, setInputs] = React.useState(clone(initialArguments))

  const steps = React.useMemo(() => {
    const snapshots = snapshot.createSnapshot()
    const returnVal = algorithm(snapshots)(...inputs)

    const last = snapshots.data[snapshots.data.length - 1]
    if (last) {
      last.__done = true
      last.__returnValue = returnVal
    }

    return snapshots.data
  }, [inputs, algorithm])

  return {
    models: {
      steps,
      inputs,
    },
    actions: {
      setInputs,
    },
  }
}
