import React from 'react'
import { motion } from 'framer-motion'
import { styled } from '@stitches/react'
import { HiX } from 'react-icons/hi'

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
      variant={active ? 'active' : undefined}
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

const Wrapper = styled(motion.li, {
  '--border-color': 'var(--gray400)',

  width: '4rem',
  height: '4rem',
  borderRadius: '6px',
  border: '2px solid var(--border-color, var(--gray400))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '1.5rem',

  variants: {
    variant: {
      active: {
        '--border-color': 'var(--black)',
        background: 'var(--red)',
        color: 'white',
      },
    },
  },
})
