import React from 'react'
import useInterval from '@use-it/interval'

export default function usePlayer(steps, settings = { delay: 500 }) {
  const [activeStepIndex, setActiveStepIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)

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

  const reset = React.useCallback(() => {
    setIsPlaying(false)
    setActiveStepIndex(0)
  }, [])

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
      isPlaying,
      settings,
    },
    actions: {
      reset,
      toggle,
      next,
      prev,
      setIndex: setActiveStepIndex,
    },
  }
}
