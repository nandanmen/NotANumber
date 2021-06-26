import { FaLongArrowAltDown } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useInViewAnimate } from 'framer-motion-hooks'

import { styled } from '@/stitches'
import Refresh from '@/components/utils/Refresh'

import ArrayItem from './ArrayItem'

const ROWS = 3
const COLS = 8
const CELL_SIZE = 100

const range = (length: number) => Array.from({ length }).fill(-1)

type ArrayLookupProps = {
  arr: number[]
  activeIndex: number
}

export default function ArrayLookup({ arr, activeIndex }: ArrayLookupProps) {
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
        <Pointer />
        <List>
          {arr.map((item, index) => (
            <ArrayItem
              key={index}
              style={{ '--size': `${CELL_SIZE}px` }}
              active={index === activeIndex}
            >
              {item}
            </ArrayItem>
          ))}
        </List>
        <List style={{ '--row': 3 } as React.CSSProperties}>
          {arr.map((_, index) => (
            <Index key={index}>{index}</Index>
          ))}
        </List>
      </Wrapper>
    </Figure>
  )
}

function Pointer() {
  const { inViewRef, animation } = useInViewAnimate({
    animate: { opacity: 1, y: 0 },
  })
  return (
    <PointerWrapper
      ref={inViewRef}
      initial={{ opacity: 0, y: -12 }}
      animate={animation}
      transition={{ duration: 0.8 }}
    >
      <FaLongArrowAltDown />
    </PointerWrapper>
  )
}

const PointerWrapper = styled(motion.div, {
  gridColumn: '5',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  fontSize: '2rem',
  color: 'hsl(187,55%,41%)',
  paddingBottom: '16px',
})

function Index({ children }) {
  const { inViewRef, animation } = useInViewAnimate({
    animate: { opacity: 1, y: 0 },
  })
  return (
    <IndexWrapper
      ref={inViewRef}
      animate={animation}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </IndexWrapper>
  )
}

const IndexWrapper = styled(motion.div, {
  width: `${CELL_SIZE}px`,
  height: `${CELL_SIZE}px`,
  fontFamily: 'var(--text-mono)',
  paddingTop: '16px',
  color: 'var(--gray600)',
  display: 'flex',
  justifyContent: 'center',
})

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
