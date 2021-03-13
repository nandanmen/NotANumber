import React from 'react'
import tw from 'twin.macro'
import { motion } from 'framer-motion'

import Editor from './Editor'
import Transpiler from './Transpiler'

export default function Architecture() {
  const [done, setDone] = React.useState(true)
  return (
    <>
      <div
        tw="flex justify-between relative mb-8 mt-4"
        key={done}
        className="full-width"
      >
        <div tw="absolute h-1 bg-gray-400 dark:bg-blacks-500 w-full self-center" />
        <Editor done={done} />
        <Transpiler delay={1.75} onComplete={() => setDone(true)} done={done} />
        <Box tw="bg-gray-400">
          <div />
          <div />
          <div />
          <Caption>Evaluator</Caption>
        </Box>
        <Box tw="bg-gray-600">
          <div />
          <div />
          <div />
          <Caption>Debug Panel</Caption>
        </Box>
      </div>
      <button tw="mb-8!" onClick={() => setDone((done) => !done)}>
        Play
      </button>
    </>
  )
}

const Box = tw(motion.div)`relative w-32 p-4 rounded-lg`

const Caption = tw.code`absolute top-full block left-0 text-xs mt-1 text-gray-500`
