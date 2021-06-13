import React from 'react'
import produce from 'immer'

export default function useMemory() {
  const [data, setData] = React.useState<number[]>([])
  return {
    set(address: number, value: number) {
      setData(
        produce(data, (draft) => {
          draft[address] = value
        })
      )
    },
    get(address: number) {
      return data[address]
    },
  }
}
