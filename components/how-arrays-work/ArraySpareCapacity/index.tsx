import { styled } from '@/stitches'
import { StaticVisual } from '@/components/AlgorithmPlayer'

import { MemoryList, Memory } from '../Memory'

export * from './SetSpareCapacity'

const memory = new Memory(4).allocate(3).set(0, 10).set(1, 20)

export function ArraySpareCapacity() {
  return (
    <StaticVisual>
      <Center>
        <MemoryList state={{ memory: memory.data }} />
        <Legend>
          <LegendItem>
            <SmallBlock />
            <LegendText>Spare capacity</LegendText>
          </LegendItem>
          <LegendItem>
            <SmallFreeBlock />
            <LegendText>Unallocated memory</LegendText>
          </LegendItem>
        </Legend>
      </Center>
    </StaticVisual>
  )
}

const Center = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  '> :not(:last-child)': {
    marginBottom: '$8',
  },
})

const SmallBlock = styled('div', {
  width: '$6',
  aspectRatio: 1,
  background: '$white',
  border: '2px solid $grey400',
  borderRadius: 4,
})

const SmallFreeBlock = styled(SmallBlock, {
  background: '$grey100',
  border: '2px dashed $grey400',
})

const Legend = styled('ul', {
  '> :not(:last-child)': {
    marginBottom: '$1',
  },
})

const LegendItem = styled('li', {
  display: 'flex',
  gap: '$2',
})

const LegendText = styled('p', {
  color: '$grey600',
})
