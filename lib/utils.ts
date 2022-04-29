import React from 'react'

export function zip(...args) {
  const longest = args.reduce((a, b) => {
    return a.length > b.length ? a : b
  }, [])

  return longest.map((_, i) => {
    return args.map((array) => {
      return array[i] || array[array.length - 1]
    })
  })
}

export function formatPath(path) {
  return path.replace(/\.mdx$/, '')
}

export function range(length) {
  return Array.from({ length })
    .fill(-1)
    .map((_, index) => index)
}

export function useToggle(initial: boolean) {
  return React.useReducer((state) => !state, initial)
}

export function useSequence<StateType>(states: readonly StateType[]) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  const next = () => {
    if (activeIndex < states.length - 1) {
      setActiveIndex(activeIndex + 1)
    }
  }

  return {
    state: states[activeIndex],
    next,
  }
}
