import React from 'react'

type OptionalProps = {
  title: string
  children: React.ReactNode
}

export function Optional({ title, children }: OptionalProps) {
  const [isOpen, toggle] = React.useReducer((state) => !state, false)

  return (
    <>
      <button onClick={toggle}>{title}</button>
      {isOpen ? children : null}
    </>
  )
}
