import { AnimationWrapper } from '@/components/AlgorithmPlayer'
import { useAlgorithmSteps } from '@/lib/hooks/useAlgorithmSteps'

import { tokenize } from './lib/tokenizer'

const INPUT = `function hello(message) {
  console.log(message);
}`

export function Tokenizer() {
  const player = useAlgorithmSteps({
    algorithm: tokenize,
    inputs: [INPUT],
  })
  const { state } = player.models

  return (
    <AnimationWrapper player={player} controls editable>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </AnimationWrapper>
  )
}
