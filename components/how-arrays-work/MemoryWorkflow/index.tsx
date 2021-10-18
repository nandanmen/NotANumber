import React from 'react'
import { styled } from '@stitches/react'
import { motion } from 'framer-motion'

import CodeBlock from '@/elements/CodeBlock'
import { Block, BlockList, MEMORY_SIZE } from '../Block'
import { range } from '@/lib/utils'
import usePlayer from '@/lib/usePlayer'

import { MemoryBlock } from './MemoryBlock'
import { Controls } from '@/components/Controls'

const code = `// Allocate
const block = Mem.allocate(4)

// Use
Mem.set(block, 'a')
Mem.set(block + 1, 'b')
console.log(Mem.get(block)) // prints 'a'

// Free
Mem.free(block)`

type MemoryBlockType = {
  state: 'free' | 'allocated' | 'occupied'
  data: number | null
}

const makeMemory = (): MemoryBlockType[] =>
  range(MEMORY_SIZE).map(() => ({
    state: 'free',
    data: null,
  }))

const allocate = (size: number) => (mem: MemoryBlockType[]) => {
  const copy = [...mem]
  range(size).forEach((offset) => (copy[offset].state = 'allocated'))
  return copy
}

const steps = [allocate(4)]

export function MemoryWorkflow() {
  const [memory, setMemory] = React.useState(makeMemory)
  const player = usePlayer(steps)
  return (
    <Wrapper>
      <CodeWrapper highlight="1">{code}</CodeWrapper>
      <AnimationWrapper>
        <BlockList>
          {memory.map((block) => (
            <MemoryBlock state={block.state}>{block.data}</MemoryBlock>
          ))}
        </BlockList>
      </AnimationWrapper>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const AnimationWrapper = styled('div', {
  background: '$grey200',
  padding: '$20 $16',
  borderRadius: '12px',
})

const CodeWrapper = styled(CodeBlock, {
  position: 'relative',
  width: 'fit-content',
  // boxShadow: '4px 4px 2px $colors$grey300',
  transform: 'translateY(16px)',
})
