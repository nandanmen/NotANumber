import { styled } from '@/stitches'
import { StaticVisual } from '@/components/AlgorithmPlayer'

import { MemoryList, Memory } from '../Memory'

const memory = new Memory(4).allocate(3).set(0, 10).set(1, 20)

export function ArraySpareCapacity() {
  return (
    <StaticVisual>
      <MemoryList state={{ memory: memory.data }} />
    </StaticVisual>
  )
}
