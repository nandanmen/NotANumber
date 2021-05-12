import Item from '../Item'
import SlidingWindow from '../SlidingWindow'

export default function Optimal({ state }) {
  const {
    __done: done,
    windowStart,
    windowEnd,
    windowSum,
    result,
    chocolates,
    period,
  } = state
  const isActive = (index) =>
    done ? true : index >= windowStart && index <= windowEnd
  const step = done
    ? 'Done! 🥳'
    : windowEnd < period
    ? `Building window 🚧`
    : `Sliiide 🏂`
  return (
    <>
      <p className="font-semibold text-center text-gray-500">{step}</p>
      <div className="flex justify-center my-12">
        <div className="relative flex items-center justify-start">
          <SlidingWindow
            start={windowStart}
            end={done ? chocolates.length - 1 : windowEnd}
          />
          {chocolates.map((item, index) => (
            <Item key={item} active={isActive(index)}>
              {item}
            </Item>
          ))}
        </div>
      </div>
      <p className="mt-16 font-mono text-center">period: 3</p>
      <p className="font-mono text-center">sum: {windowSum}</p>
      <p className="font-mono text-center">
        result: {JSON.stringify(result.map(Number), null, 2)}
      </p>
    </>
  )
}
