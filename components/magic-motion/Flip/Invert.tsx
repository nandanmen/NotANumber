import React from 'react'

import Figure from '@/elements/Figure'
import { Slider } from '@/components/Slider'
import { styled } from '@/stitches'

import {
  FlipWrapper,
  FlipConsole,
  FlipDisplay,
  Label,
  Outline,
  Square,
  DomRect,
  ConsoleItem,
  List,
} from './shared'

export const Invert = () => {
  const [x, setX] = React.useState(80)
  return (
    <Figure size="lg">
      <FlipWrapper>
        <FlipDisplay>
          <Label>justify-content: flex-end</Label>
          <Outline style={{ x: 5, y: 20 }} />
          <Outline style={{ x: 80, y: 20 }} />
          <line
            x1={x + 7.5}
            x2="87.5"
            y1="27.5"
            y2="27.5"
            stroke="var(--gray600)"
            strokeWidth="0.2"
          />
          <circle
            cx="87.5"
            cy="27.5"
            r="1.5"
            stroke="var(--gray600)"
            strokeWidth="0.2"
            fill="white"
            strokeDasharray="2 1"
            transform={`rotate(${x * 10}, 87.5, 27.5)`}
          />
          <Square style={{ x, y: 20 }} />
        </FlipDisplay>
        <FlipConsole>
          <List>
            <DomRect label="First position" box={{ x: 5, y: 20 }} />
            <DomRect label="Last position" box={{ x: 80, y: 20 }} />
            <ConsoleItem label="Transform">translateX({x - 80})</ConsoleItem>
          </List>
        </FlipConsole>
      </FlipWrapper>
      <SliderWrapper>
        <Slider
          type="range"
          min="0"
          max="80"
          value={x}
          onChange={(e) => setX(e.target.valueAsNumber)}
        />
      </SliderWrapper>
    </Figure>
  )
}

const SliderWrapper = styled('div', {
  margin: '$0 $8',
  marginTop: '$4',
})
