import React from 'react'
import { styled } from '@stitches/react'
import { motion, useAnimation } from 'framer-motion'
import { RiArrowDownSFill } from 'react-icons/ri'

import { range } from '@/lib/utils'
import { ArrayListItem } from '../ArrayList'

const LOWERCASE_ALPHABET_CHAR_CODE = 97

export function MemoryReadWrite() {
  const [index, setIndex] = React.useState(-1)

  const cycle = () => setIndex((index) => (index + 1) % 4)
  const activeIndex = index + 1

  return (
    <Wrapper>
      <button onClick={cycle}>Cycle</button>
      <Code>
        <code>Mem.set(block, 'a')</code>
      </Code>
      <List>
        <ArrayListItem variant="free" />
        {range(4).map((_, index) => (
          <div key={`allocated-${index}`}>
            <AllocatedBlock active={index + 1 <= activeIndex}>
              {String.fromCharCode(index + LOWERCASE_ALPHABET_CHAR_CODE)}
            </AllocatedBlock>
            <Index>{index + 1}</Index>
          </div>
        ))}
        {range(3).map((_, index) => (
          <ArrayListItem key={`free-${index}`} variant="free" />
        ))}
        <Pointer
          animate={{
            x: `calc(${activeIndex} * calc(8px + 4rem))`,
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
  const controls = useAnimation()

  React.useEffect(() => {
    let timeout = null

    if (!props.active) {
      controls.start('base')
    } else {
      controls.start('active')
      timeout = setTimeout(() => {
        controls.start({
          scale: 1,
          transition: {
            type: 'spring',
            velocity: -20,
            stiffness: 400,
            damping: 100,
          },
        })
      }, 300)
    }

    return () => {
      controls.stop()
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [props.active])

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
      animate={controls}
      variant={props.active && 'active'}
      {...props}
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
        {props.children}
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
  marginTop: '12px',
})

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const Code = styled('p', {
  marginBottom: '40px',
  textAlign: 'center',
})

const List = styled('ul', {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 4rem)',
  gap: '8px',
  position: 'relative',
})
