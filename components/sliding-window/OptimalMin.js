import Item from '../shared/Item'
import SlidingWindow from './shared/SlidingWindow'

export default function OptimalMin({ state }) {
  const { __done: done, windowStart, windowEnd, result, arr } = state
  const isActive = (index) =>
    done ? true : index >= windowStart && index <= windowEnd
  return (
    <div className="flex flex-col items-start md:items-center overflow-x-scroll px-4">
      <div className="flex justify-start items-center relative py-12">
        <SlidingWindow
          start={windowStart}
          end={done ? arr.length - 1 : windowEnd}
        />
        {arr.map((item, index) => (
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
