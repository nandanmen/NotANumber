import { motion, AnimateSharedLayout } from 'framer-motion'
import { BsTriangleFill } from 'react-icons/bs'
import { styled } from 'twin.macro'

import Item from '../Item'

export default function DoubleCount({ state, inputs }) {
  const doubleCounted = (index) => state.doubleCounted.includes(index)
  return (
    <>
      <div className="flex justify-center w-full">
        <AnimateSharedLayout>
          {state.chocolates.map((item, index) => (
            <Item
              key={index}
              active={(state.subarray || []).includes(index) || state.__done}
              variant={doubleCounted(index) ? 'danger' : 'base'}
              className="relative"
            >
              {item}
              {index === state.i && (
                <Caret layoutId="caret" tw="absolute mt-1 top-full">
                  <BsTriangleFill />
                </Caret>
              )}
            </Item>
          ))}
        </AnimateSharedLayout>
      </div>
      <p className="w-full mt-8 font-mono text-sm text-center">
        period = {inputs[1]}
      </p>
      <p className="w-full mt-6 font-mono text-sm text-center">
        {JSON.stringify(state.result, null, 2)}
      </p>
    </>
  )
}

const Caret = styled(motion.div)`
  font-size: 8px;
  background: var(--brown);
`
