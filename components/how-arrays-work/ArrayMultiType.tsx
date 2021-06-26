import { styled } from '@/stitches'

import ArrayItem from './ArrayItem'

const ROWS = 3
const COLS = 8
const CELL_SIZE = 100

const range = (length: number) => Array.from({ length }).fill(-1)

type ArrayLookupProps = {
  arr: number[]
}

export default function ArrayMultiType({ arr }: ArrayLookupProps) {
  return (
    <Figure className="full-width-2x">
      <Wrapper>
        <Background>
          {range(ROWS).map((_, index) => (
            <Row key={index} />
          ))}
        </Background>
        <Columns>
          {range(COLS).map((_, index) => (
            <Column key={index} />
          ))}
        </Columns>
        <List>
          {arr.map((item, index) => (
            <ArrayItem key={index} style={{ '--size': `${CELL_SIZE}px` }}>
              {item}
            </ArrayItem>
          ))}
        </List>
      </Wrapper>
    </Figure>
  )
}

const List = styled('ul', {
  display: 'flex',
  gridColumn: 'var(--column, 2 / -2)',
  gridRow: 'var(--row, 2)',
})

const Figure = styled('figure', {
  display: 'flex',
  justifyContent: 'center',
})

const Wrapper = styled('div', {
  position: 'relative',
  height: `${ROWS * CELL_SIZE}px`,
  width: `${COLS * CELL_SIZE}px`,
  display: 'grid',
  gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
  gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
})

const Background = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
})

const Columns = styled(Background, {
  display: 'flex',
})

const Row = styled('div', {
  width: '100%',
  height: `${CELL_SIZE}px`,
  borderBottom: '2px dashed var(--gray200)',
  '&:last-child': {
    borderBottom: 'none',
  },
})

const Column = styled('div', {
  width: `${CELL_SIZE}px`,
  height: '100%',
  borderRight: '2px dashed var(--gray200)',
  '&:last-child': {
    borderRight: 'none',
  },
})
