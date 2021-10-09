import { styled } from '@stitches/react'
import { motion } from 'framer-motion'

import { range } from '@/lib/utils'
import { Block, BLOCK_SIZE } from '../Block/Block'

type AllocationProps = {
  startIndex: number
  size: number
}

const MEMORY_SIZE = 8
const GRID_GAP = '$space$2'

export function Allocation({ startIndex, size }: AllocationProps) {
  return (
    <List>
      {range(MEMORY_SIZE).map((_, index) => (
        <Block key={index} type="free" />
      ))}
      <AllocatedList
        css={{
          gridTemplateColumns: `repeat(${size}, 4rem)`,
          left: `calc(${startIndex} * calc(4rem + 8px))`,
        }}
        variants={{
          normal: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        animate="normal"
        initial="small"
      >
        {range(size).map((_, index) => (
          <Block
            key={`allocated-${index}`}
            variants={{
              small: {
                scale: 0.1,
              },
              normal: {
                scale: 1,
              },
            }}
          />
        ))}
      </AllocatedList>
    </List>
  )
}

// -- Styles

const AllocatedList = styled(motion.ul, {
  display: 'grid',
  gap: GRID_GAP,
  position: 'absolute',
})

const List = styled('ul', {
  display: 'grid',
  gridTemplateColumns: `repeat(${MEMORY_SIZE}, ${BLOCK_SIZE})`,
  gap: GRID_GAP,
  position: 'relative',
})
