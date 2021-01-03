import Item from '../shared/Item'
import SlidingWindow from './shared/SlidingWindow'

export default function Optimal({ state }) {
  const {
    __done: done,
    windowStart,
    windowEnd,
    windowSum,
    result,
    arr,
    k,
  } = state
  const isActive = (index) =>
    done ? true : index >= windowStart && index <= windowEnd
  const step = done
    ? 'Done! 🥳'
    : windowEnd < k
    ? `Building window 🚧`
    : `Sliiide 🏂`
  return (
    <>
      <p className="text-gray-500 font-semibold text-center">{step}</p>
      <div className="flex justify-center my-12">
        <div className="flex justify-start items-center relative">
          <SlidingWindow
            start={windowStart}
            end={done ? arr.length - 1 : windowEnd}
          />
          {arr.map((item, index) => (
            <Item key={item} active={isActive(index)}>
              {item}
            </Item>
          ))}
        </div>
      </div>
      <section className="text-center">
        <code className="block">Window sum: {windowSum}</code>
        <code className="block">Subarray size: {k}</code>
        <code className="block">
          Result: {JSON.stringify(result.map(Number), null, 2)}
        </code>
      </section>
    </>
  )
}
