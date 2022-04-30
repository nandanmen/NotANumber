import React from 'react'

import {
  FlipWrapper,
  FlipDisplay,
  Square,
  FlipConsole,
  XLine,
  YLine,
  DomRect,
} from './shared'

export const First = () => {
  const ref = React.useRef<HTMLButtonElement>()
  const [box, setBox] = React.useState<DOMRect>(null)
  const [hovering, setHovering] = React.useState(false)

  function record() {
    setBox(ref.current.getBoundingClientRect())
  }

  return (
    <FlipWrapper>
      <FlipDisplay>
        {(hovering || box) && (
          <>
            <XLine />
            <YLine style={{ x: '2rem' }} />
          </>
        )}
        <Square
          ref={ref}
          onHoverStart={() => setHovering(true)}
          onHoverEnd={() => setHovering(false)}
          onClick={record}
        />
      </FlipDisplay>
      <FlipConsole>
        {box ? (
          <DomRect label="First position" box={box} />
        ) : (
          <p>Click on the box to record its coordinates.</p>
        )}
      </FlipConsole>
    </FlipWrapper>
  )
}
