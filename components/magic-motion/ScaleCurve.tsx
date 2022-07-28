import React from 'react'
import { motion } from 'framer-motion'

import Figure from '@/elements/Figure'
import { styled } from '@/stitches'

import { Grid } from './Flip/shared/Grid'

export function ScaleCurve() {
  return (
    <Figure size="full">
      <VisualWrapper>
        <GridBackground rows={5} cols={20} />
        <GraphWrapper>
          <GraphBackground />
        </GraphWrapper>
        <GraphWrapper small full>
          <GraphBackground bright />
        </GraphWrapper>
      </VisualWrapper>
    </Figure>
  )
}

const GridBackground = styled(Grid, {
  position: 'absolute',
  inset: '$0',
})

const VisualWrapper = styled('div', {
  aspectRatio: 20 / 5,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$0 $8',
  gap: '$10',
  border: '1px solid $grey200',
})

const GraphBackground = styled('div', {
  borderRadius: 6,
  width: '100%',
  height: '100%',
  background: '$grey100',
  border: '1px solid $black',
  position: 'relative',

  variants: {
    bright: {
      true: {
        background: '#efc3e6',
      },
    },
  },
})

const GraphWrapper = styled(motion.div, {
  borderRadius: 6,
  height: '$48',
  aspectRatio: 1,
  position: 'relative',

  '&:before': {
    position: 'absolute',
    content: '',
    inset: '$0',
    backgroundColor: '$grey300',
    opacity: 0.3,
    transform: 'translate(4px, 4px)',
    borderRadius: 'inherit',
  },

  variants: {
    small: {
      true: {
        height: 80,
      },
    },
    full: {
      true: {
        aspectRatio: 5,
      },
    },
  },
})
