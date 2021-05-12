import Item from '../Item'

export default function Derive({ state }) {
  const [start, end] = state.window
  return (
    <>
      <div className="flex justify-center">
        {state.arr.map((item, index) => (
          <Item
            key={item}
            active={index >= start && index < end}
            variants={variants}
          >
            {item}
          </Item>
        ))}
      </div>
      <p className="w-full mt-4 font-mono text-center">
        sum: {state.sum}{' '}
        {state.diff && `(${state.diff > 0 ? `+${state.diff}` : state.diff})`}
      </p>
    </>
  )
}

const variants = {
  show: {
    y: 0,
    opacity: 1,
  },
  hide: {
    y: 5,
    opacity: 0.25,
  },
}
