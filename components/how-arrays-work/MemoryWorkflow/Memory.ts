import { produce } from 'immer'
import { range } from '@/lib/utils'

export const DEFAULT_MEMORY_SIZE = 8

type Value = number | string

export type MemoryBlockType = {
  state: 'free' | 'allocated' | 'occupied'
  data: Value | null
}

export class Memory {
  data: MemoryBlockType[]

  constructor() {
    this.data = range(DEFAULT_MEMORY_SIZE).map(() => ({
      state: 'free',
      data: null,
    }))
  }

  allocate(size: number) {
    this.data = produce(this.data, (draft) => {
      range(size).forEach((offset) => (draft[offset].state = 'allocated'))
    })
    return this
  }

  set(address: number, value: Value) {
    this.data = produce(this.data, (draft) => {
      const block = draft[address]
      block.state = 'occupied'
      block.data = value
    })
    return this
  }

  map<ReturnType>(
    callback: (block: MemoryBlockType, index: number) => ReturnType
  ): ReturnType[] {
    return this.data.map(callback)
  }
}
