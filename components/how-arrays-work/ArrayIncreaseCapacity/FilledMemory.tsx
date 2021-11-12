import { styled } from '@/stitches'
import { StaticVisual } from '@/components/AlgorithmPlayer'
import { MemoryList, Memory } from '../Memory'

const memory = new Memory(12)
  .setAnonymous([2, 4])
  .set(5, 10)
  .set(6, 20)
  .setAnonymous([7, 10])

export function FilledMemory() {
  return (
    <StaticVisual>
      <Center>
        <MemoryList state={{ memory: memory.data }} rowSize={4} />
      </Center>
    </StaticVisual>
  )
}

const Center = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})
