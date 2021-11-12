import React from 'react'
import { motion } from 'framer-motion'

import { range } from '@/lib/utils'
import { useInViewAnimate } from '@/lib/hooks/useInViewAnimate'
import { styled } from '@/stitches'

import { Block, BlockList, GRID_GAP, MEMORY_SIZE } from '../Block'

export type AllocationProps = {
  startIndex: number
  size: number
  memorySize?: number
}

export function Allocation({
  startIndex,
  size,
  memorySize = MEMORY_SIZE,
}: AllocationProps) {
  const [ref, animate] = useInViewAnimate(
    {
      initial: 'small',
      animate: 'normal',
    },
    {
      threshold: 1,
      rootMargin: '-100px',
    }
  )
  return (
    <BlockList style={{ '--size': memorySize } as React.CSSProperties}>
      {range(memorySize).map((_, index) => (
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
