import { styled } from '@/stitches'
import { AnimationWrapper } from '@/components/AlgorithmPlayer'
import { useAlgorithmSteps } from '@/lib/hooks/useAlgorithmSteps'
import { MemoryList, Memory } from '../Memory'

import snapshot from '../../../lib/snapshot.macro'

const steps = snapshot(() => {
  const cursor = 2
  const memory = new Memory(4).allocate(3).set(0, 10).set(1, 20)
  debugger

  memory.set(2, 30)
  debugger
})

export function SetSpareCapacity() {
  const player = useAlgorithmSteps<{ memory: Memory; cursor: number }>({
    algorithm: steps,
  })
  const { memory, cursor } = player.models.state
  return (
    <AnimationWrapper player={player} controls editable={false}>
      <Center>
        <MemoryList state={{ memory: memory.data, cursor }} />
      </Center>
    </AnimationWrapper>
  )
}

const Center = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  '> :not(:last-child)': {
    marginBottom: '$8',
  },
})
