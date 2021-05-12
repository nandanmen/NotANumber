import { AnimateSharedLayout, motion } from 'framer-motion'
import { BsTriangleFill, BsCheck, BsX } from 'react-icons/bs'
import tw, { styled } from 'twin.macro'

export default function FrequencyComparison({ state }) {
  return (
    <div tw="flex space-x-4 justify-center w-full">
      <div tw="w-1/3">
        <h1 tw="font-serif mb-4 text-xl text-center">{state.string}</h1>
        <ul tw="mb-4 list-none text-center">
          <AnimateSharedLayout>
            {Object.entries(state.stringFrequencies).map(([key, val]) => (
              <Item key={key} checked={key in state.checked}>
                {state.character === key && (
                  <motion.div
                    layoutId="caret"
                    tw="absolute -left-6 text-gray-500 text-sm"
                    style={{ rotate: 90, fontSize: 12 }}
                  >
                    <BsTriangleFill />
                  </motion.div>
                )}
                <Key passed={state.checked[key]}>{key}</Key>
                <Value passed={state.checked[key]}>{val}</Value>
              </Item>
            ))}
          </AnimateSharedLayout>
        </ul>
      </div>
      <div tw="w-1/3">
        <h1 tw="font-serif mb-4 text-xl text-center">{state.pattern}</h1>
        <ul tw="mb-4 list-none text-center">
          {Object.entries(state.patternFrequencies).map(([key, val]) => (
            <Item key={key} checked={key in state.checked}>
              {key in state.checked && (
                <div tw="absolute -right-6 text-gray-500">
                  {state.checked[key] ? <BsCheck /> : <BsX />}
                </div>
              )}
              <Key passed={state.checked[key]}>{key}</Key>
              <Value passed={state.checked[key]}>{val}</Value>
            </Item>
          ))}
        </ul>
      </div>
    </div>
  )
}

const Item = styled.li`
  ${tw`relative flex items-center mb-1 font-semibold`}

  opacity: ${({ checked }) => (checked ? 1 : 0.2)};
`

const Key = styled.p`
  ${tw`flex-1 mr-1 text-white rounded-md`}

  ${({ passed }) => passed === undefined && tw`bg-gray-400`}

  ${({ passed }) => passed && tw`bg-green-500`}

  ${({ passed }) => passed === false && tw`bg-red-500`}
`

const Value = tw.p`flex items-center self-stretch justify-center flex-1 font-mono text-sm rounded-md text-gray-500 bg-gray-100`
