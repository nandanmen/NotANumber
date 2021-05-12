import React from 'react'
import { CgSpinner } from 'react-icons/cg'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import 'twin.macro'

const events = {
  Change: 0,
  Submit: 1,
  Saved: 2,
}

const formState = {
  Start: 0,
  Loading: 1,
  Done: 2,
}

const machine = {
  [formState.Start]: {
    [events.Submit]: formState.Loading,
  },
  [formState.Loading]: {
    [events.Saved]: formState.Done,
  },
  [formState.Done]: {
    [events.Change]: formState.Start,
  },
}

const transition = (state, event) => {
  return machine[state][event] ?? state
}

export default function NewsletterForm({ className }) {
  const [state, dispatch] = React.useReducer(transition, formState.Start)

  const handleSubmit = async (evt) => {
    dispatch(events.Submit)
    await subscribe(evt)
    dispatch(events.Saved)
  }

  return (
    <form
      className={clsx(
        'flex flex-col p-6 md:p-8 space-y-4 bg-gray-100 border-2 rounded-lg shadow-lg',
        className
      )}
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-semibold">Newsletter</h1>
      <p>
        If you like my content, consider signing up for my newsletter. You'll
        receive updates on new posts, gain access to subscriber-exclusive posts
        and little tidbits on whatever I find interesting!
      </p>
      <label htmlFor="email" className="hidden">
        Email
      </label>
      <input
        id="email"
        type="email"
        name="email"
        className="p-2 border-2 rounded-lg focus:outline-none focus:border-blue-400"
        placeholder="john@doe.com"
        onChange={() => dispatch(events.Change)}
      />
      <motion.button
        className={clsx(
          'flex items-center justify-center h-10 text-sm font-semibold text-white bg-green-600 shadow-lg rounded-xl',
          { 'bg-opacity-50': state === formState.Loading }
        )}
        whileTap={{ scale: 0.95 }}
        disabled={state === formState.Loading}
      >
        {state === formState.Start && 'Subscribe'}
        {state === formState.Loading && (
          <span className="text-xl animate-spin">
            <CgSpinner />
          </span>
        )}
        {state === formState.Done && 'Thanks! 🎉'}
      </motion.button>
      {state === formState.Done && (
        <p tw="text-center">We've sent you a confirmation letter.</p>
      )}
    </form>
  )
}

function subscribe(evt) {
  evt.preventDefault()

  const { email } = Object.fromEntries(new FormData(evt.target).entries())
  if (!email) {
    return
  }

  const params = new URLSearchParams({ email })
  return new Promise((resolve, reject) => {
    window.fetch(`/api/subscribe?${params}`).then((response) => {
      if (response.ok) {
        resolve(response)
      } else {
        reject(response)
      }
    })
  })
}
