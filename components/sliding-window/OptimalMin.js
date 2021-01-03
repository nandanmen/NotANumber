import Item from '../shared/Item'
import SlidingWindow from './shared/SlidingWindow'

export default function OptimalMin({ state }) {
  const { __done: done, windowStart, windowEnd, result, arr } = state
  const isActive = (index) =>
    done ? true : index >= windowStart && index <= windowEnd
  return (
    <div className="flex flex-col items-start md:items-center overflow-x-scroll px-4">
      <h3 className="text-gray-500 font-semibold">Optimal</h3>
      <div className="flex justify-start items-center relative py-12">
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
      <code className="block whitespace-nowrap">
        Result: {JSON.stringify(result.map(Number), null, 2)}
      </code>
    </div>
  )
}
