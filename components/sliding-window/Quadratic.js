import { motion, AnimateSharedLayout } from 'framer-motion'
import { BsTriangleFill } from 'react-icons/bs'
import Item from '../shared/Item'

export default function Quadratic({ state }) {
  return (
    <>
      <div className="flex w-full justify-center">
        <AnimateSharedLayout>
          {state.arr.map((item, index) => (
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
                  className="absolute top-full mt-1 text-green-500"
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
      <code className="block font-mono w-full text-center whitespace-nowrap mt-8">
        {JSON.stringify(
          state.result.map((num) => Number(num.toFixed(2))),
          null,
          2
        )}
      </code>
    </>
  )
}
