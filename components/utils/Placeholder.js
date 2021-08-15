import { styled } from 'twin.macro'

export default function Placeholder({ name }) {
  return <Wrapper>{name}</Wrapper>
}

const Wrapper = styled.div`
  border: 2px dashed var(--gray300);
  font-family: var(--text-mono);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`
