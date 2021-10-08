import { styled } from '@/stitches'

export function DebuggerIcon() {
  return (
    <Wrapper>
      <Flex>
        <Node />
      </Flex>
      <Node />
      <Node />
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, $12)',
  gridTemplateRows: 'repeat(2, $12)',
  gap: '$2',
  justifyContent: 'flex-end',
})

const Node = styled('div', {
  $$borderRadius: '$sizes$4',

  width: '$12',
  height: '$12',
  position: 'relative',

  '&:before': {
    content: '',
    position: 'absolute',
    background: `repeating-linear-gradient(
      -45deg,
      $colors$black,
      $colors$black 3px,
      transparent 3px,
      transparent 5px
    )`,
    inset: '$0',
    transform: 'translate(4px, 4px)',
    borderRadius: '$$borderRadius',
  },

  '&:after': {
    content: '',
    position: 'absolute',
    inset: '$0',
    background: '$background',
    border: '3px solid $black',
    borderRadius: '$$borderRadius',
  },
})

const Flex = styled('div', {
  gridColumn: '1 / span 2',
  display: 'flex',
  justifyContent: 'center',
})
