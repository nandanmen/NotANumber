import React from 'react'
import type { ComponentPropsWithRef } from 'react'
import { motion } from 'framer-motion'
import { gray, blue } from '@radix-ui/colors'

import Figure from '@/elements/Figure'
import { styled } from '@/stitches'

export const FlipWrapper: React.FC<{}> = ({ children }) => (
  <Figure size="lg">
    <Wrapper>{children}</Wrapper>
  </Figure>
)

export const FlipConsole = styled('div', {
  padding: '$6',
})

const Wrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  border: '1px solid $black',
  height: '$64',
  borderRadius: 6,
  overflow: 'hidden',
})

export const FlipDisplay = styled('div', {
  backgroundImage: `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(155, 30%, 99%, 1)'/><path d='M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z'  stroke-width='0.5' stroke='hsla(151, 11%, 95%, 1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',
  borderRight: '1px solid $black',
  padding: '0 $6',
})

export const Square = React.forwardRef<
  HTMLButtonElement,
  ComponentPropsWithRef<typeof SquareWrapper>
>((props, ref) => (
  <SquareWrapper
    ref={ref}
    variants={{ hover: { borderColor: `rgba(0,145,255,1)`, scale: 1.05 } }}
    whileHover="hover"
    {...props}
  />
))

const SquareWrapper = styled(motion.button, {
  display: 'block',
  width: '$16',
  aspectRatio: 1,
  background: blue.blue6,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: `rgba(23,23,23,1)`,
  borderRadius: 6,
  boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
  zIndex: 10,

  variants: {
    type: {
      outline: {
        background: '$white',
        boxShadow: 'none',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: gray.gray12,
        pointerEvents: 'none',
      },
    },
  },
})

const Line = styled(motion.div, {
  position: 'absolute',
  background: gray.gray8,
})

export const XLine = styled(Line, {
  height: 1,
  left: 0,
  right: 0,
})

export const YLine = styled(Line, {
  width: 1,
  top: 0,
  bottom: 0,
})
