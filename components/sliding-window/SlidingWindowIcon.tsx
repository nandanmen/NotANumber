import { styled } from '@/stitches'

export function SlidingWindowIcon() {
  return (
    <Wrapper>
      <Box />
      <Window />
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  $$left: '$sizes$6',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  transform: 'translateX($$left)',
})

const Box = styled('div', {
  width: '$12',
  height: '$20',
  borderRadius: '$sizes$2',
  background: `repeating-linear-gradient(
    -45deg,
    $colors$black,
    $colors$black 3px,
    transparent 3px,
    transparent 6px
  )`,
})

const Window = styled('div', {
  border: '3px solid $black',
  height: '$12',
  width: '$20',
  borderRadius: '$sizes$2',
  background: '$background',
  position: 'relative',
  transform: 'translateX(-$$left)',

  '&:after': {
    content: '',
    position: 'absolute',
    height: 'calc(100% + 3px)',
    width: '2px',
    background: '$black',
    left: 'calc($$left - 4px)',
  },
})
