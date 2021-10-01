import React from 'react'
import { styled } from '@stitches/react'
import { motion } from 'framer-motion'
import { RiArrowDownSFill } from 'react-icons/ri'

import { range } from '@/lib/utils'
import { ArrayListItem } from '../ArrayList'

const states = [
  {
    code: `Mem.set(block, 'a')`,
    activeIndex: 1,
  },
  {
    code: `Mem.set(block + 1, 'b')`,
    activeIndex: 2,
  },
]

export function MemoryReadWrite() {
  const [currentStateIndex, setCurrentStateIndex] = React.useState(0)
  const currentState = states[currentStateIndex]

  return (
    <Wrapper>
      <Code>
        <code>{currentState.code}</code>
      </Code>
      <List>
        <ArrayListItem variant="free" />
        {range(4).map((_, index) => (
          <div key={`allocated-${index}`}>
            <AllocatedBlock active={index + 1 === currentState.activeIndex} />
            <Index>{index + 1}</Index>
          </div>
        ))}
        {range(3).map((_, index) => (
          <ArrayListItem key={`free-${index}`} variant="free" />
        ))}
        <Pointer
          animate={{
            x: `calc(${currentState.activeIndex} * calc(8px + 4rem))`,
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

function AllocatedBlock(props) {
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
      animate={props.active ? 'active' : 'base'}
      variant={props.active && 'active'}
      {...props}
    />
  )
}

// -- Styles

const Slider = styled(motion.div, {
  $$offset: '10px',
  position: 'absolute',
  height: 'calc(100% + $$offset)',
  border: '3px solid var(--color-highlight-secondary)',
  borderRadius: '6px',
  width: 'calc(4rem + $$offset)',
})

const AllocatedList = styled(motion.ul, {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 4rem)',
  gap: '8px',
  position: 'absolute',
  left: 'calc(4rem + 8px)',
})

const AllocatedBlockWrapper = styled(motion.li, {
  '--border-color': 'var(--gray400)',

  width: '4rem',
  height: '4rem',
  borderRadius: '6px',
  border: '2px solid var(--border-color, var(--gray400))',
  background: 'var(--background, white)',

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
  marginTop: '12px',
})

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const Code = styled('p', {
  marginBottom: '60px',
  textAlign: 'center',
})

const List = styled('ul', {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 4rem)',
  gap: '8px',
  position: 'relative',
})
