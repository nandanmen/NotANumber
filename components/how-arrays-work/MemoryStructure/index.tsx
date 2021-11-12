import React from 'react'
import { useInView } from 'react-intersection-observer'

import { styled, keyframes } from '@/stitches'
import { range } from '@/lib/utils'

import { Block, BlockList } from '../Block'

const ITEM_LENGTH = 4

const items = range(ITEM_LENGTH)
const highlightIndex = 1

export function MemoryStructure() {
  return (
    <WrapperList style={{ '--size': ITEM_LENGTH } as React.CSSProperties}>
      {items.map((item, index) => {
        return <ItemWithIndex key={item} index={index} />
      })}
    </WrapperList>
  )
}

const WrapperList = styled(BlockList, {
  marginTop: '$8',
  justifyContent: 'center',
})

// --

function ItemWithIndex({ index }) {
  const [ref, inView] = useInView({ rootMargin: '-100px' })
  return (
    <Wrapper ref={ref} active={inView && index === highlightIndex}>
      <Block type="free" />
      <Index>{index}</Index>
    </Wrapper>
  )
}

const fadeUp = keyframes({
  '0%': {
    transform: 'translateY($space$4)',
    opacity: 0,
  },
  '100%': {
    transform: 'translateY(0)',
    opacity: 1,
  },
})

const slideCenter = keyframes({
  '0%': {
    transform: 'scaleX(0)',
  },
  '100%': {
    transform: 'scaleX(1)',
  },
})

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
          top: '-$space$4',
          background: '$grey400',
          transformOrigin: 'center',
          animationName: `${slideCenter}`,
          animationDuration: '600ms',
          animationFillMode: 'forwards',
          transform: 'scaleX(0)',
        },
        '&:after': {
          content: '1 byte',
          position: 'absolute',
          width: '100%',
          top: '-44px',
          color: '$grey600',
          textAlign: 'center',
          fontWeight: 'bold',
          animationName: `${fadeUp}`,
          animationDuration: '600ms',
          animationFillMode: 'forwards',
          animationDelay: '400ms',
          opacity: 0,
          transform: `translateY($space$4)`,
        },
      },
    },
  },
})

const Index = styled('div', {
  textAlign: 'center',
  marginTop: '$space$3',
  color: '$grey600',
  fontFamily: '$mono',
})
