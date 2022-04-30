import React from 'react'

import { useSequence } from '@/lib/utils'

import { useBox } from '../use-box'
import {
  FlipWrapper,
  FlipConsole,
  Square,
  XLine,
  YLine,
  Display,
  Label,
  Outline,
  DomRect,
} from './shared'

export const Last = () => {
  const ref = React.useRef<HTMLButtonElement>(null)
  const [box, setBox] = React.useState<DOMRect>(null)
  const [hovering, setHovering] = React.useState(false)

  const [originalRef, originalBox] = useBox<HTMLButtonElement>()
  const { state, next } = useSequence(['start', 'toggled', 'measured'] as const)

  const record = () => {
    if (state === 'start') {
      next()
    } else if (state === 'toggled') {
      setBox(ref.current.getBoundingClientRect())
      next()
    }
  }
  const toggled = state !== 'start'

  return (
    <FlipWrapper>
      <Display toggled={toggled}>
        <Label>justify-content: {toggled ? 'flex-end' : 'flex-start'}</Label>
        {(hovering || box) && state !== 'start' && (
          <>
            <XLine />
            <YLine style={{ x: '-2rem' }} />
          </>
        )}
        <Outline ref={originalRef} type="outline" />
        <Square
          ref={ref}
          onClick={record}
          onHoverStart={() => setHovering(true)}
          onHoverEnd={() => setHovering(false)}
        />
      </Display>
      <FlipConsole>
        <ul>
          <DomRect label="First position" box={originalBox} />
          <li>
            {state === 'start' && <button onClick={next}>Toggle layout</button>}
            {state === 'toggled' && (
              <p>Click on the box again to record its last coordinates.</p>
            )}
            {state === 'measured' && (
              <DomRect label="Last position" box={box} />
            )}
          </li>
        </ul>
      </FlipConsole>
    </FlipWrapper>
  )
}
