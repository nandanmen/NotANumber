import React from 'react'
import { motion } from 'framer-motion'

import { styled } from '@/stitches'
import ArrayItem from './ArrayItem'

const ROWS = 3
const COLS = 8
const CELL_SIZE = 100

const range = (length: number) => Array.from({ length }).fill(-1)

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

type ArrayGrowProps = {
  initialArr: number[]
}

export default function ArrayGrow({ initialArr }: ArrayGrowProps) {
  const [arr, setArr] = React.useState(initialArr)
  return (
    <Figure className="full-width">
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
            <ArrayItem
              key={index}
              style={{ '--size': `${CELL_SIZE}px` }}
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {item}
            </ArrayItem>
          ))}
        </List>
        <ButtonWrapper>
          <Button
            onClick={() => setArr([...arr, getRandomInt(0, 100)])}
            whileTap={{ x: 4, y: 4 }}
          >
            Grow 📈
          </Button>
          <ButtonShadow />
        </ButtonWrapper>
      </Wrapper>
    </Figure>
  )
}

const ButtonWrapper = styled('div', {
  gridColumn: '4 / span 2',
  gridRow: '3',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  zIndex: '10',
  height: '100%',
  '--color': '187, 55%',
})

const Button = styled(motion.button, {
  color: 'white',
  bottom: '24px',
  backgroundColor: 'hsla(var(--color), 41%)',
  fontWeight: '500',
  fontFamily: 'var(--text-mono)',
  padding: '8px 12px',
  borderRadius: '8px',

  '&:focus': {
    outline: 'none',
  },
})

const ButtonShadow = styled('div', {
  position: 'absolute',
  transform: 'translate(4px, 4px)',
  backgroundColor: 'hsla(var(--color), 81%)',
  // TODO: Fix this so it's not hard-coded
  height: '40px',
  width: '88px',
  borderRadius: '8px',
  zIndex: '-1',
})

const List = styled('ul', {
  display: 'flex',
  position: 'relative',
})

const Figure = styled('figure', {
  display: 'flex',
  justifyContent: 'center',
})

const Wrapper = styled('div', {
  position: 'relative',
  height: `${ROWS * CELL_SIZE}px`,
  width: `${COLS * CELL_SIZE}px`,
  padding: `${CELL_SIZE}px`,
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
