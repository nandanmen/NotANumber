import React from 'react'
import { FaChevronDown, FaChevronUp, FaQuestion } from 'react-icons/fa'
import { motion } from 'framer-motion'

import { styled } from '@/stitches'
import Figure from './Figure'

type CalloutProps = {
  label: string
  children: React.ReactNode
}

export default function Callout({ label, children }: CalloutProps) {
  return (
    <Figure size="lg">
      <Aside>
        <Icon>
          <FaQuestion />
        </Icon>
        <Title>{label}</Title>
        {children}
      </Aside>
    </Figure>
  )
}

const Title = styled('p', {
  fontWeight: '600',
})

// --

type CalloutDetailsProps = {
  children: React.ReactNode
}

function CalloutDetails({ children }: CalloutDetailsProps) {
  const [open, setOpen] = React.useState(false)

  if (open) {
    return (
      <Details
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.1 }}
      >
        {children}
        <RevealButton onClick={() => setOpen(false)}>
          Hide
          <ArrowWrapper>
            <FaChevronUp />
          </ArrowWrapper>
        </RevealButton>
      </Details>
    )
  }

  return (
    <RevealButton onClick={() => setOpen(true)}>
      Read more
      <ArrowWrapper>
        <FaChevronDown />
      </ArrowWrapper>
    </RevealButton>
  )
}

Callout.Details = CalloutDetails

const ArrowWrapper = styled('span', {
  marginLeft: '$2',
})

const RevealButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
})

const Icon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '$10',
  height: '$10',
  color: '$white',
  background: '$black',
  position: 'absolute',
  top: -20,
  right: 16,
  borderRadius: '50%',
})

const Aside = styled('aside', {
  position: 'relative',
  padding: '$8',
  border: '2px solid $black',
  borderLeft: 'none',
  borderRight: 'none',
  background: '$grey200',

  '> :not(:last-child)': {
    marginBottom: '$6',
  },

  '@md': {
    borderRadius: 8,
    borderLeft: '2px solid $black',
    borderRight: '2px solid $black',
  },
})

const Details = styled(motion.div, {
  '> :not(:last-child)': {
    marginBottom: '$6',
  },
})
