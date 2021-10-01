import { styled } from '@stitches/react'
import { motion } from 'framer-motion'

import { range } from '@/lib/utils'
import { ArrayListItem } from '../ArrayList'

export function MemoryAllocation() {
  return (
    <Wrapper>
      <Code>
        <code>const block = Mem.allocate(bytes: 4)</code>
      </Code>
      <List>
        {range(8).map((_, index) => (
          <ArrayListItem key={index} variant="free" />
        ))}
        <AllocatedList
          variants={{
            normal: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          animate="normal"
          initial="small"
        >
          {range(4).map((_, index) => (
            <AllocatedBlock
              key={`allocated-${index}`}
              variants={{
                small: {
                  scale: 0.2,
                },
                normal: {
                  scale: 1,
                },
              }}
            />
          ))}
        </AllocatedList>
      </List>
    </Wrapper>
  )
}

// -- Styles

const AllocatedList = styled(motion.ul, {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 4rem)',
  gap: '8px',
  position: 'absolute',
  left: 'calc(4rem + 8px)',
})

const AllocatedBlock = styled(motion.li, {
  width: '4rem',
  height: '4rem',
  borderRadius: '6px',
  border: '2px solid var(--gray400)',
  background: 'white',
})

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const Code = styled('p', {
  marginBottom: '24px',
  textAlign: 'center',
})

const List = styled('ul', {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 4rem)',
  gap: '8px',
  position: 'relative',
})
