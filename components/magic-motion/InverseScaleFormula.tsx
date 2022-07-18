import React from 'react'
import { motion } from 'framer-motion'

import Figure from '@/elements/Figure'
import { styled } from '@/stitches'

import { Grid } from './Flip/shared/Grid'
import { Square } from './Flip'
import { Slider } from '../Slider'

export function InverseScaleFormula() {
  const [scaleX, setScaleX] = React.useState(1)
  return (
    <Figure size="lg">
      <Wrapper>
        <Grid rows={7} cols={15}>
          <motion.g style={{ x: 52, y: 20, scaleX }}>
            <Square stroke="none" rx="0" shadow={false} disabled />
            <Text x={7.5} y={7.5} style={{ scaleX: 1 / scaleX }}>
              Hi!
            </Text>
          </motion.g>
          <motion.g style={{ x: 60, y: 14 }}>
            <line
              x1="0"
              x2="0"
              y1="0"
              y2="8"
              stroke="currentColor"
              strokeWidth="0.3"
            />
            <line
              x1="-3"
              x2="3"
              y1="8"
              y2="8"
              stroke="currentColor"
              strokeWidth="0.3"
            />
          </motion.g>
          <SubText x={60} y={40}>
            scaleX({scaleX.toFixed(2)})
          </SubText>
          <LabelText x={60} y={12}>
            scaleX({(1 / scaleX).toFixed(2)})
          </LabelText>
        </Grid>
      </Wrapper>
      <Slider
        type="range"
        min="1"
        max="5"
        value={scaleX}
        onChange={(e) => setScaleX(e.target.valueAsNumber)}
        step="0.1"
      />
    </Figure>
  )
}

const Wrapper = styled('div', {
  aspectRatio: 2,
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
