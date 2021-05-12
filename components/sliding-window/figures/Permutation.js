import { motion } from 'framer-motion'
import 'twin.macro'

import Dictionary from '../Dictionary'

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
        <Dictionary
          tw="w-1/2 mx-auto mb-4 md:w-1/3"
          entries={patternFrequencies}
        />
      </section>
    </>
  )
}
