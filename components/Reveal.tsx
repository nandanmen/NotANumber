import React from 'react'
import { styled } from '@/stitches'

export function Reveal({ children }) {
  const [revealed, setRevealed] = React.useState(false)

  return (
    <Wrapper>
      <Content revealed={revealed}>{children}</Content>
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

const Content = styled('div', {
  filter: 'blur(8px)',

  '> :not(:last-child)': {
    marginBottom: '1em',
  },

  variants: {
    revealed: {
      true: {
        filter: 'blur(0px)',
      },
    },
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
