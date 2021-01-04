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
      <p className="text-gray-500 font-semibold text-center">{step}</p>
      <div className="flex justify-center my-12">
        <div className="flex justify-start items-center relative">
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
    <ul className="list-none w-1/2 md:w-1/3 mx-auto mb-4">
      {Object.entries(entries).map(([key, val]) => (
        <li key={key} className="flex mb-1 font-semibold">
          <p className="flex-1 bg-gray-400 rounded-md mr-1 text-white">{key}</p>
          <p className="flex-1 bg-gray-100 flex items-center justify-center rounded-md text-gray-500 font-mono text-sm">
            {val}
          </p>
        </li>
      ))}
    </ul>
  )
}
