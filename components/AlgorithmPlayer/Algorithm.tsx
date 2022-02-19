import React from 'react'
import { motion } from 'framer-motion'

import { styled } from '@/stitches'
import exec from '@/lib/exec'
import { zip } from '@/lib/utils'
import usePlayer, {Player} from '@/lib/usePlayer'

import { AnimationWrapper } from './AnimationWrapper'

export type AlgorithmContext<StateType, InputType = unknown> = {
  state: StateType
  inputs: InputType
  player: Player<StateType>
}

export function Algorithm({
  algorithm,
  children,
  initialInputs = [],
  controls = false,
  editable = false,
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
  const formRef = React.useRef<HTMLFormElement>()

  const steps = React.useMemo(
    () => zip(...algorithm.map(({ entryPoint }) => exec(entryPoint, inputs))),
    [algorithm, inputs]
  )

  const playerContext = usePlayer<any[]>(steps, { delay })
  const { state } = playerContext.models

  const handleSubmit = (form: HTMLFormElement) => {
    const entries = [...new FormData(form).entries()]
    if (entries.every(validate)) {
      playerContext.actions.reset()
      setInputs(entries.map(([, value]) => JSON.parse(value as string)))
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
      <AnimationWrapper
        player={playerContext}
        controls={controls}
        editable={editable}
        showForm={showForm}
        onSubmitForm={() => {
          handleSubmit(formRef.current)
          toggle()
        }}
        onShowForm={toggle}
      >
        {children({ state: algorithm.length > 1 ? state : state[0], inputs })}
      </AnimationWrapper>
      {showForm && (
        <Form
          ref={formRef}
          onSubmit={(evt) => {
            evt.preventDefault()
            handleSubmit(evt.target as HTMLFormElement)
          }}
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
            .map((name: string, index: number) => [name, inputs[index]])
            .map(([name, value]: [string, string]) => (
              <Label key={name}>
                <Input
                  name={name}
                  type="text"
                  defaultValue={JSON.stringify(value)}
                  onBlur={(evt) => validate([name, evt.target.value])}
                />
                <InputName>{name}</InputName>
                {errors[name] && <p>{errors[name]}</p>}
              </Label>
            ))}
          <button type="submit"></button>
        </Form>
      )}
    </>
  )
}

const InputName = styled('span', {
  display: 'block',
})

const Input = styled('input', {
  $$borderColor: '$colors$grey300',

  width: '100%',
  padding: '$2',
  border: '2px solid $$borderColor',
  borderRadius: 8,

  '&:focus': {
    outline: 'none',
    $$borderColor: '$colors$blue',
  },
})

const Label = styled('label', {
  flex: 1,
  margin: '0 $1',
  fontFamily: '$mono',
})

const Form = styled(motion.form, {
  zIndex: 1,
  display: 'flex',
  width: '100%',
  padding: '0 $8',
  margin: '0 auto',
  marginTop: '$6',

  '@md': {
    width: '75%',
    padding: '0',
  },
})
