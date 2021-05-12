import Item from '../Item'
import SlidingWindow from '../SlidingWindow'

export default function Window({ state }) {
  const [start, end] = state.window
  return (
    <>
      <div className="flex justify-center">
        <div className="relative flex items-center justify-center">
          <SlidingWindow start={start} end={end - 1} />
          {state.arr.map((item, index) => (
            <Item key={item} active={index >= start && index < end}>
              {item}
            </Item>
          ))}
        </div>
      </div>
      <p className="w-full mt-16 font-mono text-center">sum: {state.sum}</p>
    </>
  )
}
