import React from 'react'
import { motion } from 'framer-motion'
import { styled } from '@/stitches'

export function Reveal({ children }) {
  const [revealed, setRevealed] = React.useState(false)
  return (
    <Wrapper>
      <Content
        initial={{ filter: 'blur(8px)' }}
        animate={revealed ? { filter: 'blur(0px)' } : null}
      >
        {children}
      </Content>
      {!revealed && (
        <RevealButton onClick={() => setRevealed(true)}>
          Reveal answer
        </RevealButton>
      )}
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  position: 'relative',
  padding: '$8',
  border: '3px dashed $grey300',
  borderRadius: 8,
})

const Content = styled(motion.div, {
  '> :not(:last-child)': {
    marginBottom: '1em',
  },
})

const RevealButton = styled('button', {
  background: '$black',
  color: '$white',
  fontFamily: '$serif',
  fontSize: '$xl',
  fontWeight: 600,
  padding: '$2 $4',
  borderRadius: 8,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: `translate(-50%, -50%)`,
})
