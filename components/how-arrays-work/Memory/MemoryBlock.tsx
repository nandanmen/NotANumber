import React from 'react'
import { motion } from 'framer-motion'

import { styled } from '@/stitches'

export const BLOCK_SIZE = '$sizes$16'

type MemoryBlockProps = {
  state: 'free' | 'allocated' | 'occupied' | 'anonymous'
  index: number
  children?: React.ReactNode
}

const prevStates = {
  free: 'free',
  allocated: 'free',
  anonymous: 'free',
  occupied: 'allocated',
}

export function MemoryBlock({ state, index, children }: MemoryBlockProps) {
  return (
    <Wrapper animate={state} initial={prevStates[state]}>
      <Block type="free" />
      <ContentBlock
        type={
          ['occupied', 'anonymous'].includes(state)
            ? (state as 'occupied' | 'anonymous')
            : undefined
        }
        variants={{
          free: {
            scale: 0,
            transition: {
              delay: index * 0.2,
            },
          },
          allocated: {
            scale: 1,
            transition: {
              delay: index * 0.2,
            },
          },
          occupied: {
            scale: 1,
          },
          anonymous: {
            scale: 1,
          },
        }}
      >
        <motion.div
          variants={{
            free: {
              opacity: 0,
            },
            allocated: {
              opacity: 0,
            },
            occupied: {
              opacity: 1,
              transition: {
                delay: 0.3,
              },
            },
          }}
        >
          {children}
        </motion.div>
      </ContentBlock>
    </Wrapper>
  )
}

const Wrapper = styled(motion.div, {
  position: 'relative',
})

const Block = styled(motion.div, {
  $$borderColor: '$colors$grey400',
  $$borderStyle: 'solid',
  $$background: 'white',

  width: BLOCK_SIZE,
  height: BLOCK_SIZE,
  borderRadius: '6px',
  border: '2px $$borderStyle $$borderColor',
  background: '$$background',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '$lg',

  variants: {
    type: {
      free: {
        $$background: '$colors$grey100',
        $$borderStyle: 'dashed',
      },
      occupied: {
        $$borderColor: '$black',
        $$background: '$teal',
      },
      anonymous: {
        $$background: `repeating-linear-gradient(
          -45deg,
          $colors$grey400,
          $colors$grey400 5px,
          transparent 5px,
          transparent 10px
        )`,
      },
    },
  },
})

const ContentBlock = styled(Block, {
  position: 'absolute',
  inset: '0',
})
