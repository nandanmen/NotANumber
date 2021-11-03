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
  marginRight: '$$left',
})

const Box = styled('div', {
  width: '$12',
  height: '$20',
  borderRadius: '$sizes$2',
  background: '$sky6',
  border: '3px solid $slate12',
})

const Window = styled('div', {
  border: '3px solid $slate12',
  height: '$12',
  width: '$20',
  borderRadius: '$sizes$2',
  background: '$lime6',
  position: 'relative',
  transform: 'translateX(-$$left)',

  '&:after': {
    content: '',
    position: 'absolute',
    height: 'calc(100% + 3px)',
    width: '2px',
    background: '$slate12',
    left: 'calc($$left - 5px)',
  },
})
