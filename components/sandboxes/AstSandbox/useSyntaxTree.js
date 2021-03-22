import React from 'react'
import { parse } from '@babel/parser'

export default function useSyntaxTree(code) {
  const [tree, setTree] = React.useState(parse(code, { sourceType: 'module' }))

  React.useEffect(() => {
    try {
      const tree = parse(code, { sourceType: 'module' })
      setTree(tree)
    } catch (e) {
      // syntax error
    }
  }, [code])

  return tree
}
