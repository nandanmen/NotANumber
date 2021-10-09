import React from 'react'
import { motion } from 'framer-motion'
import { HiX } from 'react-icons/hi'

import { styled } from '@/stitches'
import { Block } from '../Block/Block'

type ForbiddenBlockProps = {
  active: boolean
}

export function ForbiddenBlock({ active }: ForbiddenBlockProps) {
  const [isBooped, setIsBooped] = React.useState(active)

  React.useEffect(() => {
    if (active) {
      setIsBooped(true)
    }
  }, [active])

  React.useEffect(() => {
    if (!isBooped) {
      return
    }

    const timeout = window.setTimeout(() => {
      setIsBooped(false)
    }, 150)

    return () => window.clearTimeout(timeout)
  }, [isBooped])

  return (
    <Wrapper
      active={active}
      variants={{
        base: {
          x: 0,
        },
        active: {
          x: 5,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 2,
            mass: 0.5,
          },
        },
      }}
      animate={isBooped ? 'active' : 'base'}
      initial="base"
      type="free"
    >
      <motion.div
        animate={{ opacity: active ? 1 : 0 }}
        initial={{ opacity: 0 }}
      >
        <HiX size="38px" />
      </motion.div>
    </Wrapper>
  )
}

// -- Styles

const Wrapper = styled(Block, {
  variants: {
    active: {
      true: {
        $$borderColor: '$black',
        $$background: '$red',
        color: '$white',
      },
    },
  },
})
