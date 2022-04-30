import React from 'react'

import { useSequence } from '@/lib/utils'
import {
  FlipWrapper,
  FlipConsole,
  Square,
  XLine,
  YLine,
  Display,
  Label,
  Outline,
} from './shared'

export const Last = () => {
  const ref = React.useRef<HTMLButtonElement>(null)
  const [box, setBox] = React.useState<DOMRect>(null)
  const [hovering, setHovering] = React.useState(false)
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
        <Outline type="outline" />
        <Square
          ref={ref}
          onClick={record}
          onHoverStart={() => setHovering(true)}
          onHoverEnd={() => setHovering(false)}
        />
      </Display>
      <FlipConsole>
        <ul>
          <li>
            <p>x: 50</p>
            <p>y: 50</p>
          </li>
          <li>
            {state === 'start' && <button onClick={next}>Toggle layout</button>}
            {state === 'toggled' && (
              <p>Click on the box again to record its last coordinates.</p>
            )}
            {state === 'measured' && (
              <>
                <p>x: {box.x.toFixed()}</p>
                <p>y: {box.y.toFixed()}</p>
              </>
            )}
          </li>
        </ul>
      </FlipConsole>
    </FlipWrapper>
  )
}
