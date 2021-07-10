import React from 'react'
import produce from 'immer'
import { motion } from 'framer-motion'

import { styled } from '@/stitches'
import Memory from '@/lib/memory'
import type { Byte } from '@/lib/memory'

import Rect from './Rect'

const freeMemory: Byte[] = Array.from({ length: 14 })
  .fill(-1)
  .map(() => ({ allocated: false, value: null }))

const allocatedAddresses = [0, 1, 2, 6, 11, 12]

const someAllocated = produce(freeMemory, (mem) =>
  mem.forEach((byte, index) => {
    if (allocatedAddresses.includes(index)) {
      byte.allocated = true
    }
  })
)

export default function Allocate() {
  const [isFree, setIsFree] = React.useState(true)
  const [bytes, setBytes] = React.useState<number>(4)

  const memory = new Memory({
    data: isFree ? freeMemory : someAllocated,
  })
  const [pointer, allocated] = memory.allocate(bytes)

  return (
    <figure className="full-width-2x">
      <Controls>
        <input
          type="range"
          min="0"
          max="12"
          value={bytes}
          onChange={(evt) => setBytes(evt.target.valueAsNumber)}
        />
        <label>
          <input
            type="checkbox"
            checked={!isFree}
            onChange={() => setIsFree((free) => !free)}
          />
          <span>With data</span>
        </label>
        <p>
          Mem.allocate(num of bytes: <Highlight>{bytes}</Highlight>) {`->`}{' '}
          <Highlight>{pointer}</Highlight>
        </p>
      </Controls>
      <Wrapper>
        {allocated.data.map((byte, index) => (
          <motion.div key={index} layout="position">
            <Rect
              size={90}
              borderRadius={6}
              strokeWidth={2}
              dashed={!byte.allocated}
            >
              {byte.value != null ? String(byte.value) : null}
            </Rect>
            <Address>{String(index).padStart(3, '0')}</Address>
          </motion.div>
        ))}
      </Wrapper>
    </figure>
  )
}

const Controls = styled('div', {
  marginBottom: '48px',
  fontFamily: 'var(--text-mono)',
})

const Highlight = styled('span', {
  background: 'var(--gray200)',
  padding: '2px',
  borderRadius: '4px',
})

const Wrapper = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  padding: '0 64px',
})

const Address = styled(motion.p, {
  fontFamily: 'var(--text-mono)',
  width: 'fit-content',
  margin: '0 auto',
  marginTop: '4px',
  color: 'var(--gray600)',
})
