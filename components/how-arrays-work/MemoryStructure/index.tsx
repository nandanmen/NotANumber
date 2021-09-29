import { styled } from '@stitches/react'

import { ArrayList, ArrayListItem } from '../ArrayList'
import { range } from '@/lib/utils'

const ITEM_LENGTH = 7

const items = range(ITEM_LENGTH)
const highlightIndex = Math.floor(ITEM_LENGTH / 2)

export function MemoryStructure() {
  return (
    <ArrayList>
      {items.map((item, index) => {
        return <ItemWithIndex key={item} index={index} />
      })}
    </ArrayList>
  )
}

// --

function ItemWithIndex({ index }) {
  return (
    <Wrapper active={index === highlightIndex}>
      <ArrayListItem variant="free" />
      <Index>{index}</Index>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  position: 'relative',
  variants: {
    active: {
      true: {
        '&:before': {
          content: '',
          position: 'absolute',
          width: '100%',
          height: '2px',
          top: '-16px',
          background: 'var(--gray400)',
        },
        '&:after': {
          content: '1 byte',
          position: 'absolute',
          width: '100%',
          top: '-44px',
          color: 'var(--gray600)',
          textAlign: 'center',
          fontWeight: 'bold',
        },
      },
    },
  },
})

const Index = styled('div', {
  textAlign: 'center',
  marginTop: '12px',
  color: 'var(--gray600)',
  fontFamily: 'var(--text-mono)',
})
