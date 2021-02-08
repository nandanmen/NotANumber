import React from 'react'
import { motion } from 'framer-motion'

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

export default function FeedbackForm() {
  const [state, dispatch] = React.useReducer(transition, formState.Start)

  const handleSubmit = async (evt) => {
    dispatch(events.Submit)
    await submitFeedback(evt)
    dispatch(events.Saved)
  }

  return (
    <form
      className="flex flex-col max-w-md p-8 mx-auto space-y-4 border-2 rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-semibold">Have feedback?</h1>
      <p>Let me know what you think of the article!</p>
      <label htmlFor="message" className="hidden">
        Message
      </label>
      <textarea
        id="message"
        type="text"
        name="message"
        className="p-2 border-2 rounded-lg focus:outline-none focus:border-blue-400"
        onChange={() => dispatch(events.Change)}
      />
      <p>
        If you're open to me reaching out to you, please leave your email or
        twitter handle.
      </p>
      <label htmlFor="contact" className="hidden">
        Contact
      </label>
      <input
        id="contact"
        type="text"
        name="name"
        placeholder="@johndoe"
        className="p-2 border-2 rounded-lg focus:outline-none focus:border-blue-400"
        onChange={() => dispatch(events.Change)}
      />
      <motion.button
        className="py-2 text-sm font-semibold text-white bg-green-600 shadow-lg rounded-xl"
        whileTap={{ scale: 0.95 }}
      >
        Submit
      </motion.button>
      <div>{state}</div>
    </form>
  )
}

function submitFeedback(evt) {
  evt.preventDefault()

  const feedback = Object.fromEntries(new FormData(evt.target).entries())
  if (!feedback.message) {
    return
  }

  if (!feedback.name) {
    feedback.name = 'Anonymous'
  }

  return new Promise((resolve, reject) => {
    window
      .fetch('https://notion-github-app.herokuapp.com/feedback', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(feedback),
      })
      .then((response) => {
        if (response.ok) {
          resolve()
        } else {
          reject(response)
        }
      })
  })
}
