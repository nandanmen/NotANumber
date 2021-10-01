import { motion } from 'framer-motion'
import { styled } from '@stitches/react'

type ArrayListItemVariants = 'highlight' | 'free' | 'allocated' | 'base'

type ArrayListItemProps = {
  children?: React.ReactNode
  pressed?: boolean
  shadow?: boolean
  variant?: ArrayListItemVariants
}

const contentVariants = {
  base: {
    x: 0,
    y: 0,
  },
  pressed: {
    x: 4,
    y: 4,
  },
}

export function ArrayListItem({
  children,
  variant,
  shadow = false,
  pressed = false,
}: ArrayListItemProps) {
  return (
    <Wrapper>
      <Content
        variants={contentVariants}
        animate={pressed ? 'pressed' : 'base'}
        variant={variant}
      >
        {children}
      </Content>
      {shadow && <Shadow />}
    </Wrapper>
  )
}

const Wrapper = styled('li', {
  position: 'relative',
  width: '4rem',
  height: '4rem',
  zIndex: 0,
})

const Content = styled(motion.div, {
  position: 'relative',
  fontFamily: 'var(--text-mono)',
  fontSize: '1.2rem',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  color: 'var(--gray600)',
  background: 'var(--white)',
  justifyContent: 'center',
  border: '2px var(--border-style, solid) var(--border-color)',
  borderRadius: '6px',
  zIndex: 10,
  variants: {
    variant: {
      base: {
        color: 'var(--gray600)',
        background: 'var(--white)',
      },
      highlight: {
        background: 'var(--color-highlight-secondary)',
        color: 'white',
      },
      free: {
        '--border-style': 'dashed',
        '--border-color': 'var(--gray400)',
        background: 'var(--gray100)',
        color: 'var(--gray600)',
      },
      allocated: {
        '--border-color': 'var(--gray400)',
        background: 'white',
      },
    },
  },
})

const Shadow = styled('div', {
  borderRadius: '6px',
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  background: 'var(--gray300)',
  zIndex: 0,
  transform: 'translate(4px, 4px)',
})
