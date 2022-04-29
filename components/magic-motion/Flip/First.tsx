import React from 'react'

import { Center } from '@/components/utils/Center'
import {
  FlipWrapper,
  FlipDisplay,
  Square,
  FlipConsole,
  XLine,
  YLine,
} from './shared'

export const First = () => {
  const ref = React.useRef<HTMLButtonElement>()
  const [box, setBox] = React.useState<{ x: number; y: number }>(null)
  const [hovering, setHovering] = React.useState(false)

  function record() {
    const { x, y } = ref.current.getBoundingClientRect()
    setBox({ x, y })
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
        <Center>
          {box ? (
            <div>
              <p>x: {box.x.toFixed()}</p>
              <p>y: {box.y.toFixed()}</p>
            </div>
          ) : (
            <p>Click on the box to record its coordinates.</p>
          )}
        </Center>
      </FlipConsole>
    </FlipWrapper>
  )
}
