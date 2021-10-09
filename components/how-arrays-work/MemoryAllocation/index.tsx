import { styled } from '@stitches/react'

import { Allocation } from './Allocation'

export * from './Allocation'

export function MemoryAllocation() {
  return (
    <Wrapper>
      <Code>
        <code>const block = Mem.allocate(bytes: 4)</code>
      </Code>
      <Allocation startIndex={1} size={4} />
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
