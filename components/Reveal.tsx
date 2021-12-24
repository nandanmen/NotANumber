import { styled } from '@/stitches'

export function Reveal({ children }) {
  return (
    <Wrapper>
      {children}
      <Filter />
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  position: 'relative',
})

const Filter = styled('div', {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(10px)',
})
