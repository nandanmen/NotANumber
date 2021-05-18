import React from 'react'
import { FaChevronDown, FaChevronUp, FaQuestion } from 'react-icons/fa'
import { motion } from 'framer-motion'
import tw, { styled } from 'twin.macro'

import Widget from './Widget'

export default function Callout({ label, children }) {
  return (
    <Widget className="full-width">
      <Aside>
        <Icon>
          <FaQuestion />
        </Icon>
        <p tw="font-semibold">{label}</p>
        {children}
      </Aside>
    </Widget>
  )
}

function CalloutDetails({ children }) {
  const [open, setOpen] = React.useState(false)

  if (open) {
    return (
      <Details
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.1 }}
      >
        {children}
        <button
          tw="flex items-center font-semibold"
          onClick={() => setOpen(false)}
        >
          Hide
          <span tw="ml-2">
            <FaChevronUp />
          </span>
        </button>
      </Details>
    )
  }

  return (
    <button tw="flex items-center font-semibold" onClick={() => setOpen(true)}>
      Read more
      <span tw="ml-2">
        <FaChevronDown />
      </span>
    </button>
  )
}

Callout.Details = CalloutDetails

// --

const Icon = styled.div`
  ${tw`flex items-center justify-center w-10 h-10 text-white`}

  background: var(--brown);
  border: 2px solid var(--border-color);
  position: absolute;
  top: -20px;
  right: 16px;
  border-radius: 50%;
`

const Aside = styled.aside`
  ${tw`relative p-8 border-4`}

  border-radius: 8px;
  border: 2px solid var(--border-color);
  background: var(--teal);

  --inline-code-background: hsl(187, 55%, 81%);

  > * {
    margin-bottom: 1.5em;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const Details = styled(motion.div)`
  > * {
    margin-bottom: 1.5em;

    &:last-child {
      margin-bottom: 0;
    }
  }
`
