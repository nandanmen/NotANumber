import React from 'react'
import type { ComponentPropsWithRef } from 'react'
import { motion } from 'framer-motion'
import { gray, blue } from '@radix-ui/colors'

import Figure, { Caption } from '@/elements/Figure'
import { styled } from '@/stitches'

import { Grid } from './shared/Grid'

export const FlipWrapper: React.FC<{ caption?: string }> = ({
  children,
  caption,
}) => (
  <Figure size="lg">
    <Wrapper>{children}</Wrapper>
    {caption && <Caption>{caption}</Caption>}
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
  overflow: 'hidden',
})

export const FlipDisplay = ({ children }) => {
  return (
    <DisplayWrapper>
      <Grid>{children}</Grid>
    </DisplayWrapper>
  )
}

const DisplayWrapper = styled('div', {
  background: '$white',
  borderRight: '1px solid $black',
})

export const Square = React.forwardRef<
  SVGRectElement,
  ComponentPropsWithRef<typeof SquareWrapper>
>((props, ref) => (
  <SquareWrapper
    ref={ref}
    variants={{
      hover: { borderColor: `rgba(0,145,255,1)`, scale: 1.1 },
      base: {
        borderColor: `rgba(23,23,23,1)`,
        scale: 1,
      },
    }}
    whileHover="hover"
    {...props}
  />
))

const SquareWrapper = styled(motion.rect, {
  cursor: 'pointer',
  fill: blue.blue6,
  rx: 1,
  stroke: 'rgba(23,23,23,1)',
  strokeWidth: 0.2,
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

export const Label = styled('p', {
  fontFamily: '$mono',
  fontSize: '$sm',
  color: '$grey600',
  position: 'absolute',
  top: '$4',
  left: '$4',
})

export const Outline = styled(Square, {
  position: 'absolute',
  left: '$6',
})

export const Display = styled(FlipDisplay, {
  variants: {
    toggled: {
      true: {
        justifyContent: 'flex-end',
      },
    },
  },
})

type DomRectProps = {
  label: string
  box: DOMRect | null
}

export const DomRect = ({ label, box }: DomRectProps) => {
  if (!box) return null

  return (
    <RectWrapper>
      <RectTitle>{label}</RectTitle>
      <RectValues>
        <p>x: {box.x.toFixed()}</p>
        <p>y: {box.y.toFixed()}</p>
      </RectValues>
    </RectWrapper>
  )
}

const RectWrapper = styled('div', {
  fontSize: '$sm',
})

const RectTitle = styled('h4', {
  fontWeight: 600,
  color: '$grey600',
})

const RectValues = styled('div', {
  fontFamily: '$mono',
  display: 'flex',
  gap: '$4',
})
