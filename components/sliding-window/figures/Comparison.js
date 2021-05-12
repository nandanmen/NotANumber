import Item from '../Item'

const variants = {
  hide: {
    scale: 0.95,
    opacity: 0.25,
  },
  show: {
    scale: 1,
    opacity: 1,
  },
}

export default function Comparison() {
  const subOne = [1, 2, 3, 4]
  const subTwo = [1, 2, 3, 4]
  return (
    <>
      <div className="flex justify-center">
        {subOne.map((item, index) => (
          <Item
            key={index}
            variant={index > 0 && index < subOne.length - 1 ? 'danger' : 'base'}
            className="relative"
            active={index < subOne.length - 1}
            variants={variants}
          >
            {item}
          </Item>
        ))}
      </div>
      <div className="flex justify-center mt-2">
        {subTwo.map((item, index) => (
          <Item
            key={index}
            variant={index > 0 && index < subTwo.length - 1 ? 'danger' : 'base'}
            className="relative"
            active={index > 0}
            variants={variants}
          >
            {item}
          </Item>
        ))}
      </div>
    </>
  )
}
