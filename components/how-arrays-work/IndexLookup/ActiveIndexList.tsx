import { styled } from '@stitches/react'
import { ArrayList, ArrayListItem } from '../ArrayList'

type ActiveIndexListProps = {
  items: unknown[]
  activeIndex: number
}

export default function ActiveIndexList({
  items,
  activeIndex,
}: ActiveIndexListProps) {
  return (
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
