import { styled } from 'twin.macro'

const Heading = styled.h2`
  font-size: var(--text-2xl);
  font-family: var(--text-serif);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: -16px;
    width: 24px;
    height: 3px;
    background: var(--border-color);
  }
`

export default Heading
