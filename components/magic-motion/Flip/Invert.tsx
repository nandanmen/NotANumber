import React from 'react'

import { styled } from '@/stitches'
import { Slider } from '@/components/Slider'
import { FlipWrapper, FlipConsole, FlipDisplay, Square } from './shared'

export const Invert = () => {
  const ref = React.useRef<HTMLButtonElement>(null)
  const [box, setBox] = React.useState<DOMRect>(null)
  const [x, setX] = React.useState(0)

  React.useEffect(() => {
    setBox(ref.current.getBoundingClientRect())
  }, [])

  return (
    <FlipWrapper>
      <Display toggled>
        <Label>justify-content: flex-end</Label>
        <Outline type="outline" />
        <Square ref={ref} style={{ x }} />
      </Display>
      <FlipConsole>
        {box && (
          <ul>
            <li>
              <p>x: {Number(box.x.toFixed()) + x}</p>
              <p>y: {box.y.toFixed()}</p>
            </li>
            <li>
              <Slider
                type="range"
                min="-400"
                max="0"
                value={x}
                onChange={(evt) => setX(evt.target.valueAsNumber)}
              />
            </li>
          </ul>
        )}
      </FlipConsole>
    </FlipWrapper>
  )
}

const Label = styled('p', {
  fontFamily: '$mono',
  fontSize: '$sm',
  color: '$grey600',
  position: 'absolute',
  top: '$4',
  left: '$4',
})

const Outline = styled(Square, {
  position: 'absolute',
  left: '$6',
})

const Display = styled(FlipDisplay, {
  variants: {
    toggled: {
      true: {
        justifyContent: 'flex-end',
      },
    },
  },
})
