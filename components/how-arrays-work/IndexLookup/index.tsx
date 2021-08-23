import React from 'react'
import { styled } from '@stitches/react'

import ActiveIndexList from './ActiveIndexList'

type IndexLookupProps = {
  items: unknown[]
}

export default function IndexLookup({ items }: IndexLookupProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  return (
    <Wrapper>
      <IndexButton
        onClick={() => setActiveIndex((index) => (index + 1) % items.length)}
      >
        Index: {activeIndex}
      </IndexButton>
      <ActiveIndexList items={items} activeIndex={activeIndex} />
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  paddingTop: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const IndexButton = styled('button', {
  marginBottom: '24px',
  padding: '6px 10px',
  border: '2px solid var(--border-color)',
  background: 'var(--teal)',
  borderRadius: '6px',
})
