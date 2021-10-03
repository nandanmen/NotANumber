import { motion } from 'framer-motion'
import { styled } from '@stitches/react'

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
      variant={active ? 'active' : undefined}
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

const AllocatedBlockWrapper = styled(motion.li, {
  '--border-color': 'var(--gray400)',

  width: '4rem',
  height: '4rem',
  borderRadius: '6px',
  border: '2px solid var(--border-color, var(--gray400))',
  background: 'var(--background, white)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '1.5rem',

  variants: {
    variant: {
      active: {
        '--border-color': 'var(--black)',
        '--background': 'var(--teal)',
      },
    },
  },
})
