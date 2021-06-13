import { styled } from 'twin.macro'

export default function Placeholder({ name }) {
  return <Wrapper>{name}</Wrapper>
}

const Wrapper = styled.div`
  border: 2px dashed var(--gray400);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  font-family: var(--text-mono);
`
