import React from 'react'
import { motion } from 'framer-motion'
import { styled } from '@/stitches'

import { Grid } from './shared/Grid'

import {
  FlipWrapper,
  FlipDisplay,
  FlipConsole,
  XLine,
  YLine,
  DomRect,
} from './shared'

export const First = () => {
  const ref = React.useRef<SVGRectElement>()
  const [box, setBox] = React.useState<DOMRect>(null)

  function record() {
    setBox(ref.current.getBoundingClientRect())
  }

  return (
    <FlipWrapper>
      <Display>
        <Grid>
          {box && (
            <>
              <line
                x1="12.5"
                x2="12.5"
                y1="0"
                y2="100"
                stroke="var(--gray200)"
                strokeWidth="0.4"
              />
              <line
                x1="0"
                x2="100"
                y1="27.5"
                y2="27.5"
                stroke="var(--gray200)"
                strokeWidth="0.4"
              />
            </>
          )}
          <motion.g
            style={{ x: 5, y: 20 }}
            whileHover="hover"
            variants={{ hover: { scale: 1.1 } }}
          >
            <rect
              fill="var(--gray200)"
              width="15"
              height="15"
              rx="1"
              x="1"
              y="1"
            />
            <Square
              ref={ref}
              fill="rgb(183, 217, 248)"
              width="15"
              height="15"
              rx="1"
              stroke="currentColor"
              strokeWidth="0.2"
              variants={{
                hover: {
                  strokeWidth: 0.3,
                  stroke: 'rgba(0,145,255,1)',
                },
              }}
              onClick={record}
            />
          </motion.g>
        </Grid>
      </Display>
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

const Square = styled(motion.rect, {
  cursor: 'pointer',
})

const Display = styled('div', {
  background: '$white',
  borderRight: '1px solid $black',
})
