import React from 'react'

export function useBox<ElementType extends HTMLElement>() {
  const ref = React.useRef<ElementType>()
  const [box, setBox] = React.useState<DOMRect>(null)

  React.useEffect(() => {
    setBox(ref.current.getBoundingClientRect())
  }, [])

  return [ref, box] as const
}
