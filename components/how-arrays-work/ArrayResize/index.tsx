import { styled } from '@/stitches'
import { Controls } from '@/components/Controls'
import { useAlgorithmSteps } from '@/lib/hooks/useAlgorithmSteps'

import { Memory, MemoryList } from '../Memory'

// Macros have to use relative imports because they only exist at compile time
import snapshot from '../../../lib/snapshot.macro'

type AnimationState = {
  cursor: number | null
  memory: Memory
  message?: string
}

const ANIMATION_STEPS = snapshot((allocateSize = 1, pushTwice = false) => {
  let message = 'Waiting...'
  let memory = new Memory(16)
    .allocate(4)
    .set(0, 'a')
    .set(1, 'b')
    .set(2, 'c')
    .set(3, 'd')
  memory.setAnonymous([4, 7])
  debugger

  message = 'Allocate space for the array plus the new item'
  memory.allocate(4 + allocateSize, 8)
  debugger

  message = 'Copy over each element of the old array'
  for (let i = 0; i < 4; i++) {
    const currentValue = memory.get(i)
    memory.clear(i)
    memory.set(i + 8, currentValue)
    debugger
  }

  message = 'Add the new item to the array'
  memory.set(12, 'e')
  debugger

  if (pushTwice) {
    memory.set(13, 'f')
    debugger
  }

  message = 'Free up the old array'
  memory.free([0, 3])
  debugger
})

type ArrayResizeProps = {
  slice?: [number, number]
  performant?: boolean
}

export function ArrayResize({ slice, performant = false }: ArrayResizeProps) {
  const player = useAlgorithmSteps<AnimationState>({
    algorithm: ANIMATION_STEPS,
    inputs: performant ? [4, true] : [],
    options: { delay: 1000, slice },
  })
  const { state } = player.models
  const { memory, cursor, message = '' } = state

  return (
    <Wrapper>
      {!slice && <Message>{message}</Message>}
      <AnimationWrapper>
        <MemoryList state={{ memory: memory.data, cursor }} />
      </AnimationWrapper>
      <Controls player={player} variant={slice ? 'keys' : ''} />
    </Wrapper>
  )
}

const Message = styled('div', {
  marginBottom: '$4',
  fontWeight: 'bold',
  fontSize: 'larger',
})

const AnimationWrapper = styled('div', {
  background: '$grey200',
  padding: '$20 $16',
  borderRadius: '12px',
  marginBottom: '$4',
})

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})
