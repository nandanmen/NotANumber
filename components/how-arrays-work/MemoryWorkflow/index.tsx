import React from 'react'
import { styled } from '@stitches/react'

import CodeBlock from '@/elements/CodeBlock'
import { BlockList, MEMORY_SIZE } from '../Block'
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
  data: number | string | null
}

type AnimationState = {
  cursor: number | null
  lineNumber?: number
  memory: MemoryBlockType[]
}

function pipe<DataType>(...fns: Array<(value: DataType) => DataType>) {
  return (initialArg: DataType) => {
    let currentArg = initialArg
    for (const fn of fns) {
      currentArg = fn(currentArg)
    }
    return currentArg
  }
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

const set = (address: number, value: number | string) => (
  mem: MemoryBlockType[]
) => {
  const copy = [...mem]
  const block = copy[address]
  block.data = value
  block.state = 'occupied'
  return copy
}

const free = (address: number, size: number) => (mem: MemoryBlockType[]) => {
  const copy = [...mem]
  range(size).forEach((offset) => (copy[address + offset].state = 'free'))
  return copy
}

const steps: AnimationState[] = [
  {
    cursor: null,
    memory: makeMemory(),
  },
  {
    cursor: null,
    lineNumber: 1,
    memory: pipe(allocate(4))(makeMemory()),
  },
  {
    cursor: 0,
    lineNumber: 4,
    memory: pipe(allocate(4), set(0, 'a'))(makeMemory()),
  },
  {
    cursor: 1,
    lineNumber: 5,
    memory: pipe(allocate(4), set(0, 'a'), set(1, 'b'))(makeMemory()),
  },
  {
    cursor: null,
    lineNumber: 9,
    memory: makeMemory(),
  },
  {
    cursor: null,
    memory: makeMemory(),
  },
]

export function MemoryWorkflow() {
  const player = usePlayer(steps, { delay: 1000 })
  const { memory, lineNumber } = player.models.state

  return (
    <Wrapper>
      <CodeWrapper highlight={lineNumber ? String(lineNumber) : undefined}>
        {code}
      </CodeWrapper>
      <AnimationWrapper>
        <BlockList>
          {memory.map((block, index) => (
            <MemoryBlock state={block.state} index={index}>
              {block.data}
            </MemoryBlock>
          ))}
        </BlockList>
      </AnimationWrapper>
      <Controls player={player} />
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
  marginBottom: '$4',
})

const CodeWrapper = styled(CodeBlock, {
  position: 'relative',
  width: 'fit-content',
  // boxShadow: '4px 4px 2px $colors$grey300',
  transform: 'translateY(16px)',
})
