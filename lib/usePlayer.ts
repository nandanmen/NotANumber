import React from 'react'
import useInterval from '@use-it/interval'

export type PlayerOptions = {
  delay: number
  loop: boolean
}

export type Player<StateType> = {
  models: {
    activeStepIndex: number
    state: StateType
    steps: StateType[]
    isPlaying: boolean
    settings: PlayerOptions
  }
  actions: {
    reset: () => void
    toggle: () => void
    next: () => void
    prev: () => void
    setIndex: (index: number) => void
  }
}


const DEFAULT_OPTIONS: PlayerOptions = {
  delay: 500,
  loop: false,
}

export default function usePlayer<StateType = unknown>(
  steps: StateType[],
  settings: Partial<PlayerOptions> = DEFAULT_OPTIONS
) {
  const populatedSettings = { ...DEFAULT_OPTIONS, ...settings }

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
    isPlaying ? populatedSettings.delay : null
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
    if (populatedSettings.loop) {
      setActiveStepIndex((index) => (index + 1) % steps.length)
    } else if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex((index) => index + 1)
    }
  }

  const prev = () => {
    if (populatedSettings.loop && activeStepIndex === 0) {
      setActiveStepIndex(steps.length - 1)
    } else if (activeStepIndex > 0) {
      setActiveStepIndex((index) => index - 1)
    }
  }

  return {
    models: {
      activeStepIndex,
      state: steps[activeStepIndex],
      steps,
      isPlaying,
      settings: populatedSettings,
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
