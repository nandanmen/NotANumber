import React from 'react'

import { execute } from './execute'

export type WorkerState<ReturnType> =
  | {
      state: 'ready'
    }
  | {
      state: 'processing'
    }
  | {
      state: 'error'
      error: Error
    }
  | {
      state: 'done'
      result: ReturnType
    }

/**
 * Given a source script, executes it and returns the result. Uses the
 * default export of the script as its entry point.
 */
export function useCode<InputTypes extends any[], ReturnType>(
  code: string,
  inputs: InputTypes
): WorkerState<ReturnType> {
  const [state, setState] = React.useState<WorkerState<ReturnType>>({
    state: 'ready',
  })

  React.useEffect(() => {
    setState({ state: 'processing' })
    execute(code, inputs)
      .then((result: ReturnType) => {
        setState({
          state: 'done',
          result,
        })
      })
      .catch((error) => {
        setState({
          state: 'error',
          error,
        })
      })
  }, [code, JSON.stringify(inputs)])

  return state
}
