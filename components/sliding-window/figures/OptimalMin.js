import Item from '../Item'
import SlidingWindow from '../SlidingWindow'

export default function OptimalMin({ state }) {
  const { __done: done, windowStart, windowEnd, result, chocolates } = state
  const isActive = (index) =>
    done ? true : index >= windowStart && index <= windowEnd
  return (
    <div className="flex flex-col items-start px-4 overflow-x-scroll md:items-center md:overflow-x-hidden">
      <div className="relative flex items-center justify-start py-12">
        <SlidingWindow
          start={windowStart}
          end={done ? chocolates.length - 1 : windowEnd}
        />
        {chocolates.map((item, index) => (
          <Item key={index} active={isActive(index)}>
            {item}
          </Item>
        ))}
      </div>
      <code className="block whitespace-nowrap">
        {JSON.stringify(
          result.map((avg) => Number(avg.toFixed(2))),
          null,
          2
        )}
      </code>
    </div>
  )
}
