import React from 'react'
import useInterval from '@use-it/interval'
import rfdc from 'rfdc'

import snapshot from './snapshot'

const clone = rfdc()

export default function useAlgorithm(algorithm, initialArguments) {
  const [activeStepIndex, setActiveStepIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [inputs, setInputs] = React.useState(clone(initialArguments))
  const [settings, setSettings] = React.useState({
    delay: 500,
  })

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

  useInterval(
    () => {
      if (activeStepIndex < steps.length - 1) {
        setActiveStepIndex((index) => index + 1)
      } else {
        setIsPlaying(false)
      }
    },
    isPlaying ? settings.delay : null
  )

  const toggle = () => {
    if (activeStepIndex === steps.length - 1) {
      reset()
    }
    setIsPlaying((playing) => !playing)
  }

  const reset = () => {
    setIsPlaying(false)
    setActiveStepIndex(0)
  }

  const next = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex((index) => index + 1)
    }
  }

  const prev = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((index) => index - 1)
    }
  }

  return {
    models: {
      activeStepIndex,
      state: steps[activeStepIndex],
      steps,
      inputs,
      isPlaying,
      settings,
    },
    actions: {
      reset,
      toggle,
      next,
      prev,
      setInputs,
      setSettings: (partialSettings) =>
        setSettings({ ...settings, ...partialSettings }),
    },
  }
}
