import { motion, AnimateSharedLayout } from 'framer-motion'
import { BsTriangleFill } from 'react-icons/bs'

import Item from '../Item'

export default function SmallestSubarrayNaive({ state }) {
  return (
    <div className="flex flex-col px-4">
      <div className="flex justify-center pb-4">
        <AnimateSharedLayout>
          {state.arr.map((item, index) => (
            <Item
              key={index}
              active={state.__done || (index >= state.i && index <= state.j)}
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
        s = {state.s}
      </code>
      <code className="block w-full font-mono text-center whitespace-nowrap">
        min = {JSON.stringify(state.min, null, 2)}
      </code>
    </div>
  )
}
