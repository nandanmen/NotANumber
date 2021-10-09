import { motion } from 'framer-motion'

import { styled } from '@/stitches'
import { Block } from './Block'

type AllocatedBlockProps = {
  active: boolean
  children?: React.ReactNode
}

export function AllocatedBlock({ active, children }: AllocatedBlockProps) {
  return (
    <AllocatedBlockWrapper
      variants={{
        base: {
          y: 0,
        },
        active: {
          y: -5,
        },
      }}
      animate={active ? 'active' : 'base'}
      initial="base"
      active={active}
    >
      <motion.div
        variants={{
          base: {
            opacity: 0,
          },
          active: {
            opacity: 1,
            transition: {
              delay: 0.3,
            },
          },
        }}
      >
        {children}
      </motion.div>
    </AllocatedBlockWrapper>
  )
}

// -- Styles

const AllocatedBlockWrapper = styled(Block, {
  variants: {
    active: {
      true: {
        $$borderColor: '$black',
        $$background: '$teal',
      },
    },
  },
})
