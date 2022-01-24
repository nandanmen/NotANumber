import { motion } from 'framer-motion'
import { styled } from '@/stitches'

export function CharacterList({ state }) {
  return (
    <InputWrapper>
      {[...state.input].map((char, index) => {
        const isActive = index === state.current
        return (
          <InputCharacter
            key={index}
            type={char === ' ' ? 'empty' : undefined}
            active={isActive || state.__done}
          >
            {char === '\n' ? `\\n` : char}
            {isActive && !state.__done && <Cursor style={{ x: '-50%' }} />}
          </InputCharacter>
        )
      })}
    </InputWrapper>
  )
}

const InputWrapper = styled('div', {
  fontFamily: '$mono',
  display: 'flex',
  position: 'relative',
})

const Cursor = styled(motion.span, {
  width: 4,
  aspectRatio: 1,
  background: '$grey600',
  borderRadius: '50%',
  position: 'absolute',
  top: '100%',
  left: '50%',
})

const InputCharacter = styled('p', {
  color: '$grey300',
  position: 'relative',
  variants: {
    type: {
      empty: {
        // TODO: Compute this based on font size and line height
        width: 12.3,
      },
    },
    active: {
      true: {
        color: '$black',
      },
    },
  },
})