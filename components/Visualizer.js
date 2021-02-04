import React from 'react'
import clsx from 'clsx'
import { HiArrowLeft, HiArrowRight, HiPencil, HiX } from 'react-icons/hi'
import { BsPlayFill, BsPauseFill } from 'react-icons/bs'
import { FaUndo } from 'react-icons/fa'
import { motion } from 'framer-motion'

import exec from '../lib/exec'
import zip from '../lib/zip'
import usePlayer from '../lib/usePlayer'

export default function Visualizer({ algorithm, caption, children, ...props }) {
  if (!children) {
    return (
      <div className="z-0 max-w-full mt-4 mb-8 overflow-x-scroll full-width">
        <div className="relative z-20 px-8 py-16 bg-yellow-200 md:rounded-2xl">
          <p className="font-semibold text-center">Implement me!</p>
        </div>
      </div>
    )
  }

  if (!algorithm) {
    return (
      <div className="z-0 max-w-full mt-4 mb-8 overflow-x-scroll full-width">
        <div className="relative z-20 px-8 py-16 bg-gray-200 md:rounded-2xl">
          {children}
        </div>
        {caption && (
          <p className="px-8 mt-4 text-sm text-center md:px-0">{caption}</p>
        )}
      </div>
    )
  }

  return (
    <div className="z-0 max-w-full mt-4 mb-8 overflow-x-scroll full-width">
      <Algorithm algorithm={algorithm} {...props}>
        {children}
      </Algorithm>
      {caption && (
        <p className="px-8 mt-4 text-sm text-center md:px-0">{caption}</p>
      )}
    </div>
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

  const steps = React.useMemo(
    () => zip(...algorithm.map(({ entryPoint }) => exec(entryPoint, inputs))),
    [algorithm, inputs]
  )

  const playerContext = usePlayer(steps, { delay })
  const { activeStepIndex, state, isPlaying } = playerContext.models

  const isDone = state.every((subState) => subState.__done)

  return (
    <>
      <div className="relative z-20 block w-full py-16 bg-gray-200 md:rounded-2xl">
        <div className="z-0">
          {children({ state: algorithm.length > 1 ? state : state[0], inputs })}
        </div>
        <div className="absolute left-0 flex justify-between w-full px-4 text-gray-500 bottom-4">
          <div className="flex">
            <Button className="mr-1" onClick={playerContext.actions.toggle}>
              {isPlaying ? (
                <BsPauseFill />
              ) : isDone ? (
                <span className="text-sm">
                  <FaUndo />
                </span>
              ) : (
                <BsPlayFill />
              )}
            </Button>
            {controls && (
              <>
                <Button
                  className="mr-1"
                  onClick={playerContext.actions.prev}
                  disabled={activeStepIndex === 0}
                >
                  <HiArrowLeft />
                </Button>
                <Button
                  className="mr-1"
                  onClick={playerContext.actions.next}
                  disabled={isDone}
                >
                  <HiArrowRight />
                </Button>
              </>
            )}
          </div>
          {editable && (
            <Button onClick={toggle}>
              {showForm ? <HiX /> : <HiPencil />}
            </Button>
          )}
        </div>
        <p className="absolute text-gray-500 right-5 top-4">
          {steps.indexOf(state) + 1} / {steps.length}
        </p>
      </div>
      {showForm && (
        <InputForm
          inputs={params.map((name, index) => [name, inputs[index]])}
          onSubmit={(inputs) => {
            playerContext.actions.reset()
            setInputs(inputs.map((entry) => entry[1]))
          }}
          className="z-10"
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
        />
      )}
    </>
  )
}

function Button({ className, ...props }) {
  return (
    <button
      className={clsx(
        'flex items-center justify-center w-8 h-8 font-semibold text-gray-500 bg-gray-100 rounded-lg shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-current',
        {
          'opacity-50 cursor-not-allowed': props.disabled,
        },
        className
      )}
      {...props}
    />
  )
}

function InputForm({ inputs, onSubmit, className, ...props }) {
  const [errors, setErrors] = React.useState({})

  const handleSubmit = (evt) => {
    evt.preventDefault()
    const entries = [...new FormData(evt.target).entries()]
    if (entries.every(validate)) {
      onSubmit(entries.map(([name, value]) => [name, JSON.parse(value)]))
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
    <motion.form
      className={clsx(
        'flex w-full px-8 mx-auto mt-6 md:w-3/4 md:px-0',
        className
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      {inputs.map(([name, value]) => (
        <label key={name} className="flex-1 mx-1 font-mono">
          <input
            name={name}
            className="w-full p-2 border-2 rounded-lg focus:outline-none focus:border-blue-400"
            type="text"
            defaultValue={JSON.stringify(value)}
            onBlur={(evt) => validate([name, evt.target.value])}
          />
          <span className="block">{name}</span>
          {errors[name] && <p>{errors[name]}</p>}
        </label>
      ))}
      <button type="submit"></button>
    </motion.form>
  )
}
