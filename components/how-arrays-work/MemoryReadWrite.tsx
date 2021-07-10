import React from 'react'
import { motion, AnimateSharedLayout } from 'framer-motion'

import { styled } from '@/stitches'

import Rect from './Rect'
import { useMemory } from '@/lib/memory'

const MEMORY = [
  'h',
  'i',
  null,
  12,
  null,
  false,
  null,
  null,
  62,
  'w',
  'o',
  'r',
  'l',
  'd',
]

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatAddress(address: number) {
  return String(address).padStart(3, '0')
}

export default function MemoryReadWrite() {
  const memory = useMemory(MEMORY)
  const [method, setMethod] = React.useState<'get' | 'set'>('get')
  const [address, setAddress] = React.useState(1)

  const toggleMethod = () => {
    setMethod((method) => (method === 'get' ? 'set' : 'get'))
  }

  return (
    <figure className="full-width">
      <Controls>
        <span>Mem.</span>
        <Button onClick={toggleMethod}>{method}</Button>
        <span>(</span>
        <span>address: </span>
        <Button
          onClick={() => setAddress(getRandomInt(0, memory.values.length - 1))}
        >
          {formatAddress(address)}
        </Button>
        {method === 'set' && (
          <>
            <span>, </span>
            <span>value: </span>
            <Button>100</Button>
          </>
        )}
        <span>)</span>
        {method === 'get' && <span>{` -> ${memory.get(address)}`} </span>}
      </Controls>
      <Wrapper>
        <AnimateSharedLayout>
          {memory.values.map((value, index) => (
            <Byte key={index} layout="position">
              {index === address && <Highlight layoutId="highlight" />}
              <Rect
                size={90}
                borderRadius={6}
                strokeWidth={2}
                dashed={value == null ? true : undefined}
              >
                {value != null ? String(value) : null}
              </Rect>
              <Address>{formatAddress(index)}</Address>
            </Byte>
          ))}
        </AnimateSharedLayout>
      </Wrapper>
    </figure>
  )
}

const Controls = styled('div', {
  margin: '0 auto',
  marginBottom: '48px',
  width: 'fit-content',
  fontFamily: 'var(--text-mono)',
})

const Button = styled('button', {
  background: 'var(--gray200)',
  padding: '2px',
  borderRadius: '4px',
})

const Byte = styled(motion.div, {
  position: 'relative',
})

const Highlight = styled(motion.div, {
  position: 'absolute',
  width: '90px',
  height: '90px',
  border: '4px solid var(--orange)',
  borderRadius: '8px',
  zIndex: 10,
})

const Wrapper = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
})

const Address = styled(motion.p, {
  fontFamily: 'var(--text-mono)',
  width: 'fit-content',
  margin: '0 auto',
  marginTop: '4px',
  color: 'var(--gray600)',
})
