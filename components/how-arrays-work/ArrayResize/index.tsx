import React from 'react'
import { styled } from '@stitches/react'

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

const steps = snapshot(() => {
  let cursor = null
  let message = 'Waiting...'
  let memory = new Memory(16)
    .allocate(4)
    .set(0, 'a')
    .set(1, 'b')
    .set(2, 'c')
    .set(3, 'd')
  memory.setAnonymous([4, 10])
  debugger

  message = 'Allocate space for the array plus the new item'
  memory.allocate(5, 11)
  debugger

  message = 'Copy over each element of the old array'
  for (cursor = 0; cursor < 4; cursor++) {
    const currentValue = memory.get(cursor)
    memory.clear(cursor)
    memory.set(cursor + 11, currentValue)
    debugger
  }

  message = 'Add the new item to the array'
  cursor = null
  memory.set(15, 'e')
  debugger

  message = 'Free up the old array'
  memory.free([0, 3])
  debugger
})

export function ArrayResize() {
  const player = useAlgorithmSteps<AnimationState>({
    algorithm: steps,
    options: { delay: 1000 },
  })
  const { memory, cursor, message = '' } = player.models.state

  return (
    <Wrapper>
      <Message>{message}</Message>
      <AnimationWrapper>
        <MemoryList state={{ memory: memory.data, cursor }} />
      </AnimationWrapper>
      <Controls player={player} />
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
