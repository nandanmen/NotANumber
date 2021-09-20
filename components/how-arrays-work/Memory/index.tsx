import { styled } from '@stitches/react'

import { ArrayListItem } from '../ArrayList'

type MemoryProps = {
  length: number
}

export function Memory({ length }: MemoryProps) {
  return (
    <List>
      {Array.from({ length }, () => -1).map((_, index) => (
        <ArrayListItem
          variant={index > 5 ? 'base' : index > 3 ? 'allocated' : 'free'}
          shadow={index > 5}
        >
          {index > 5 ? index : null}
        </ArrayListItem>
      ))}
    </List>
  )
}

const List = styled('ul', {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 4rem)',
  gap: '8px',
})
