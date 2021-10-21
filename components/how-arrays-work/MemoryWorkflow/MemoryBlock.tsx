import { styled } from '@/stitches'
import { motion } from 'framer-motion'
import React from 'react'

export const BLOCK_SIZE = '$sizes$16'

type MemoryBlockProps = {
  state: 'free' | 'allocated' | 'occupied'
  index: number
  children?: React.ReactNode
}

const prevStates = {
  free: 'free',
  allocated: 'free',
  occupied: 'allocated',
}

export function MemoryBlock({ state, index, children }: MemoryBlockProps) {
  return (
    <Wrapper
      animate={state}
      initial={prevStates[state]}
      variants={{
        free: {
          y: 0,
        },
        allocated: {
          y: 0,
        },
        occupied: {
          y: -5,
        },
      }}
    >
      <Block type="free" />
      <ContentBlock
        type={state === 'occupied' ? 'occupied' : undefined}
        variants={{
          free: {
            scale: 0,
            transition: {
              delay: index * 0.1,
            },
          },
          allocated: {
            scale: 1,
            transition: {
              delay: index * 0.1,
            },
          },
          occupied: {
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
    },
  },
})

const ContentBlock = styled(Block, {
  position: 'absolute',
  inset: '0',
})
