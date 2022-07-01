import React from 'react'
import { motion } from 'framer-motion'
import { styled } from '@/stitches'
import { range } from '@/lib/utils'

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
              strokeWidth="0.1"
              variants={{
                hover: {
                  strokeWidth: 0.3,
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

const CELL_SIZE = 8

const Grid: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 10,
  cols = 15,
  children,
}) => {
  return (
    <svg width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <Wrapper>
        {range(rows).map((index) => (
          <line
            key={`row-${index}`}
            x1="0"
            x2="100"
            y1={index * CELL_SIZE}
            y2={index * CELL_SIZE}
            stroke="currentColor"
            strokeWidth="0.2"
          />
        ))}
        {range(cols).map((index) => (
          <line
            key={`col-${index}`}
            x1={index * CELL_SIZE}
            x2={index * CELL_SIZE}
            y1="0"
            y2="100"
            stroke="currentColor"
            strokeWidth="0.2"
          />
        ))}
      </Wrapper>
      {children}
    </svg>
  )
}

const Wrapper = styled('g', {
  color: '$grey100',
})
