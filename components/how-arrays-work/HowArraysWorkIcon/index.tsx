import { styled } from '@/stitches'

export function HowArraysWorkIcon() {
  return (
    <Wrapper>
      <Node>
        <Content>1</Content>
      </Node>
      <Node>
        <Content>2</Content>
      </Node>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',

  '> :first-child': {
    marginRight: '8px',
  },
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
})

const Content = styled('div', {
  position: 'absolute',
  inset: '$0',
  background: '$background',
  border: '3px solid $black',
  borderRadius: '$$borderRadius',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '$lg',
})
