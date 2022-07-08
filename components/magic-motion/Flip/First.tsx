import React from 'react'

import Figure from '@/elements/Figure'

import {
  FlipWrapper,
  FlipDisplay,
  FlipConsole,
  XLine,
  YLine,
  DomRect,
  Square,
} from './shared'

export const First = () => {
  const [box, setBox] = React.useState<{ x: number; y: number }>(null)
  return (
    <Figure size="lg">
      <FlipWrapper>
        <FlipDisplay>
          {box && (
            <>
              <YLine x={12.5} />
              <XLine y={27.5} />
            </>
          )}
          <Square
            style={{ x: 5, y: 20 }}
            onClick={() => setBox({ x: 5, y: 20 })}
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
    </Figure>
  )
}
