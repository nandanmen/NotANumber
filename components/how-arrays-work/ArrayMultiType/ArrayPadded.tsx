import React from 'react'
import { blue, yellow, mint } from '@radix-ui/colors'

import { StaticVisual } from '@/components/AlgorithmPlayer'
import { styled } from '@/stitches'

import { Block } from '../Block'
import { range } from '@/lib/utils'

export function ArrayPadded() {
  return (
    <StaticVisual>
      <Center>
        <Cols>
          <ColItem>0</ColItem>
          <ColItem>4</ColItem>
          <ColItem>8</ColItem>
        </Cols>
        <Grid>
          <LongBlock size={2} color={yellow.yellow8}>
            ab
          </LongBlock>
          {range(2).map(() => (
            <Block />
          ))}
          <LongBlock size={4} color={blue.blue8}>
            10
          </LongBlock>
          <LongBlock size={1} color={mint.mint10}>
            true
          </LongBlock>
          {range(3).map(() => (
            <Block />
          ))}
        </Grid>
      </Center>
    </StaticVisual>
  )
}

const Cols = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  transform: 'translateX(14px)',
})

const ColItem = styled('li', {
  height: '$16',
  borderTop: '2px solid $black',
  paddingRight: '$8',
  fontWeight: 600,
})

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: `repeat(4, $sizes$16)`,
  gap: '$2',
})

const Center = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
})

function LongBlock({ size, color, ...props }) {
  return (
    <LongBlockContent
      style={
        {
          '--gridSpan': `span ${size}`,
          '--color': color,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

const LongBlockContent = styled(Block, {
  width: 'auto',
  gridColumnEnd: 'var(--gridSpan)',
  background: 'var(--color)',
  border: '2px solid $black',
})
