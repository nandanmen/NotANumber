import { styled } from '@stitches/react'

import { Allocation, AllocationProps } from './Allocation'

export * from './Allocation'

type MemoryAllocationProps = AllocationProps

export function MemoryAllocation({ startIndex, size }: MemoryAllocationProps) {
  return (
    <Wrapper>
      <Code>
        <code>const block = Mem.allocate(bytes: {size})</code>
      </Code>
      <Allocation startIndex={startIndex} size={size} />
    </Wrapper>
  )
}

// -- Styles

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const Code = styled('p', {
  marginBottom: '24px',
  textAlign: 'center',
})
