import React from 'react'
import { styled } from '@stitches/react'

import { ArrayList, ArrayListItem } from '../ArrayList'

type IndexLookupProps = {
  items: unknown[]
}

export default function IndexLookup({ items }: IndexLookupProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  return (
    <div>
      <button
        onClick={() => setActiveIndex((index) => (index + 1) % items.length)}
      >
        Get Index: {activeIndex}
      </button>
      <ArrayList>
        {items.map((item, index) => {
          const isActive = activeIndex === index
          return (
            <div key={index}>
              <ArrayListItem
                pressed={isActive}
                variant={isActive ? 'highlight' : undefined}
                shadow
              >
                {item}
              </ArrayListItem>
              <Index active={isActive}>{index}</Index>
            </div>
          )
        })}
      </ArrayList>
    </div>
  )
}

const Index = styled('div', {
  textAlign: 'center',
  marginTop: '12px',
  variants: {
    active: {
      true: {
        color: 'var(--color-highlight-secondary)',
        fontWeight: 600,
      },
    },
  },
})
