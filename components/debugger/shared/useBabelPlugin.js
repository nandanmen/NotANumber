import React from 'react'
import * as Babel from '@babel/standalone'

/**
 * Given code and a Babel plugin, this hook transforms the code using the plugin,
 * returning a code _string_.
 */
export default function useBabelPlugin(code, plugin) {
  const [result, setResult] = React.useState('')
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    try {
      setError(null)
      const result = Babel.transform(code, { plugins: [plugin] })
      setResult(result.code)
    } catch (err) {
      // syntax error
      setError(err.message)
    }
  }, [code, plugin])

  return [result, error]
}
