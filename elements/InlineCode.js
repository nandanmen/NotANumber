import { styled } from 'twin.macro'

const InlineCode = styled.code`
  padding: 4px;
  background: var(--inline-code-background, var(--gray200));
  border-radius: 2px;
  font-size: var(--text-sm);
  font-family: var(--text-mono);
`

export default InlineCode
