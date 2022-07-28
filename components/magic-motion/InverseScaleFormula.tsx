import React from 'react'
import { motion } from 'framer-motion'

import Figure from '@/elements/Figure'
import { styled } from '@/stitches'

import { Grid } from './Flip/shared/Grid'
import { Square } from './Flip'
import { Slider } from '../Slider'

export function InverseScaleFormula() {
  const [scaleX, setScaleX] = React.useState(1)
  const currentWidth = 15 * scaleX
  return (
    <Figure size="lg">
      <VisualWrapper>
        <Grid rows={7} cols={15}>
          <motion.g style={{ x: 59.5 - currentWidth / 2, y: 20 }}>
            <Square disabled width={currentWidth} />
            <Text x={currentWidth / 2} y={7.5}>
              Hi!
            </Text>
          </motion.g>
          <Pointer style={{ x: 60, y: 15 }}>
            <line
              x1="0"
              x2="0"
              y1="0"
              y2="8"
              stroke="currentColor"
              strokeWidth="0.3"
            />
            <line
              x1="-2"
              x2="2"
              y1="8"
              y2="8"
              stroke="currentColor"
              strokeWidth="0.3"
            />
          </Pointer>
          <SubText x={60} y={40}>
            scaleX({scaleX.toFixed(2)})
          </SubText>
          <LabelText x={60} y={12}>
            scaleX({(1 / scaleX).toFixed(2)})
          </LabelText>
        </Grid>
      </VisualWrapper>
      <SliderWrapper>
        <Slider
          type="range"
          min="1"
          max="5"
          value={scaleX}
          onChange={(e) => setScaleX(e.target.valueAsNumber)}
          step="0.1"
        />
      </SliderWrapper>
    </Figure>
  )
}

const Pointer = styled(motion.g, {
  color: '$grey600',
})

const SliderWrapper = styled('div', {
  marginTop: '$8',
  padding: '$0 $8',
})

const VisualWrapper = styled('div', {
  aspectRatio: 2,
  border: '1px solid $grey200',
})

const Text = styled(motion.text, {
  fontFamily: '$mono',
  fontWeight: 'bold',
  fontSize: 3,
  textAnchor: 'middle',
  dominantBaseline: 'middle',
})

const LabelText = styled(Text, {
  fill: '$grey600',
  fontWeight: 'normal',
})

const SubText = styled(LabelText, {
  fontSize: 2.5,
})
