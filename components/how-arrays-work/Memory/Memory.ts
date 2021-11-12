import { produce } from 'immer'

import { range } from '@/lib/utils'

export const DEFAULT_MEMORY_SIZE = 8

type Value = number | string

export type MemoryBlockType = {
  state: 'free' | 'allocated' | 'occupied' | 'anonymous'
  data: Value | null
}

export class Memory {
  data: MemoryBlockType[]

  constructor(length = DEFAULT_MEMORY_SIZE) {
    this.data = range(length).map(() => ({
      state: 'free',
      data: null,
    }))
  }

  allocate(size: number, start = 0) {
    this.data = produce(this.data, (draft) => {
      range(size).forEach(
        (offset) => (draft[offset + start].state = 'allocated')
      )
    })
    return this
  }

  get(address: number) {
    return this.data[address].data
  }

  set(addressOrInterval: number | number[], value: Value) {
    return this.updateBlocks(addressOrInterval, (block) => {
      block.state = 'occupied'
      block.data = value
    })
  }

  clear(addressOrInterval: number | number[]) {
    return this.updateBlocks(addressOrInterval, (block) => {
      block.state = 'allocated'
      block.data = null
    })
  }

  free(addressOrInterval: number | number[]) {
    return this.updateBlocks(addressOrInterval, (block) => {
      block.state = 'free'
      block.data = null
    })
  }

  /**
   * Sets the block(s) at the given address or interval to an anonymous block.
   * An anonymous block is a block that's occupied but is not owned by the
   * current data structure.
   */
  setAnonymous(addressOrInterval: number | number[]) {
    return this.updateBlocks(
      addressOrInterval,
      (block) => (block.state = 'anonymous')
    )
  }

  map<ReturnType>(
    callback: (block: MemoryBlockType, index: number) => ReturnType
  ): ReturnType[] {
    return this.data.map(callback)
  }

  private updateBlocks(
    addressOrInterval: number | number[],
    updateFn: (block: MemoryBlockType) => void
  ) {
    this.data = produce(this.data, (draft) => {
      const blocks = this.getBlocks(draft, addressOrInterval)
      blocks.forEach(updateFn)
    })
    return this
  }

  private getBlocks(
    data: MemoryBlockType[],
    addressOrInterval: number | number[]
  ) {
    if (typeof addressOrInterval === 'number') {
      return [data[addressOrInterval]]
    }
    const [start, end] = addressOrInterval
    return range(end - start + 1).map((offset) => data[start + offset])
  }
}
