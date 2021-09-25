import { styled } from '@stitches/react'

import { ArrayListItem } from '../ArrayList'

type PrimitiveType = number | string | boolean

type MemoryData = Array<PrimitiveType | null | undefined>

type MemoryProps = {
  data: MemoryData
}

type Block = {
  allocated: boolean
  value: unknown
}

/**
 * Given an array of null, undefined, or a primitive type, this component
 * converts that array into an array of memory blocks and displays them.
 *
 * The conversion works as follows:
 *  - `undefined` gets converted into a free block
 *  - `null` gets converted into an allocated block _without_ data
 *  - Primitive types gets converted into an allocated block _with_ data
 */
export function Memory({ data }: MemoryProps) {
  const blocks = toBlocks(data)
  return (
    <List>
      {blocks.map((block) => {
        const variant = getVariantFromBlock(block)
        return (
          <ArrayListItem variant={variant} shadow={variant === 'base'}>
            {block.value}
          </ArrayListItem>
        )
      })}
    </List>
  )
}

// -- Styles

const List = styled('ul', {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 4rem)',
  gap: '8px',
})

// -- Utils

const getVariantFromBlock = (block: Block): 'base' | 'allocated' | 'free' => {
  if (block.allocated) {
    return block.value === null ? 'allocated' : 'base'
  }
  return 'free'
}

const toBlocks = (data: MemoryData): Block[] =>
  data.map((value) => ({
    allocated: value !== undefined,
    value,
  }))
