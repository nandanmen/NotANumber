import { motion, AnimateSharedLayout } from 'framer-motion'
import { BsTriangleFill } from 'react-icons/bs'

import Item from '../Item'

export default function Quadratic({ state }) {
  return (
    <div className="flex flex-col items-start px-4 overflow-x-scroll md:items-center md:overflow-x-hidden">
      <div className="flex justify-start pb-4">
        <AnimateSharedLayout>
          {state.chocolates.map((item, index) => (
            <Item
              key={index}
              active={
                state.__done || (index >= state.i && index <= state.i + state.j)
              }
              className="relative"
            >
              {item}
              {index === state.i && (
                <motion.div
                  layoutId="caret"
                  className="absolute mt-1 text-green-500 top-full"
                  style={{
                    fontSize: '8px',
                  }}
                >
                  <BsTriangleFill />
                </motion.div>
              )}
            </Item>
          ))}
        </AnimateSharedLayout>
      </div>
      <code className="block w-full mt-4 font-mono text-center whitespace-nowrap">
        {JSON.stringify(
          state.result.map((num) => Number(num.toFixed(2))),
          null,
          2
        )}
      </code>
    </div>
  )
}
