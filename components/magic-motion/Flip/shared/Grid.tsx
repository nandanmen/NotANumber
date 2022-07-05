import { styled } from '@/stitches'

import { range } from '@/lib/utils'

const CELL_SIZE = 8

export const Grid: React.FC<{ rows?: number; cols?: number }> = ({
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
