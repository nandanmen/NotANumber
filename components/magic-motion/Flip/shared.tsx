import React from 'react'
import type { ComponentPropsWithRef } from 'react'
import { motion } from 'framer-motion'

import { styled } from '@/stitches'

import { Grid } from './shared/Grid'

export const FlipConsole = styled('div', {
  padding: '$6',
})

export const FlipWrapper = styled('div', {
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

export const List = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

const DisplayWrapper = styled('div', {
  background: '$white',
  borderRight: '1px solid $black',
})

export const Square = React.forwardRef<
  SVGRectElement,
  ComponentPropsWithRef<typeof motion.rect> & {
    shadow?: boolean
    disabled?: boolean
  }
>(
  (
    {
      style: { x = 0, y = 0, ...otherStyles } = {},
      shadow = true,
      disabled = false,
      ...props
    }: any,
    ref
  ) => (
    <motion.g style={{ x, y }} whileHover={disabled ? undefined : 'hover'}>
      {shadow && (
        <rect
          fill="var(--gray200)"
          width={props.width ?? 15}
          height="15"
          rx="1"
          x="1"
          y="1"
        />
      )}
      <SquareWrapper
        ref={ref}
        fill="rgb(183, 217, 248)"
        width="15"
        height="15"
        rx="1"
        stroke="currentColor"
        strokeWidth="0.2"
        variants={{
          hover: {
            strokeWidth: 0.3,
            stroke: 'rgba(0,145,255,1)',
          },
        }}
        style={otherStyles}
        {...props}
      />
    </motion.g>
  )
)

export const Outline = (props) => (
  <Square
    shadow={false}
    disabled
    strokeDasharray="1"
    fill="var(--gray100)"
    stroke="var(--gray600)"
    {...props}
  />
)

export const XLine = ({ y, ...props }) => {
  return <Line x1="0" x2="100" y1={y} y2={y} {...props} />
}

export const YLine = ({ x, ...props }) => {
  return <Line y1="0" y2="100" x1={x} x2={x} {...props} />
}

const Line = (props) => {
  return <line stroke="var(--gray200)" strokeWidth="0.4" {...props} />
}

const SquareWrapper = styled(motion.rect, {
  cursor: 'pointer',
})

export const Label = (props) => {
  return <LabelText x="3" y="6" {...props} />
}

export const LabelText = styled('text', {
  fontFamily: '$mono',
  fontSize: 3,
  fill: '$grey600',
})

type DomRectProps = {
  label: string
  box: { x: number; y: number } | null
}

export const ConsoleItem = ({ label, children }) => {
  return (
    <RectWrapper>
      <RectTitle>{label}</RectTitle>
      <RectValues>{children}</RectValues>
    </RectWrapper>
  )
}

export const DomRect = ({ label, box }: DomRectProps) => {
  if (!box) return null

  return (
    <ConsoleItem label={label}>
      <p>x: {box.x.toFixed()}</p>
      <p>y: {box.y.toFixed()}</p>
    </ConsoleItem>
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
