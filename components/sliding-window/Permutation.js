import Item from '../shared/Item'
import SlidingWindow from './shared/SlidingWindow'

export default function Permutation({ state }) {
  const {
    __done: done,
    __returnValue,
    windowStart,
    windowEnd,
    str,
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
      <p className="font-semibold text-center text-gray-500">{step}</p>
      <div className="flex justify-center my-12">
        <div className="relative flex items-center justify-start">
          <SlidingWindow start={windowStart} end={windowEnd} />
          {[...str].map((item, index) => (
            <Item
              key={`${item}-${index}`}
              active={isActive(index)}
              variant={done ? (__returnValue ? 'base' : 'danger') : 'base'}
            >
              {item}
            </Item>
          ))}
        </div>
      </div>
      <section className="text-center">
        <code className="block">Pattern: {pattern}</code>
        <code className="block my-4">
          {pattern} - {str.slice(windowStart, windowEnd + 1)}
        </code>
        <Dictionary entries={patternFrequencies} />
      </section>
    </>
  )
}

function Dictionary({ entries }) {
  return (
    <ul className="w-1/2 mx-auto mb-4 list-none md:w-1/3">
      {Object.entries(entries).map(([key, val]) => (
        <li key={key} className="flex mb-1 font-semibold">
          <p className="flex-1 mr-1 text-white bg-gray-400 rounded-md">{key}</p>
          <p className="flex items-center justify-center flex-1 font-mono text-sm text-gray-500 bg-gray-100 rounded-md">
            {val}
          </p>
        </li>
      ))}
    </ul>
  )
}
