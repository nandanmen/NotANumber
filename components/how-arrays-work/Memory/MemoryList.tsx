import React from 'react'
import { motion } from 'framer-motion'
import { RiArrowDownSFill } from 'react-icons/ri'
import { styled } from '@/stitches'

import { BlockList } from '../Block'
import { MemoryBlock } from './MemoryBlock'
import { MemoryBlockType } from './Memory'

type MemoryListProps = {
  state: {
    memory: MemoryBlockType[]
    cursor?: number
  }
  rowSize?: number
}

export function MemoryList({ state, rowSize }: MemoryListProps) {
  const { memory, cursor } = state
  return (
    <BlockList
      style={{ '--size': rowSize ?? memory.length } as React.CSSProperties}
    >
      {memory.map((block, index) => (
        <MemoryBlock
          key={index}
          state={block.state}
          index={getRelativeIndex(index, memory)}
        >
          {block.data}
        </MemoryBlock>
      ))}
      {typeof cursor === 'number' && (
        <Pointer
          initial={{ opacity: 0 }}
          animate={{
            x: `calc(${cursor} * calc(8px + 4rem))`,
            opacity: 1,
          }}
        >
          <RiArrowDownSFill size="2em" />
        </Pointer>
      )}
    </BlockList>
  )
}

/**
 * The relative index of an address is its offset from the first allocated block
 * that it's a part of.
 */
function getRelativeIndex(address: number, memory: MemoryBlockType[]) {
  const block = memory[address]

  // if block isn't an allocated block, return its address
  if (block.state !== 'allocated' && block.state !== 'occupied') {
    return address
  }

  /**
   * otherwise the block _is_ allocated, so we iterate backwards until we find
   * a free block or we reached the start of our memory
   */
  let curr = address
  while (curr >= 0) {
    const currBlock = memory[curr]

    if (currBlock.state !== 'allocated' && currBlock.state !== 'occupied') {
      break
    }

    curr--
  }

  /**
   * At this point, curr is either -1 (meaning it's at the beginning of the
   * memory) or the address of a free block.
   */
  return address - (curr + 1)
}

const Pointer = styled(motion.div, {
  position: 'absolute',
  color: '$black',
  width: '4rem',
  display: 'flex',
  justifyContent: 'center',
  top: 'calc(-2em - 2px)',
  left: 0,
})
