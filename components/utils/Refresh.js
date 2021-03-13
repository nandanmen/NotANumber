import React from 'react'

export default function Refresh({ children }) {
  const [key, setKey] = React.useState(0)
  return (
    <>
      <button onClick={() => setKey((key) => key + 1)}>Refresh</button>
      <div key={key}>{children}</div>
    </>
  )
}
