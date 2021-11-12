import { motion } from 'framer-motion'
import { RiArrowDownSFill } from 'react-icons/ri'

import { AnimationWrapper } from '@/components/AlgorithmPlayer'
import { range } from '@/lib/utils'
import usePlayer from '@/lib/usePlayer'
import { styled } from '@/stitches'

import { ForbiddenBlock } from './ForbiddenBlock'
import { Block, AllocatedBlock } from '../Block'

const LOWERCASE_ALPHABET_CHAR_CODE = 97

const code = [
  'const block = Memory.allocate(2)',
  `Memory.set(block, 'a')`,
  `Memory.set(block + 1, 'b')`,
  `Memory.set(block + 2, 'c')`,
]

export function MemoryReadWrite() {
  const player = usePlayer(code, { delay: 750, loop: true })
  const activeIndex = player.models.activeStepIndex

  return (
    <AnimationWrapper player={player} editable={false} controls>
      <Wrapper>
        <Code>{player.models.state}</Code>
        <List>
          {range(2).map((_, index) => (
            <div key={`allocated-${index}`}>
              <AllocatedBlock active={index + 1 <= activeIndex}>
                {String.fromCharCode(index + LOWERCASE_ALPHABET_CHAR_CODE)}
              </AllocatedBlock>
              <Index>{index > 0 ? `block + ${index}` : 'block'}</Index>
            </div>
          ))}
          <div>
            <ForbiddenBlock active={activeIndex === 3} />
            <Index>block + 2</Index>
          </div>
          <Block type="free" />
          <Pointer
            initial={{ opacity: 0 }}
            animate={{
              x: `calc(${activeIndex - 1} * calc(8px + 4rem))`,
              opacity: activeIndex === 0 ? 0 : 1,
            }}
          >
            <RiArrowDownSFill size="2em" />
          </Pointer>
        </List>
      </Wrapper>
    </AnimationWrapper>
  )
}

/* Main */

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  '> :not(:last-child)': {
    marginBottom: '32px',
  },
})

const Code = styled('p', {
  textAlign: 'center',
  fontFamily: 'var(--text-mono)',
})

const List = styled('ul', {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 4rem)',
  gap: '8px',
  position: 'relative',
})

const Pointer = styled(motion.div, {
  position: 'absolute',
  color: '$black',
  width: '4rem',
  display: 'flex',
  justifyContent: 'center',
  top: 'calc(-2em - 2px)',
  left: 0,
})

const Index = styled('p', {
  textAlign: 'center',
  marginTop: '8px',
  fontSize: '$sm',
})
