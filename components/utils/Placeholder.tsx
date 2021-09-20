import { styled } from '@stitches/react'

export default function Placeholder({ name }) {
  return <Wrapper>{name}</Wrapper>
}

const Wrapper = styled('div', {
  border: '2px dashed var(--gray300)',
  fontFamily: 'var(--text-mono)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
})
