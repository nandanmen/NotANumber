import Item from '../Item'
import SlidingWindow from '../SlidingWindow'

export default function SmallestSubarrayWindow({ state }) {
  return (
    <>
      <div className="flex justify-center">
        <div className="relative flex items-center justify-center">
          <SlidingWindow start={0} end={state.windowEnd} />
          {state.arr.map((item, index) => (
            <Item key={item} active={index >= 0 && index <= state.windowEnd}>
              {item}
            </Item>
          ))}
        </div>
      </div>
      <p className="w-full mt-16 font-mono text-center">sum: {state.sum}</p>
    </>
  )
}
