import { motion } from 'framer-motion'
import 'twin.macro'

export default function Permutation({ state }) {
  const {
    __done: done,
    __returnValue,
    windowStart,
    windowEnd,
    patternFrequencies,
    pattern,
  } = state
  const isActive = (index) =>
    done && !__returnValue ? true : index >= windowStart && index <= windowEnd
  const step = done
    ? __returnValue
      ? 'Done! 🥳'
      : 'Not found 😢'
    : windowEnd < pattern.length
    ? `Building window 🚧`
    : `Sliiide 🏂`
  return (
    <>
      <p tw="font-semibold text-center text-gray-500">{step}</p>
      <h1 tw="text-4xl font-serif text-center my-10">
        {[...state.str].map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            tw="inline-block"
            animate={{
              opacity: isActive(index) ? 1 : 0.1,
              y: isActive(index) ? 0 : 4,
            }}
          >
            {char}
          </motion.span>
        ))}
      </h1>
      <section tw="text-center">
        <code tw="block mb-4">Pattern: {pattern}</code>
        <Dictionary entries={patternFrequencies} />
      </section>
    </>
  )
}

function Dictionary({ entries }) {
  return (
    <ul tw="w-1/2 mx-auto mb-4 list-none md:w-1/3">
      {Object.entries(entries).map(([key, val]) => (
        <li key={key} tw="flex mb-1 font-semibold">
          <p tw="flex-1 mr-1 text-white bg-gray-400 rounded-md">{key}</p>
          <p tw="flex items-center justify-center flex-1 font-mono text-sm text-gray-500 bg-gray-100 rounded-md">
            {val}
          </p>
        </li>
      ))}
    </ul>
  )
}
