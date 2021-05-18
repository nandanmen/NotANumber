import React from 'react'
import {
  HiArrowLeft,
  HiArrowRight,
  HiPencil,
  HiX,
  HiCheck,
} from 'react-icons/hi'
import { BsPlayFill, BsPauseFill } from 'react-icons/bs'
import { FaUndo } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { styled } from 'twin.macro'

import exec from '@/lib/exec'
import { zip } from '@/lib/utils'
import usePlayer from '@/lib/usePlayer'

import Figure from './Figure'

export default function Visualizer({ algorithm, caption, children, ...props }) {
  return (
    <Figure>
      <Algorithm algorithm={algorithm} {...props}>
        {children}
      </Algorithm>
      {caption && <Figure.Caption>{caption}</Figure.Caption>}
    </Figure>
  )
}

function Algorithm({
  algorithm,
  children,
  initialInputs = [],
  controls,
  editable,
  delay = 400,
}) {
  if (!Array.isArray(algorithm)) {
    algorithm = [algorithm]
  }
  let { params } = algorithm[0]
  params = JSON.parse(params)

  const [showForm, toggle] = React.useReducer((show) => !show, false)
  const [inputs, setInputs] = React.useState(initialInputs)
  const [errors, setErrors] = React.useState({})
  const formRef = React.useRef()

  const steps = React.useMemo(
    () => zip(...algorithm.map(({ entryPoint }) => exec(entryPoint, inputs))),
    [algorithm, inputs]
  )

  const playerContext = usePlayer(steps, { delay })
  const { activeStepIndex, state, isPlaying } = playerContext.models

  const isDone = state.every((subState) => subState.__done)

  const handleSubmit = (form) => {
    const entries = [...new FormData(form).entries()]
    if (entries.every(validate)) {
      playerContext.actions.reset()
      setInputs(entries.map(([, value]) => JSON.parse(value)))
    }
  }

  const validate = ([name, value]) => {
    try {
      JSON.parse(value)
      setErrors({ ...errors, [name]: null })
      return true
    } catch (err) {
      setErrors({ ...errors, [name]: `Please enter a serializable value.` })
      return false
    }
  }

  return (
    <>
      <Figure.Content>
        <div tw="z-0">
          {children({ state: algorithm.length > 1 ? state : state[0], inputs })}
        </div>
        <div tw="absolute left-0 flex justify-between w-full px-4 text-gray-500 bottom-4">
          <div tw="flex">
            {steps.length > 1 && (
              <>
                <Button tw="mr-1" onClick={playerContext.actions.toggle}>
                  {isPlaying ? (
                    <BsPauseFill />
                  ) : isDone ? (
                    <span tw="text-sm">
                      <FaUndo />
                    </span>
                  ) : (
                    <BsPlayFill />
                  )}
                </Button>
                {controls && (
                  <>
                    <Button
                      tw="mr-1"
                      onClick={playerContext.actions.prev}
                      disabled={activeStepIndex === 0}
                    >
                      <HiArrowLeft />
                    </Button>
                    <Button
                      tw="mr-1"
                      onClick={playerContext.actions.next}
                      disabled={isDone}
                    >
                      <HiArrowRight />
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
          {editable && (
            <div tw="flex space-x-1">
              <AnimatePresence>
                {showForm && (
                  <Button
                    onClick={() => {
                      handleSubmit(formRef.current)
                      toggle()
                    }}
                    variants={{
                      hidden: {
                        x: '100%',
                        opacity: 0,
                      },
                      shown: {
                        x: 0,
                        opacity: 1,
                      },
                    }}
                    initial="hidden"
                    animate="shown"
                    exit="hidden"
                  >
                    <HiCheck />
                  </Button>
                )}
              </AnimatePresence>
              <Button onClick={toggle} tw="relative">
                {showForm ? <HiX /> : <HiPencil />}
              </Button>
            </div>
          )}
        </div>
        {steps.length > 1 && (
          <p tw="absolute text-gray-500 right-5 top-4">
            {steps.indexOf(state) + 1} / {steps.length}
          </p>
        )}
      </Figure.Content>
      {showForm && (
        <motion.form
          ref={formRef}
          onSubmit={(evt) => {
            evt.preventDefault()
            handleSubmit(evt.target)
          }}
          tw="z-10 flex w-full px-8 mx-auto mt-6 md:w-3/4 md:px-0"
          variants={{
            show: {
              y: 0,
              opacity: 1,
            },
            hide: {
              y: '-100%',
              opacity: 0,
            },
          }}
          initial="hide"
          animate="show"
        >
          {params
            .map((name, index) => [name, inputs[index]])
            .map(([name, value]) => (
              <label key={name} tw="flex-1 mx-1 font-mono">
                <input
                  name={name}
                  tw="w-full p-2 border-2 rounded-lg focus:outline-none focus:border-blue-400"
                  type="text"
                  defaultValue={JSON.stringify(value)}
                  onBlur={(evt) => validate([name, evt.target.value])}
                />
                <span tw="block">{name}</span>
                {errors[name] && <p>{errors[name]}</p>}
              </label>
            ))}
          <button type="submit"></button>
        </motion.form>
      )}
    </>
  )
}

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-weight: 600;
  border-radius: 6px;
  background: var(--gray100);

  &:focus {
    outline: none;
    background: hsl(13, 16%, 40%);
    color: white;
  }
`
