import { styled } from '@/stitches'
import { AnimationWrapper } from '@/components/AlgorithmPlayer'
import { useAlgorithmSteps } from '@/lib/hooks/useAlgorithmSteps'

import { Memory, MemoryList } from '../Memory'

// Macros have to use relative imports because they only exist at compile time
import snapshot from '../../../lib/snapshot.macro'

type AnimationState = {
  cursor: number | null
  memory: Memory
  phase: 'setup' | 'allocate' | 'copy' | 'push' | 'free'
}

const ANIMATION_STEPS = snapshot((allocateSize = 1, pushTwice = false) => {
  let phase = 'setup'
  let memory = new Memory(8).allocate(2).set(0, 'a').set(1, 'b')
  memory.setAnonymous([2, 3])
  debugger

  phase = 'allocate'
  debugger
  memory.allocate(allocateSize + 2, 4)
  debugger

  phase = 'copy'
  debugger
  for (let i = 0; i < 2; i++) {
    memory.set(i + 4, memory.get(i))
    memory.clear(i)
    debugger
  }

  phase = 'push'
  debugger
  memory.set(6, 'c')
  debugger

  if (pushTwice) {
    memory.set(7, 'd')
    debugger
  }

  phase = 'free'
  debugger
  memory.free([0, 1])
  debugger
})

type ArrayResizeProps = {
  slice?: [number, number]
  performant?: boolean
  phase?: AnimationState['phase']
}

export function ArrayResize({ phase, performant = false }: ArrayResizeProps) {
  const player = useAlgorithmSteps<AnimationState>({
    algorithm: ANIMATION_STEPS,
    inputs: performant ? [2, true] : [],
    filterState: (state: AnimationState) =>
      phase != null ? state.phase === phase : true,
    options: {
      delay: 1000,
    },
  })
  const { state } = player.models
  const { memory, cursor } = state

  return (
    <AnimationWrapper player={player} controls editable={false}>
      <Wrapper>
        <MemoryList state={{ memory: memory.data, cursor }} rowSize={4} />
      </Wrapper>
    </AnimationWrapper>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
