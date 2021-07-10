import React from 'react'
import produce from 'immer'

export type Value = number | string | boolean

export type Byte = {
  allocated: boolean
  value: Value
}

type MemoryOptions = {
  unsafe: boolean
  capacity: number
}

type MemoryParameters = {
  options: MemoryOptions
  values: Value[]
  data: Byte[]
}

const DEFAULT_OPTIONS: MemoryOptions = {
  unsafe: false,
  capacity: 18,
}

function toByteArray(values: Value[]): Byte[] {
  return values.map((value) => ({ allocated: false, value }))
}

export default class Memory {
  data: Byte[]
  options: MemoryOptions

  static from(values: Value[]): Memory {
    return new Memory({ data: toByteArray(values) })
  }

  constructor({
    options = DEFAULT_OPTIONS,
    data = toByteArray(Array.from({ length: options.capacity })),
  }: Partial<MemoryParameters> = {}) {
    this.data = data
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  get values() {
    return this.data.map(({ value }) => value)
  }

  set(address: number, value: Value) {
    // TODO: Check if allocated
    // TODO: Check if address is in capacity
    const data = produce(this.data, (draft) => {
      draft[address].value = value
    })
    return new Memory({ data, options: this.options })
  }

  get(address: number) {
    return this.data[address].value
  }

  allocate(bytes: number): [number | null, Memory] {
    for (let address = 0; address < this.data.length - bytes; address++) {
      const slice = this.data.slice(address, address + bytes)
      if (slice.every((byte) => !byte.allocated)) {
        return [
          address,
          new Memory({
            data: produce(this.data, (data) => {
              data.forEach((byte, index) => {
                if (index >= address && index < address + bytes) {
                  byte.allocated = true
                }
              })
            }),
          }),
        ]
      }
    }
    return [null, this]
  }
}

export function useMemory(values: Value[]) {
  const [memory, setMemory] = React.useState<Memory>(Memory.from(values))
  return {
    values: memory.values,
    set(address: number, value: number) {
      setMemory(memory.set(address, value))
    },
    get(address: number) {
      return memory.get(address)
    },
  }
}
