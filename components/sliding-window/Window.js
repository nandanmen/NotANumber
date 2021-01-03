import Item from '../shared/Item'
import SlidingWindow from './shared/SlidingWindow'

export default function Window({ state }) {
  const [start, end] = state.window
  return (
    <>
      <div className="flex justify-center">
        <div className="flex justify-center items-center relative">
          <SlidingWindow start={start} end={end - 1} />
          {state.arr.map((item, index) => (
            <Item key={item} active={index >= start && index < end}>
              {item}
            </Item>
          ))}
        </div>
      </div>
      <p className="w-full text-center mt-16 font-mono">sum: {state.sum}</p>
    </>
  )
}
