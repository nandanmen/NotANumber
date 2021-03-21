import React from 'react'
import { FaChevronDown, FaQuestion } from 'react-icons/fa'
import { motion } from 'framer-motion'
import tw, { styled } from 'twin.macro'

export default function Callout({ label, children }) {
  return (
    <Aside className="full-width">
      <div tw="absolute right-8 -top-4 bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white">
        <FaQuestion />
      </div>
      <p>
        <strong>{label}</strong>
      </p>
      {children}
    </Aside>
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

const Aside = styled.aside`
  ${tw`relative p-8 bg-purple-200 md:rounded-2xl dark:bg-purple-800`}

  > * {
    margin-bottom: 1.5em;

    &:last-child {
      margin-bottom: 0;
    }
  }

  code {
    ${tw`bg-blue-100 dark:bg-purple-700 py-0.5 px-1 rounded-sm text-sm`}
  }

  a {
    ${tw`underline dark:text-blue-100`}
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
