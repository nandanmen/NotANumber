import React from 'react'
import { styled } from '@stitches/react'
import { motion, useAnimation } from 'framer-motion'
import { RiArrowDownSFill } from 'react-icons/ri'

import { range } from '@/lib/utils'
import { ArrayListItem } from '../ArrayList'

const LOWERCASE_ALPHABET_CHAR_CODE = 97

const code = [
  'const block = Mem.allocate(4)',
  `Mem.set(block, 'a')`,
  `Mem.set(block + 1, 'b')`,
  `Mem.set(block + 2, 'c')`,
  `Mem.set(block + 3, 'd')`,
  `Mem.set(block + 4, 'e')`,
]

export function MemoryReadWrite() {
  const [activeIndex, setIndex] = React.useState(0)

  const cycle = () => setIndex((index) => (index + 1) % code.length)

  return (
    <Wrapper>
      <button onClick={cycle}>Cycle</button>
      <Code>{code[activeIndex]}</Code>
      <List>
        <ArrayListItem variant="free" />
        {range(4).map((_, index) => (
          <div key={`allocated-${index}`}>
            <AllocatedBlock active={index + 1 <= activeIndex}>
              {String.fromCharCode(index + LOWERCASE_ALPHABET_CHAR_CODE)}
            </AllocatedBlock>
            <Index>{index > 0 ? `block + ${index}` : 'block'}</Index>
          </div>
        ))}
        {range(3).map((_, index) => (
          <ArrayListItem key={`free-${index}`} variant="free" />
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
    </Wrapper>
  )
}

const Pointer = styled(motion.div, {
  position: 'absolute',
  color: 'var(--black)',
  width: '4rem',
  display: 'flex',
  justifyContent: 'center',
  top: 'calc(-2em - 2px)',
  left: 0,
})

type AllocatedBlockProps = {
  active: boolean
  children?: React.ReactNode
}

function AllocatedBlock({ active, children }: AllocatedBlockProps) {
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

const Index = styled('p', {
  textAlign: 'center',
  marginTop: '8px',
  fontSize: 'var(--text-sm)',
})

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const Code = styled('p', {
  marginBottom: '40px',
  textAlign: 'center',
  fontFamily: 'var(--text-mono)',
})

const List = styled('ul', {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 4rem)',
  gap: '8px',
  position: 'relative',
})
