import { motion } from 'framer-motion'
import { styled } from '@/stitches'

export default function Item({ style, children, active = false, ...props }) {
  return (
    <Wrapper style={style} {...props}>
      <Content active={active}>{children}</Content>
    </Wrapper>
  )
}

const Wrapper = styled(motion.li, {
  width: `var(--size)`,
  height: `var(--size)`,
  padding: '8px',
  flexShrink: 0,
})

const Content = styled('div', {
  '--color': '187,55%',

  height: '100%',
  backgroundColor: `var(--teal)`,
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'var(--text-xl)',
  fontFamily: 'var(--text-mono)',
  color: 'hsl(var(--color), 21%)',
  fontWeight: '500',

  variants: {
    active: {
      true: {
        border: '4px solid hsl(var(--color), 41%)',
        boxShadow: '6px 6px 0 var(--gray200)',
      },
    },
  },
})
