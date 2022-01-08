import React from 'react'

import { StaticVisual } from '@/components/AlgorithmPlayer'
import { Slider } from '@/components/Slider'
import { styled } from '@/stitches'

import { getSchools, SchoolList } from './SchoolList'

export function FormulaStartSlider({ start = 6 }) {
  const [startingValue, setStartingValue] = React.useState(start)
  const snapshots = getSchools([startingValue], 14)

  return (
    <div>
      <Controls>
        <Title>Starting value: {startingValue}</Title>
        <Slider
          min={0}
          max={6}
          value={startingValue}
          onInput={(evt) => setStartingValue(evt.target.valueAsNumber)}
        />
      </Controls>
      <StaticVisual>
        <Content>
          <p>
            Actual fish created: {snapshots[snapshots.length - 1].length - 1}
          </p>
          <p>Calculated fish created: 14 / 7 = 2</p>
          <Output>
            <SchoolList schools={snapshots} />
          </Output>
        </Content>
      </StaticVisual>
    </div>
  )
}

const Controls = styled('div', {
  marginBottom: '$8',
})

const Title = styled('h4', {
  textAlign: 'center',
  fontWeight: 700,
  fontSize: '$lg',
  marginBottom: '$2',
})

const Content = styled('div', {
  fontFamily: '$mono',
  padding: '$0 $8',
})

const Output = styled('div', {
  marginTop: '$4',
})
