import { styled } from '@/stitches'
import { AnimationWrapper } from '@/components/AlgorithmPlayer'
import CodeBlock from '@/elements/CodeBlock'
import usePlayer from '@/lib/usePlayer'

import { Memory, MemoryList } from '../Memory'

const code = `// Allocate
const block = Mem.allocate(3)

// Use
Mem.set(block, 'a')
Mem.set(block + 1, 'b')
console.log(Mem.get(block)) // prints 'a'

// Free
Mem.free(block)`

type AnimationState = {
  cursor: number | null
  lineNumber?: number
  memory: Memory
}

const steps: AnimationState[] = [
  {
    cursor: null,
    memory: new Memory(4),
  },
  {
    cursor: null,
    lineNumber: 1,
    memory: new Memory(4).allocate(3),
  },
  {
    cursor: 0,
    lineNumber: 4,
    memory: new Memory(4).allocate(3).set(0, 'a'),
  },
  {
    cursor: 1,
    lineNumber: 5,
    memory: new Memory(4).allocate(3).set(0, 'a').set(1, 'b'),
  },
  {
    cursor: 0,
    lineNumber: 6,
    memory: new Memory(4).allocate(3).set(0, 'a').set(1, 'b'),
  },
  {
    cursor: null,
    lineNumber: 9,
    memory: new Memory(4),
  },
  {
    cursor: null,
    memory: new Memory(4),
  },
]

export function MemoryWorkflow() {
  const player = usePlayer(steps, { delay: 1200 })
  const { memory, lineNumber, cursor } = player.models.state

  return (
    <>
      <CodeWrapper highlight={lineNumber ? String(lineNumber) : undefined}>
        {code}
      </CodeWrapper>
      <AnimationWrapper player={player} controls editable={false}>
        <Wrapper>
          <MemoryList state={{ memory: memory.data, cursor }} />
        </Wrapper>
      </AnimationWrapper>
    </>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
})

const CodeWrapper = styled(CodeBlock, {
  position: 'relative',
  maxWidth: 'fit-content',
  transform: 'translateY(16px)',
  margin: '0 auto',
  zIndex: 10,
})
