import React from 'react'
import { motion } from 'framer-motion'
import { RiArrowDownSFill } from 'react-icons/ri'

import { range } from '@/lib/utils'
import usePlayer from '@/lib/usePlayer'
import { styled } from '@/stitches'

import { ForbiddenBlock } from './ForbiddenBlock'
import { Block, AllocatedBlock } from '../Block'
import { Controls } from '@/components/Controls'

const LOWERCASE_ALPHABET_CHAR_CODE = 97

const code = [
  'const block = Memory.allocate(4)',
  `Memory.set(block, 'a')`,
  `Memory.set(block + 1, 'b')`,
  `Memory.set(block + 2, 'c')`,
  `Memory.set(block + 3, 'd')`,
  `Memory.set(block + 4, 'e')`,
]

export function MemoryReadWrite() {
  const { actions, models } = usePlayer(code, { delay: 750, loop: true })
  const activeIndex = models.activeStepIndex

  return (
    <Wrapper>
      <Code>{models.state}</Code>
      <List>
        <Block type="free" />
        {range(4).map((_, index) => (
          <div key={`allocated-${index}`}>
            <AllocatedBlock active={index + 1 <= activeIndex}>
              {String.fromCharCode(index + LOWERCASE_ALPHABET_CHAR_CODE)}
            </AllocatedBlock>
            <Index>{index > 0 ? `block + ${index}` : 'block'}</Index>
          </div>
        ))}
        <div>
          <ForbiddenBlock active={activeIndex === 5} />
          <Index>block + 4</Index>
        </div>
        {range(2).map((_, index) => (
          <Block key={`free-${index}`} type="free" />
        ))}
        <Pointer
          initial={{ opacity: 0 }}
          animate={{
            x: `calc(${activeIndex} * calc(8px + 4rem))`,
            opacity: activeIndex === 0 ? 0 : 1,
          }}
        >
          <RiArrowDownSFill size="2em" />
        </Pointer>
      </List>
      <Controls player={{ actions, models }} />
    </Wrapper>
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
  gridTemplateColumns: 'repeat(8, 4rem)',
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
