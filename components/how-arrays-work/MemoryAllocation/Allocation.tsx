import { styled } from '@stitches/react'
import { motion } from 'framer-motion'

import { range } from '@/lib/utils'
import { useInViewAnimate } from '@/lib/hooks/useInViewAnimate'
import { Block, BlockList, GRID_GAP, MEMORY_SIZE } from '../Block'

export type AllocationProps = {
  startIndex: number
  size: number
}

export function Allocation({ startIndex, size }: AllocationProps) {
  const [ref, animate] = useInViewAnimate(
    {
      initial: 'small',
      animate: 'normal',
    },
    {
      threshold: 1,
      rootMargin: '-300px',
    }
  )
  return (
    <BlockList>
      {range(MEMORY_SIZE).map((_, index) => (
        <Block key={index} type="free" />
      ))}
      <AllocatedList
        ref={ref}
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
        animate={animate}
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
    </BlockList>
  )
}

// -- Styles

const AllocatedList = styled(motion.ul, {
  display: 'grid',
  gap: GRID_GAP,
  position: 'absolute',
})
