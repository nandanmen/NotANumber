import React from 'react'
import { blue, yellow, mint } from '@radix-ui/colors'

import { StaticVisual } from '@/components/AlgorithmPlayer'
import { styled } from '@/stitches'

import { Block } from '../Block'

export * from './ArrayPadded'

export function ArrayMultiType() {
  return (
    <StaticVisual>
      <Center>
        <LongBlock size={1.25} index={0} address={0} color={yellow.yellow8}>
          ab
        </LongBlock>
        <LongBlock size={2.5} index={1} address={2} color={blue.blue8}>
          10
        </LongBlock>
        <LongBlock size={1} index={2} address={6} color={mint.mint10}>
          true
        </LongBlock>
      </Center>
    </StaticVisual>
  )
}

const Center = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
})

function LongBlock({ size, index, address, color, ...props }) {
  return (
    <LongBlockWrapper>
      <Index>Index {index}</Index>
      <LongBlockContent
        style={{ '--size': size, '--color': color } as React.CSSProperties}
        {...props}
      />
      <Address>{address}</Address>
    </LongBlockWrapper>
  )
}

const LongBlockWrapper = styled('div', {
  position: 'relative',
})

const Index = styled('p', {
  fontSize: '$sm',
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: '$2',
})

const Address = styled('div', {
  fontSize: '$sm',
  fontWeight: 600,
  borderLeft: '2px solid $black',
  paddingTop: '$6',
  paddingLeft: '$2',
  transform: 'translateY(-8px)',
})

const LongBlockContent = styled(Block, {
  width: 'auto',
  aspectRatio: 'var(--size, 1)',
  background: 'var(--color)',
  border: '2px solid $black',
})
