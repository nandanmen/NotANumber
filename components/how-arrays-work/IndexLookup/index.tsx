import React, { MouseEventHandler } from 'react'
import { styled } from '@stitches/react'

import { ArrayList, ArrayListItem } from '../ArrayList'

const items = [1, 2, 3]
const indexValues = [0, 1, 500]

function useCycle<CycleValue>(values: CycleValue[]) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  return [
    values[currentIndex],
    () => setCurrentIndex((index) => (index + 1) % values.length),
  ] as const
}

export default function IndexLookup() {
  const [activeIndex, cycle] = useCycle(indexValues)
  return (
    <Wrapper>
      <IndexButton onClick={cycle as MouseEventHandler}>
        Index: {activeIndex}
      </IndexButton>
      <ArrayList>
        {items.map((item, index) => {
          const isActive = activeIndex === index
          return (
            <ItemWithIndex key={item} isActive={isActive} index={index}>
              {item}
            </ItemWithIndex>
          )
        })}
        <Spacer />
        <ItemWithIndex isActive={activeIndex === 499} index={499}>
          498
        </ItemWithIndex>
        <ItemWithIndex isActive={activeIndex === 500} index={500}>
          499
        </ItemWithIndex>
      </ArrayList>
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

// --

function ItemWithIndex({ isActive, index, children }) {
  return (
    <div>
      <ArrayListItem
        pressed={isActive}
        variant={isActive ? 'highlight' : undefined}
        shadow
      >
        {children}
      </ArrayListItem>
      <Index active={isActive}>{index}</Index>
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

// --

function Spacer() {
  return (
    <SpacerWrapper>
      <Dot />
      <Dot />
      <Dot />
    </SpacerWrapper>
  )
}

const SpacerWrapper = styled('div', {
  paddingTop: 'calc(2rem - 8px)',
  margin: '0 20px',
  display: 'flex',
  gap: '8px',
})

const Dot = styled('div', {
  $$size: '16px',
  width: '$$size',
  height: '$$size',
  background: 'var(--gray400)',
  borderRadius: '50%',
})
