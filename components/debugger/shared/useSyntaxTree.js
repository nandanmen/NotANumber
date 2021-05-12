import React from 'react'
import { parse } from '@babel/parser'
import { useDebouncedCallback } from 'use-debounce'

export default function useSyntaxTree(
  code,
  { getParent = (tree) => tree?.program } = {}
) {
  const [tree, setTree] = React.useState({})
  const [error, setError] = React.useState(null)

  const debouncedSetError = useDebouncedCallback(
    (message) => setError(message),
    750
  )

  React.useEffect(() => {
    try {
      setError(null)
      const tree = parse(code, { sourceType: 'module' })
      setTree(tree)
    } catch (err) {
      // syntax error
      debouncedSetError(err.message)
    }
  }, [code, debouncedSetError])

  return [getParent(tree) || {}, error]
}
