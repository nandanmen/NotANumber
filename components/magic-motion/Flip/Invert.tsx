import React from 'react'
import { useMotionValue } from 'framer-motion'

import { useBox } from '../use-box'
import {
  FlipWrapper,
  FlipConsole,
  Display,
  Label,
  Outline,
  Square,
  DomRect,
} from './shared'

function useReactiveMotionValue<ValueType>(initial: ValueType) {
  const [reactiveValue, setReactiveValue] = React.useState(initial)
  const value = useMotionValue(initial)

  React.useEffect(() => {
    value.onChange(setReactiveValue)
  }, [])

  return [value, reactiveValue] as const
}

export const Invert = () => {
  const containerRef = React.useRef()
  const [dragged, setDragged] = React.useState(false)

  const [x, reactiveX] = useReactiveMotionValue(0)
  const [originalRef, originalBox] = useBox<HTMLButtonElement>()
  const [boxRef, box] = useBox<HTMLButtonElement>()

  return (
    <FlipWrapper>
      <Display toggled ref={containerRef}>
        <Label>justify-content: flex-end</Label>
        <Outline ref={originalRef} type="outline" />
        <Square
          ref={boxRef}
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.1}
          style={{ x }}
          onDragStart={() => setDragged(true)}
        />
      </Display>
      <FlipConsole>
        {box && (
          <ul>
            <DomRect label="First position" box={originalBox} />
            <DomRect label="Last position" box={box} />
            <li>
              {dragged ? (
                <p>transform: translateX({reactiveX.toFixed()}px)</p>
              ) : (
                <p>Drag the box to its original position.</p>
              )}
            </li>
          </ul>
        )}
      </FlipConsole>
    </FlipWrapper>
  )
}
