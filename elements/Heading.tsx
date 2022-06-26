import React from 'react'
import { styled } from '@/stitches'

export const Heading: React.FC<{}> = ({ children }) => {
  const id = getIdFromChildren(children)
  return <H2 id={id}>{children}</H2>
}

export const getIdFromChildren = (children: React.ReactNode) => {
  if (typeof children === 'string') {
    return children.toLowerCase().replace(/\s/g, '-').replace(/\.|\?/g, '')
  }
}

const H2 = styled('h2', {
  fontSize: '$2xl',
  fontFamily: '$serif',
  position: 'relative',
  scrollMarginTop: '$28',

  '&:before': {
    content: '',
    position: 'absolute',
    left: 0,
    top: -16,
    width: 24,
    height: 3,
    background: '$black',
  },
})

export const Subheading: React.FC<{}> = ({ children }) => {
  const id = getIdFromChildren(children)
  return <H3 id={id}>{children}</H3>
}

const H3 = styled('h3', {
  fontSize: '$xl',
  color: '$grey800',
  scrollMarginTop: '$28',
})
